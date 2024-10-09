var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { MatDialog } from '@angular/material';
import { AlbumFormComponent } from '../album-form/album-form.component';
import { ConfirmComponent } from '../confirm/confirm.component';
var AlbumManagerComponent = /** @class */ (function () {
    //#region Lifetime Cycle
    function AlbumManagerComponent(apiService, toaster, _fuseTranslationLoaderService, translate, dialog) {
        this.apiService = apiService;
        this.toaster = toaster;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.translate = translate;
        this.dialog = dialog;
        this.changeList = new EventEmitter();
        this.albumList = [];
        this.isWorking = false;
        this.albumId = 0;
        this.albumDetail = false;
    }
    AlbumManagerComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    };
    AlbumManagerComponent.prototype.ngOnDestroy = function () {
        this.changeList.complete();
    };
    AlbumManagerComponent.prototype.ngOnChanges = function (changes) {
        var personId = changes.personId;
        if (personId.currentValue > 0) {
            this.albumDetail = false;
            this.getAbumApi();
        }
    };
    //#endregion
    AlbumManagerComponent.prototype.showForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        this.isWorking = true;
        var album = {};
        if (id != 0) {
            album = this.albumList.find(function (f) { return f.id == id; });
        }
        var dialogRef = this.dialog.open(AlbumFormComponent, {
            width: '800px',
            data: {
                model: album
            }
        });
        dialogRef.afterClosed().subscribe(function (album) {
            if (album !== undefined) {
                album.personRelationId = _this.personId;
                var works = [];
                if (album.works && album.works.length > 0) {
                    works = album.works;
                    delete album.works;
                    console.log('existen obras');
                }
                if (id == 0) {
                    _this.saveAlbumApi(album, works);
                }
                else {
                    album.id = id;
                    _this.updateAlbumApi(album, works);
                }
            }
        });
        this.isWorking = false;
    };
    AlbumManagerComponent.prototype.updateStatus = function (id, statusRecordId) {
        var status = (statusRecordId == 1) ? 2 : 1;
        var params = {
            id: id,
            status: status,
            TypeId: this.personId
        };
        this.changeStatusApi(params);
    };
    AlbumManagerComponent.prototype.confirmDelete = function (id, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '500px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1) {
                    var params = {
                        id: id,
                        personId: _this.personId
                    };
                    _this.deleteAlbumApi(params);
                }
            }
        });
    };
    AlbumManagerComponent.prototype.reponseError = function (err) {
        console.log('http', err);
        this.isWorking = false;
    };
    //#region api
    AlbumManagerComponent.prototype.saveAlbumApi = function (model, works) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.Album, model).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster('Registro guardado exitosamente!');
                _this.saveAlbumWorksApi(works, response.result.id);
                _this.albumList.push(response.result);
                _this.changeList.emit(_this.albumList);
            }
            else {
                _this.toaster.showToaster('Error guardando registro');
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AlbumManagerComponent.prototype.updateAlbumApi = function (model, works) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.Album, model).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster('Registro modificado exitosamente!');
                _this.deleteAlbumWorksApi(model.id, works);
                _this.getAbumApi();
            }
            else {
                _this.toaster.showToaster('Error modificando registro');
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AlbumManagerComponent.prototype.changeStatusApi = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.AlbumStatus, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster('Cambio de estatus exitoso!');
                _this.getAbumApi();
            }
            else {
                _this.toaster.showToaster('Error cambiando estatus');
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AlbumManagerComponent.prototype.getAbumApi = function () {
        var _this = this;
        this.isWorking = true;
        var param = { personId: this.personId };
        this.apiService.get(EEndpoints.AlbumsByPerson, param).subscribe(function (response) {
            if (response.code == 100) {
                _this.albumList = response.result;
                _this.changeList.emit(_this.albumList);
            }
            else {
                _this.toaster.showToaster('Error obteniendo datos del album');
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AlbumManagerComponent.prototype.deleteAlbumApi = function (params) {
        var _this = this;
        this.apiService.delete(EEndpoints.Album, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.deleteAlbumWorksApi(params.id, null, false);
                _this.getAbumApi();
                _this.toaster.showToaster('registro eliminado!');
            }
            else {
                _this.toaster.showToaster('Error eliminando registro');
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AlbumManagerComponent.prototype.saveAlbumWorksApi = function (works, albumId) {
        var _this = this;
        var params = works.map(function (m) {
            return {
                WorkId: m.id,
                AlbumId: albumId
            };
        });
        this.apiService.save(EEndpoints.AlbumWorks, params).subscribe(function (response) {
            if (response.code != 100) {
                _this.toaster.showToaster('Ocurrio un error guardando las obras');
            }
        }, function (err) { return _this.reponseError(err); });
    };
    AlbumManagerComponent.prototype.deleteAlbumWorksApi = function (albumId, params, saveAfter) {
        var _this = this;
        if (saveAfter === void 0) { saveAfter = true; }
        this.apiService.delete(EEndpoints.AlbumWorks, { albumId: albumId }).subscribe(function (response) {
            if (response.code == 100) {
                if (saveAfter) {
                    _this.saveAlbumWorksApi(params, albumId);
                }
            }
            else
                _this.toaster.showToaster('Ocurrio un error eliminando las obras');
        }, function (err) { return _this.reponseError(err); });
    };
    AlbumManagerComponent.prototype.openDetail = function (id) {
        var _this = this;
        this.isWorking = true;
        var param = { albumId: id };
        this.apiService.get(EEndpoints.AlbumWorks, param).subscribe(function (response) {
            if (response.code == 100) {
                _this.albumWorks = response.result;
            }
            else {
                _this.toaster.showToaster('Error obteniendo datos del album');
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
        this.albumDetail = !this.albumDetail;
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AlbumManagerComponent.prototype, "personId", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AlbumManagerComponent.prototype, "changeList", void 0);
    AlbumManagerComponent = __decorate([
        Component({
            selector: 'app-album-manager',
            templateUrl: './album-manager.component.html',
            styleUrls: ['./album-manager.component.scss']
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            TranslateService,
            MatDialog])
    ], AlbumManagerComponent);
    return AlbumManagerComponent;
}());
export { AlbumManagerComponent };
//# sourceMappingURL=album-manager.component.js.map