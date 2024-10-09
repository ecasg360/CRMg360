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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@app/core/enums/endpoints";
import { FormBuilder, Validators } from "@angular/forms";
var AddDepartmentComponent = /** @class */ (function () {
    function AddDepartmentComponent(dialogRef, formBuilder, service, toasterService, actionData, translate, _fuseTranslationLoaderService) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.service = service;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.id = 0;
        this.isWorking = true;
    }
    AddDepartmentComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = this.actionData.id;
        this.configureForm();
        if (this.id == 0) {
            this.isWorking = false;
            this.titleAction = this.translate.instant('settings.department.saveTitle');
            this.action = this.translate.instant('general.save');
        }
        else {
            this.titleAction = this.translate.instant('settings.department.editTitle');
            this.action = this.translate.instant('general.save');
            this.getDeparment();
        }
    };
    Object.defineProperty(AddDepartmentComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddDepartmentComponent.prototype.configureForm = function () {
        this.form = this.formBuilder.group({
            name: ['', [
                    Validators.required,
                    Validators.maxLength(5),
                    Validators.minLength(1),
                ]],
            description: ['', [
                    Validators.maxLength(50)
                ]]
        });
    };
    AddDepartmentComponent.prototype.populateForm = function (data) {
        var _this = this;
        Object.keys(this.form.controls).forEach(function (name) {
            if (_this.form.controls[name]) {
                _this.form.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
    };
    AddDepartmentComponent.prototype.getDeparment = function () {
        var _this = this;
        var params = [];
        params['id'] = this.id;
        this.service.get(EEndpoints.Department, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.populateForm(data.result);
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddDepartmentComponent.prototype.set = function () {
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
    AddDepartmentComponent.prototype.save = function () {
        var _this = this;
        this.service.save(EEndpoints.Department, this.form.value)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('settings.department.messages.saved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddDepartmentComponent.prototype.update = function () {
        var _this = this;
        this.form.value.id = this.id;
        this.service.update(EEndpoints.Department, this.form.value)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('settings.department.messages.saved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddDepartmentComponent.prototype.reponseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddDepartmentComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddDepartmentComponent = __decorate([
        Component({
            selector: 'app-add-department',
            templateUrl: './add-department.component.html'
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddDepartmentComponent);
    return AddDepartmentComponent;
}());
export { AddDepartmentComponent };
//# sourceMappingURL=add-department.component.js.map