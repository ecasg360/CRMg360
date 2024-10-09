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
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { PersonFormComponent } from '@shared/components/person-form/person-form.component';
import { EEndpoints } from '@enums/endpoints';
import { ToasterService } from '@services/toaster.service';
import { allLang } from '@i18n/allLang';
var ContractMembersManagerComponent = /** @class */ (function () {
    function ContractMembersManagerComponent(
    //public dialogRef: MatDialogRef<AddProjectWorkDetailsComponent>,
    toaster, apiService, dialog, translate, 
    //private formBuilder: FormBuilder,
    _fuseTranslationLoaderService) {
        this.toaster = toaster;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.contractMembers = [];
    }
    ContractMembersManagerComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.getMembers();
    };
    ContractMembersManagerComponent.prototype.getMembers = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ContractMembers)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.contractMembers = response.result;
                _this.person = response.result[0].person;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ContractMembersManagerComponent.prototype.saveMember = function (model) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ContractMember, model)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.getMembers();
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ContractMembersManagerComponent.prototype.openDialogForAddContractMember = function () {
        var _this = this;
        var dialogRef = this.dialog.open(PersonFormComponent, {
            width: '900px',
            data: {
                id: 0,
                isContractMember: true
            },
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                var contractMember = {
                    id: 0,
                    contractId: _this.contractId,
                    companyId: 0,
                    personId: result,
                    contractRoleId: 0
                };
                _this.saveMember(contractMember);
            }
        });
    };
    ContractMembersManagerComponent.prototype.responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ContractMembersManagerComponent.prototype, "contractId", void 0);
    ContractMembersManagerComponent = __decorate([
        Component({
            selector: 'app-contract-members-manager',
            templateUrl: './contract-members-manager.component.html',
            styleUrls: ['./contract-members-manager.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService])
    ], ContractMembersManagerComponent);
    return ContractMembersManagerComponent;
}());
export { ContractMembersManagerComponent };
//# sourceMappingURL=contract-members-manager.component.js.map