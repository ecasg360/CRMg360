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
var AddCategoryComponent = /** @class */ (function () {
    function AddCategoryComponent(dialogRef, formBuilder, service, dialog, toasterService, actionData, translate, _fuseTranslationLoaderService) {
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
        this.modules = [];
        this.projectTypes = [];
    }
    AddCategoryComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = this.actionData.id;
        this.configureForm();
        this.getModules();
        this.getProjectTypes();
        if (this.id == 0) {
            this.isWorking = false;
            this.action = this.translate.instant('general.save');
        }
        else {
            this.action = this.translate.instant('general.save');
            this.getCategory();
        }
    };
    AddCategoryComponent.prototype.getCategory = function () {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = this.id;
        this.service.get(EEndpoints.Category, params).subscribe(function (data) {
            if (data.code == 100) {
                _this.populateForm(data.result);
                _this.croppedImage = data.result.pictureUrl;
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddCategoryComponent.prototype.getModules = function () {
        var _this = this;
        this.service.get(EEndpoints.Modules).subscribe(function (data) {
            if (data.code == 100) {
                _this.modules = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddCategoryComponent.prototype.getProjectTypes = function () {
        var _this = this;
        this.service.get(EEndpoints.ProjectTypes).subscribe(function (data) {
            if (data.code == 100) {
                _this.projectTypes = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    Object.defineProperty(AddCategoryComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddCategoryComponent.prototype.configureForm = function () {
        this.form = this.formBuilder.group({
            name: ['', [
                    Validators.required
                ]],
            description: ['', [Validators.maxLength(250)]],
            pictureUrl: [''],
            moduleId: ['', [Validators.required]],
            projectTypeId: [''],
            key: ['']
        });
    };
    AddCategoryComponent.prototype.populateForm = function (data) {
        var _this = this;
        Object.keys(this.form.controls).forEach(function (name) {
            if (_this.form.controls[name]) {
                _this.form.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
    };
    AddCategoryComponent.prototype.set = function () {
        if (this.form.valid) {
            if (this.f.moduleId.value !== 1) {
                this.f.projectTypeId.setValue('');
            }
            this.isWorking = true;
            var params = this.form.value;
            params.key = (params.key) ? params.key : 0;
            params.description = (params.description) ? params.description : '';
            params.projectTypeId = (params.projectTypeId) ? params.projectTypeId : 0;
            if (this.id == 0) {
                this.save(params);
            }
            else {
                this.update(params);
            }
        }
    };
    AddCategoryComponent.prototype.save = function (params) {
        var _this = this;
        this.service.save(EEndpoints.Category, params)
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
    AddCategoryComponent.prototype.update = function (params) {
        var _this = this;
        params.id = this.id;
        this.service.update(EEndpoints.Category, params)
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
    AddCategoryComponent.prototype.selectImage = function (image) {
        this.f.pictureUrl.setValue(image);
    };
    AddCategoryComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddCategoryComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddCategoryComponent = __decorate([
        Component({
            selector: 'app-add-category',
            templateUrl: './add-category.component.html',
            styleUrls: ['./add-category.component.scss']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            MatDialog,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddCategoryComponent);
    return AddCategoryComponent;
}());
export { AddCategoryComponent };
//# sourceMappingURL=add-category.component.js.map