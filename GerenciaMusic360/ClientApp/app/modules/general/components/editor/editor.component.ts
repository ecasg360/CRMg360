import { Component, OnInit, ViewChild } from '@angular/core';
import { IEditor } from '@models/editor';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { allLang } from '@i18n/allLang';
import { ICompany } from '@models/company';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { HttpErrorResponse } from '@angular/common/http';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { AddEditorComponent } from './add-editor/add-editor.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  displayedColumns: string[] = ['dba', 'name', 'company', 'association', 'internal', 'action'];
  dataSource: MatTableDataSource<IEditor>;
  editorList: IEditor[] = [];
  isWorking: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isDataAvailable: boolean = true;
  perm:any = {};

  constructor(
    public dialog: MatDialog,
    private translationLoaderService: FuseTranslationLoaderService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toaster: ToasterService,
  ) {
    this.perm = this.route.snapshot.data;
  };

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.getEditorsApi();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showModalForm(row: IEditor = <IEditor>{}): void {
    const dialogRef = this.dialog.open(AddEditorComponent, {
      width: '400px',
      data: {
        model: row
      }
    });
    dialogRef.afterClosed().subscribe((result: ICompany) => {
      if (result)
        this.getEditorsApi();
    });
  }

  confirmDelete(row: IEditor): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: row.name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.deleteEditorApi(row.id);
    });
  }

  private _fillTable() {
    this.dataSource = new MatTableDataSource(this.editorList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private _responseError(error: HttpErrorResponse): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    console.error(error);
    this.isWorking = false;
  }

  //#region API

  getEditorsApi(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Editors).subscribe(
      (response: ResponseApi<IEditor[]>) => {
        if (response.code == 100) {
          this.editorList = response.result;
          this._fillTable();
        } else
          this.toaster.showToaster(this.translate.instant('errors.errorGettingItems'));
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  deleteEditorApi(id: number): void {
    this.isWorking = true;
    const params = { id: id };
    this.apiService.delete(EEndpoints.Editor, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.itemDeleted'));
          this.editorList = this.editorList.filter(f => f.id !== id);
          this._fillTable();
        } else
          this.toaster.showToaster(this.translate.instant('errors.errorDeletingItem'));
        this.isWorking = false;
      }, err => this._responseError(err));
  }

  //#endregion
}
