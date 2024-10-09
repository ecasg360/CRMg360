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
import { Component, Input, Inject, Output, EventEmitter, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var PersonFormComponent = /** @class */ (function () {
    function PersonFormComponent(_fuseTranslationLoaderService, fb, service, actionData, dialogRef) {
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.fb = fb;
        this.service = service;
        this.actionData = actionData;
        this.dialogRef = dialogRef;
        this.manageImage = true;
        this.formReady = new EventEmitter();
        this.outIsInternal = new EventEmitter();
        this.isInternal = false;
        this.isContact = false;
        this.isComposer = false;
        this.isContractMember = false;
    }
    PersonFormComponent.prototype.ngOnInit = function () {
        var _a;
        this.isComposer = this.actionData.isComposer;
        this.isContractMember = this.actionData.isContractMember;
        if (!this.person) {
            this.person = {};
        }
        //this.person.isIntern = true;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.genders = [
            { value: 'F', viewValue: 'general.female' },
            { value: 'M', viewValue: 'general.male' }
        ];
        this.initializeValidations();
        this.formReady.emit(this.personForm);
    };
    PersonFormComponent.prototype.ngOnChanges = function (changes) {
    };
    PersonFormComponent.prototype.initializeValidations = function () {
        var birthDateString = (this.person.birthDateString)
            ? (new Date(this.person.birthDateString)).toISOString()
            : null;
        this.person.isInternal = (this.person.isInternal) ? true : false;
        this.personForm = this.fb.group({
            name: [this.person.name, [Validators.required]],
            lastName: [this.person.lastName, this.isContact ? [] : [Validators.required]],
            secondLastName: [this.person.secondLastName, []],
            birthDateString: [birthDateString, []],
            gender: [this.person.gender, this.isContact ? [] : [Validators.required]],
            email: [this.person.email, []],
            officePhone: [this.person.officePhone],
            cellPhone: [this.person.cellPhone, []],
            pictureUrl: [this.person.pictureUrl, []],
            isInternal: [false, []],
        });
        this.isInternal = this.person.isInternal;
    };
    Object.defineProperty(PersonFormComponent.prototype, "f", {
        get: function () { return this.personForm.controls; },
        enumerable: false,
        configurable: true
    });
    PersonFormComponent.prototype.selectImage = function ($evt) {
        this.personForm.controls['pictureUrl'].patchValue($evt);
    };
    PersonFormComponent.prototype.ngOnDestroy = function () {
        this.formReady.complete();
    };
    PersonFormComponent.prototype.sample = function () {
        this.isInternal = !this.isInternal;
        this.outIsInternal.emit(this.isInternal);
    };
    PersonFormComponent.prototype.setComposer = function () {
        if (this.personForm.valid) {
            this.saveComposer();
        }
    };
    PersonFormComponent.prototype.saveComposer = function () {
        var _this = this;
        this.service.save(EEndpoints.Composer, this.personForm.value)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(_this.personForm.value);
            }
        }, function (err) { return _this.responseError(err); });
    };
    PersonFormComponent.prototype.setContractMember = function () {
        if (this.personForm.valid) {
            this.saveContractMember();
        }
    };
    PersonFormComponent.prototype.saveContractMember = function () {
        var _this = this;
        this.service.save(EEndpoints.ContractMemberPerson, this.personForm.value)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(data.result);
            }
        }, function (err) { return _this.responseError(err); });
    };
    PersonFormComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    PersonFormComponent.prototype.responseError = function (err) {
        console.log('http error', err);
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], PersonFormComponent.prototype, "projectId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], PersonFormComponent.prototype, "manageImage", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], PersonFormComponent.prototype, "person", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], PersonFormComponent.prototype, "title", void 0);
    __decorate([
        Input('image'),
        __metadata("design:type", Object)
    ], PersonFormComponent.prototype, "pictureURL", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], PersonFormComponent.prototype, "formReady", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], PersonFormComponent.prototype, "outIsInternal", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], PersonFormComponent.prototype, "isInternal", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], PersonFormComponent.prototype, "isContact", void 0);
    PersonFormComponent = __decorate([
        Component({
            selector: 'app-person-form',
            templateUrl: './person-form.component.html',
            styleUrls: ['./person-form.component.scss']
        }),
        __param(3, Optional()),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FuseTranslationLoaderService,
            FormBuilder,
            ApiService, Object, MatDialogRef])
    ], PersonFormComponent);
    return PersonFormComponent;
}());
export { PersonFormComponent };
//# sourceMappingURL=person-form.component.js.map