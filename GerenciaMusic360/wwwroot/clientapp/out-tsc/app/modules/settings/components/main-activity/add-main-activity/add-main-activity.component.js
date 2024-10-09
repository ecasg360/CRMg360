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
var AddMainActivityComponent = /** @class */ (function () {
    function AddMainActivityComponent(dialogRef, formBuilder, apiService, toasterService, actionData, translate, _fuseTranslationLoaderService) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.id = 0;
        this.croppedImage = "";
        this.isWorking = true;
    }
    AddMainActivityComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = this.actionData.id;
        this.configureForm();
        if (this.id == 0) {
            this.isWorking = false;
            this.titleAction = this.translate.instant('settings.mainActivity.saveTitle');
            this.action = this.translate.instant('general.save');
        }
        else {
            this.titleAction = this.translate.instant('settings.mainActivity.saveTitle');
            this.action = this.translate.instant('general.save');
            this.getMainActivity();
        }
    };
    Object.defineProperty(AddMainActivityComponent.prototype, "f", {
        get: function () { return this.formMainActivity.controls; },
        enumerable: false,
        configurable: true
    });
    AddMainActivityComponent.prototype.configureForm = function () {
        this.formMainActivity = this.formBuilder.group({
            name: ['', [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.minLength(3),
                ]],
            description: ['', [
                    Validators.maxLength(150)
                ]]
        });
    };
    AddMainActivityComponent.prototype.populateForm = function (data) {
        var _this = this;
        Object.keys(this.formMainActivity.controls).forEach(function (name) {
            if (_this.formMainActivity.controls[name]) {
                _this.formMainActivity.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
        this.croppedImage =
            data.pictureUrl !== null
                ? "data:image/jpg;base64," + data.pictureUrl
                : "";
    };
    AddMainActivityComponent.prototype.setMainActivity = function () {
        if (!this.formMainActivity.invalid) {
            this.isWorking = true;
            if (this.id == 0) {
                this.saveMainActivity();
            }
            else {
                this.updateMainActivity();
            }
        }
    };
    AddMainActivityComponent.prototype.saveMainActivity = function () {
        var _this = this;
        this.formMainActivity.value.pictureUrl = this.croppedImage;
        this.apiService.save(EEndpoints.MainActivity, this.formMainActivity.value).subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('settings.mainActivity.messages.saved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddMainActivityComponent.prototype.updateMainActivity = function () {
        var _this = this;
        this.isWorking = true;
        if (!this.formMainActivity.invalid) {
            this.formMainActivity.value.id = this.id;
            this.formMainActivity.value.pictureUrl = this.croppedImage;
            this.apiService.update(EEndpoints.MainActivity, this.formMainActivity.value).subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick(true);
                    _this.toasterService.showToaster(_this.translate.instant('settings.mainActivity.messages.saved'));
                }
                else {
                    _this.toasterService.showToaster(data.message);
                }
                _this.isWorking = false;
            }, function (err) { return _this.reponseError(err); });
        }
    };
    AddMainActivityComponent.prototype.getMainActivity = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MainActivity, { id: this.id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.populateForm(data.result);
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddMainActivityComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddMainActivityComponent.prototype.reponseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddMainActivityComponent.prototype.selectImage = function ($event) {
        this.croppedImage = $event;
    };
    AddMainActivityComponent = __decorate([
        Component({
            selector: 'app-add-main-activity',
            templateUrl: './add-main-activity.component.html',
            styleUrls: ['./add-main-activity.component.scss']
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddMainActivityComponent);
    return AddMainActivityComponent;
}());
export { AddMainActivityComponent };
//# sourceMappingURL=add-main-activity.component.js.map