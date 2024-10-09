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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var AddTypeComponent = /** @class */ (function () {
    function AddTypeComponent(dialogRef, formBuilder, apiService, toasterService, actionData, translate, _fuseTranslationLoaderService) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.id = 0;
        this.typeId = 0;
        this.isWorking = true;
    }
    AddTypeComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = this.actionData.id;
        this.typeId = this.actionData.typeId;
        this.name = (this.actionData.name) ? this.actionData.name : '';
        this.configureForm();
        if (this.id == 0) {
            this.isWorking = false;
            this.titleAction = this.translate.instant('settings.catalogTypes.saveTitle');
            this.action = this.translate.instant('general.save');
        }
        else {
            this.titleAction = this.translate.instant('settings.catalogTypes.editTitle');
            this.action = this.translate.instant('general.save');
            this.getMaintenanceType();
        }
    };
    Object.defineProperty(AddTypeComponent.prototype, "f", {
        get: function () { return this.formType.controls; },
        enumerable: false,
        configurable: true
    });
    AddTypeComponent.prototype.configureForm = function () {
        this.formType = this.formBuilder.group({
            name: [this.name, [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.minLength(3),
                ]],
            description: ['', [
                    Validators.maxLength(150)
                ]]
        });
    };
    AddTypeComponent.prototype.populateForm = function (data) {
        var _this = this;
        Object.keys(this.formType.controls).forEach(function (name) {
            if (_this.formType.controls[name]) {
                _this.formType.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
    };
    AddTypeComponent.prototype.set = function () {
        if (!this.formType.invalid) {
            this.isWorking = true;
            this.formType.value.typeId = this.typeId;
            if (this.id == 0) {
                this.save();
            }
            else {
                this.update();
            }
        }
    };
    AddTypeComponent.prototype.save = function () {
        var _this = this;
        this.apiService.save(EEndpoints.Type, this.formType.value).subscribe(function (data) {
            if (data.code == 100) {
                console.log(data.result);
                _this.onNoClick(data.result);
                _this.toasterService.showToaster(_this.translate.instant('messages.itemSaved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddTypeComponent.prototype.update = function () {
        var _this = this;
        this.formType.value.id = this.id;
        this.apiService.update(EEndpoints.Type, this.formType.value).subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(_this.formType.value);
                _this.toasterService.showToaster(_this.translate.instant('messages.itemUpdated'));
            }
            else {
                _this.toasterService.showToaster(data.message);
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddTypeComponent.prototype.getMaintenanceType = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Type, { id: this.id, typeId: this.typeId }).subscribe(function (data) {
            if (data.code == 100 && data.result) {
                _this.populateForm(data.result);
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddTypeComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddTypeComponent.prototype.reponseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddTypeComponent = __decorate([
        Component({
            selector: 'app-add-type',
            templateUrl: './add-type.component.html',
            styleUrls: ['./add-type.component.scss']
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddTypeComponent);
    return AddTypeComponent;
}());
export { AddTypeComponent };
//# sourceMappingURL=add-type.component.js.map