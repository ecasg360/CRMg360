var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { EMarketingKeyIdeasSections } from '@enums/modules';
import { ConventionalMediaComponent } from './../conventional-media/conventional-media.component';
import { DigitalPlatformComponent } from './../digital-platform/digital-platform.component';
import { TouringComponent } from './../touring/touring.component';
import { SocialMediaComponent } from '../social-media/social-media.component';
var KeysIdeasManageComponent = /** @class */ (function () {
    function KeysIdeasManageComponent(apiService, toaster, dialog, translate, translationLoader) {
        var _a;
        this.apiService = apiService;
        this.toaster = toaster;
        this.dialog = dialog;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.marketingId = 0;
        this.perm = {};
        this.keysIdeasSection = EMarketingKeyIdeasSections;
        this.isWorking = false;
        this.configurationKeysIdeas = [];
        this.marketingKeyIdeasList = [];
        this.keysIdeasName = [];
        this.conventionalList = [];
        this.socialMediaList = [];
        this.touringList = [];
        this.digitalPlatformList = [];
        this.keyBudgets = [];
        this.allSocialNetworksList = [];
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        this._getConfigurations();
    }
    KeysIdeasManageComponent.prototype.ngOnInit = function () {
        this._getSocialNetworkTypes();
    };
    KeysIdeasManageComponent.prototype.openPanel = function (section, keyIdeasTypeId, categoryId) {
        var found = this.marketingKeyIdeasList.find(function (f) { return f.keyIdeasTypeId == keyIdeasTypeId && f.categoryId == categoryId; });
        if (found) {
            this._getKeysIdeasName(section, found.id);
        }
        else {
            var model = {
                marketingId: this.marketingId,
                keyIdeasTypeId: keyIdeasTypeId,
                categoryId: categoryId
            };
            this._createMarketingKeyIdea(model, section);
        }
    };
    KeysIdeasManageComponent.prototype.showModal = function (section, keyIdeasTypeId, categoryId) {
        var _this = this;
        var model = null;
        var component = null;
        var found = this.marketingKeyIdeasList.find(function (f) { return f.keyIdeasTypeId == keyIdeasTypeId && f.categoryId == categoryId; });
        console.log('section: ', section);
        switch (section) {
            case EMarketingKeyIdeasSections.conventionalMedia:
                model = {
                    marketingKey: found,
                    keysIdeas: this.conventionalList,
                };
                component = ConventionalMediaComponent;
                break;
            case EMarketingKeyIdeasSections.digitalPlatform:
                model = {
                    marketingKey: found,
                    keysIdeas: this.digitalPlatformList,
                    keysBudgets: this.keyBudgets,
                };
                component = DigitalPlatformComponent;
                break;
            case EMarketingKeyIdeasSections.socialMedia:
                model = {
                    marketingKey: found,
                    keysIdeas: this.socialMediaList,
                    keysBudgets: this.keyBudgets,
                };
                component = SocialMediaComponent;
                break;
            case EMarketingKeyIdeasSections.touring:
                model = {
                    marketingKey: found,
                    keysIdeas: this.touringList,
                };
                component = TouringComponent;
                break;
        }
        console.log('component: ', component);
        var dialogRef = this.dialog.open(component, {
            width: '700px',
            data: model
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this._getKeysIdeasName(section, found.id);
            }
        });
    };
    KeysIdeasManageComponent.prototype.delete = function (section, item) {
        var found = this.keysIdeasName.find(function (f) { return f.id == item.marketingKeyIdeasNameId; });
        this._deleteKeyName(item.marketingKeyIdeasNameId, section, found.marketingKeyIdeasId);
        if (section == EMarketingKeyIdeasSections.digitalPlatform || EMarketingKeyIdeasSections.socialMedia)
            this._deleteKeyBudget(found.marketingKeyIdeasId);
    };
    KeysIdeasManageComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    KeysIdeasManageComponent.prototype._getConfigurations = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ConfigurationMarketingKeyIdeasCategory).subscribe(function (response) {
            if (response.code == 100) {
                _this.configurationKeysIdeas = response.result;
                _this.isWorking = false;
                _this._getMarketingKeyIdeas();
            }
        }, function (err) { return _this._responseError(err); });
    };
    KeysIdeasManageComponent.prototype._getMarketingKeyIdeas = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MarketingKeyIdeas, { marketingId: this.marketingId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.marketingKeyIdeasList = response.result ? response.result : [];
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    KeysIdeasManageComponent.prototype._createMarketingKeyIdea = function (keyIdea, section) {
        var _this = this;
        if (section === void 0) { section = null; }
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingKeyIdea, keyIdea).subscribe(function (response) {
            if (response.code == 100) {
                _this.marketingKeyIdeasList.push(response.result);
                _this.isWorking = false;
                if (section) {
                    _this._getKeysIdeasName(section, response.result.id);
                }
            }
        }, function (err) { return _this._responseError(err); });
    };
    KeysIdeasManageComponent.prototype._getKeysIdeasName = function (section, marketingKeyIdeasId) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MarketingKeyIdeasNames, { marketingKeyIdeasId: marketingKeyIdeasId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.keysIdeasName = response.result;
                _this._getKeyIdeas(section, marketingKeyIdeasId);
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    KeysIdeasManageComponent.prototype._getKeyIdeas = function (section, marketingKeyIdeasId) {
        var _this = this;
        this.isWorking = true;
        var param = { marketingKeyIdeasId: marketingKeyIdeasId };
        this.apiService.get(EEndpoints.KeyIdeasByMarketingKeyIdeas, param).subscribe(function (response) {
            if (response.code == 100) {
                switch (section) {
                    case EMarketingKeyIdeasSections.conventionalMedia:
                        _this.conventionalList = response.result;
                        break;
                    case EMarketingKeyIdeasSections.socialMedia:
                        _this.socialMediaList = response.result;
                        _this._getKeyBudget(marketingKeyIdeasId, section);
                        break;
                    case EMarketingKeyIdeasSections.touring:
                        _this.touringList = response.result;
                        break;
                    case EMarketingKeyIdeasSections.digitalPlatform:
                        _this.digitalPlatformList = response.result;
                        _this._getKeyBudget(marketingKeyIdeasId, section);
                        break;
                }
                console.log('this.digitalPlatformList: ', _this.digitalPlatformList);
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    KeysIdeasManageComponent.prototype._deleteKeyName = function (id, section, marketingKeyIdeasId) {
        var _this = this;
        this.apiService.delete(EEndpoints.MarketingKeyIdeaName, { id: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this._getKeysIdeasName(section, marketingKeyIdeasId);
            }
            else
                _this.toaster.showTranslate('errors.errorDeletingItem');
        }, function (err) { return _this._responseError(err); });
    };
    KeysIdeasManageComponent.prototype._getKeyBudget = function (marketingKeyIdeasId, section) {
        var _this = this;
        this.apiService.get(EEndpoints.MarketingKeyIdeasBudgets, { marketingKeyIdeasId: marketingKeyIdeasId }).subscribe(function (response) {
            _this.keyBudgets = response.result;
            console.log('this.keyBudgets: ', _this.keyBudgets);
        }, function (err) { return _this._responseError(err); });
    };
    KeysIdeasManageComponent.prototype._deleteKeyBudget = function (marketingKeyIdeaId) {
        var _this = this;
        this.apiService.delete(EEndpoints.MarketingKeyIdeasBudget, { merketingKeyIdeaId: marketingKeyIdeaId }).subscribe(function (response) {
            if (response.code != 100)
                _this.toaster.showTranslate('errors.errorDeletingItem');
        }, function (err) { return _this._responseError(err); });
    };
    KeysIdeasManageComponent.prototype._getSocialNetworkTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.SocialNetworkTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.allSocialNetworksList = response.result;
                _this.isWorking = false;
                console.log('this.allSocialNetworksList ESR1: ', _this.allSocialNetworksList);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    KeysIdeasManageComponent.prototype.getNetworkName = function (networkId) {
        var name = '';
        this.allSocialNetworksList.forEach(function (element) {
            if (element.id === networkId) {
                name = element.name;
            }
        });
        return name;
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], KeysIdeasManageComponent.prototype, "marketingId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], KeysIdeasManageComponent.prototype, "perm", void 0);
    KeysIdeasManageComponent = __decorate([
        Component({
            selector: 'app-keys-ideas-manage',
            templateUrl: './keys-ideas-manage.component.html',
            styleUrls: ['./keys-ideas-manage.component.scss'],
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService])
    ], KeysIdeasManageComponent);
    return KeysIdeasManageComponent;
}());
export { KeysIdeasManageComponent };
//# sourceMappingURL=keys-ideas-manage.component.js.map