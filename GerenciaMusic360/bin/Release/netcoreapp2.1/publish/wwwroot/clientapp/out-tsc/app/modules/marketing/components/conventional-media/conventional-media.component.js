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
import { Component, Optional, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
var ConventionalMediaComponent = /** @class */ (function () {
    function ConventionalMediaComponent(apiService, toaster, translationLoaderService, fb, translate, dialogRef, data) {
        var _a;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translationLoaderService = translationLoaderService;
        this.fb = fb;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.data = data;
        this.isWorking = false;
        this.model = {};
        this.usedKeysIdeas = [];
        this.keysIdeasList = [];
        this.socialNetworksList = [];
        this.showSocialList = false;
        this.cssClass = 'mat-elevation-z4 p-4 accent-bg';
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    ConventionalMediaComponent.prototype.ngOnInit = function () {
        this.model = this.data.marketingKey;
        this.usedKeysIdeas = this.data.keysIdeas;
        this._getKeyIdeas();
    };
    ConventionalMediaComponent.prototype.onNoClick = function (overview) {
        if (overview === void 0) { overview = undefined; }
        this.dialogRef.close(overview);
    };
    ConventionalMediaComponent.prototype.selectKeyIdea = function (item) {
        item.cssClass = (item.cssClass == undefined || item.cssClass == '') ? this.cssClass : '';
    };
    ConventionalMediaComponent.prototype.toggleSocialList = function () {
        this.socialNetworksList.forEach(function (item) {
            item.cssClass = '';
        });
        this.showSocialList = !this.showSocialList;
    };
    ConventionalMediaComponent.prototype.selectSocialNetwork = function (item) {
        item.cssClass = (item.cssClass == '' || item.cssClass == undefined) ? this.cssClass : '';
    };
    ConventionalMediaComponent.prototype.saveSocialNetwork = function () {
        var _this = this;
        var list = this.socialNetworksList.filter(function (f) { return f.cssClass != undefined && f.cssClass != ''; });
        if (list.length > 0) {
            var keysIdeas = list.map(function (m, index) {
                return {
                    keyIdeasTypeId: _this.model.keyIdeasTypeId,
                    categoryId: _this.model.categoryId,
                    socialNetworkTypeId: m.id,
                    name: '',
                    position: _this.keysIdeasList.length + (index + 1)
                };
            });
            this._saveKeysIdeas(keysIdeas);
        }
    };
    ConventionalMediaComponent.prototype.save = function () {
        var _this = this;
        var list = this.keysIdeasList.filter(function (f) { return f.cssClass != undefined && f.cssClass != ''; });
        if (list.length > 0) {
            var keysNames = list.map(function (m, index) {
                return {
                    marketingKeyIdeasId: _this.model.id,
                    keyIdeasId: m.id
                };
            });
            this._deleteKeysNames(this.model.id, keysNames);
        }
    };
    ConventionalMediaComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    ConventionalMediaComponent.prototype._getKeyIdeas = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.KeyIdeasByType, { keyIdeasTypeId: this.model.keyIdeasTypeId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.keysIdeasList = response.result.map(function (m) {
                    var item = m;
                    var found = _this.usedKeysIdeas.findIndex(function (f) { return f.id == m.id; });
                    if (found >= 0)
                        item.cssClass = _this.cssClass;
                    return item;
                });
                _this._getSocialNetworkTypes();
            }
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ConventionalMediaComponent.prototype._saveKeyIdeasNames = function (keyNames) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingKeyIdeaNames, keyNames).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(_this.model);
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ConventionalMediaComponent.prototype._deleteKeysNames = function (marketingKeyIdeasId, marketingKeyIdeasNames) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MarketingKeyIdeaNameByMarketingKeysId, { marketingKeyIdeasId: marketingKeyIdeasId }).subscribe(function (response) {
            if (response.code == 100)
                _this._saveKeyIdeasNames(marketingKeyIdeasNames);
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ConventionalMediaComponent.prototype._getSocialNetworkTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.SocialNetworkTypes).subscribe(function (response) {
            if (response.code == 100) {
                response.result.forEach(function (value) {
                    var found = _this.keysIdeasList.findIndex(function (f) { return f.socialNetworkTypeId == value.id; });
                    if (found < 0) {
                        _this.socialNetworksList.push(value);
                    }
                });
                _this.isWorking = false;
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    ConventionalMediaComponent.prototype._saveKeysIdeas = function (keysIdeas) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.KeyIdeas, keysIdeas).subscribe(function (response) {
            if (response.code == 100) {
                _this._getKeyIdeas();
                _this.toggleSocialList();
                _this.socialNetworksList = [];
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    ConventionalMediaComponent = __decorate([
        Component({
            selector: 'app-conventional-media',
            templateUrl: './conventional-media.component.html',
            styleUrls: ['./conventional-media.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            FormBuilder,
            TranslateService,
            MatDialogRef, Object])
    ], ConventionalMediaComponent);
    return ConventionalMediaComponent;
}());
export { ConventionalMediaComponent };
//# sourceMappingURL=conventional-media.component.js.map