import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { AddCompanyComponent } from '@shared/components/add-company/add-company.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ICompany } from '@models/company';
import { ResponseApi } from '@models/response-api';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-company-manager',
    templateUrl: './company-manager.component.html',
    styleUrls: ['./company-manager.component.scss']
})

export class CompanyManagerComponent implements OnInit {
    displayedColumns: string[] = ['businessName', 'legalName', 'status', 'action'];
    dataSource: MatTableDataSource<ICompany>;
    isWorking: boolean = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isDataAvailable: boolean = true;
    perm: any = {};

    constructor(
        public dialog: MatDialog,
        private translationLoaderService: FuseTranslationLoaderService,
        private translate: TranslateService,
        private apiService: ApiService,
        private toaster: ToasterService,
        private route: ActivatedRoute
    ) {
        this.translationLoaderService.loadTranslations(...allLang);
        this.perm = this.route.snapshot.data;
    };

    ngOnInit() {        
        this.getCompaniesApi();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    showModalForm(row: ICompany = <ICompany>{}): void {
        const dialogRef = this.dialog.open(AddCompanyComponent, {
            width: '900px',
            data: {
                model: row
            }
        });
        dialogRef.afterClosed().subscribe((result: ICompany) => {
            if (result)
                this.getCompaniesApi();
        });
    }


    confirmDelete(row: ICompany): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: row.businessName }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.confirm)
                this.deleteCompanyApi(row.id);
        });
    }

    private _responseError(error: HttpErrorResponse): void {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        console.error(error);
        this.isWorking = false;
    }

    //#region API

    getCompaniesApi(): void {
        this.isWorking = true;
        this.apiService.get(EEndpoints.Companies).subscribe(
            (response: ResponseApi<ICompany[]>) => {
                if (response.code == 100) {
                    this.dataSource = new MatTableDataSource(response.result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                } else
                    this.toaster.showToaster(this.translate.instant('errors.errorChangingStatus'));
                this.isWorking = false;
            }, err => this._responseError(err)
        );
    }

    updateStatusApi(id: number, status: number): void {
        this.isWorking = true;
        let statusId = status == 1 ? 2 : 1;
        const params = { id: id, status: statusId };
        this.apiService.save(EEndpoints.CompanyStatus, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.changeStatusSuccess'));
                    this.getCompaniesApi();
                } else
                    this.toaster.showToaster(this.translate.instant('general.errors.requestError'));

                this.isWorking = false;
            }, (err) => {
                this._responseError(err);
            });
    }

    deleteCompanyApi(id: number): void {
        this.isWorking = true;
        const params = { id: id };
        this.apiService.delete(EEndpoints.Company, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.itemDeleted'));
                    this.getCompaniesApi();
                } else
                    this.toaster.showToaster(this.translate.instant('messages.errorDeletingItem'));

            }, err => this._responseError(err));
    }

    //#endregion
}
