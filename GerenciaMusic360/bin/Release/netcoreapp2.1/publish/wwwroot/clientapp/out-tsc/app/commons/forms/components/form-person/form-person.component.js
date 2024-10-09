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
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { isNullOrUndefined } from 'util';
import { EEndpoints } from '@enums/endpoints';
var FormPersonComponent = /** @class */ (function () {
    function FormPersonComponent(_fuseTranslationLoaderService, fb, service) {
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.fb = fb;
        this.service = service;
        this.manageImage = true;
        this.formReady = new EventEmitter();
        this.outIsInternal = new EventEmitter();
        this.isInternal = false;
        this.isContact = false;
        this.isComposer = false;
        this.isContractMember = false;
    }
    FormPersonComponent.prototype.ngOnInit = function () {
        // this.isComposer = this.actionData.isComposer;
        // this.isContractMember = this.actionData.isContractMember;
        var _a;
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
    FormPersonComponent.prototype.ngOnChanges = function (changes) {
    };
    FormPersonComponent.prototype.initializeValidations = function () {
        var birthDateString = (this.person.birthDateString)
            ? (new Date(this.person.birthDateString)).toISOString()
            : null;
        this.person.isInternal = (this.person.isInternal) ? true : false;
        var res = this.projectId;
        if (!isNullOrUndefined(this.projectId)) {
            if (!this.person.name) {
                this.personForm = this.fb.group({
                    name: ['', [Validators.required]],
                    lastName: ['', [this.isContact ? [] : [Validators.required]]],
                    secondLastName: [''],
                    birthDateString: [birthDateString],
                    gender: ['', this.isContact ? [] : [Validators.required]],
                    email: [''],
                    officePhone: [''],
                    cellPhone: [''],
                    pictureUrl: [''],
                    isInternal: [false],
                });
                return;
            }
            this.personForm = this.fb.group({
                name: [this.person.name, [
                        Validators.required
                    ]],
                lastName: [this.person.lastName, [
                        this.isContact ? [] : []
                    ]],
                secondLastName: [this.person.secondLastName, []],
                birthDateString: [birthDateString, []],
                gender: [this.person.gender, this.isContact ? [] : [Validators.required]],
                email: [this.person.email, []],
                officePhone: [this.person.officePhone],
                cellPhone: [this.person.cellPhone, []],
                pictureUrl: [this.person.pictureUrl, []],
                isInternal: [false, []],
            });
            return;
        }
        this.personForm = this.fb.group({
            name: [this.person.name, [
                    Validators.required
                ]],
            lastName: [this.person.lastName, [
                    Validators.required
                ]],
            secondLastName: [this.person.secondLastName, []],
            birthDateString: [birthDateString, []],
            gender: [this.person.gender, this.isContact ? [] : [Validators.required]],
            email: [this.person.email, []],
            officePhone: [this.person.officePhone, []],
            cellPhone: [this.person.cellPhone, []],
            pictureUrl: [this.person.pictureUrl, []],
            isInternal: [this.person.isInternal, []],
        });
        this.isInternal = this.person.isInternal;
    };
    Object.defineProperty(FormPersonComponent.prototype, "f", {
        get: function () { return this.personForm.controls; },
        enumerable: false,
        configurable: true
    });
    FormPersonComponent.prototype.selectImage = function ($evt) {
        this.personForm.controls['pictureUrl'].patchValue($evt);
    };
    FormPersonComponent.prototype.ngOnDestroy = function () {
        this.formReady.complete();
    };
    FormPersonComponent.prototype.sample = function () {
        this.isInternal = !this.isInternal;
        this.outIsInternal.emit(this.isInternal);
    };
    FormPersonComponent.prototype.setComposer = function () {
        if (this.personForm.valid) {
            this.saveComposer();
        }
    };
    FormPersonComponent.prototype.saveComposer = function () {
        var _this = this;
        this.service.save(EEndpoints.Composer, this.personForm.value)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(_this.personForm.value);
            }
        }, function (err) { return _this.responseError(err); });
    };
    FormPersonComponent.prototype.setContractMember = function () {
        if (this.personForm.valid) {
            this.saveContractMember();
        }
    };
    FormPersonComponent.prototype.saveContractMember = function () {
        var _this = this;
        this.service.save(EEndpoints.ContractMemberPerson, this.personForm.value)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(data.result);
            }
        }, function (err) { return _this.responseError(err); });
    };
    FormPersonComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        // this.dialogRef.close(status);
    };
    FormPersonComponent.prototype.responseError = function (err) {
        console.log('http error', err);
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FormPersonComponent.prototype, "projectId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], FormPersonComponent.prototype, "manageImage", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], FormPersonComponent.prototype, "person", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FormPersonComponent.prototype, "title", void 0);
    __decorate([
        Input('image'),
        __metadata("design:type", Object)
    ], FormPersonComponent.prototype, "pictureURL", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], FormPersonComponent.prototype, "formReady", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], FormPersonComponent.prototype, "outIsInternal", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], FormPersonComponent.prototype, "isInternal", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], FormPersonComponent.prototype, "isContact", void 0);
    FormPersonComponent = __decorate([
        Component({
            selector: 'app-form-person',
            templateUrl: './form-person.component.html',
            styleUrls: ['./form-person.component.scss']
        }),
        __metadata("design:paramtypes", [FuseTranslationLoaderService,
            FormBuilder,
            ApiService])
    ], FormPersonComponent);
    return FormPersonComponent;
}());
export { FormPersonComponent };
//# sourceMappingURL=form-person.component.js.map