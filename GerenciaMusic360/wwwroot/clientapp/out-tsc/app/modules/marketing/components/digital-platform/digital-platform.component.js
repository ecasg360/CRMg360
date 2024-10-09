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
var DigitalPlatformComponent = /** @class */ (function () {
    function DigitalPlatformComponent(apiService, toaster, translationLoaderService, fb, translate, dialogRef, data) {
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
        this.allSocialNetworksList = [];
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    DigitalPlatformComponent.prototype.ngOnInit = function () {
        this.model = this.data.marketingKey;
        this.usedKeysIdeas = this.data.keysIdeas;
        this.keysBudgets = this.data.keysBudgets;
        this._getSocialNetworkTypes();
        this._getKeyIdeas();
        this.initForm();
        //this._fillTable();
    };
    DigitalPlatformComponent.prototype.initForm = function () {
        this.formPlatform = this.fb.group({});
    };
    Object.defineProperty(DigitalPlatformComponent.prototype, "f", {
        get: function () { return this.formPlatform.controls; },
        enumerable: false,
        configurable: true
    });
    DigitalPlatformComponent.prototype.onNoClick = function (overview) {
        if (overview === void 0) { overview = undefined; }
        this.dialogRef.close(overview);
    };
    DigitalPlatformComponent.prototype.selectKeyIdea = function (item) {
        item.cssClass = (item.cssClass == undefined || item.cssClass == '') ? this.cssClass : '';
    };
    DigitalPlatformComponent.prototype.toggleSocialList = function () {
        this.socialNetworksList.forEach(function (item) {
            item.cssClass = '';
        });
        this.showSocialList = !this.showSocialList;
    };
    DigitalPlatformComponent.prototype.selectSocialNetwork = function (item) {
        item.cssClass = (item.cssClass == '' || item.cssClass == undefined) ? this.cssClass : '';
    };
    DigitalPlatformComponent.prototype.saveSocialNetwork = function () {
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
    DigitalPlatformComponent.prototype.addPlatformValues = function () {
        if (this.objetive && this.percentage && this.social_network) {
            this.valuesList.push({
                objetive: this.objetive,
                percentage: this.percentage,
                social_network: this.social_network,
                social_network_name: this.getSocialNetworkName(this.social_network)
            });
            this.percentage = 0;
            this.objetive = '';
            this.social_network = null;
        }
    };
    DigitalPlatformComponent.prototype.getSocialNetworkName = function (socialNetworkId) {
        console.log('socialNetworkId getSocialNetworkName: ', socialNetworkId);
        console.log('allSocialNetworksList: ', this.allSocialNetworksList);
        var name = '';
        this.allSocialNetworksList.forEach(function (element) {
            console.log('element: ', element);
            if (element.id === socialNetworkId) {
                console.log('Entró al if: ', element);
                name = element.name;
            }
            else {
                console.log('Entro al else: ', socialNetworkId, element.id);
            }
        });
        console.log('return name: ', name);
        return name;
    };
    DigitalPlatformComponent.prototype.deleteValue = function (index) {
        this.valuesList.splice(index, 1);
    };
    DigitalPlatformComponent.prototype.save = function () {
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
                    socialNetworkId: m.social_network
                };
            });
            this._deleteKeysNames(this.model.id, keysNames, keyBudgets);
        }
    };
    DigitalPlatformComponent.prototype._fillTable = function () {
        var _this = this;
        console.log('this.keysBudgets en _fillTable: ', this.keysBudgets);
        if (this.keysBudgets.length > 0) {
            this.valuesList = this.keysBudgets.map(function (m) {
                return {
                    objetive: m.target,
                    percentage: m.percentageBudget,
                    social_network: m.socialNetworkId,
                    social_network_name: _this.getSocialNetworkName(m.socialNetworkId)
                };
            });
            console.log('this.valuesList _fillTable: ', this.valuesList);
        }
    };
    DigitalPlatformComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    DigitalPlatformComponent.prototype._getKeyIdeas = function () {
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
                //this._getSocialNetworkTypes();
            }
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    DigitalPlatformComponent.prototype._saveKeyIdeasNames = function (keyNames, keyBudget) {
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
    DigitalPlatformComponent.prototype._saveKeyIdeasBudget = function (keyNames) {
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
    DigitalPlatformComponent.prototype._deleteKeysNames = function (marketingKeyIdeasId, marketingKeyIdeasNames, keyBudget) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MarketingKeyIdeaNameByMarketingKeysId, { marketingKeyIdeasId: marketingKeyIdeasId }).subscribe(function (response) {
            if (response.code == 100)
                _this._deleteKeysBudget(marketingKeyIdeasId, marketingKeyIdeasNames, keyBudget);
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    DigitalPlatformComponent.prototype._deleteKeysBudget = function (marketingKeyIdeasId, marketingKeyIdeasNames, keyBudget) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MarketingKeyIdeasBudgets, { marketingKeyIdeaId: marketingKeyIdeasId }).subscribe(function (response) {
            if (response.code == 100)
                _this._saveKeyIdeasNames(marketingKeyIdeasNames, keyBudget);
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    DigitalPlatformComponent.prototype._getSocialNetworkTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.SocialNetworkTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.allSocialNetworksList = response.result;
                response.result.forEach(function (value) {
                    var found = _this.keysIdeasList.findIndex(function (f) { return f.socialNetworkTypeId == value.id; });
                    if (found < 0) {
                        _this.socialNetworksList.push(value);
                    }
                });
                _this.isWorking = false;
                console.log('this.allSocialNetworksList: ', _this.allSocialNetworksList);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
            _this._fillTable();
        }, function (err) { return _this._responseError(err); });
    };
    DigitalPlatformComponent.prototype._saveKeysIdeas = function (keysIdeas) {
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
    DigitalPlatformComponent = __decorate([
        Component({
            selector: 'app-digital-platform',
            templateUrl: './digital-platform.component.html',
            styleUrls: ['./digital-platform.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            FormBuilder,
            TranslateService,
            MatDialogRef, Object])
    ], DigitalPlatformComponent);
    return DigitalPlatformComponent;
}());
export { DigitalPlatformComponent };
//# sourceMappingURL=digital-platform.component.js.map