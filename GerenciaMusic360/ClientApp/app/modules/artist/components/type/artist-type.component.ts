import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { AddArtistTypeComponent } from "./add-artist-type.component";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { entity } from '@enums/entity';
import { IPersonType } from "@models/person-type";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { TranslateService } from "@ngx-translate/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
import { HttpErrorResponse } from "@angular/common/http";
import { ToasterService } from '@services/toaster.service';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-artist-type',
    templateUrl: './artist-type.component.html',
})
export class ArtistTypeComponent implements OnInit {

    displayedColumns: string[] = ['id', 'name', 'status', 'action'];
    dataSource: MatTableDataSource<IPersonType>;
    isWorking: boolean = false;
    personTypeList: IPersonType[] = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    perm:any = {};

    constructor(
        private toaster: ToasterService,
        private apiService: ApiService,
        private translate: TranslateService,
        private translationLoaderService: FuseTranslationLoaderService,
        public dialog: MatDialog,
        private route: ActivatedRoute,
    ) {
        //this.perm = this.route.snapshot.data;
        this.route.data.subscribe((data: any) => {
            this.perm = data;
            console.log('this.perm en artist type: ', this.perm);
        });
    }

    ngOnInit() {
        this.translationLoaderService.loadTranslationsList(allLang);
        this._getArtistTypesApi();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    showModal(row: IPersonType = <IPersonType>{}): void {
        if (!row.id) {
            row.entityId = entity.Artist;
        }
        const dialogRef = this.dialog.open(AddArtistTypeComponent, {
            width: '500px',
            data: {
                model: row
            }
        });
        dialogRef.afterClosed().subscribe((result: IPersonType) => {
            if (result !== undefined)
                this._getArtistTypesApi();
        });
    }

    confirmDelete(row: IPersonType): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: row.name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm)
                    this._deleteArtistTypeApi(row.id);
            }
        });
    }

    private _responseError(error: HttpErrorResponse): void {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        console.error(error);
        this.isWorking = false;
    }

    //#region API
    private _getArtistTypesApi() {
        this.isWorking = true;
        this.apiService.get(EEndpoints.PersonTypes, { entityId: entity.Artist }).subscribe(
            (response: ResponseApi<IPersonType[]>) => {
                if (response.code == 100) {
                    this.personTypeList = response.result;
                    this.dataSource = new MatTableDataSource(this.personTypeList);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                } else
                    this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
                this.isWorking = false;
            }, err => this._responseError(err)
        );
    }

    private _deleteArtistTypeApi(id: number) {
        this.isWorking = true;
        this.apiService.delete(EEndpoints.PersonType, { id: id }).subscribe(
            (response: ResponseApi<boolean>) => {
                if (response.code == 100) {
                    this._getArtistTypesApi();
                    this.toaster.showToaster(this.translate.instant('messages.itemDeleted'));
                } else
                    this.toaster.showToaster(this.translate.instant('errors.errorDeletingItem'));
                this.isWorking = false;
            }, (err) => this._responseError(err)
        );
    }

    updateStatusApi(id: number, status: number) {
        this.isWorking = true;
        let statusId = status == 1 ? 2 : 1;
        const params = { id: id, status: statusId };
        this.apiService.save(EEndpoints.PersonTypeStatus, params).subscribe(
            (response: ResponseApi<boolean>) => {
                if (response.code == 100) {
                    this._getArtistTypesApi();
                    this.toaster.showToaster(this.translate.instant('messages.statusChanged'));
                } else
                    this.toaster.showToaster(this.translate.instant('messages.errorChangingStatus'));
                this.isWorking = false;
            }, (err) => this._responseError(err)
        );
    }

    //#endregion
}