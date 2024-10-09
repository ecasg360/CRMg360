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
var MarketingSocialMediaComponent = /** @class */ (function () {
    function MarketingSocialMediaComponent(apiService, toaster, translationLoaderService, fb, dialogRef, data) {
        var _a;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translationLoaderService = translationLoaderService;
        this.fb = fb;
        this.dialogRef = dialogRef;
        this.data = data;
        this.socialNetworksList = [];
        this.isWorking = false;
        this.activeSocial = -1;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this._getSocialNetworkTypes();
    }
    MarketingSocialMediaComponent.prototype.ngOnInit = function () {
        this.marketingOverviews = this.data;
        this.initForm();
    };
    MarketingSocialMediaComponent.prototype.initForm = function () {
        this.formSocialMedia = this.fb.group({
            social: [null, [Validators.required]]
        });
    };
    Object.defineProperty(MarketingSocialMediaComponent.prototype, "f", {
        get: function () { return this.formSocialMedia.controls; },
        enumerable: false,
        configurable: true
    });
    MarketingSocialMediaComponent.prototype.addSocialNetwork = function (item) {
        this.activeSocial = item.id;
        this.f.social.patchValue(item.id);
    };
    MarketingSocialMediaComponent.prototype._formatDetail = function (overviewId) {
        var _this = this;
        var pictureUrl = null;
        this.socialNetworksList.forEach(function (social) {
            if (social.id === parseInt(_this.f.social.value)) {
                pictureUrl = social.pictureUrl;
            }
        });
        var detail = {
            marketingOverviewId: overviewId,
            socialNetworkTypeId: this.f.social.value,
            position: (new Date()).getMilliseconds(),
            pictureUrl: pictureUrl ? pictureUrl : null,
        };
        return detail;
    };
    MarketingSocialMediaComponent.prototype.save = function () {
        if (this.marketingOverviews.id) {
            var detail = this._formatDetail(this.marketingOverviews.id);
            this._saveMarketingOverViewDetail(detail);
        }
        else {
            delete this.marketingOverviews['id'];
            this._saveMarketingOverView(this.marketingOverviews);
        }
    };
    MarketingSocialMediaComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    MarketingSocialMediaComponent.prototype.onNoClick = function (overview) {
        if (overview === void 0) { overview = undefined; }
        this.dialogRef.close(overview);
    };
    //#region API
    MarketingSocialMediaComponent.prototype._getSocialNetworkTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.SocialNetworkTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.socialNetworksList = response.result; //.filter(f => f.statusRecordId == 1);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
            }
            _this.isWorking = false;
        }, this._responseError);
    };
    MarketingSocialMediaComponent.prototype._saveMarketingOverView = function (overview) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingOverview, overview).subscribe(function (response) {
            if (response.code == 100) {
                _this.marketingOverviews = response.result;
                var detail = _this._formatDetail(response.result.id);
                _this._saveMarketingOverViewDetail(detail);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, this._responseError);
    };
    MarketingSocialMediaComponent.prototype._saveMarketingOverViewDetail = function (detail) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingOverviewDetail, detail).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(_this.marketingOverviews);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, this._responseError);
    };
    MarketingSocialMediaComponent = __decorate([
        Component({
            selector: 'app-marketing-social-media',
            templateUrl: './marketing-social-media.component.html',
            styleUrls: ['./marketing-social-media.component.scss']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            FormBuilder,
            MatDialogRef, Object])
    ], MarketingSocialMediaComponent);
    return MarketingSocialMediaComponent;
}());
export { MarketingSocialMediaComponent };
//# sourceMappingURL=marketing-social-media.component.js.map