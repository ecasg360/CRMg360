import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ToasterService } from '@services/toaster.service';
import {
  MatDialog,
  MatPaginator,
  MatPaginatorIntl,
  MatSort,
  MatTableDataSource
} from '@angular/material';
import { SelectOption } from '@shared/models/select-option.models';
import { allLang } from '@app/core/i18n/allLang';
import { ResponseApi } from '@shared/models/response-api';
import { ResponseSelect } from '@shared/models/select-response';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { AddTypeComponent } from '@shared/components/add-type/add-type.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-maintenance-type',
  templateUrl: './maintenance-type.component.html',
  styleUrls: ['./maintenance-type.component.scss']
})
export class MaintenanceTypeComponent implements OnInit {

  innerWidth: any;
  displayedColumns: string[] = ['name', 'status', 'action'];
  dataSource: MatTableDataSource<any>;
  paginatorIntl: MatPaginatorIntl;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isWorking: boolean = true;
  isDataAvailable: boolean = false;
  typeNames: SelectOption[] = [];
  typeId: number;
  perm: any = {};

  constructor(
    private toasterService: ToasterService,
    public dialog: MatDialog,
    private apiService: ApiService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
      this.perm = this.route.snapshot.data;
      this._fuseTranslationLoaderService.loadTranslations(...allLang);
     }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.getTypeNames();
  }

  getTypeNames(): void {
    this.isWorking = false;
    this.dataSource = undefined;
    this.apiService.get(EEndpoints.TypeNames)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.typeNames = response.result.map((s: ResponseSelect) => ({
            value: s.id,
            viewValue: s.description
          }));
        }
      }, (err) => this.reponseError(err));
  }

  SelectionChangeCatalogType(id: number) {
    this.isWorking = true;
    this.typeId = id;
    const params = [];
    params['typeId'] = id;
    this.apiService.get(EEndpoints.Types, params).subscribe((response: ResponseApi<any>) => {
      if (response.code == 100) {
        this.isDataAvailable = (response.result.length > 0);
        this.dataSource = new MatTableDataSource(response.result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isWorking = false;
      }
    }, (err) => this.reponseError(err));
  }

  private reponseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateStatus(id: number, status: number): void {
    let statusId = status == 1 ? 2 : 1;
    this.isWorking = true;
    this.apiService.save(EEndpoints.TypeStatus, { id: id, typeId: this.typeId, status: statusId })
      .subscribe(data => {
        if (data.code == 100) {
          this.SelectionChangeCatalogType(this.typeId);
            this.toasterService.showToaster(this.translate.instant('messages.changeStatusSuccess'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => {
        this.reponseError(err);
      });
  }

  showModalForm(id: number = 0): void {
    if (this.typeId === undefined) {
      this.toasterService.showToaster(this.translate.instant('settings.catalogTypes.messages.selectCatalogType'));
      return;
    }
    const dialogRef = this.dialog.open(AddTypeComponent, {
      width: '500px',
      data: {
        id: id,
        typeId: this.typeId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.SelectionChangeCatalogType(this.typeId);
      }
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
          this.deleteType(id);
      }
    });
  }

  deleteType(id: number) {
    this.isWorking = true;
    const params = [];
    params['typeId'] = this.typeId;
    params['id'] = id;
    this.apiService.delete(EEndpoints.Type, params)
      .subscribe(data => {
        if (data.code == 100) {
          this.SelectionChangeCatalogType(this.typeId);
            this.toasterService.showToaster(this.translate.instant('messages.itemDeleted'));
        } else {
          this.toasterService.showToaster(data.message);          
        }
        this.isWorking = false;
      }, (err) => {
        this.reponseError(err);
      });
  }

}
