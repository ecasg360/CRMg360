import { Component, OnInit, OnDestroy, SimpleChanges, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { Album } from '@models/album';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@shared/models/response-api';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { MatDialog } from '@angular/material';
import { AlbumFormComponent } from '../album-form/album-form.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { AlbumDetailComponent } from '../album-detail/album-detail.component';

@Component({
    selector: 'app-album-manager',
    templateUrl: './album-manager.component.html',
    styleUrls: ['./album-manager.component.scss']
})
export class AlbumManagerComponent implements OnInit, OnDestroy, OnChanges {

    @Input() personId: number;
    @Output() changeList = new EventEmitter<Album[]>();

    albumList: Album[] = [];
    isWorking: boolean = false;
    albumId: number = 0;
    albumDetail: boolean = false;
    albumWorks: Album;
    //#region Lifetime Cycle
    constructor(
        private apiService: ApiService,
        private toaster: ToasterService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private translate: TranslateService,
        public dialog: MatDialog,
    ) {
    }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        
    }

    ngOnDestroy(): void {
        this.changeList.complete();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const personId = changes.personId;
        if (personId.currentValue > 0) {
            this.albumDetail = false;
            this.getAbumApi();
        }
    }

    //#endregion

    showForm(id: number = 0) {
        this.isWorking = true;
        let album = <Album>{};
        if (id != 0) {
            album = this.albumList.find(f => f.id == id);
        }
        const dialogRef = this.dialog.open(AlbumFormComponent, {
            width: '800px',
            data: {
                model: album
            }
        });
        dialogRef.afterClosed().subscribe((album: Album) => {
            if (album !== undefined) {
                album.personRelationId = this.personId;
                let works = [];
                if (album.works && album.works.length > 0) {
                    works = album.works;
                    delete album.works;
                    console.log('existen obras');
                }
                if (id == 0) {
                    this.saveAlbumApi(album, works);
                } else {
                    album.id = id;
                    this.updateAlbumApi(album, works);
                }
            }
        });
        this.isWorking = false;
    }

    updateStatus(id: number, statusRecordId: number) {
        const status = (statusRecordId == 1) ? 2 : 1;
        const params = {
            id: id,
            status: status,
            TypeId: this.personId
        }
        this.changeStatusApi(params);
    }

    confirmDelete(id: number, name: string): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '500px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm) {
                    const params = {
                        id: id,
                        personId: this.personId
                    }
                    this.deleteAlbumApi(params);
                }
            }
        });
    }

    reponseError(err: any) {
        console.log('http', err);
        this.isWorking = false;
    }

    //#region api
    saveAlbumApi(model: Album, works: any[]) {
        this.isWorking = true;
        this.apiService.save(EEndpoints.Album, model).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster('Registro guardado exitosamente!');
                    this.saveAlbumWorksApi(works, response.result.id);
                    this.albumList.push(response.result);
                    this.changeList.emit(this.albumList);
                } else {
                    this.toaster.showToaster('Error guardando registro');
                }
                this.isWorking = false;
            }, err => this.reponseError(err)
        )
    }

    updateAlbumApi(model: Album, works: any[]) {
        this.isWorking = true;
        this.apiService.update(EEndpoints.Album, model).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster('Registro modificado exitosamente!');
                    this.deleteAlbumWorksApi(model.id, works);
                    this.getAbumApi();
                } else {
                    this.toaster.showToaster('Error modificando registro');
                }
                this.isWorking = false;
            }, err => this.reponseError(err)
        )
    }

    changeStatusApi(params: any) {
        this.isWorking = true;
        this.apiService.save(EEndpoints.AlbumStatus, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster('Cambio de estatus exitoso!');
                    this.getAbumApi();
                } else {
                    this.toaster.showToaster('Error cambiando estatus');
                }
                this.isWorking = false;
            }, err => this.reponseError(err)
        )
    }

    getAbumApi() {
        this.isWorking = true;
        const param = { personId: this.personId };
        this.apiService.get(EEndpoints.AlbumsByPerson, param).subscribe(
            (response: ResponseApi<Album[]>) => {
                if (response.code == 100) {
                    this.albumList = response.result;
                   
                    this.changeList.emit(this.albumList);
                } else {
                    this.toaster.showToaster('Error obteniendo datos del album');
                }
                this.isWorking = false;
            }, err => this.reponseError(err)
        )
    }

    deleteAlbumApi(params: any) {
        this.apiService.delete(EEndpoints.Album, params).subscribe(
            (response: ResponseApi<Album[]>) => {
                if (response.code == 100) {
                    this.deleteAlbumWorksApi(params.id, null, false);
                    this.getAbumApi();
                    this.toaster.showToaster('registro eliminado!');
                } else {
                    this.toaster.showToaster('Error eliminando registro');
                }
                this.isWorking = false;
            }, err => this.reponseError(err)
        )
    }

    saveAlbumWorksApi(works: any[], albumId: number) {
        const params = works.map(m => {
            return {
                WorkId: m.id,
                AlbumId: albumId
            }
        });
        this.apiService.save(EEndpoints.AlbumWorks, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code != 100) {
                    this.toaster.showToaster('Ocurrio un error guardando las obras');
                }
            }, err => this.reponseError(err)
        )
    }

    deleteAlbumWorksApi(albumId: number, params: any[], saveAfter: boolean = true) {
        this.apiService.delete(EEndpoints.AlbumWorks, { albumId: albumId }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    if (saveAfter) {
                        this.saveAlbumWorksApi(params, albumId);
                    }
                } else
                    this.toaster.showToaster('Ocurrio un error eliminando las obras')
            }, err => this.reponseError(err)
        )
    }
    openDetail(id: string) {
        this.isWorking = true;
        const param = { albumId:id };
        this.apiService.get(EEndpoints.AlbumWorks, param).subscribe(
            (response: ResponseApi<Album>) => {
                if (response.code == 100) {
                    this.albumWorks = response.result;
                } else {
                    this.toaster.showToaster('Error obteniendo datos del album');
                }
                this.isWorking = false;
            }, err => this.reponseError(err)
        )
        this.albumDetail = !this.albumDetail;
    }
}
