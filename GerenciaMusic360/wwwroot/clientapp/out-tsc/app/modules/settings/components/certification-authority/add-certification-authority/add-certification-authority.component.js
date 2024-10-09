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
import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from '@services/toaster.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EEndpoints } from '@enums/endpoints';
var AddCertificationAuthorityComponent = /** @class */ (function () {
    function AddCertificationAuthorityComponent(translationLoaderService, apiService, translate, toaster, dialogRef, data, fb) {
        this.translationLoaderService = translationLoaderService;
        this.apiService = apiService;
        this.translate = translate;
        this.toaster = toaster;
        this.dialogRef = dialogRef;
        this.data = data;
        this.fb = fb;
        this.certification = {};
        this.address = {};
    }
    AddCertificationAuthorityComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.certification = this.data;
        if (this.certification.addressId) {
            this.action = this.translate.instant('general.save');
            this._getAddressApi(this.certification.addressId);
        }
        else {
            this.action = this.translate.instant('general.save');
        }
        this.initForm();
    };
    AddCertificationAuthorityComponent.prototype.initForm = function () {
        this.certAuthForm = this.fb.group({
            id: [this.certification.id, []],
            name: [this.certification.name, [
                    Validators.required
                ]],
            businessName: [this.certification.businessName, [
                    Validators.required
                ]],
            phone: [this.certification.phone, []],
            contact: [this.certification.contact, [Validators.required]],
        });
    };
    Object.defineProperty(AddCertificationAuthorityComponent.prototype, "f", {
        get: function () { return this.certAuthForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddCertificationAuthorityComponent.prototype.bindExternalForm = function (name, form) {
        this.certAuthForm.setControl(name, form);
    };
    AddCertificationAuthorityComponent.prototype.save = function () {
        if (this.certAuthForm.valid) {
            this.data = this.certAuthForm.value;
            if (this.certification.id)
                this._updateAddressApi(this.certAuthForm.value.address);
            else
                this._createAddressApi(this.certAuthForm.value.address);
        }
    };
    AddCertificationAuthorityComponent.prototype._prepareParams = function () {
    };
    AddCertificationAuthorityComponent.prototype.onNoClick = function (certificationAuth) {
        if (certificationAuth === void 0) { certificationAuth = undefined; }
        this.dialogRef.close(certificationAuth);
    };
    AddCertificationAuthorityComponent.prototype._reponseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        console.error(error);
        this.isWorking = false;
    };
    //#region API
    AddCertificationAuthorityComponent.prototype._createAddressApi = function (params) {
        var _this = this;
        this.isWorking = true;
        delete params.id;
        this.apiService.save(EEndpoints.Address, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.data.addressId = response.result.id;
                delete _this.data.address;
                delete _this.data.id;
                _this.isWorking = true;
                _this._createCertificationApi(_this.data);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.savedAddressFailed'));
                _this.onNoClick();
                _this.isWorking = true;
            }
            _this.isWorking = false;
        }, function (err) { return _this._reponseError(err); });
    };
    AddCertificationAuthorityComponent.prototype._updateAddressApi = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.Address, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.isWorking = false;
                _this._updateCertificationApi(_this.data);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.savedAddressFailed'));
                _this.onNoClick();
                _this.isWorking = false;
            }
        }, function (err) { return _this._reponseError(err); });
    };
    AddCertificationAuthorityComponent.prototype._getAddressApi = function (addressId) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.AddressById, { id: addressId }).subscribe(function (response) {
            if (response.code == 100)
                _this.address = response.result;
            else {
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this._reponseError(err); });
    };
    AddCertificationAuthorityComponent.prototype._createCertificationApi = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.CertificationAuthority, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.data.id = response.result;
                _this.onNoClick(_this.data);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.savedCertificationAuthorityFailed'));
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this._reponseError(err); });
    };
    AddCertificationAuthorityComponent.prototype._updateCertificationApi = function (params) {
        var _this = this;
        delete params.address;
        this.isWorking = true;
        this.apiService.update(EEndpoints.CertificationAuthority, params).subscribe(function (response) {
            if (response.code == 100)
                _this.onNoClick(_this.data);
            else
                _this.onNoClick(_this.data);
            _this.isWorking = false;
        }, function (err) { return _this._reponseError(err); });
    };
    AddCertificationAuthorityComponent = __decorate([
        Component({
            selector: 'app-add-certification-authority',
            templateUrl: './add-certification-authority.component.html',
            styleUrls: ['./add-certification-authority.component.scss']
        }),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FuseTranslationLoaderService,
            ApiService,
            TranslateService,
            ToasterService,
            MatDialogRef, Object, FormBuilder])
    ], AddCertificationAuthorityComponent);
    return AddCertificationAuthorityComponent;
}());
export { AddCertificationAuthorityComponent };
//# sourceMappingURL=add-certification-authority.component.js.map