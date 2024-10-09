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
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ToasterService } from "@services/toaster.service";
import { Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
var AddContactComponent = /** @class */ (function () {
    function AddContactComponent(formBuilder, translate, _fuseTranslationLoaderService, actionData, dialogRef, service, toasterService) {
        this.formBuilder = formBuilder;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.actionData = actionData;
        this.dialogRef = dialogRef;
        this.service = service;
        this.toasterService = toasterService;
        this.contact = {};
        this.person = {};
        this.id = 0;
        this.isWorking = true;
        this.showSelectType = true;
        this.personTypes = [];
        this.personTypeFC = new FormControl();
        this.personTypeId = 0;
        this.question = '';
        this._unsubscribeAll = new Subject();
        this._getPersonTypes();
    }
    AddContactComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = this.actionData.id;
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
        this.projectId = this.actionData.projectId;
        if (this.actionData.showSelectType != undefined) {
            this.showSelectType = this.actionData.showSelectType;
        }
        this.contact = (this.actionData.model) ? this.actionData.model : {};
        this.person = this.contact;
        this.pictureUrl = this.contact.pictureUrl;
        if (this.id == 0) {
            this.personTypeId = this.actionData.personTypeId;
            this.action = this.translate.instant('general.save');
        }
        else {
            this.action = this.translate.instant('general.save');
            this.getProjectContact(this.id);
        }
        this.contact.personTypeId = this.personTypeId;
        this.initForm();
        if (this.personTypeId > 0) {
            this.f.typeId.setValue(this.personTypeId);
        }
    };
    AddContactComponent.prototype.ngOnDestroy = function () {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    AddContactComponent.prototype.initForm = function () {
        this.contactForm = this.formBuilder.group({
            typeId: [this.contact.personTypeId, [
                    Validators.required
                ]]
        });
        this.isWorking = false;
    };
    AddContactComponent.prototype.enter = function () {
        var value = this.personTypeFC.value;
        if (value.indexOf(this.question) < 0) {
            var found = this.personTypes.find(function (f) { return f.viewValue.toLowerCase() == value.toLowerCase(); });
            if (found) {
                this.f.typeId.patchValue(found.value);
            }
            else
                this._savePersonType(value);
        }
    };
    AddContactComponent.prototype.autocompleteOptionSelected = function ($event) {
        if ($event.option.id != '0') {
            var found = this.personTypes.find(function (f) { return f.value == $event.option.id; });
            if (found) {
                this.f.typeId.patchValue(found.value);
            }
        }
        else {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            this._savePersonType(newItem);
        }
    };
    AddContactComponent.prototype.bindExternalForm = function (name, form) {
        this.contactForm.setControl(name, form);
    };
    Object.defineProperty(AddContactComponent.prototype, "f", {
        get: function () { return this.contactForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddContactComponent.prototype.setContact = function () {
        if (!this.contactForm.invalid) {
            this.isWorking = true;
            var formValues = this.contactForm.value;
            this.contact = formValues.generalData;
            //this.contact.typeId = formValues.typeId;
            this.contact.id = this.id;
            this.contact.personTypeId = formValues.typeId;
            for (var key in formValues) {
                if (key != 'generalData') {
                    var value = formValues[key];
                    this.contact[key] = value;
                }
            }
            this.contact.projectId = this.projectId;
            this.contact.typeId = 1;
            if (this.contact.id > 0) {
                this.update();
            }
            else {
                this.save();
            }
        }
    };
    AddContactComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddContactComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        var result = this.personTypes.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (result.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + value.trim() + "\"?"
                }]
            : result;
    };
    AddContactComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log('http error', err);
    };
    //#region API
    AddContactComponent.prototype.getProjectContact = function (id) {
        var _this = this;
        this.isWorking = true;
        this.service.get(EEndpoints.ProjectContact, { id: id })
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (data) {
            if (data.code == 100) {
                _this.contact = data.result;
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddContactComponent.prototype._getPersonTypes = function () {
        var _this = this;
        this.isWorking = true;
        var params = { entityId: 9 };
        this.service.get(EEndpoints.PersonTypes, params)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.personTypes = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                _this.filteredOptions = _this.personTypeFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddContactComponent.prototype._savePersonType = function (name) {
        var _this = this;
        this.isWorking = true;
        var person = {
            name: name,
            description: name,
            entityId: 9
        };
        this.service.save(EEndpoints.PersonType, person)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.personTypes.push({
                    value: response.result.id,
                    viewValue: response.result.name
                });
                setTimeout(function () {
                    _this.f.typeId.patchValue(response.result.id);
                    _this.personTypeFC.patchValue(response.result.name);
                });
            }
            else
                _this.toasterService.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddContactComponent.prototype.update = function () {
        var _this = this;
        this.service.update(EEndpoints.ProjectContact, this.contact)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (data) {
            if (data.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('settings.contact.messages.saved'));
                _this.onNoClick(_this.contact);
            }
            else {
                _this.toasterService.showToaster(data.message);
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddContactComponent.prototype.save = function () {
        var _this = this;
        delete this.contact.id;
        this.service.save(EEndpoints.ProjectContact, this.contact)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (data) {
            if (data.code == 100) {
                _this.toasterService.showTranslate('messages.itemSaved');
                _this.contact.id = data.result;
                _this.onNoClick(_this.contact);
            }
            else {
                _this.toasterService.showToaster(data.message);
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddContactComponent = __decorate([
        Component({
            selector: 'app-add-contact',
            templateUrl: './add-contact.component.html',
            providers: [{
                    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
                }]
        }),
        __param(3, Optional()),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            TranslateService,
            FuseTranslationLoaderService, Object, MatDialogRef,
            ApiService,
            ToasterService])
    ], AddContactComponent);
    return AddContactComponent;
}());
export { AddContactComponent };
//# sourceMappingURL=add-contact.component.js.map