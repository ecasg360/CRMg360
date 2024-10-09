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
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { allLang } from '@i18n/allLang';
var WorkFormComponent = /** @class */ (function () {
    function WorkFormComponent(translate, _fuseTranslationLoaderService, fb, actionData, dialogRef) {
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.fb = fb;
        this.actionData = actionData;
        this.dialogRef = dialogRef;
        this.isWorking = true;
        this.isWorkRegistered = false;
        this.isWorkCertified = false;
        this.certificationAuthority = [];
    }
    WorkFormComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.work = this.actionData.model;
        this.action = (this.work.id == 0)
            ? this.translate.instant('general.save')
            : this.action = this.translate.instant('general.save');
        this.isWorkRegistered = (this.work.registeredWork)
            ? this.work.registeredWork
            : false;
        this.isWorkCertified = (this.work.certifiedWork)
            ? this.work.certifiedWork
            : false;
        this.pictureUrl = this.work.pictureUrl;
        this.initializeForm();
        this.isWorking = false;
    };
    Object.defineProperty(WorkFormComponent.prototype, "f", {
        get: function () { return this.workForm.controls; },
        enumerable: false,
        configurable: true
    });
    WorkFormComponent.prototype.initializeForm = function () {
        var createdDateString = (this.work.createdDateString)
            ? (new Date(this.work.createdDateString)).toISOString()
            : this.work.createdDateString;
        var registerDateString = (this.work.registerDateString)
            ? (new Date(this.work.registerDateString)).toISOString()
            : this.work.registerDateString;
        this.workForm = this.fb.group({
            name: [this.work.name, [Validators.required]],
            description: [this.work.description, []],
            createdDateString: [createdDateString, [Validators.required]],
            registerDateString: [registerDateString, []],
            registeredWork: [this.isWorkRegistered, []],
            registerNum: [this.work.registerNum, []],
            certifiedWork: [this.isWorkCertified, []],
            certificationAuthorityId: [this.work.certificationAuthorityId, []],
            licenseNum: [this.work.licenseNum, [Validators.required]],
            pictureUrl: [this.work.pictureUrl, []],
        });
    };
    WorkFormComponent.prototype.setWork = function () {
        if (!this.workForm.invalid) {
            this.isWorking = true;
            this.work = this.workForm.value;
            this.work.pictureUrl = (this.pictureUrl.indexOf('assets') >= 0)
                ? null : this.work.pictureUrl;
            this.onNoClick(this.work);
        }
    };
    WorkFormComponent.prototype.selectImage = function ($evt) {
        this.pictureUrl = $evt;
        this.work.pictureUrl = $evt;
        this.workForm.controls['pictureUrl'].patchValue($evt);
    };
    WorkFormComponent.prototype.checkRegisteredWork = function ($event) {
        this.isWorkRegistered = $event.checked;
        if (!this.isWorkRegistered) {
            this.workForm.controls['registerDateString'].patchValue(null);
            this.workForm.controls['registerNum'].patchValue(null);
        }
    };
    WorkFormComponent.prototype.checkCertifiedWork = function ($event) {
        this.isWorkCertified = $event.checked;
        if (!this.isWorkCertified) {
            this.workForm.controls['certificationAuthorityId'].patchValue(null);
        }
    };
    WorkFormComponent.prototype.onNoClick = function (data) {
        if (data === void 0) { data = undefined; }
        this.dialogRef.close(data);
    };
    WorkFormComponent = __decorate([
        Component({
            selector: 'app-work-form',
            templateUrl: './work-form.component.html',
            styleUrls: ['./work-form.component.scss']
        }),
        __param(3, Optional()),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [TranslateService,
            FuseTranslationLoaderService,
            FormBuilder, Object, MatDialogRef])
    ], WorkFormComponent);
    return WorkFormComponent;
}());
export { WorkFormComponent };
//# sourceMappingURL=work-form.component.js.map