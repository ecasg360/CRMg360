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
import { Component, Optional, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { FormBuilder, Validators } from "@angular/forms";
var AddLocationComponent = /** @class */ (function () {
    function AddLocationComponent(dialogRef, formBuilder, service, dialog, toasterService, actionData, translate, _fuseTranslationLoaderService) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.service = service;
        this.dialog = dialog;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.id = 0;
        this.isWorking = true;
        this.addresses = [];
    }
    AddLocationComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = this.actionData.id;
        this.data = {};
        this.addressForm = this.formBuilder.group({});
        this.configureForm();
        if (this.id == 0) {
            this.isWorking = false;
            this.titleAction = this.translate.instant('general.save');
            this.action = this.translate.instant('general.save');
        }
        else {
            this.titleAction = this.translate.instant('general.save');
            this.action = this.translate.instant('general.save');
            this.getLocation();
        }
    };
    AddLocationComponent.prototype.getAddress = function () {
        var _this = this;
        var params = [];
        params['id'] = this.f.addressId.value;
        this.service.get(EEndpoints.AddressById, params).subscribe(function (response) {
            _this.data = {};
            if (response.code == 100) {
                _this.data = response.result;
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddLocationComponent.prototype.getLocation = function () {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = this.id;
        this.service.get(EEndpoints.Location, params).subscribe(function (data) {
            if (data.code == 100) {
                _this.croppedImage = data.result.pictureUrl;
                _this.populateForm(data.result);
                _this.getAddress();
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    Object.defineProperty(AddLocationComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddLocationComponent.prototype.configureForm = function () {
        this.form = this.formBuilder.group({
            capacity: ['', [
                    Validators.required
                ]],
            webSite: ['', [
                    Validators.maxLength(250)
                ]],
            pictureUrl: [''],
            addressId: ['']
        });
    };
    AddLocationComponent.prototype.populateForm = function (data) {
        var _this = this;
        Object.keys(this.form.controls).forEach(function (name) {
            if (_this.form.controls[name]) {
                _this.form.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
    };
    AddLocationComponent.prototype.bindExternalForm = function (name, form) {
        this.addressForm.setControl(name, form);
    };
    AddLocationComponent.prototype.set = function () {
        if (this.form.valid) {
            if (this.id == 0) {
                if (this.addressForm.valid) {
                    this.saveAddress();
                }
            }
            else {
                if (this.addressForm.valid) {
                    this.updateAddress();
                }
            }
        }
    };
    AddLocationComponent.prototype.save = function () {
        var _this = this;
        this.form.value.id = 0;
        this.service.save(EEndpoints.Location, this.form.value)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(data.result);
                _this.toasterService.showToaster(_this.translate.instant('messages.itemSaved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddLocationComponent.prototype.update = function () {
        var _this = this;
        this.form.value.id = this.id;
        this.service.update(EEndpoints.Location, this.form.value)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('messages.itemUpdated'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddLocationComponent.prototype.saveAddress = function () {
        var _this = this;
        this.addressForm.value.address.id = 0;
        this.service.save(EEndpoints.AddressLocation, this.addressForm.value.address)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.f.addressId.setValue(data.result);
                _this.save();
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddLocationComponent.prototype.updateAddress = function () {
        var _this = this;
        this.service.update(EEndpoints.Address, this.addressForm.value.address)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.update();
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddLocationComponent.prototype.selectImage = function (image) {
        this.f.pictureUrl.setValue(image);
    };
    AddLocationComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddLocationComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddLocationComponent = __decorate([
        Component({
            selector: 'app-add-location',
            templateUrl: './add-location.component.html'
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            MatDialog,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddLocationComponent);
    return AddLocationComponent;
}());
export { AddLocationComponent };
//# sourceMappingURL=add-location.component.js.map