import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ICategory } from '@models/category';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'module', 'status', 'action'];
  dataSource: MatTableDataSource<ICategory>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isDataAvailable = false;
  isWorking: boolean = true;
  perm: any = {};

  constructor(
    private toasterService: ToasterService,
    private service: ApiService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private translationLoaderService: FuseTranslationLoaderService,
  ) {
    this.perm = this.route.snapshot.data;
  }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.getCategories();
  }

  getCategories() {
    this.isWorking = false;
    this.dataSource = undefined;
    this.service.get(EEndpoints.Categories)
      .subscribe((response: ResponseApi<ICategory[]>) => {
        if (response.code == 100) {
          if (response.result.length > 0) {
            this.isDataAvailable = (response.result.length > 0);
            this.dataSource = new MatTableDataSource(response.result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        }
        this.isWorking = false;
      }, (err) => this.responseError(err));
  }

  showModalForm(id: number = 0): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '600px',
      data: {
        id: id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.getCategories();
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
    params['id'] = id;
    this.service.delete(EEndpoints.Category, params)
      .subscribe(data => {
        if (data.code == 100) {
          this.getCategories();
            this.toasterService.showToaster(this.translate.instant('messages.itemDeleted'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => {
        this.responseError(err);
      });
  }

  updateStatus(id: number, status: number): void {
    let statusId = status == 1 ? 2 : 1;
    this.isWorking = true;

    this.service.save(EEndpoints.CategoryStatus, { id: id, status: statusId })
      .subscribe(data => {
        if (data.code == 100) {
          this.getCategories();
            this.toasterService.showToaster(this.translate.instant('messages.changeStatusSuccess'));
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
