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
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ToasterService } from '@services/toaster.service';
var AddStatusContractComponent = /** @class */ (function () {
    function AddStatusContractComponent(dialogRef, apiService, toaster, translate, formBuilder, _fuseTranslationLoaderService, data) {
        this.dialogRef = dialogRef;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translate = translate;
        this.formBuilder = formBuilder;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.data = data;
        this.status = [];
        this.statusModule = [];
        this.selectedStatus = {};
    }
    AddStatusContractComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.contractId = this.data.contractId;
        this.statusModule = this.data.statusModuleList;
        this.selectedStatus = this.data.selectedStatus;
        this.configureForm();
        this.getStatus();
    };
    AddStatusContractComponent.prototype.configureForm = function () {
        this.form = this.formBuilder.group({
            contractId: [this.contractId],
            statusId: [this.selectedStatus.id],
            notes: ['']
        });
    };
    AddStatusContractComponent.prototype.getStatus = function () {
        this.isWorking = true;
        if (this.statusModule.length > 0) {
            this.status = this.statusModule.map(function (m) { return ({
                value: m.id,
                viewValue: m.name
            }); });
        }
        this.isWorking = false;
    };
    Object.defineProperty(AddStatusContractComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddStatusContractComponent.prototype.set = function () {
        if (this.form.valid) {
            this.save();
        }
    };
    AddStatusContractComponent.prototype.onNoClick = function () {
        this.dialogRef.close(undefined);
    };
    AddStatusContractComponent.prototype._responseError = function (err) {
        this.isWorking = false;
        this.toaster.showToaster(err);
    };
    AddStatusContractComponent.prototype.save = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ContractStatus, this.form.value).subscribe(function (response) {
            if (response.code == 100) {
                _this.dialogRef.close(true);
            }
            else {
                _this.toaster.showToaster('Error: ' + response.message);
                //this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddStatusContractComponent = __decorate([
        Component({
            selector: 'app-add-status-contract',
            templateUrl: './add-status-contract.component.html',
            styleUrls: ['./add-status-contract.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ApiService,
            ToasterService,
            TranslateService,
            FormBuilder,
            FuseTranslationLoaderService, Object])
    ], AddStatusContractComponent);
    return AddStatusContractComponent;
}());
export { AddStatusContractComponent };
//# sourceMappingURL=add-status-contract.component.js.map