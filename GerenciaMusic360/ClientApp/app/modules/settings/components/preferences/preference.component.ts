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
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { AddPreferenceComponent } from './add-preference/add-preference.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preferences',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})

export class PreferenceComponent implements OnInit {

  innerWidth: any;
  displayedColumns: string[] = ['photo', 'name', 'status', 'action'];
  dataSource: MatTableDataSource<any>;
  paginatorIntl: MatPaginatorIntl;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isWorking: boolean = true;
  isDataAvailable: boolean = false;
  preferencesTypes: SelectOption[] = [];
  typeId: number;
  perm: any = {};

  constructor(
    private toasterService: ToasterService,
    public dialog: MatDialog,
    private service: ApiService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
      this.perm = this.route.snapshot.data;
    }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.innerWidth = window.innerWidth;
    this.getPreferenceTypes();
  }

  getPreferenceTypes(): void {
    this.isWorking = false;
    this.dataSource = undefined;
    this.service.get(EEndpoints.PreferenceTypes)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.preferencesTypes = response.result.map((s: ResponseSelect) => ({
            value: s.id,
            viewValue: s.name
          }));
        }
      }, (err) => this.responseError(err));
  }

  SelectionChange(id: number) {
      this.typeId = id;
      this.apiGetTypeDetail();
  }

  showImage(image: string, caption) {
    this.dialog.open(ImagePreviewComponent, {
      width: '500px',
      data: {
        imageUrl: image,
        caption: caption
      }
    });
  }

  private responseError(error: any): void {
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

    this.service.save(EEndpoints.PreferenceStatus, { id: id, typeId: this.typeId, status: statusId })
      .subscribe(data => {
        if (data.code == 100) {
          this.SelectionChange(this.typeId);
          this.toasterService.showToaster(this.translate.instant('settings.preferences.messages.statusChanged'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => {
        this.responseError(err);
      });
  }

  showModalForm(id: number = 0): void {
    if(this.typeId === undefined) {
      this.toasterService.showToaster(this.translate.instant('settings.preferences.messages.selectPreferenceType'));
      return;
    }
    const dialogRef = this.dialog.open(AddPreferenceComponent, {
      width: '500px',
      data: {
        id: id,
        typeId: this.typeId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.SelectionChange(this.typeId);
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

    private apiGetTypeDetail() {
        this.isWorking = true;
        this.service.get(EEndpoints.PreferencesByType, { typeId: this.typeId }).subscribe((response: ResponseApi<any>) => {
            if (response.code == 100) {
                this.isDataAvailable = (response.result.length > 0);
                this.dataSource = new MatTableDataSource(response.result);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
            this.isWorking = false;
        }, (err) => this.responseError(err));
    }

  deleteType(id: number) {
    this.isWorking = true;
      this.service.delete(EEndpoints.Preference, { id })
      .subscribe(data => {
        if (data.code == 100) {
          this.isWorking = false;
          this.apiGetTypeDetail();
          this.toasterService.showToaster(this.translate.instant('settings.preferences.messages.deleteSuccess'));
        } else {
          this.toasterService.showToaster(data.message);
          this.isWorking = false;
        }
      }, (err) => {
        this.responseError(err);
      });
  }

}
