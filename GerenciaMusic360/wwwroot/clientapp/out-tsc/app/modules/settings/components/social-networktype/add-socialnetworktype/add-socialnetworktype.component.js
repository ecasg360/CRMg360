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
import { EEndpoints } from '@app/core/enums/endpoints';
var AddSocialnetworktypeComponent = /** @class */ (function () {
    function AddSocialnetworktypeComponent(dialogRef, formBuilder, service, toasterService, actionData, translate, _fuseTranslationLoaderService) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.service = service;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.croppedImage = "";
        this.isWorking = false;
        this.model = {};
    }
    AddSocialnetworktypeComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.model = this.actionData.model;
        this.configureForm();
        if (!this.model.id) {
            this.titleAction = this.translate.instant('settings.preferences.saveTitle');
            this.action = this.translate.instant('general.save');
        }
        else {
            this.titleAction = this.translate.instant('settings.preferences.editTitle');
            this.action = this.translate.instant('general.save');
        }
    };
    Object.defineProperty(AddSocialnetworktypeComponent.prototype, "f", {
        get: function () { return this.formSocialNetworkType.controls; },
        enumerable: false,
        configurable: true
    });
    AddSocialnetworktypeComponent.prototype.configureForm = function () {
        this.formSocialNetworkType = this.formBuilder.group({
            id: [this.model.id, []],
            name: [this.model.name, [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.minLength(3),
                ]],
            description: [this.model.description, [Validators.maxLength(150)]],
        });
        this.croppedImage = this.model.pictureUrl;
    };
    AddSocialnetworktypeComponent.prototype.setSocialNetworkType = function () {
        if (!this.formSocialNetworkType.invalid) {
            this.isWorking = true;
            this.model = this.formSocialNetworkType.value;
            this.model.pictureUrl = this.croppedImage;
            if (!this.model.id) {
                delete this.model.id;
                this.saveSocialNetworkType();
            }
            else
                this.updateSocialNetworkType();
        }
    };
    AddSocialnetworktypeComponent.prototype.saveSocialNetworkType = function () {
        var _this = this;
        this.service.save(EEndpoints.SocialNetworkType, this.model).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showTranslate('messages.itemSaved');
            }
            else
                _this.toasterService.showTranslate('errors.errorSavingItem');
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddSocialnetworktypeComponent.prototype.updateSocialNetworkType = function () {
        var _this = this;
        this.service.update(EEndpoints.SocialNetworkType, this.model).subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showTranslate('messages.itemUpdated');
            }
            else {
                _this.toasterService.showTranslate('errors.errorEditingItem');
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddSocialnetworktypeComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddSocialnetworktypeComponent.prototype.reponseError = function (error) {
        this.toasterService.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    AddSocialnetworktypeComponent.prototype.selectImage = function ($event) {
        this.croppedImage = $event;
    };
    AddSocialnetworktypeComponent = __decorate([
        Component({
            selector: 'app-add-socialnetworktype',
            templateUrl: './add-socialnetworktype.component.html',
            styleUrls: ['./add-socialnetworktype.component.css']
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddSocialnetworktypeComponent);
    return AddSocialnetworktypeComponent;
}());
export { AddSocialnetworktypeComponent };
//# sourceMappingURL=add-socialnetworktype.component.js.map