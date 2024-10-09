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
import { allLang } from '@app/core/i18n/allLang';
import { ResponseApi } from '@shared/models/response-api';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { AddSocialnetworktypeComponent } from './add-socialnetworktype/add-socialnetworktype.component';
import { SocialNetworkType } from '@models/socialNetworkType';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-social-networktype',
    templateUrl: './social-networktype.component.html',
    styleUrls: ['./social-networktype.component.css']
})

export class SocialNetworktypeComponent implements OnInit {
    displayedColumns: string[] = ['name', 'photo', 'status', 'action'];
    dataSource: MatTableDataSource<SocialNetworkType>;
    paginatorIntl: MatPaginatorIntl;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isWorking: boolean = true;
    isDataAvailable: boolean = false;
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
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.perm = this.route.snapshot.data;
    }

    ngOnInit() {
        this.getSocialNetworkTypes();
    }

    getSocialNetworkTypes(): void {
        this.isWorking = false;
        this.dataSource = undefined;
        this.service.get(EEndpoints.SocialNetworkTypes).subscribe(
            (response: ResponseApi<SocialNetworkType[]>) => {
                if (response.code == 100) {
                    this.isDataAvailable = (response.result.length > 0);
                    this.dataSource = new MatTableDataSource(response.result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.isWorking = false;
                }
            }, (err) => this.responseError(err));
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

        this.service.save(EEndpoints.SocialNetworkTypeStatus, { id: id, typeId: this.typeId, status: statusId })
            .subscribe(data => {
                if (data.code == 100) {
                    this.toasterService.showToaster(this.translate.instant('settings.preferences.messages.statusChanged'));
                    this.getSocialNetworkTypes();
                } else
                    this.toasterService.showToaster(data.message);
                this.isWorking = false;
            }, err => this.responseError(err)
            );
    }

    showModalForm(item: SocialNetworkType = <SocialNetworkType>{}): void {
        const dialogRef = this.dialog.open(AddSocialnetworktypeComponent, {
            width: '500px',
            data: {
                model: item,
                typeId: this.typeId
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.getSocialNetworkTypes();
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
        this.service.delete(EEndpoints.SocialNetworkType, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.getSocialNetworkTypes();
                    this.toasterService.showTranslate('messages.itemDeleted');
                    this.getSocialNetworkTypes();
                } else {
                    this.toasterService.showToaster(response.message);
                    this.isWorking = false;
                }
            }, err => this.responseError(err)
        );
    }
}
