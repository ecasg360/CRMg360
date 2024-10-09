import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { allLang } from '@i18n/allLang';
import { IVideo } from '@models/video';
import { VideoLibraryFormComponent } from '../video-library-form/video-library-form.component';

@Component({
    selector: 'app-video-library-manager',
    templateUrl: './video-library-manager.component.html'
})
export class VideoLibraryManagerComponent implements OnInit, OnChanges {

    @Input() personId: number;
    @Output() changeList = new EventEmitter<IVideo[]>();

    videoList: IVideo[] = [];
    isWorking: boolean;
    videoId: number = 0;

    constructor(
        private apiService: ApiService,
        private toaster: ToasterService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private translate: TranslateService,
        public dialog: MatDialog) { }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslationsList(allLang)
        this.getVideosApi();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const personId = changes.personId;
        if (personId.currentValue > 0) {
            this.getVideosApi();
        }
    }

    showModalForm(id: number = 0) {
        this.isWorking = true;
        let video = <IVideo>{};
        if (id !== 0) {
            video = this.videoList.find(f => f.id == id);
        } else {
            video.id = 0;
            //video.certificationAuthorityId = 0;
            //video.personRelationId = this.personId;
        }

        const dialogRef = this.dialog.open(VideoLibraryFormComponent, {
            width: '750px',
            data: {
                model: video
            }
        });
        dialogRef.afterClosed().subscribe((video: IVideo) => {
            if (video !== undefined) {

                let artists = [];
                if (video.artists && video.artists.length > 0) {
                    artists = video.artists;
                    delete video.artists;
                }
                if (id == 0) {
                    this.saveVideoApi(video, artists);
                } else {
                    video.id = id;
                    this.updateVideoApi(video, artists);
                }
            }
        });
        this.isWorking = false;
    }


    updateStatus(id: number, statusRecordId: number) {
        const status = (statusRecordId == 1) ? 2 : 1;
        const params = {
            id: id,
            status: status
        }
        this.changeStatusApi(params);
    }

    confirmDelete(id: number, name: string) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
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
                    this.deleteVideoApi(id);
            }
        });
    }

    private responseError(err: any) {
        console.log('http', err);
        this.isWorking = false;
    }

    //#region API

    saveVideoApi(model: IVideo, artist: any[]) {
        this.isWorking = true;
        this.apiService.save(EEndpoints.Video, model).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster('Registro guardado exitosamente!');
                    this.saveVideoArtistsApi(artist, response.result.id);
                    this.videoList.push(response.result);
                    this.changeList.emit(this.videoList);
                } else {
                    this.toaster.showToaster('Error guardando registro');
                }
                this.isWorking = false;
            }, err => this.reponseError(err)
        )
    }

    updateVideoApi(model: IVideo, artist: any[]) {
        this.isWorking = true;
        this.apiService.update(EEndpoints.Album, model).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster('Registro modificado exitosamente!');
                    this.deleteVideoArtistsApi(model.id, artist);
                    this.getVideosApi();
                } else {
                    this.toaster.showToaster('Error modificando registro');
                }
                this.isWorking = false;
            }, err => this.reponseError(err)
        )
    }

    changeStatusApi(params: any) {
        this.isWorking = true;
        this.apiService.save(EEndpoints.VideoStatus, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster('Cambio de estatus exitoso!');
                    this.getVideosApi();
                } else {
                    this.toaster.showToaster('Error cambiando estatus');
                }
                this.isWorking = false;
            }, err => this.reponseError(err)
        )
    }

    deleteVideoApi(id: number) {
        const params = {
            id: id
        }
        this.apiService.delete(EEndpoints.Video, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.getVideosApi();
                    this.toaster.showToaster('registro eliminado');
                } else {
                    this.toaster.showToaster('ocurrio un error eliminando el registro');
                }
            }, err => this.responseError(err)
        )
    }

    getVideosApi() {
        this.isWorking = true;
        this.apiService.get(EEndpoints.Videos).subscribe(
            (response: ResponseApi<IVideo[]>) => {
                if (response.code == 100) {
                    this.videoList = response.result;
                    console.log(this.videoList);
                } else {
                    this.toaster.showToaster('Error obteniendo datos');
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        )
    }

    saveVideoArtistsApi(artists: any[], videoId: number) {
        const params = artists.map(m => {
            return {
                PersonComposerId: m.id,
                VideoId: videoId
            }
        });
        console.log(params);
        this.apiService.save(EEndpoints.VideoComposers, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code != 100) {
                    this.toaster.showToaster('Ocurrio un error guardando artistas');
                }
            }, err => this.reponseError(err)
        )
    }

    deleteVideoArtistsApi(videoId: number, params: any[], saveAfter: boolean = true) {
        this.apiService.delete(EEndpoints.VideoComposers, { videoId: videoId }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    if (saveAfter) {
                        this.saveVideoArtistsApi(params, videoId);
                    }
                } else
                    this.toaster.showToaster('Ocurrio un error eliminando las artistas')
            }, err => this.reponseError(err)
        )
    }

    reponseError(err: any) {
        console.log('http', err);
        this.isWorking = false;
    }
    //#endregion

}
