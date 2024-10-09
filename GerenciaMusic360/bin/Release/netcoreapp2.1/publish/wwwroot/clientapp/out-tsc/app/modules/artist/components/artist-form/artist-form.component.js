var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { entity } from '@enums/entity';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { isNullOrUndefined } from 'util';
import { EEndpoints } from '@enums/endpoints';
import { Subject } from 'rxjs';
var ArtistFormComponent = /** @class */ (function () {
    //#region Lifetime Cycle
    function ArtistFormComponent(formBuilder, apiService, toaster, translate, _fuseTranslationLoaderService) {
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.entityType = entity.Artist;
        this.formReady = new EventEmitter();
        this.formWorking = new EventEmitter();
        this._unsubscribeAll = new Subject();
        this.isBuyer = false;
        this.musicalGenres = [];
        this.personTypes = [];
        this.membersList = [];
        this.person = {};
        this.musicalGenresId = [];
        this.agentsList = [];
        this.isInternal = false;
    }
    Object.defineProperty(ArtistFormComponent.prototype, "isWorking", {
        get: function () {
            return this._isWorking;
        },
        set: function (v) {
            this._isWorking = v;
            this._manageFormStates();
        },
        enumerable: false,
        configurable: true
    });
    ArtistFormComponent.prototype.ngOnChanges = function (changes) {
        if (!changes.artist.firstChange) {
            this.person = this.artist;
            this.initForm();
        }
    };
    ArtistFormComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.person = this.artist;
        this.isInternal = this.person.isInternal;
        this.pictureUrl = this.artist.pictureUrl;
        this.initForm();
        if (!isNullOrUndefined(this.entityType)) {
            this.isBuyer = true;
            this.f.personTypeId.setValue(entity.Buyer);
        }
        this.getPersonTypesApi();
        this.getMusicalGenresApi();
        this.getAgentsApi();
    };
    ArtistFormComponent.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.formReady.complete();
        this.formWorking.complete();
    };
    //#endregion
    //#region form
    ArtistFormComponent.prototype.initForm = function () {
        var reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.artistForm = this.formBuilder.group({
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
    Object.defineProperty(ArtistFormComponent.prototype, "f", {
        get: function () { return this.artistForm.controls; },
        enumerable: false,
        configurable: true
    });
    ArtistFormComponent.prototype.bindExternalForm = function (name, form) {
        console.log('bind');
        this.artistForm.setControl(name, form);
        this.formReady.emit(this.artistForm);
    };
    //#endregion
    //#region API
    ArtistFormComponent.prototype.saveArtistApi = function () {
        var _this = this;
        this.isWorking = true;
        this.prepareDataToSend();
        console.log(this.artist);
        this.apiService.save(EEndpoints.Artist, this.artist).subscribe(function (response) {
            if (response.code == 100) {
                _this.artist.id = response.result;
                _this.person.id = response.result;
                _this.saveMusicalGenres();
                _this.deleteAgentApi();
                _this.toaster.showToaster(_this.translate.instant('messages.dataSaved'));
            }
            else {
                console.log(response.message);
                _this.toaster.showToaster(_this.translate.instant('messages.savedArtistFailed'));
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ArtistFormComponent.prototype.saveBuyerApi = function () {
        var _this = this;
        this.isWorking = true;
        this.prepareDataToSend();
        this.artist.personRelationId = 0;
        this.apiService.save(EEndpoints.Buyer, this.artist).subscribe(function (response) {
            if (response.code == 100) {
                _this.artist.id = response.result.id;
                _this.person.id = response.result.id;
                _this.saveMusicalGenres();
                _this.deleteAgentApi();
                _this.toaster.showToaster(_this.translate.instant('messages.dataSaved'));
                // this.onNoClick(response.result);
            }
            else {
                console.log(response.message);
                _this.toaster.showToaster(_this.translate.instant('messages.savedArtistFailed'));
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ArtistFormComponent.prototype.updateArtistApi = function () {
        var _this = this;
        console.log('actualizar');
        this.prepareDataToSend();
        this.deleteAgentApi();
        this.apiService.update(EEndpoints.Artist, this.artist).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.dataEdited'));
                _this.saveMusicalGenres();
            }
            else {
                console.log(response.message);
                _this.toaster.showToaster(_this.translate.instant('errors.dataEditedFailed'));
            }
        }, function (err) { return _this._responseError(err); });
    };
    ArtistFormComponent.prototype.updateBuyerApi = function () {
        var _this = this;
        this.prepareDataToSend();
        this.apiService.update(EEndpoints.Buyer, this.artist).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.dataEdited'));
                _this.saveMusicalGenres();
                _this.deleteAgentApi();
            }
            else {
                console.log(response.message);
                _this.toaster.showToaster(_this.translate.instant('errors.dataEditedFailed'));
            }
        }, function (err) { return _this._responseError(err); });
    };
    ArtistFormComponent.prototype.getMusicalGenresApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.MusicalGenres).subscribe(function (data) {
            if (data.code == 100) {
                _this.musicalGenres = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this._responseError(err); });
    };
    ArtistFormComponent.prototype.getArtistMusicalGenresApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.PersonMusicalGenres, { personId: this.artist.id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.musicalGenresId = [];
                if (response.result.length > 0) {
                    for (var i = 0; i < response.result.length; i++) {
                        var element = response.result[i];
                        _this.musicalGenresId.push(element.musicalGenreId);
                    }
                }
                _this.artistForm.patchValue({ musicalGenreId: _this.musicalGenresId });
            }
            else {
                console.log(response.message);
            }
        }, function (err) { return _this._responseError(err); });
    };
    ArtistFormComponent.prototype.setMusicalGenresApi = function () {
        var _this = this;
        this.isWorking = true;
        var data = this.musicalGenresId.map(function (m) {
            return {
                personId: _this.artist.id,
                musicalGenreId: m
            };
        });
        this.apiService.save(EEndpoints.PersonMusicalGenres, data).subscribe(function (response) {
            if (response.code != 100) {
                _this.toaster.showToaster(_this.translate.instant('error.savedMusicalGenreFailed'));
                console.log(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ArtistFormComponent.prototype.deleteMusicalGenresApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.PersonMusicalGenres, { id: this.artist.id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.setMusicalGenresApi();
            }
            else {
                console.log(data.message);
            }
            _this.isWorking = false;
            ;
        }, function (err) { return _this._responseError(err); });
    };
    ArtistFormComponent.prototype.getAgentsApi = function () {
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
        }, function (err) { return _this._responseError(err); });
    };
    ArtistFormComponent.prototype.saveAgentApi = function () {
        var _this = this;
        var params = {
            PersonArtistId: this.artist.id,
            PersonAgentId: this.artist.personRelationId
        };
        this.apiService.save(EEndpoints.ArtistAgent, params).subscribe(function (response) {
            if (response.code != 100) {
                _this.toaster.showToaster('Ocurrio un error asociando al agente del artista');
            }
        }, function (err) { return _this._responseError(err); });
    };
    ArtistFormComponent.prototype.deleteAgentApi = function () {
        var _this = this;
        console.log('borrando agente');
        if (this.artist.personRelationId > 0) {
            console.log('agent: ' + this.artist.personRelationId);
            console.log('artist: ' + this.artist.id);
            this.apiService.delete(EEndpoints.ArtistAgent, { agentId: this.artist.personRelationId, artistId: this.artist.id }).subscribe(function (response) {
                _this.saveAgentApi();
            }, function (err) { return _this._responseError(err); });
        }
    };
    ArtistFormComponent.prototype.getPersonTypesApi = function () {
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
    ArtistFormComponent.prototype.setArtist = function () {
        if (!this.artistForm.invalid) {
            console.log(this.artist.id);
            if (!this.artist.id) {
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
    ArtistFormComponent.prototype._manageFormStates = function () {
        if (this.isWorking)
            this.artistForm.disable();
        else
            this.artistForm.enable();
        this.formWorking.emit(this.isWorking);
    };
    ArtistFormComponent.prototype.prepareDataToSend = function () {
        this.artist = this.artistForm.value['generalData'];
        this.artist.pictureUrl = (this.artist.pictureUrl.indexOf('assets') >= 0)
            ? null : this.artist.pictureUrl;
        var values = this.artistForm.value;
        this.musicalGenresId = values.musicalGenreId;
        for (var key in values) {
            if (key != 'generalData' && key != 'musicalGenreId' &&
                key != 'generalTaste' && key != 'birthDate') {
                var value = values[key];
                this.artist[key] = value;
            }
        }
    };
    ArtistFormComponent.prototype.saveMusicalGenres = function () {
        if (this.musicalGenres.length > 0 && this.artist.id > 0) {
            this.deleteMusicalGenresApi();
        }
    };
    ArtistFormComponent.prototype._responseError = function (err) {
        this.toaster.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    ArtistFormComponent.prototype.outIsInternal = function ($event) {
        this.isInternal = $event;
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ArtistFormComponent.prototype, "artist", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ArtistFormComponent.prototype, "entityType", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ArtistFormComponent.prototype, "formReady", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ArtistFormComponent.prototype, "formWorking", void 0);
    ArtistFormComponent = __decorate([
        Component({
            selector: 'app-artist-form',
            templateUrl: './artist-form.component.html',
            styleUrls: ['./artist-form.component.scss']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            ApiService,
            ToasterService,
            TranslateService,
            FuseTranslationLoaderService])
    ], ArtistFormComponent);
    return ArtistFormComponent;
}());
export { ArtistFormComponent };
//# sourceMappingURL=artist-form.component.js.map