import { AddMainActivityComponent } from './add-main-activity/add-main-activity.component';
import { allLang } from '@i18n/allLang';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import {
  MatDialog,
  MatPaginator,
  MatPaginatorIntl,
  MatSort,
  MatTableDataSource
} from '@angular/material';
import { ResponseApi } from '@shared/models/response-api';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-activity',
  templateUrl: './main-activity.component.html',
  styleUrls: ['./main-activity.component.scss']
})
export class MainActivityComponent implements OnInit {

  innerWidth: any;
  displayedColumns: string[] = ['name', 'description', 'status', 'edit', 'delete'];
  dataSource: MatTableDataSource<any>;
  paginatorIntl: MatPaginatorIntl;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isWorking: boolean = true;
  isDataAvailable: boolean = true;
  perm: any = {};

  constructor(
    private toasterService: ToasterService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) {
    this.perm = this.route.snapshot.data;
  }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.innerWidth = window.innerWidth;
    this.getMainActivity();
  }

  getMainActivity(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.MainActivities).subscribe(
      (response: ResponseApi<any>) => {
        this.isDataAvailable = (response.result.length > 0);
        this.dataSource = new MatTableDataSource(response.result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isWorking = false;
      },
      (error: any) => this.reponseError(error)
    )
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

    this.apiService.save(EEndpoints.MainActivityStatus, { id: id, status: statusId }).subscribe(data => {
      if (data.code == 100) {
        this.getMainActivity();
        this.toasterService.showToaster(this.translate.instant('settings.mainActivity.messages.statusChanged'));
      } else {
        this.toasterService.showToaster(data.message);
      }
      this.isWorking = false;
    }, (err) => {
      this.reponseError(err);
    });
  }

  /**
   * Abre el modal con el formulario para agregar una nueva actividad
   */
  showModalForm(id: number = 0): void {
    const dialogRef = this.dialog.open(AddMainActivityComponent, {
      width: '500px',
      data: {
        id: id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.getMainActivity();
      }
    });
  }

  showImage(image: string, caption) {
    const dialogRef = this.dialog.open(ImagePreviewComponent, {
      width: '500px',
      data: {
        imageUrl: image,
        caption: caption
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
          this.deleteMainActivity(id);
      }
    });
  }

  deleteMainActivity(id: number) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.MainActivity, { id: id }).subscribe(data => {
      if (data.code == 100) {
        this.getMainActivity();
        this.toasterService.showToaster(this.translate.instant('settings.mainActivity.messages.deleteSuccess'));
      } else {
        this.toasterService.showToaster(data.message);
        this.isWorking = false;
      }
    }, (err) => {
      this.reponseError(err);
    });
  }
}
