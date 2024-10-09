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
import { AssetsModalComponent } from './assets-modal/assets-modal.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ActivatedRoute } from '@angular/router';
var AssetsComponent = /** @class */ (function () {
    function AssetsComponent(apiService, toaster, dialog, translate, translationLoader, activatedRoute) {
        var _a;
        var _this = this;
        this.apiService = apiService;
        this.toaster = toaster;
        this.dialog = dialog;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.activatedRoute = activatedRoute;
        this.marketingId = 0;
        this.perm = {};
        this.assetsList = [];
        this.isWorking = true;
        this.activatedRoute.data.subscribe(function (data) {
            _this.permisions = data;
        });
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
    }
    AssetsComponent.prototype.ngOnInit = function () {
        console.log('this.permisions: ', this.permisions);
        this._getAssets();
    };
    AssetsComponent.prototype.modalAsset = function (asset) {
        var _this = this;
        if (asset === void 0) { asset = {}; }
        if (!asset.id) {
            asset.position = this.assetsList.length + 1;
            asset.marketingId = this.marketingId;
        }
        var dialogRef = this.dialog.open(AssetsModalComponent, {
            width: '500px',
            data: asset
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                if (asset.id) {
                    var index = _this.assetsList.findIndex(function (f) { return f.id == asset.id; });
                    if (index >= 0)
                        _this.assetsList.splice(index, 1, result);
                }
                else
                    _this.assetsList.push(result);
            }
        });
    };
    AssetsComponent.prototype.deleteAsset = function (asset) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: asset.description }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this._deleteAsset(asset.id);
            }
        });
    };
    AssetsComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    AssetsComponent.prototype._getAssets = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MarketingAssets, { marketingId: this.marketingId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.assetsList = response.result;
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AssetsComponent.prototype._deleteAsset = function (id) {
        var _this = this;
        this.apiService.delete(EEndpoints.MarketingAsset, { id: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.assetsList = _this.assetsList.filter(function (f) { return f.id != id; });
            }
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AssetsComponent.prototype, "marketingId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AssetsComponent.prototype, "perm", void 0);
    AssetsComponent = __decorate([
        Component({
            selector: 'app-assets',
            templateUrl: './assets.component.html',
            styleUrls: ['./assets.component.scss'],
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService,
            ActivatedRoute])
    ], AssetsComponent);
    return AssetsComponent;
}());
export { AssetsComponent };
//# sourceMappingURL=assets.component.js.map