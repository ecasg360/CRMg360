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
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
var ProjectContactFormComponent = /** @class */ (function () {
    function ProjectContactFormComponent(formBuilder, translate, _fuseTranslationLoaderService, actionData, dialogRef, service) {
        this.formBuilder = formBuilder;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.actionData = actionData;
        this.dialogRef = dialogRef;
        this.service = service;
        this.project = {};
        this.contact = {};
        this.person = {};
        this.id = 0;
        this.isWorking = true;
        this.contactTypes = [];
    }
    ProjectContactFormComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = this.actionData.id;
        this.projectId = this.actionData.projectId;
        if (this.id == 0) {
            this.action = this.translate.instant('general.save');
        }
        else {
            this.action = this.translate.instant('general.save');
            this.contact = (this.actionData.model) ? this.actionData.model : {};
            this.person = this.contact;
            this.pictureUrl = this.contact.pictureUrl;
        }
        this.isWorking = false;
        this.initForm();
    };
    ProjectContactFormComponent.prototype.initForm = function () {
        this.contactForm = this.formBuilder.group({
            typeId: [this.contact.typeId, [
                    Validators.required
                ]]
        });
        this.getContactTypes();
    };
    ProjectContactFormComponent.prototype.bindExternalForm = function (name, form) {
        this.contactForm.setControl(name, form);
    };
    Object.defineProperty(ProjectContactFormComponent.prototype, "f", {
        get: function () { return this.contactForm.controls; },
        enumerable: false,
        configurable: true
    });
    ProjectContactFormComponent.prototype.setContact = function () {
        if (!this.contactForm.invalid) {
            this.isWorking = true;
            var formValues = this.contactForm.value;
            this.contact = formValues.generalData;
            this.contact.id = this.id;
            for (var key in formValues) {
                if (key != 'generalData') {
                    var value = formValues[key];
                    this.contact[key] = value;
                }
            }
            this.dialogRef.close(this.contact);
        }
    };
    ProjectContactFormComponent.prototype.getContactTypes = function () {
        var _this = this;
        var params = [];
        params['typeId'] = 5;
        this.service.get(EEndpoints.Types, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.contactTypes = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    ProjectContactFormComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    //Imagen methods
    ProjectContactFormComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log('http error', err);
    };
    ProjectContactFormComponent = __decorate([
        Component({
            selector: 'project-contact-form',
            templateUrl: './project-contact-form.component.html',
        }),
        __param(3, Optional()),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            TranslateService,
            FuseTranslationLoaderService, Object, MatDialogRef,
            ApiService])
    ], ProjectContactFormComponent);
    return ProjectContactFormComponent;
}());
export { ProjectContactFormComponent };
//# sourceMappingURL=project-contact-form.component.js.map