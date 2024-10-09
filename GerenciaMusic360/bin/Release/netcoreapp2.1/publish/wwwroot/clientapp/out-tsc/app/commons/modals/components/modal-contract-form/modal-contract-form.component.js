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
import { FormBuilder } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
var ModalContractFormComponent = /** @class */ (function () {
    function ModalContractFormComponent(apiService, toaster, fb, translate, dialogRef, data, translationLoaderService) {
        var _a;
        this.apiService = apiService;
        this.toaster = toaster;
        this.fb = fb;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.data = data;
        this.translationLoaderService = translationLoaderService;
        this.isWorking = false;
        this.contractTypes = [];
        this.contractTypeSelected = {};
        this.contract = {};
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this._getContractType();
        this.form = this.fb.group({});
    }
    ModalContractFormComponent.prototype.ngOnInit = function () {
        if (this.data && this.data.contract) {
            this.contract = this.data.contract;
        }
    };
    ModalContractFormComponent.prototype.bindForm = function ($event) {
        this.form = $event;
    };
    ModalContractFormComponent.prototype.manageFormWork = function ($event) {
        this.isWorking = $event;
    };
    Object.defineProperty(ModalContractFormComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    ModalContractFormComponent.prototype.setContract = function () {
        if (this.form.valid) {
            this.contract = this.form.value;
            this.contract.id = 0;
            this.save();
        }
    };
    ModalContractFormComponent.prototype.selectContractType = function (contractType) {
        this.contractTypeSelected = contractType;
        this.f.contractTypeId.setValue(contractType.id);
        this.f.localCompanyName.setValue(contractType.localCompanyName);
        this.f.localCompanyId.setValue(contractType.localCompanyId);
    };
    ModalContractFormComponent.prototype.onNoClick = function (contract) {
        if (contract === void 0) { contract = undefined; }
        this.dialogRef.close(contract);
    };
    ModalContractFormComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    ModalContractFormComponent.prototype.save = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.Contract, this.contract).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(response.result);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ModalContractFormComponent.prototype._getContractType = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ContractTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.contractTypes = response.result;
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ModalContractFormComponent = __decorate([
        Component({
            selector: 'app-modal-contract-form',
            templateUrl: './modal-contract-form.component.html',
            styleUrls: ['./modal-contract-form.component.scss']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FormBuilder,
            TranslateService,
            MatDialogRef, Object, FuseTranslationLoaderService])
    ], ModalContractFormComponent);
    return ModalContractFormComponent;
}());
export { ModalContractFormComponent };
//# sourceMappingURL=modal-contract-form.component.js.map