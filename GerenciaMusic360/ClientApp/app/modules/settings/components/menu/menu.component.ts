import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@app/core/i18n/allLang';
import { EEndpoints } from '@app/core/enums/endpoints';
import { ResponseApi } from '@shared/models/response-api';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'url', 'status', 'edit', 'delete'];
  dataSource: MatTableDataSource<any>;
  //paginatorIntl: MatPaginatorIntl;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isWorking: boolean = true;
  perm: any = {};
  
  constructor(
    private toasterService: ToasterService,
    public dialog: MatDialog,
    private service: ApiService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
      this._fuseTranslationLoaderService.loadTranslations(...allLang);
      this.perm = this.route.snapshot.data;
    }

  ngOnInit() {
    this.getMenus();
  }

  getMenus(): void {
    this.service.get(EEndpoints.Menus).subscribe((response: ResponseApi<any>) => {
      if (response.code == 100) {
        this.dataSource = new MatTableDataSource(response.result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isWorking = false;
      }
    }, (err) => this.responseError(err));
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

    this.service.save(EEndpoints.MenuStatus, { id: id, typeId: 0, status: statusId })
      .subscribe(data => {
        if (data.code == 100) {
          this.getMenus();
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
    const dialogRef = this.dialog.open(AddMenuComponent, {
      width: '500px',
      data: {
        id: id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.getMenus();
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
          this.delete(id);
      }
    });
  }

  delete(id: number) {
    this.isWorking = true;
    const params = [];
    params['id'] = id;
    this.service.delete(EEndpoints.Menu, params)
      .subscribe(data => {
        if (data.code == 100) {
          this.getMenus();
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
