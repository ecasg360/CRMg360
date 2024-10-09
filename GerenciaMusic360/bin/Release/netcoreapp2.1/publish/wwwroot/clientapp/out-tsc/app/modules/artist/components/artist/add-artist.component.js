var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Optional, Inject, Input } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { entity } from '@enums/entity';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { isNullOrUndefined } from 'util';
var AddArtistComponent = /** @class */ (function () {
    //#region Lifetime Cycle
    function AddArtistComponent(formBuilder, apiService, toaster, translate, dialogRef, _fuseTranslationLoaderService, data) {
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.data = data;
        this.entityType = entity.Artist;
        this.isBuyer = false;
        this.isArtist = false;
        this.id = 0;
        this.isWorking = false;
        this.musicalGenres = [];
        this.personTypes = [];
        this.membersList = [];
        this.musicalGenresId = [];
        this.agentsList = [];
        this.isInternal = false;
    }
    AddArtistComponent.prototype.ngOnInit = function () {
        var _a;
        console.log('Entró al onInit en add artist: ', this.data);
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = 0;
        this.title = (this.data.title) ? this.data.title : this.translate.instant('general.artist');
        if (this.data !== null) {
            this.id = this.data.personId;
            this.artist = (this.data.model != undefined) ? this.data.model : {};
            this.person = this.artist;
            this.isInternal = this.person.isInternal;
            this.pictureUrl = this.artist.pictureUrl;
            this.isArtist = this.data.isArtist ? true : false;
        }
        this.initForm();
        if (!isNullOrUndefined(this.data.entityType)) {
            this.isBuyer = this.data.isBuyer;
            this.entityType = this.data.entityType;
            this.f.personTypeId.setValue(entity.Buyer);
        }
        this.getPersonTypesApi();
        this.getMusicalGenresApi();
        this.getAgentsApi();
        if (this.id > 0) {
            this.actionLabel = this.translate.instant('general.save');
            this.getArtistMusicalGenresApi();
        }
        else {
            this.actionLabel = this.translate.instant('general.new');
        }
    };
    //#endregion
    //#region form
    AddArtistComponent.prototype.initForm = function () {
        console.log('this.isArtist en initForm: ', this.isArtist);
        var reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.addArtistForm = this.formBuilder.group({
            aliasName: [this.artist.aliasName, []],
            price: [this.artist.price, [
                    Validators.pattern("^[0-9]*$"),
                ]],
            personTypeId: [this.artist.personTypeId, [
                    Validators.required
                ]],
            musicalGenreId: [this.musicalGenresId, [
                    Validators.required
                ]],
            website: [this.artist.webSite, [
                    Validators.pattern(reg)
                ]],
            personRelationId: [this.artist.personRelationId, []],
            biography: [this.artist.biography, []],
        });
    };
    Object.defineProperty(AddArtistComponent.prototype, "f", {
        get: function () { return this.addArtistForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddArtistComponent.prototype.bindExternalForm = function (name, form) {
        this.addArtistForm.setControl(name, form);
    };
    //#endregion
    //#region API
    AddArtistComponent.prototype.saveArtistApi = function () {
        var _this = this;
        this.isWorking = true;
        this.prepareDataToSend();
        this.apiService.save(EEndpoints.Artist, this.artist).subscribe(function (response) {
            if (response.code == 100) {
                _this.id = response.result;
                _this.saveMusicalGenres();
                _this.deleteAgentApi();
                _this.toaster.showToaster(_this.translate.instant('messages.itemSaved'));
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('messages.savedArtistFailed'));
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistComponent.prototype.saveBuyerApi = function () {
        var _this = this;
        this.isWorking = true;
        this.prepareDataToSend();
        this.artist.personRelationId = 0;
        this.apiService.save(EEndpoints.Buyer, this.artist).subscribe(function (response) {
            if (response.code == 100) {
                _this.id = response.result.id;
                _this.saveMusicalGenres();
                _this.deleteAgentApi();
                _this.toaster.showToaster(_this.translate.instant('messages.dataSaved'));
                _this.onNoClick(response.result);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('messages.savedArtistFailed'));
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistComponent.prototype.updateArtistApi = function () {
        var _this = this;
        this.prepareDataToSend();
        this.artist.id = this.id;
        this.deleteAgentApi();
        this.apiService.update(EEndpoints.Artist, this.artist).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.dataEdited'));
                _this.saveMusicalGenres();
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.dataEditedFailed'));
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistComponent.prototype.updateBuyerApi = function () {
        var _this = this;
        this.prepareDataToSend();
        this.artist.id = this.id;
        this.apiService.update(EEndpoints.Buyer, this.artist).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.dataEdited'));
                _this.saveMusicalGenres();
                _this.deleteAgentApi();
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.dataEditedFailed'));
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistComponent.prototype.getMusicalGenresApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.MusicalGenres).subscribe(function (data) {
            if (data.code == 100) {
                _this.musicalGenres = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistComponent.prototype.getArtistMusicalGenresApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.PersonMusicalGenres, { personId: this.id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.musicalGenresId = [];
                if (response.result.length > 0) {
                    for (var i = 0; i < response.result.length; i++) {
                        var element = response.result[i];
                        _this.musicalGenresId.push(element.musicalGenreId);
                    }
                }
                _this.addArtistForm.patchValue({ musicalGenreId: _this.musicalGenresId });
            }
            else {
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistComponent.prototype.setMusicalGenresApi = function () {
        var _this = this;
        this.isWorking = true;
        var data = this.musicalGenresId.map(function (m) {
            return {
                personId: _this.id,
                musicalGenreId: m
            };
        });
        this.apiService.save(EEndpoints.PersonMusicalGenres, data).subscribe(function (response) {
            if (response.code != 100) {
                _this.toaster.showToaster(_this.translate.instant('error.savedMusicalGenreFailed'));
                console.log(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistComponent.prototype.deleteMusicalGenresApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.PersonMusicalGenres, { id: this.id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.setMusicalGenresApi();
            }
            else {
                console.log(data.message);
            }
            _this.isWorking = false;
            ;
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistComponent.prototype.getAgentsApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Agents).subscribe(function (response) {
            if (response.code == 100) {
                _this.agentsList = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name
                    };
                });
            }
            else
                console.log(response.message);
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistComponent.prototype.saveAgentApi = function () {
        var _this = this;
        var params = {
            PersonArtistId: this.id,
            PersonAgentId: this.artist.personRelationId
        };
        this.apiService.save(EEndpoints.ArtistAgent, params).subscribe(function (response) {
            if (response.code != 100) {
                _this.toaster.showToaster('Ocurrio un error asociando al agente del artista');
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistComponent.prototype.deleteAgentApi = function () {
        var _this = this;
        console.log('borrando agente');
        if (this.artist.personRelationId > 0) {
            console.log('agent: ' + this.artist.personRelationId);
            console.log('artist: ' + this.artist.id);
            this.apiService.delete(EEndpoints.ArtistAgent, { agentId: this.artist.personRelationId, artistId: this.artist.id }).subscribe(function (response) {
                _this.saveAgentApi();
            }, function (err) { return _this.responseError(err); });
        }
    };
    AddArtistComponent.prototype.getPersonTypesApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.PersonTypes, { entityId: entity.Artist }).subscribe(function (data) {
            if (data.code == 100) {
                _this.personTypes = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return console.error('Failed artist type! ', err); });
    };
    //#endregion
    //#region general methods
    AddArtistComponent.prototype.setArtist = function () {
        if (!this.addArtistForm.invalid) {
            console.log(this.id);
            if (!this.id) {
                switch (this.entityType) {
                    case entity.Artist:
                        this.saveArtistApi();
                        break;
                    case entity.Buyer:
                        this.saveBuyerApi();
                        break;
                    default:
                        this.saveArtistApi();
                        break;
                }
            }
            else {
                switch (this.entityType) {
                    case entity.Artist:
                        this.updateArtistApi();
                        break;
                    case entity.Buyer:
                        this.updateBuyerApi();
                        break;
                    default:
                        this.saveArtistApi();
                        break;
                }
            }
        }
    };
    AddArtistComponent.prototype.prepareDataToSend = function () {
        this.artist = this.addArtistForm.value['generalData'];
        this.artist.pictureUrl = (this.artist.pictureUrl && this.artist.pictureUrl.indexOf('assets') >= 0)
            ? null : this.artist.pictureUrl;
        var values = this.addArtistForm.value;
        this.musicalGenresId = values.musicalGenreId;
        for (var key in values) {
            if (key != 'generalData' && key != 'musicalGenreId' &&
                key != 'generalTaste' && key != 'birthDate') {
                var value = values[key];
                this.artist[key] = value;
            }
        }
    };
    AddArtistComponent.prototype.saveMusicalGenres = function () {
        if (this.musicalGenres.length > 0 && this.id > 0) {
            this.deleteMusicalGenresApi();
        }
    };
    AddArtistComponent.prototype.responseError = function (err) {
        console.log('http error', err);
        this.isWorking = false;
    };
    AddArtistComponent.prototype.onNoClick = function (artist) {
        if (artist === void 0) { artist = undefined; }
        this.dialogRef.close(artist);
    };
    AddArtistComponent.prototype.outIsInternal = function ($event) {
        this.isInternal = $event;
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AddArtistComponent.prototype, "artist", void 0);
    AddArtistComponent = __decorate([
        Component({
            selector: 'app-add-artist',
            templateUrl: './add-artist.component.html'
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            ApiService,
            ToasterService,
            TranslateService,
            MatDialogRef,
            FuseTranslationLoaderService, Object])
    ], AddArtistComponent);
    return AddArtistComponent;
}());
export { AddArtistComponent };
//# sourceMappingURL=add-artist.component.js.map