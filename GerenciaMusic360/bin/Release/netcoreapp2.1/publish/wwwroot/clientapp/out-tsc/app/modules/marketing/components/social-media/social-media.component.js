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
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
var SocialMediaComponent = /** @class */ (function () {
    function SocialMediaComponent(apiService, toaster, translationLoaderService, fb, translate, dialogRef, data) {
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
        this.valuesList = [];
        this.keysBudgets = [];
        this.objetive = '';
        this.percentage = 0;
        this.socialNetworksList = [];
        this.showSocialList = false;
        this.cssClass = 'mat-elevation-z4 p-4 accent-bg';
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    SocialMediaComponent.prototype.ngOnInit = function () {
        this.model = this.data.marketingKey;
        this.usedKeysIdeas = this.data.keysIdeas;
        this.keysBudgets = this.data.keysBudgets;
        this._getKeyIdeas();
        this.initForm();
        this._fillTable();
    };
    SocialMediaComponent.prototype.initForm = function () {
        this.formPlatform = this.fb.group({});
    };
    Object.defineProperty(SocialMediaComponent.prototype, "f", {
        get: function () { return this.formPlatform.controls; },
        enumerable: false,
        configurable: true
    });
    SocialMediaComponent.prototype.onNoClick = function (overview) {
        if (overview === void 0) { overview = undefined; }
        this.dialogRef.close(overview);
    };
    SocialMediaComponent.prototype.selectKeyIdea = function (item) {
        item.cssClass = (item.cssClass == undefined || item.cssClass == '') ? this.cssClass : '';
    };
    SocialMediaComponent.prototype.toggleSocialList = function () {
        this.socialNetworksList.forEach(function (item) {
            item.cssClass = '';
        });
        this.showSocialList = !this.showSocialList;
    };
    SocialMediaComponent.prototype.selectSocialNetwork = function (item) {
        item.cssClass = (item.cssClass == '' || item.cssClass == undefined) ? this.cssClass : '';
    };
    SocialMediaComponent.prototype.saveSocialNetwork = function () {
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
    SocialMediaComponent.prototype.addPlatformValues = function () {
        if (this.objetive && this.percentage) {
            this.valuesList.push({
                objetive: this.objetive,
                percentage: this.percentage
            });
            this.percentage = 0;
            this.objetive = '';
        }
    };
    SocialMediaComponent.prototype.deleteValue = function (index) {
        this.valuesList.splice(index, 1);
    };
    SocialMediaComponent.prototype.save = function () {
        var _this = this;
        var list = this.keysIdeasList.filter(function (f) { return f.cssClass != undefined && f.cssClass != ''; });
        if (list.length > 0 && this.valuesList.length > 0) {
            var keysNames = list.map(function (m, index) {
                return {
                    marketingKeyIdeasId: _this.model.id,
                    keyIdeasId: m.id
                };
            });
            var keyBudgets = this.valuesList.map(function (m) {
                return {
                    marketingKeyIdeasId: _this.model.id,
                    target: m.objetive,
                    percentageBudget: m.percentage,
                };
            });
            this._deleteKeysNames(this.model.id, keysNames, keyBudgets);
        }
    };
    SocialMediaComponent.prototype._fillTable = function () {
        if (this.keysBudgets.length > 0) {
            this.valuesList = this.keysBudgets.map(function (m) {
                return {
                    objetive: m.target,
                    percentage: m.percentageBudget
                };
            });
        }
    };
    SocialMediaComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    SocialMediaComponent.prototype._getKeyIdeas = function () {
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
    SocialMediaComponent.prototype._saveKeyIdeasNames = function (keyNames, keyBudget) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingKeyIdeaNames, keyNames).subscribe(function (response) {
            if (response.code == 100) {
                if (keyBudget.length > 0)
                    _this._saveKeyIdeasBudget(keyBudget);
                else
                    _this.onNoClick(_this.model);
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    SocialMediaComponent.prototype._saveKeyIdeasBudget = function (keyNames) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingKeyIdeasBudgets, keyNames).subscribe(function (response) {
            if (response.code == 100)
                _this.onNoClick(_this.model);
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    SocialMediaComponent.prototype._deleteKeysNames = function (marketingKeyIdeasId, marketingKeyIdeasNames, keyBudget) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MarketingKeyIdeaNameByMarketingKeysId, { marketingKeyIdeasId: marketingKeyIdeasId }).subscribe(function (response) {
            if (response.code == 100)
                _this._deleteKeysBudget(marketingKeyIdeasId, marketingKeyIdeasNames, keyBudget);
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    SocialMediaComponent.prototype._deleteKeysBudget = function (marketingKeyIdeasId, marketingKeyIdeasNames, keyBudget) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MarketingKeyIdeasBudgets, { marketingKeyIdeaId: marketingKeyIdeasId }).subscribe(function (response) {
            if (response.code == 100)
                _this._saveKeyIdeasNames(marketingKeyIdeasNames, keyBudget);
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    SocialMediaComponent.prototype._getSocialNetworkTypes = function () {
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
    SocialMediaComponent.prototype._saveKeysIdeas = function (keysIdeas) {
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
    SocialMediaComponent = __decorate([
        Component({
            selector: 'app-social-media',
            templateUrl: './social-media.component.html',
            styleUrls: ['./social-media.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            FormBuilder,
            TranslateService,
            MatDialogRef, Object])
    ], SocialMediaComponent);
    return SocialMediaComponent;
}());
export { SocialMediaComponent };
//# sourceMappingURL=social-media.component.js.map