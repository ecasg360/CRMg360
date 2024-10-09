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
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var PersonDocumentFormComponent = /** @class */ (function () {
    function PersonDocumentFormComponent(translate, _fuseTranslationLoaderService, fb, actionData, dialogRef, apiService) {
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.fb = fb;
        this.actionData = actionData;
        this.dialogRef = dialogRef;
        this.apiService = apiService;
        this.documentTypes = [];
        this.countries = [];
        this.id = 0;
        this.croppedImage = "";
        this.isWorking = true;
    }
    PersonDocumentFormComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = this.actionData.id;
        if (this.id == 0) {
            this.data = {};
            this.titleAction = this.translate.instant('general.save');
            this.action = this.translate.instant('general.save');
        }
        else {
            this.titleAction = this.translate.instant('general.save');
            this.action = this.translate.instant('general.save');
            this.data = (this.actionData.model) ? this.actionData.model : {};
        }
        this.isWorking = false;
        if (this.actionData.documentTypes) {
            this.documentTypes = this.actionData.documentTypes;
        }
        else {
            this.getDocumentsTypesApi();
        }
        if (this.actionData.countries) {
            this.countries = this.actionData.countries;
        }
        else {
            this.getCountriesApi();
        }
        this.initializeValidations();
    };
    Object.defineProperty(PersonDocumentFormComponent.prototype, "f", {
        get: function () { return this.personDocumentForm.controls; },
        enumerable: false,
        configurable: true
    });
    /**
     * Establece las validaciones del formulario asociado a los datos basicos del proyecto
     *
     * @memberof ProjectDataComponent
     */
    PersonDocumentFormComponent.prototype.initializeValidations = function () {
        var expiredDate = (this.data.expiredDate) ? (new Date(this.data.expiredDate)).toISOString() : '';
        var emisionDate = (this.data.emisionDate) ? (new Date(this.data.emisionDate)).toISOString() : '';
        this.personDocumentForm = this.fb.group({
            countryId: [this.data.countryId, [Validators.required]],
            personDocumentTypeId: [this.data.personDocumentTypeId, [Validators.required]],
            expiredDateString: [expiredDate, [Validators.required]],
            emisionDateString: [emisionDate, [Validators.required]],
            number: [this.data.number, [Validators.required]],
            legalName: [this.data.legalName, [Validators.required]]
        });
    };
    PersonDocumentFormComponent.prototype.getCountriesApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Countries).subscribe(function (data) {
            if (data.code == 100) {
                _this.countries = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return console.error('Countries Failed! ', err); });
    };
    PersonDocumentFormComponent.prototype.getDocumentsTypesApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.PersonDocumentTypes).subscribe(function (data) {
            if (data.code == 100) {
                _this.documentTypes = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return console.error('document type Failed! ', err); });
    };
    PersonDocumentFormComponent.prototype.setDocument = function () {
        var _this = this;
        if (!this.personDocumentForm.invalid) {
            this.isWorking = true;
            this.data = this.personDocumentForm.value;
            this.data.id = this.id;
            this.data.expiredDate = this.data.expiredDateString;
            this.data.emisionDate = this.data.emisionDateString;
            this.data.legalName = this.data.legalName;
            var country = this.countries.find(function (f) { return f.value == _this.data.countryId; });
            var documentType = this.documentTypes.find(function (f) { return f.value == _this.data.personDocumentTypeId; });
            if (country)
                this.data.country = country.viewValue;
            if (documentType)
                this.data.documentType = documentType.viewValue;
            this.dialogRef.close(this.data);
        }
    };
    PersonDocumentFormComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = false; }
        this.dialogRef.close(undefined);
    };
    PersonDocumentFormComponent = __decorate([
        Component({
            selector: 'app-person-document-form',
            templateUrl: './person-document-form.component.html',
            styleUrls: ['./person-document-form.component.scss']
        }),
        __param(3, Optional()),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [TranslateService,
            FuseTranslationLoaderService,
            FormBuilder, Object, MatDialogRef,
            ApiService])
    ], PersonDocumentFormComponent);
    return PersonDocumentFormComponent;
}());
export { PersonDocumentFormComponent };
//# sourceMappingURL=person-document-form.component.js.map