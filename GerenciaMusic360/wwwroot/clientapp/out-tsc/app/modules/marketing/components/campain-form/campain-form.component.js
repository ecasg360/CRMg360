var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ToasterService } from '@services/toaster.service';
var CampainFormComponent = /** @class */ (function () {
    function CampainFormComponent(translationLoader, formBuilder, apiService, toaster) {
        this.translationLoader = translationLoader;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toaster = toaster;
        this.marketing = {};
        this.formReady = new EventEmitter();
        this.disableDate = true;
        this.initDate = new Date(2000, 0, 1);
        this.endDate = new Date(2220, 0, 1);
        this.projects = [];
        this.langList = [];
    }
    CampainFormComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        this._getProjects();
        this._getLangs();
        this.configureForm();
    };
    CampainFormComponent.prototype.ngOnDestroy = function () {
        this.formReady.complete();
    };
    CampainFormComponent.prototype.ngOnChanges = function (changes) {
        var marketing = changes.marketing;
        if (marketing) {
            this.configureForm();
        }
    };
    Object.defineProperty(CampainFormComponent.prototype, "f", {
        //#region form
        get: function () { return this.marketingForm.controls; },
        enumerable: false,
        configurable: true
    });
    CampainFormComponent.prototype.configureForm = function () {
        var initDate = (this.marketing.startDateString)
            ? (new Date(this.marketing.startDateString)).toISOString() : null;
        var endDateString = (this.marketing.endDateString)
            ? (new Date(this.marketing.endDateString)).toISOString() : null;
        this.marketingForm = this.formBuilder.group({
            id: [this.marketing.id, []],
            name: [this.marketing.name, [
                    Validators.required,
                    Validators.maxLength(450),
                    Validators.minLength(3),
                ]],
            generalInformation: [this.marketing.generalInformation, [
                    Validators.required,
                    Validators.maxLength(450),
                    Validators.minLength(3),
                ]],
            descriptionKeyIdeas: [this.marketing.descriptionKeyIdeas, [
                    Validators.required,
                    Validators.maxLength(450),
                    Validators.minLength(3),
                ]],
            descriptionHeaderPlan: [this.marketing.descriptionHeaderPlan, [
                    Validators.required,
                    Validators.maxLength(450),
                    Validators.minLength(3),
                ]],
            descriptionHeaderOverviewMaterial: [this.marketing.descriptionHeaderOverviewMaterial, [
                    Validators.required,
                    Validators.maxLength(450),
                    Validators.minLength(3),
                ]],
            startDateString: [initDate, [Validators.required,]],
            endDateString: [endDateString /*, [Validators.required,]*/],
            projectId: [this.marketing.projectId /*, [Validators.required,]*/],
            created: [this.marketing.created],
            fileId: [this.marketing.fileId, [Validators.required,]],
        });
        if (initDate)
            this.initDate = new Date(initDate);
        if (endDateString)
            this.endDate = new Date(endDateString);
        this.formReady.emit(this.marketingForm);
    };
    //#endregion
    CampainFormComponent.prototype.dateChangeEvent = function (type, event) {
        if (type == 'init') {
            if (event.value) {
                this.initDate = new Date(event.value);
                this.f['endDateString'].enable();
            }
            else {
                this.f['endDateString'].disable();
            }
        }
        else {
            if (event.value) {
                this.endDate = new Date(event.value);
            }
        }
    };
    CampainFormComponent.prototype._responseError = function (error) {
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region api
    CampainFormComponent.prototype._getProjects = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Projects).subscribe(function (response) {
            if (response.code == 100)
                _this.projects = response.result;
            else
                _this.toaster.showTranslate('general.errors.requestError');
        }, function (err) { return _this._responseError(err); });
    };
    CampainFormComponent.prototype._getLangs = function () {
        var _this = this;
        this.apiService.get(EEndpoints.ConfigMarketingTemplates).subscribe(function (response) {
            if (response.code == 100)
                _this.langList = response.result.map(function (m) {
                    if (!_this.marketing.fileId && m.isDefault)
                        _this.f.fileId.patchValue(m.templateFileId);
                    return m;
                });
            else
                _this.toaster.showTranslate('general.errors.requestError');
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], CampainFormComponent.prototype, "marketing", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CampainFormComponent.prototype, "formReady", void 0);
    CampainFormComponent = __decorate([
        Component({
            selector: 'app-campain-form',
            templateUrl: './campain-form.component.html',
            styleUrls: ['./campain-form.component.scss']
        }),
        __metadata("design:paramtypes", [FuseTranslationLoaderService,
            FormBuilder,
            ApiService,
            ToasterService])
    ], CampainFormComponent);
    return CampainFormComponent;
}());
export { CampainFormComponent };
//# sourceMappingURL=campain-form.component.js.map