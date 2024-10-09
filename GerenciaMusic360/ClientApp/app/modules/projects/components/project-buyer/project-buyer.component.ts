import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatDialog, MatTableDataSource, MatPaginatorIntl, MatPaginator, MatSort } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@app/core/enums/endpoints";
import { ResponseApi } from "@shared/models/response-api";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { AddBuyerComponent } from "./add-buyer/add-buyer.component";
import { IProjectBuyers } from "@models/projectBuyers";

@Component({
    selector: 'app-project-buyer',
    templateUrl: './project-buyer.component.html',
    styleUrls: ['./project-buyer.component.scss']
})
export class ProjectBuyerComponent implements OnInit {
    innerWidth: any;
    displayedColumns: string[] = ['personcompany', 'type', 'action'];
    dataSource: MatTableDataSource<any>;
    paginatorIntl: MatPaginatorIntl;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isDataAvailable = false;
    isWorking: boolean = true;
    @Input() projectId: number=0;
    @Input() perm: any ={};
    permisions: any;

    constructor(
        private toasterService: ToasterService,
        private service: ApiService,
        public dialog: MatDialog,
        private router: Router,
        private translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
      this.activatedRoute.data.subscribe((data: any) => {
        this.permisions = data;
      });
    }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.getProjectBuyers();
    }

    getProjectBuyers() {
        this.isWorking = false;
        this.dataSource = undefined;
        const params = [];
        params['projectId'] = this.projectId;
        this.service.get(EEndpoints.ProjectBuyers, params)
            .subscribe((response: ResponseApi<IProjectBuyers[]>) => {
                if (response.code == 100) {
                    this.isDataAvailable = (response.result.length > 0);
                    this.dataSource = new MatTableDataSource(response.result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
                this.isWorking = false;
            }, (err) => this.responseError(err));
    }

    addData(id: number = 0): void {
        const dialogRef = this.dialog.open(AddBuyerComponent, {
          width: '500px',
          data: {
            id: id,
            projectId: this.projectId
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.getProjectBuyers();
        });
    }

    confirmDelete(id: number, name: string, company: string): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
          width: '400px',
          data: {
            text: this.translate.instant('messages.deleteQuestion', { field: '' }),
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
        this.service.delete(EEndpoints.ProjectType, params)
          .subscribe(data => {
            if (data.code == 100) {
              this.getProjectBuyers();
              this.toasterService.showToaster(this.translate.instant('settings.catalogTypes.messages.deleteSuccess'));
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

        this.service.save(EEndpoints.CurrencyStatus, { id: id, status: statusId })
            .subscribe(data => {
                if (data.code == 100) {
                    this.getProjectBuyers();
                    this.toasterService.showToaster(this.translate.instant('settings.preferences.messages.statusChanged'));
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