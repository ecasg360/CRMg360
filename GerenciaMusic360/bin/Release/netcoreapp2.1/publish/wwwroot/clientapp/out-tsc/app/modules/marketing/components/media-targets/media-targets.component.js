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
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
var MediaTargetsComponent = /** @class */ (function () {
    function MediaTargetsComponent(apiService, toaster, translationLoaderService, translate, fb, dialogRef, data) {
        var _a;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translationLoaderService = translationLoaderService;
        this.translate = translate;
        this.fb = fb;
        this.dialogRef = dialogRef;
        this.data = data;
        this.media = {};
        this.overview = {};
        this.isWorking = false;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    MediaTargetsComponent.prototype.ngOnInit = function () {
        this.overview = this.data;
        this.initForm();
    };
    MediaTargetsComponent.prototype.initForm = function () {
        this.formMedia = this.fb.group({
            name: [this.media.name, [Validators.required]],
            pictureUrl: [this.media.pictureUrl, []],
        });
    };
    Object.defineProperty(MediaTargetsComponent.prototype, "f", {
        get: function () { return this.formMedia.controls; },
        enumerable: false,
        configurable: true
    });
    MediaTargetsComponent.prototype.save = function () {
        this.media = this.formMedia.value;
        if (this.overview.id) {
            this._saveMediaTarget(this.media);
        }
        else {
            this._saveMarketingOverview(this.overview);
        }
    };
    MediaTargetsComponent.prototype.selectImage = function ($event) {
        this.croppedImage = $event;
        this.f.pictureUrl.patchValue(this.croppedImage);
    };
    MediaTargetsComponent.prototype.onNoClick = function (overview) {
        if (overview === void 0) { overview = undefined; }
        this.dialogRef.close(overview);
    };
    MediaTargetsComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        console.log(error);
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    MediaTargetsComponent.prototype._saveMarketingOverview = function (overview) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingOverview, overview).subscribe(function (response) {
            if (response.code == 100) {
                _this.overview = response.result;
                _this._saveMediaTarget(_this.media);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    MediaTargetsComponent.prototype._saveMarketingOverViewDetail = function (details) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingOverviewDetail, details).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(_this.overview);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    MediaTargetsComponent.prototype._saveMediaTarget = function (media) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.Media, media).subscribe(function (response) {
            if (response.code == 100) {
                _this.media = response.result;
                var detail = {
                    marketingOverviewId: _this.overview.id,
                    mediaId: _this.media.id,
                    position: _this.media.id,
                };
                _this._saveMarketingOverViewDetail(detail);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    MediaTargetsComponent = __decorate([
        Component({
            selector: 'app-media-targets',
            templateUrl: './media-targets.component.html',
            styleUrls: ['./media-targets.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            TranslateService,
            FormBuilder,
            MatDialogRef, Object])
    ], MediaTargetsComponent);
    return MediaTargetsComponent;
}());
export { MediaTargetsComponent };
//# sourceMappingURL=media-targets.component.js.map