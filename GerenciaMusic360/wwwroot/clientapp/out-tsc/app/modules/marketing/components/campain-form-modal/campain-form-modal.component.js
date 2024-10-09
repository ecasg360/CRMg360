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
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
var CampainFormModalComponent = /** @class */ (function () {
    function CampainFormModalComponent(fb, apiService, toaster, translate, dialogRef, data, translationLoaderService) {
        this.fb = fb;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.data = data;
        this.translationLoaderService = translationLoaderService;
        this.isWorking = false;
    }
    CampainFormModalComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.addMarketingForm = this.fb.group({});
    };
    Object.defineProperty(CampainFormModalComponent.prototype, "f", {
        //#region form
        get: function () { return this.addMarketingForm.controls; },
        enumerable: false,
        configurable: true
    });
    CampainFormModalComponent.prototype.bindExternalForm = function (controlName, form) {
        this.addMarketingForm.setControl(controlName, form);
    };
    //#endregion
    CampainFormModalComponent.prototype.saveMarketing = function () {
        var marketing = this.f['marketing'].value;
        delete marketing.id;
        delete marketing.created;
        this.saveMarketingApi(marketing);
    };
    CampainFormModalComponent.prototype.onNoClick = function (project) {
        if (project === void 0) { project = undefined; }
        this.dialogRef.close(project);
    };
    CampainFormModalComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    CampainFormModalComponent.prototype.saveMarketingApi = function (marketing) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.Marketing, marketing).subscribe(function (response) {
            if (response.code == 100)
                _this.onNoClick(response.result);
            else
                _this.toaster.showToaster(response.message);
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    CampainFormModalComponent = __decorate([
        Component({
            selector: 'app-campain-form-modal',
            templateUrl: './campain-form-modal.component.html',
            styleUrls: ['./campain-form-modal.component.scss']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            ApiService,
            ToasterService,
            TranslateService,
            MatDialogRef, Object, FuseTranslationLoaderService])
    ], CampainFormModalComponent);
    return CampainFormModalComponent;
}());
export { CampainFormModalComponent };
//# sourceMappingURL=campain-form-modal.component.js.map