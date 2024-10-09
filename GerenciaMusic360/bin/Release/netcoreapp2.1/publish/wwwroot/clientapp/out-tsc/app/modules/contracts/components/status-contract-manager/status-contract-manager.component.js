var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { AddStatusContractComponent } from '../add-status-contract/add-status-contract.component';
import * as _ from "lodash";
import { EModules } from '@enums/modules';
var StatusContractManagerComponent = /** @class */ (function () {
    function StatusContractManagerComponent(toaster, apiService, translate, dialog, _translationLoaderService) {
        var _a;
        this.toaster = toaster;
        this.apiService = apiService;
        this.translate = translate;
        this.dialog = dialog;
        this._translationLoaderService = _translationLoaderService;
        this.contract = {};
        this.statusModule = [];
        this.contractStatus = [];
        this.currentStatus = {};
        this.statusList = [];
        this.statusSelected = 0;
        (_a = this._translationLoaderService).loadTranslations.apply(_a, allLang);
        this.currentStatus = {
            id: 1,
            statusModule: {
                name: 'Enviado'
            }
        };
    }
    StatusContractManagerComponent.prototype.ngOnChanges = function (changes) {
        if (Object.values(changes.contract).length > 0) {
            this.getStatus();
        }
    };
    StatusContractManagerComponent.prototype.ngOnInit = function () { };
    StatusContractManagerComponent.prototype.sliderChange = function (event) {
        var _this = this;
        /*
        const selectedStatusModule = this.statusModule[event.value - 1];
        if (selectedStatusModule.id == this.currentStatus.statusId) {
          return;
        }
        */
        if (this.currentStatus.statusId === parseInt(event.value)) {
            return;
        }
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '600px',
            data: {
                text: this.translate.instant('messages.changeStatusContractsQuestion', { field: name }),
                action: this.translate.instant('general.confirm'),
                icon: 'save_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.openDialogChangeStatus();
                else
                    //this.valueStatus--;
                    _this.statusSelected = _this.currentStatus.statusId;
            }
        });
    };
    StatusContractManagerComponent.prototype.openDialogChangeStatus = function () {
        var _this = this;
        var theIndex = 1;
        this.statusModule.forEach(function (status, index) {
            if (_this.statusSelected == status.id) {
                theIndex = index;
            }
        });
        var dialogRef = this.dialog.open(AddStatusContractComponent, {
            width: '600px',
            data: {
                contractId: this.contract.id,
                statusModuleList: this.statusModule,
                selectedStatus: this.statusModule[theIndex]
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                if (result)
                    _this.getStatusContracts();
            }
            else
                //this.valueStatus--;
                _this.statusSelected = _this.currentStatus.statusId;
        });
    };
    StatusContractManagerComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    StatusContractManagerComponent.prototype.getStatus = function () {
        var _this = this;
        this.isWorking = true;
        var params = { moduleId: EModules.Contract };
        this.apiService.get(EEndpoints.StatusByModule, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.statusModule = response.result;
                _this.statusList = _this.statusModule;
                _this.maxValueStatus = _this.statusModule.length;
                _this.valueStatus = 1;
                _this.getStatusContracts();
            }
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    StatusContractManagerComponent.prototype.getStatusContracts = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ContractStatusByContractId, { contractId: this.contract.id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.contractStatus = response.result;
                _this.valueStatus = _this.contractStatus.length;
                _this.currentStatus = _.maxBy(_this.contractStatus, function (x) { return x.statusId; });
                _this.currentStatus.statusModule = _this.statusModule.find(function (f) { return f.id == _this.currentStatus.statusId; });
                _this.statusSelected = _this.currentStatus.statusId;
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], StatusContractManagerComponent.prototype, "contract", void 0);
    StatusContractManagerComponent = __decorate([
        Component({
            selector: 'app-status-contract-manager',
            templateUrl: './status-contract-manager.component.html',
            styleUrls: ['./status-contract-manager.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            TranslateService,
            MatDialog,
            FuseTranslationLoaderService])
    ], StatusContractManagerComponent);
    return StatusContractManagerComponent;
}());
export { StatusContractManagerComponent };
//# sourceMappingURL=status-contract-manager.component.js.map