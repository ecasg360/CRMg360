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
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { SelectionContractTermsComponent } from '../selection-contract-terms/selection-contract-terms.component';
import { AddTermTypeComponent } from '../add-term-type/add-term-type.component';
var ContractTermsManagerComponent = /** @class */ (function () {
    function ContractTermsManagerComponent(toaster, apiService, dialog, translate, _translationLoaderService) {
        var _a;
        this.toaster = toaster;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this._translationLoaderService = _translationLoaderService;
        this.isWorking = false;
        this.termsTypes = [];
        this.contractTermTypeList = [];
        (_a = this._translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    ContractTermsManagerComponent.prototype.ngOnChanges = function (changes) {
        if (changes.contractId.currentValue) {
            this._getContractTerms();
            this._getTermsTypesByContract();
        }
    };
    ContractTermsManagerComponent.prototype.ngOnInit = function () {
    };
    ContractTermsManagerComponent.prototype.trackList = function (index, item) {
        return (item.id) ? item.id : index;
    };
    ContractTermsManagerComponent.prototype.openContractTypeModal = function () {
        var _this = this;
        var dialogRef = this.dialog.open(AddTermTypeComponent, {
            width: '700px',
            data: {
                contractId: this.contractId,
                contractTermType: this.contractTermTypeList
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this._getContractTerms();
            }
        });
    };
    ContractTermsManagerComponent.prototype.addClausuleModal = function (term) {
        var _this = this;
        var dialogRef = this.dialog.open(SelectionContractTermsComponent, {
            width: '900px',
            data: {
                contractTerms: {
                    termTypeId: term.id,
                    contractId: this.contractId,
                    termTypeName: term.name,
                },
                clausules: term.contractTerms
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this._getContractTerms();
            }
        });
    };
    ContractTermsManagerComponent.prototype.deleteTermType = function (term) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: term.name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this._deleteTermType({ contractId: _this.contractId, termTypeId: term.id });
            }
        });
    };
    ContractTermsManagerComponent.prototype.drop = function (event, termTypeId) {
        var find = this.termsTypes.find(function (x) { return x.id === termTypeId; });
        this.moveItemInArray(find.contractTerms, event.previousIndex, event.currentIndex);
    };
    ContractTermsManagerComponent.prototype.moveItemInArray = function (contractTerms, previousIndex, currentIndex) {
        var _this = this;
        var posPrevious = contractTerms[previousIndex].position;
        contractTerms[previousIndex].position = contractTerms[currentIndex].position;
        contractTerms[currentIndex].position = posPrevious;
        var newList = [];
        newList.push(contractTerms[previousIndex]);
        newList.push(contractTerms[currentIndex]);
        this.apiService.update(EEndpoints.ContractTerms, newList)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this._getContractTerms();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ContractTermsManagerComponent.prototype.delete = function (id) {
        var _this = this;
        var params = [];
        params['id'] = id;
        this.apiService.delete(EEndpoints.ContractTerm, params).subscribe(function (response) {
            if (response.code == 100) {
                _this._getContractTerms();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ContractTermsManagerComponent.prototype.confirmDelete = function (id, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_2 = result.confirm;
                if (confirm_2)
                    _this.delete(id);
            }
        });
    };
    ContractTermsManagerComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    ContractTermsManagerComponent.prototype._getContractTerms = function () {
        var _this = this;
        this.isWorking = true;
        this.term = undefined;
        this.apiService.get(EEndpoints.ContractTermsByContractId, { contractid: this.contractId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.termsTypes = response.result;
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ContractTermsManagerComponent.prototype._getTermsTypesByContract = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ContractTermTypes, { contractId: this.contractId }).subscribe(function (response) {
            if (response.code == 100)
                _this.contractTermTypeList = response.result;
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ContractTermsManagerComponent.prototype._deleteTermType = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.ContractTermTypes, params).subscribe(function (response) {
            if (response.code == 100) {
                _this._getContractTerms();
            }
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ContractTermsManagerComponent.prototype, "contractId", void 0);
    ContractTermsManagerComponent = __decorate([
        Component({
            selector: 'app-contract-terms-manager',
            templateUrl: './contract-terms-manager.component.html',
            styleUrls: ['./contract-terms-manager.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService])
    ], ContractTermsManagerComponent);
    return ContractTermsManagerComponent;
}());
export { ContractTermsManagerComponent };
//# sourceMappingURL=contract-terms-manager.component.js.map