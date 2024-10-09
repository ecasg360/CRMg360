import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatTableDataSource, MatPaginatorIntl, MatPaginator, MatSort } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from "@models/response-api";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { AddFieldComponent } from "./add-field/add-field.component";
import { IField } from "@models/field";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})

export class FieldComponent implements OnInit {
  displayedColumns: string[] = ['fieldTypeName', 'marker', 'moduleName', 'position',  'required', 'status', 'action'];
  dataSource: MatTableDataSource<any>;
  paginatorIntl: MatPaginatorIntl;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isDataAvailable = false;
  isWorking: boolean = true;
  perm:any = {};

  constructor(
    private toasterService: ToasterService,
    private ApiService: ApiService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) {
    this.perm =this.route.snapshot.data;
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.getFields();
  }

  getFields() {
    this.isDataAvailable = true;
    this.isWorking = false;
    this.dataSource = undefined;
    this.ApiService.get(EEndpoints.Fields)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.isDataAvailable = (response.result.length > 0);
          this.dataSource = new MatTableDataSource(response.result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        this.isWorking = false;
      }, (err) => this.responseError(err));
  }

  showModalForm(model: IField = <IField>{}): void {
    const dialogRef = this.dialog.open(AddFieldComponent, {
      width: '500px',
      data: {
        field: model
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getFields();
    });
  }

  updateStatus(id: number, status: number): void {
    let statusId = status == 1 ? 2 : 1;
    this.isWorking = true;

    this.ApiService.save(EEndpoints.FieldStatus, { id: id, status: statusId })
      .subscribe(data => {
        if (data.code == 100) {
          this.getFields();
            this.toasterService.showToaster(this.translate.instant('messages.statusChanged'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => {
        this.responseError(err);
      });
  }

  confirmDelete(id: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this.deleteField(id);
      }
    });
  }

  deleteField(id: number) {
    this.isWorking = true;
    const params = [];
    params['id'] = id;
    this.ApiService.delete(EEndpoints.Field, params)
      .subscribe(data => {
        if (data.code == 100) {
          this.getFields();
            this.toasterService.showToaster(this.translate.instant('messages.itemDeleted'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => {
        this.responseError(err);
      });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
