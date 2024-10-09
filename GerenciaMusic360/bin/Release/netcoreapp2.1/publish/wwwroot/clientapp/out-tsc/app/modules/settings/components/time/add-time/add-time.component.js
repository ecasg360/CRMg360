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
import { ApiService } from "@services/api.service";
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { EEndpoints } from "@enums/endpoints";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
var AddTimeComponent = /** @class */ (function () {
    function AddTimeComponent(dialogRef, formBuilder, ApiService, toasterService, actionData, translate, _fuseTranslationLoaderService) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.id = 0;
        this.timeTypes = [];
        this.modules = [];
        this.isWorking = true;
        this.isRange = false;
    }
    AddTimeComponent.prototype.ngOnInit = function () {
        this.titleAction = this.translate.instant('settings.time.title');
        this.id = this.actionData.id;
        this.configureForm();
        this.getTimeTypes();
        this.getModules();
        if (this.id == 0) {
            this.isWorking = false;
            this.titleAction = this.translate.instant('settings.time.saveTitle');
            this.action = this.translate.instant('general.save');
        }
        else {
            this.titleAction = this.translate.instant('settings.time.editTitle');
            this.action = this.translate.instant('general.save');
            this.getTime();
        }
    };
    AddTimeComponent.prototype.configureForm = function () {
        this.form = this.formBuilder.group({
            name: ['', [
                    Validators.required,
                    Validators.maxLength(30),
                ]],
            timeTypeId: ['', [Validators.required]],
            withRange: [false, []],
            initialValue: ['', [Validators.required]],
            finalValue: ['', []],
            moduleId: ['', [Validators.required]],
        });
    };
    AddTimeComponent.prototype.getTimeTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.Types, { typeId: 10 }).subscribe(function (response) {
            if (response.code == 100) {
                _this.timeTypes = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTimeComponent.prototype.getTime = function () {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = this.id;
        this.ApiService.get(EEndpoints.Time, { id: this.id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.populateForm(data.result);
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTimeComponent.prototype.getModules = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.Modules).subscribe(function (response) {
            if (response.code == 100) {
                _this.modules = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTimeComponent.prototype.set = function () {
        if (this.form.valid) {
            this.isWorking = true;
            if (this.id == 0) {
                this.save();
            }
            else {
                this.update();
            }
        }
    };
    AddTimeComponent.prototype.save = function () {
        var _this = this;
        var params = this.form.value;
        params.finalValue = (params.finalValue) ? params.finalValue : 0;
        this.ApiService.save(EEndpoints.Time, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('messages.itemSaved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTimeComponent.prototype.update = function () {
        var _this = this;
        this.form.value.id = this.id;
        var params = this.form.value;
        params.finalValue = (params.finalValue) ? params.finalValue : 0;
        this.ApiService.update(EEndpoints.Time, params)
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
    AddTimeComponent.prototype.populateForm = function (data) {
        var _this = this;
        Object.keys(this.form.controls).forEach(function (name) {
            if (_this.form.controls[name]) {
                _this.form.controls[name].patchValue(data[name]);
            }
        });
        this.isRange = data.withRange == 1 ? true : false;
        this.id = data.id;
    };
    AddTimeComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddTimeComponent.prototype.showInputRange = function (event) {
        this.isRange = event.checked;
        if (event.checked) {
            this.form.controls.finalValue.setValue('');
            this.form.controls.finalValue.setValidators(Validators.required);
        }
        else {
            this.form.controls.finalValue.setValue(this.form.controls.initialValue.value);
            this.form.controls.finalValue.setValidators(Validators.nullValidator);
        }
    };
    AddTimeComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddTimeComponent = __decorate([
        Component({
            selector: 'app-add-time',
            templateUrl: './add-time.component.html'
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddTimeComponent);
    return AddTimeComponent;
}());
export { AddTimeComponent };
//# sourceMappingURL=add-time.component.js.map