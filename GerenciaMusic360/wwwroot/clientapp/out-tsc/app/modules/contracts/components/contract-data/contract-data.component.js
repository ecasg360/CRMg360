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
import { FormBuilder } from '@angular/forms';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@enums/endpoints';
import { MatDialog } from '@angular/material';
import { ProjectDetailComponent } from '@shared/components/project-detail/project-detail.component';
import { allLang } from '@i18n/allLang';
var ContractDataComponent = /** @class */ (function () {
    function ContractDataComponent(toaster, apiService, translate, fb, _translationLoaderService, dialog) {
        var _a;
        this.toaster = toaster;
        this.apiService = apiService;
        this.translate = translate;
        this.fb = fb;
        this._translationLoaderService = _translationLoaderService;
        this.dialog = dialog;
        this.contractId = 0;
        this.contract = {};
        this.times = [];
        this.currencies = [];
        this.initDate = new Date(2000, 0, 1);
        this.endDate = new Date(2120, 0, 1);
        (_a = this._translationLoaderService).loadTranslations.apply(_a, allLang);
        this.form = this.fb.group({});
    }
    ContractDataComponent.prototype.ngOnChanges = function (changes) {
        if (changes.contract) {
            if (Object.keys(changes.contract.currentValue).length == 0)
                this.getContract();
        }
    };
    ContractDataComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(ContractDataComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    ContractDataComponent.prototype.bindForm = function ($event) {
        this.form = $event;
    };
    ContractDataComponent.prototype.manageFormWork = function ($event) {
        this.isWorking = $event;
    };
    ContractDataComponent.prototype.showProjectDetail = function (projectId) {
        if (projectId === void 0) { projectId = 0; }
        var dialogRef = this.dialog.open(ProjectDetailComponent, {
            width: '700px',
            data: {
                projectId: projectId,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                console.log("Confirm");
            }
            console.log("cancel");
        });
    };
    ContractDataComponent.prototype.responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    ContractDataComponent.prototype.save = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.Contract, this.form.value).subscribe(function (response) {
            if (response.code == 100)
                _this.toaster.showTranslate('messages.itemSaved');
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ContractDataComponent.prototype.getContract = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Contract, { id: this.contractId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.contract = response.result;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ContractDataComponent.prototype, "contractId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ContractDataComponent.prototype, "contract", void 0);
    ContractDataComponent = __decorate([
        Component({
            selector: 'app-contract-data',
            templateUrl: './contract-data.component.html',
            styleUrls: ['./contract-data.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            TranslateService,
            FormBuilder,
            FuseTranslationLoaderService,
            MatDialog])
    ], ContractDataComponent);
    return ContractDataComponent;
}());
export { ContractDataComponent };
//# sourceMappingURL=contract-data.component.js.map