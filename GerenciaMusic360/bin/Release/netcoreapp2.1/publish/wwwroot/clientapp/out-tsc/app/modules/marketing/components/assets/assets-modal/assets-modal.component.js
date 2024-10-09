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
import { Component, ChangeDetectionStrategy, Optional, Inject } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
var AssetsModalComponent = /** @class */ (function () {
    function AssetsModalComponent(apiService, toaster, translationLoaderService, fb, translate, dialogRef, data) {
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
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    AssetsModalComponent.prototype.ngOnInit = function () {
        this.model = this.data;
        this.initForm();
    };
    AssetsModalComponent.prototype.initForm = function () {
        var reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.formAssets = this.fb.group({
            id: [this.model.id, []],
            description: [this.model.description, [Validators.required]],
            //url: [this.model.url, [Validators.required, Validators.pattern(reg)]],
            url: [this.model.url, [Validators.required]],
            position: [this.model.position, [Validators.required]],
            marketingId: [this.model.marketingId, [Validators.required]],
        });
    };
    Object.defineProperty(AssetsModalComponent.prototype, "f", {
        get: function () { return this.formAssets.controls; },
        enumerable: false,
        configurable: true
    });
    AssetsModalComponent.prototype.onNoClick = function (overview) {
        if (overview === void 0) { overview = undefined; }
        this.dialogRef.close(overview);
    };
    AssetsModalComponent.prototype.save = function () {
        this.model = this.formAssets.value;
        if (this.model.url.indexOf('http') < 0) {
            this.model.url = "https://" + this.model.url;
        }
        if (this.model.id) {
            this._editAsset(this.model);
        }
        else {
            delete this.model['id'];
            this._createAsset(this.model);
        }
    };
    AssetsModalComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    AssetsModalComponent.prototype._createAsset = function (asset) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingAsset, asset).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(response.result);
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AssetsModalComponent.prototype._editAsset = function (asset) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.MarketingAsset, asset).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(asset);
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AssetsModalComponent = __decorate([
        Component({
            selector: 'app-assets-modal',
            templateUrl: './assets-modal.component.html',
            styleUrls: ['./assets-modal.component.scss'],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            FormBuilder,
            TranslateService,
            MatDialogRef, Object])
    ], AssetsModalComponent);
    return AssetsModalComponent;
}());
export { AssetsModalComponent };
//# sourceMappingURL=assets-modal.component.js.map