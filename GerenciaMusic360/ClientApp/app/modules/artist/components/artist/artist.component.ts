import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatTableDataSource, MatPaginatorIntl, MatPaginator, MatSort } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ResponseApi } from "@shared/models/response-api";
import { AddArtistComponent } from "./add-artist.component";
import { IArtist } from '@models/artist';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { Album } from "@shared/models/album";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {
    innerWidth: any;
    artists: IArtist[] = [];
    artistsFiltered: IArtist[] = [];
    artist: IArtist;
    socialsMedia: [any];
    artistMembers: [any];
    isWorking: boolean = true;
    artistDetail: boolean = false;
    albumList: Album[] = [];
    albumsWorks: Album[] = [];
    permisions:any;

    displayedColumns: string[] = ['picture', 'name', 'artistName', 'status', 'action'];
    dataSource: MatTableDataSource<any>;
    paginatorIntl: MatPaginatorIntl;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    viewLabel = this.translate.instant('general.table');
    isTable = false;
    viewIcon = 'dashboard'

    constructor(
        private toaster: ToasterService,
        private apiService: ApiService,
        public dialog: MatDialog,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.activatedRoute.data.subscribe((data: any) => {
            this.permisions = data;
        });
    }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.innerWidth = window.outerWidth - 60;
        this.getArtistsApi();
    }

    changeView() {
        this.isTable = !this.isTable;
        if (this.isTable) {
            this.viewLabel = this.translate.instant('general.cards');
            this.viewIcon = 'featured_play_list';
        } else {
            this.viewLabel = this.translate.instant('general.table');
            this.viewIcon = 'dashboard';
        }
    }


    applyFilter(filterValue: string): void {
        if (filterValue)
        this.artistsFiltered = this.artists.filter(
            f =>`${f.name}${f.lastName}`.toLowerCase().includes(filterValue.toLowerCase()));
        else
            this.artistsFiltered = this.artists;

        this.fillTable();
    }

    fillTable(): void {
        this.dataSource = new MatTableDataSource(this.artistsFiltered);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    //#region API
    getArtistsApi() {
        this.isWorking = true;
        this.apiService.get(EEndpoints.Artists).subscribe(
            (response: ResponseApi<IArtist[]>) => {
                if (response.code == 100) {
                    this.artists = response.result;
                    this.artistsFiltered = response.result;
                    this.fillTable();
                } else {
                    this.toaster.showToaster(response.message);
                }
                this.isWorking = false;
            }, err => this.resposeError(err)
        );
    }

    updateStatusApi(params: any) {
        this.apiService.save(EEndpoints.ArtistStatus, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.getArtistsApi();
                } else {
                    this.toaster.showToaster(response.message);
                }
                this.isWorking = false;
            }, err => this.resposeError(err)
        );
    }

    deleteArtistApi(id: number) {
        this.isWorking = true;
        this.apiService.delete(EEndpoints.Artist, { id: id }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.getArtistsApi();
                    this.toaster.showToaster(this.translate.instant('messages.artistDeleted'));
                } else {
                    this.toaster.showToaster(response.message);
                }
                this.isWorking = false;
            }, err => this.resposeError(err)
        );
    }

    //#endregion
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
                    this.deleteArtistApi(id);
            }
        });
    }
    updateStatus(id: number, status: number): void {
        this.isWorking = true;
        let statusId = (status == 1) ? 2 : 1;
        this.updateStatusApi({ id: id, status: statusId });
    }
    resposeError(err: any): void {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    }
    openModal(id: number): void {
        const dialogRef = this.dialog.open(AddArtistComponent, {
            width: this.innerWidth,
            maxWidth:this.innerWidth,
            data: {
                personId: id,
                model: <IArtist>this.artists.find(f => f.id == id),
                isArtist: true
            }
        });
        dialogRef.afterClosed().subscribe(
            (data: IArtist) => {
                this.getArtistsApi();
            }
        );
    }
    openDetail() {
        this.artistDetail = !this.artistDetail;
    }
    getArtist(id: any): void {
        this.openDetail();
        this.artist = this.artists.find(i => i.id == id);
        this.getSocialMedias(id);
        this.getAlbums(id);
        this.getArtistMembers(id);
        return;
    }
    getSocialMedias(id: any) {
        this.apiService.get(EEndpoints.SocialNetworks, { personId: id }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.socialsMedia = response.result;
                } else {
                    console.log(response.message);
                }
            }, (err) => this.responseError(err)
        )
    }
    getAlbums(id: any) {
        this.apiService.get(EEndpoints.AlbumsByPerson, { personId: id }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.albumList = response.result;
                    this.albumsWorks = [];
                    this.albumList.forEach(item => this.getAlbumsWork(item.id));
                } else {
                    console.log(response.message);
                }
            }, (err) => this.responseError(err)
        )
    }
    getAlbumsWork(id: number) {
        this.isWorking = true;
        const param = { albumId: id };
        this.apiService.get(EEndpoints.AlbumWorks, param).subscribe(
            (response: ResponseApi<Album>) => {

                if (response.code == 100) {
                    this.albumsWorks.push(response.result);
                } else {
                    this.toaster.showToaster('Error obteniendo datos del album');
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        )
    }
    getArtistMembers(id: any) {
        this.apiService.get(EEndpoints.ArtistMembers, { personId: id }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.artistMembers = response.result;
                    console.log(this.artistMembers);
                } else {
                    console.log(response.message);
                }
            }, (err) => this.responseError(err)
        )
    }
    responseError(err: any) {
        console.log('http error', err);
        this.isWorking = false;
    }
}