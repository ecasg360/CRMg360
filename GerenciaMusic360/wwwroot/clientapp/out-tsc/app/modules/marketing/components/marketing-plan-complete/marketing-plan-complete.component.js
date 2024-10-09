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
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EEndpoints } from '@enums/endpoints';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
var MarketingPlanCompleteComponent = /** @class */ (function () {
    function MarketingPlanCompleteComponent(translate, dialogRef, translationLoaderService, data, apiService, toaster) {
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.translationLoaderService = translationLoaderService;
        this.data = data;
        this.apiService = apiService;
        this.toaster = toaster;
        this.model = {};
        this.isWorking = false;
    }
    MarketingPlanCompleteComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.model = this.data.model;
    };
    MarketingPlanCompleteComponent.prototype.onNoClick = function (task) {
        if (task === void 0) { task = undefined; }
        this.dialogRef.close(task);
    };
    MarketingPlanCompleteComponent.prototype.setTaskData = function () {
        var params = {
            id: this.model.id,
            notes: this.model.notes
        };
        this.apiMarkComplete(params);
    };
    MarketingPlanCompleteComponent.prototype.apiMarkComplete = function (params) {
        var _this = this;
        this.apiService.save(EEndpoints.MarketingPlanComplete, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(_this.model);
                _this.toaster.showTranslate('messages.statusChanged');
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.onNoClick(undefined);
            }
        }, function (err) { return _this.toaster.showTranslate('general.errors.requestError'); });
    };
    MarketingPlanCompleteComponent = __decorate([
        Component({
            selector: 'app-marketing-plan-complete',
            templateUrl: './marketing-plan-complete.component.html',
            styleUrls: ['./marketing-plan-complete.component.scss']
        }),
        __param(3, Optional()),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [TranslateService,
            MatDialogRef,
            FuseTranslationLoaderService, Object, ApiService,
            ToasterService])
    ], MarketingPlanCompleteComponent);
    return MarketingPlanCompleteComponent;
}());
export { MarketingPlanCompleteComponent };
//# sourceMappingURL=marketing-plan-complete.component.js.map