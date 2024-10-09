var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { AccountService } from '@services/account.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { MatDialog } from '@angular/material';
import { ComponentsComunicationService } from '@services/components-comunication.service';
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(service, accountService, formBuilder, translate, toaster, dialog, componentComunication) {
        this.service = service;
        this.accountService = accountService;
        this.formBuilder = formBuilder;
        this.translate = translate;
        this.toaster = toaster;
        this.dialog = dialog;
        this.componentComunication = componentComunication;
        this.isWorking = false;
        this.configurationImages = [];
        this.cssClass = "mat-elevation-z3";
    }
    ProfileComponent.prototype.ngOnInit = function () {
        this.currentUser = this.accountService.getLocalUserProfile();
        this.genders = [
            { value: 'F', viewValue: 'general.female' },
            { value: 'M', viewValue: 'general.male' }
        ];
        this.initForm();
        this.getConfigurationImages();
    };
    ProfileComponent.prototype.initForm = function () {
        var birthdate = this.currentUser.birthdate
            ? (new Date(this.currentUser.birthdate)).toISOString()
            : null;
        this.profileForm = this.formBuilder.group({
            Id: [this.currentUser.id, [Validators.required]],
            pictureUrl: [this.currentUser.pictureUrl, []],
            name: [this.currentUser.name, [Validators.required]],
            lastName: [this.currentUser.lastName, [Validators.required]],
            secondLastName: [this.currentUser.secondLastName, []],
            phoneOne: [this.currentUser.phoneOne, []],
            birthdate: [birthdate, []],
            gender: [this.currentUser.gender, [Validators.required]],
        });
    };
    Object.defineProperty(ProfileComponent.prototype, "f", {
        get: function () { return this.profileForm.controls; },
        enumerable: false,
        configurable: true
    });
    ProfileComponent.prototype.selectImage = function (item) {
        var _this = this;
        this.configurationImages.forEach(function (value) {
            value.cssClass = (value.id == item.id) ? _this.cssClass : '';
        });
    };
    ProfileComponent.prototype.selectAvatarImage = function ($event) {
        this.f.pictureUrl.patchValue($event);
    };
    ProfileComponent.prototype.saveDefaultImage = function () {
        var found = this.configurationImages.find(function (f) { return f.cssClass != '' && f.cssClass != undefined && f.cssClass != null; });
        console.log(found);
        if (found) {
            var params = {
                configurationImageId: found.id,
                userId: this.currentUser.id
            };
            this.updateConfigurationImageUser(params);
            this.toaster.showTranslate('messages.itemSaved');
        }
    };
    ProfileComponent.prototype.confirmUpdateProfile = function () {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('general.informationsaved?'),
                action: this.translate.instant('general.save'),
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.updateProfile();
            }
        });
    };
    ProfileComponent.prototype.showBackgroundList = function () {
        this.getConfigurationImages();
    };
    ProfileComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    ProfileComponent.prototype.getConfigurationImages = function () {
        var _this = this;
        this.service.get(EEndpoints.ConfigurationImages).subscribe(function (response) {
            if (response.code == 100) {
                if (response.result && response.result.length > 0) {
                    _this.configurationImages = response.result.map(function (m) {
                        m.isDefault = false;
                        return m;
                    });
                    _this.getConfigurationImageUser();
                }
                else {
                    _this.configurationImages = [];
                    _this.accountService.clearDefaultImage();
                }
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProfileComponent.prototype.getConfigurationImageUser = function () {
        var _this = this;
        var params = { userId: this.currentUser.id };
        this.service.get(EEndpoints.ConfigurationImagesByUser, params).subscribe(function (response) {
            if (response.code == 100) {
                var found = _this.configurationImages.findIndex(function (f) { return f.id == response.result.id; });
                if (found >= 0 && _this.configurationImages.length > 0) {
                    _this.configurationImages[found].cssClass = _this.cssClass;
                    _this.configurationImages[found].isDefault = true;
                    _this.accountService.setDefaultImage(_this.configurationImages[found].pictureUrl);
                }
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProfileComponent.prototype.updateConfigurationImageUser = function (params) {
        var _this = this;
        this.service.save(EEndpoints.ConfigurationImageUser, params).subscribe(function (response) {
            if (response.code !== 100)
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
            else {
                var found = _this.configurationImages.find(function (f) { return f.cssClass != '' && f.cssClass != undefined && f.cssClass != null; });
                if (found) {
                    console.log(found);
                    _this.accountService.setDefaultImage(found.pictureUrl);
                }
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProfileComponent.prototype.deleteImage = function (id) {
        var _this = this;
        this.isWorking = true;
        this.service.delete(EEndpoints.ConfigurationImage, { id: id }).subscribe(function (response) {
            if (response.code !== 100)
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
            else
                _this.getConfigurationImages();
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProfileComponent.prototype.updateProfile = function () {
        var _this = this;
        this.service.save(EEndpoints.UpdateProfile, this.profileForm.value).subscribe(function (response) {
            if (response.code == 100) {
                _this.accountService.updateLocalStorage(response.result);
                _this.currentUser = _this.accountService.getLocalUserProfile();
                _this.toaster.showToaster(_this.translate.instant('general.informationsaved'));
                _this.componentComunication.sendProfileChangeNotification(true);
            }
            else
                _this.toaster.showToaster(response.message);
        }, function (err) { return _this._responseError(err); });
    };
    ProfileComponent = __decorate([
        Component({
            selector: 'app-profile',
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.scss']
        }),
        __metadata("design:paramtypes", [ApiService,
            AccountService,
            FormBuilder,
            TranslateService,
            ToasterService,
            MatDialog,
            ComponentsComunicationService])
    ], ProfileComponent);
    return ProfileComponent;
}());
export { ProfileComponent };
//# sourceMappingURL=profile.component.js.map