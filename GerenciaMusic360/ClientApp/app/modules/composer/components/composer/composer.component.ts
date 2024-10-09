import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { AddGeneralComposerComponent } from "@shared/components/add-general-composer/add-general-composer.component";
import { ConfirmComponent } from "ClientApp/app/shared/components/confirm/confirm.component";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { FuseTranslationLoaderService } from "../../../../../@fuse/services/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
import { allLang } from "../../../../core/i18n/allLang";
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-composer',
    templateUrl: './composer.component.html',
})
export class ComposerComponent implements OnInit {

    innerWidth: any;
    displayedColumns: string[] = ['name', 'email', 'phone', 'status', 'action'];
    isWorking: boolean = false;
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Input() perm: any = {};

    permisions:any;

    constructor(
        private toasterService: ToasterService,
        private apiService: ApiService,
        public dialog: MatDialog,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.activatedRoute.data.subscribe((data: any) => {
            this.permisions = data;
        });
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
    }

    ngOnInit() {
        this.getComposers();
        this.innerWidth = window.innerWidth;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getComposers() {
        this.isWorking = true;
        this.apiService.get(EEndpoints.Composers).subscribe(data => {
            if (data.code == 100) {
                this.dataSource = new MatTableDataSource(data.result);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            } else 
                this.toasterService.showTranslate('errors.errorGettingItems');
            this.isWorking = false;
        }, err => this.responseError(err));
    }

    openModal(row: any): void {
        let action = this.translate.instant(row ? 'save': 'update');
        const dialogRef = this.dialog.open(AddGeneralComposerComponent, {
            width: '700px',
            data: {
                action: action,
                model: row
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined)
                this.getComposers();
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
                    this.deleteComposer(id);
            }
        });
    }

    deleteComposer(id) {
        this.isWorking = true;
        this.apiService.delete(EEndpoints.Composer, { id: id })
            .subscribe(data => {
                if (data.code == 100) {
                    this.getComposers();
                    this.toasterService.showTranslate('messages.itemDeleted');
                } else {
                    this.toasterService.showTranslate('errors.errorDeletingItem');
                }
                this.isWorking = false;
            }, err => this.responseError(err));
    }

    updateStatus(id: number, status: number) {
        this.isWorking = true;
        status = status == 1 ? 2 : 1;

        this.apiService.save(EEndpoints.ComposerStatus, { id, status })
            .subscribe(data => {
                if (data.code == 100) {
                    this.getComposers();
                    this.toasterService.showTranslate('messages.statusChanged');
                } else {
                    this.toasterService.showTranslate('errors.errorChangingStatus');
                }
                this.isWorking = false;
            }, err => this.responseError(err));
    }

    private responseError(error: any): void {
        this.toasterService.showTranslate('general.errors.serverError');
        this.isWorking = false;
    }
}