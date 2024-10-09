var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { allLang } from '@i18n/allLang';
import { VideoLibraryFormComponent } from '../video-library-form/video-library-form.component';
var VideoLibraryManagerComponent = /** @class */ (function () {
    function VideoLibraryManagerComponent(apiService, toaster, _fuseTranslationLoaderService, translate, dialog) {
        this.apiService = apiService;
        this.toaster = toaster;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.translate = translate;
        this.dialog = dialog;
        this.changeList = new EventEmitter();
        this.videoList = [];
        this.videoId = 0;
    }
    VideoLibraryManagerComponent.prototype.ngOnInit = function () {
        this._fuseTranslationLoaderService.loadTranslationsList(allLang);
        this.getVideosApi();
    };
    VideoLibraryManagerComponent.prototype.ngOnChanges = function (changes) {
        var personId = changes.personId;
        if (personId.currentValue > 0) {
            this.getVideosApi();
        }
    };
    VideoLibraryManagerComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        this.isWorking = true;
        var video = {};
        if (id !== 0) {
            video = this.videoList.find(function (f) { return f.id == id; });
        }
        else {
            video.id = 0;
            //video.certificationAuthorityId = 0;
            //video.personRelationId = this.personId;
        }
        var dialogRef = this.dialog.open(VideoLibraryFormComponent, {
            width: '750px',
            data: {
                model: video
            }
        });
        dialogRef.afterClosed().subscribe(function (video) {
            if (video !== undefined) {
                var artists = [];
                if (video.artists && video.artists.length > 0) {
                    artists = video.artists;
                    delete video.artists;
                }
                if (id == 0) {
                    _this.saveVideoApi(video, artists);
                }
                else {
                    video.id = id;
                    _this.updateVideoApi(video, artists);
                }
            }
        });
        this.isWorking = false;
    };
    VideoLibraryManagerComponent.prototype.updateStatus = function (id, statusRecordId) {
        var status = (statusRecordId == 1) ? 2 : 1;
        var params = {
            id: id,
            status: status
        };
        this.changeStatusApi(params);
    };
    VideoLibraryManagerComponent.prototype.confirmDelete = function (id, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteVideoApi(id);
            }
        });
    };
    VideoLibraryManagerComponent.prototype.responseError = function (err) {
        console.log('http', err);
        this.isWorking = false;
    };
    //#region API
    VideoLibraryManagerComponent.prototype.saveVideoApi = function (model, artist) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.Video, model).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster('Registro guardado exitosamente!');
                _this.saveVideoArtistsApi(artist, response.result.id);
                _this.videoList.push(response.result);
                _this.changeList.emit(_this.videoList);
            }
            else {
                _this.toaster.showToaster('Error guardando registro');
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    VideoLibraryManagerComponent.prototype.updateVideoApi = function (model, artist) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.Album, model).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster('Registro modificado exitosamente!');
                _this.deleteVideoArtistsApi(model.id, artist);
                _this.getVideosApi();
            }
            else {
                _this.toaster.showToaster('Error modificando registro');
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    VideoLibraryManagerComponent.prototype.changeStatusApi = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.VideoStatus, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster('Cambio de estatus exitoso!');
                _this.getVideosApi();
            }
            else {
                _this.toaster.showToaster('Error cambiando estatus');
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    VideoLibraryManagerComponent.prototype.deleteVideoApi = function (id) {
        var _this = this;
        var params = {
            id: id
        };
        this.apiService.delete(EEndpoints.Video, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.getVideosApi();
                _this.toaster.showToaster('registro eliminado');
            }
            else {
                _this.toaster.showToaster('ocurrio un error eliminando el registro');
            }
        }, function (err) { return _this.responseError(err); });
    };
    VideoLibraryManagerComponent.prototype.getVideosApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Videos).subscribe(function (response) {
            if (response.code == 100) {
                _this.videoList = response.result;
                console.log(_this.videoList);
            }
            else {
                _this.toaster.showToaster('Error obteniendo datos');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    VideoLibraryManagerComponent.prototype.saveVideoArtistsApi = function (artists, videoId) {
        var _this = this;
        var params = artists.map(function (m) {
            return {
                PersonComposerId: m.id,
                VideoId: videoId
            };
        });
        console.log(params);
        this.apiService.save(EEndpoints.VideoComposers, params).subscribe(function (response) {
            if (response.code != 100) {
                _this.toaster.showToaster('Ocurrio un error guardando artistas');
            }
        }, function (err) { return _this.reponseError(err); });
    };
    VideoLibraryManagerComponent.prototype.deleteVideoArtistsApi = function (videoId, params, saveAfter) {
        var _this = this;
        if (saveAfter === void 0) { saveAfter = true; }
        this.apiService.delete(EEndpoints.VideoComposers, { videoId: videoId }).subscribe(function (response) {
            if (response.code == 100) {
                if (saveAfter) {
                    _this.saveVideoArtistsApi(params, videoId);
                }
            }
            else
                _this.toaster.showToaster('Ocurrio un error eliminando las artistas');
        }, function (err) { return _this.reponseError(err); });
    };
    VideoLibraryManagerComponent.prototype.reponseError = function (err) {
        console.log('http', err);
        this.isWorking = false;
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], VideoLibraryManagerComponent.prototype, "personId", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], VideoLibraryManagerComponent.prototype, "changeList", void 0);
    VideoLibraryManagerComponent = __decorate([
        Component({
            selector: 'app-video-library-manager',
            templateUrl: './video-library-manager.component.html'
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            TranslateService,
            MatDialog])
    ], VideoLibraryManagerComponent);
    return VideoLibraryManagerComponent;
}());
export { VideoLibraryManagerComponent };
//# sourceMappingURL=video-library-manager.component.js.map