var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ProjectDetailComponent } from '@shared/components/project-detail/project-detail.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { Router } from '@angular/router';
import { ModalContractFormComponent } from '@app/commons/modals/components/modal-contract-form/modal-contract-form.component';
var ContractListComponent = /** @class */ (function () {
    function ContractListComponent(toasterService, apiService, dialog, translate, activatedRoute, _fuseTranslationLoaderService, router) {
        var _a;
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this.activatedRoute = activatedRoute;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.router = router;
        this.isWorking = false;
        this.contracts = [];
        this.filteredContracts = [];
        this.perm = {};
        this.perm = this.activatedRoute.snapshot.data;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    }
    ContractListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            var moduleFilter = params.menuFilter;
            _this.month = params.month;
            _this.year = params.year;
            console.log('this.perm en contracts: ', _this.perm);
            switch (moduleFilter) {
                case 'label':
                    if (_this.perm.Contract.GetByLabel) {
                        _this.getContracts(EEndpoints.ContractsByLabel);
                    }
                    else {
                        _this.router.navigateByUrl('/');
                    }
                    break;
                case 'event':
                case 'publishing':
                    if (_this.perm.Contract.GetByEvent) {
                        _this.getContracts(EEndpoints.ContractsByEvent);
                    }
                    else {
                        _this.router.navigateByUrl('/');
                    }
                    break;
                case 'agency':
                    if (_this.perm.Contract.GetByAgency) {
                        _this.getContracts(EEndpoints.ContractsByAgency);
                    }
                    else {
                        _this.router.navigateByUrl('/');
                    }
                    break;
                default:
                    if (_this.perm.Contract.Get) {
                        _this.getContracts(EEndpoints.Contracts);
                    }
                    else {
                        _this.router.navigateByUrl('/');
                    }
            }
        });
    };
    ContractListComponent.prototype.applyFilter = function (filterValue) {
        filterValue = filterValue.trim();
        if (!filterValue)
            this.filteredContracts = this.contracts;
        else
            this.filteredContracts = this.contracts.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
    };
    ContractListComponent.prototype.openModal = function () {
        var _this = this;
        var dialogRef = this.dialog.open(ModalContractFormComponent, {
            width: '900px',
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.router.navigate(['/contracts/manage/', result.id]);
            }
        });
    };
    ContractListComponent.prototype.showProjectDetail = function (projectId) {
        if (projectId === void 0) { projectId = 0; }
        this.dialog.open(ProjectDetailComponent, {
            width: '700px',
            data: {
                projectId: projectId,
            }
        });
    };
    ContractListComponent.prototype.confirmDelete = function (contractId, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                if (result.confirm)
                    _this._deleteContract(contractId);
            }
        });
    };
    ContractListComponent.prototype._filterProjectsByMonthYear = function (list) {
        var _this = this;
        if (this.year && this.month) {
            list = list.filter(function (f) {
                var date = new Date(f.endDate);
                if (_this.year == date.getFullYear() && date.getMonth() == _this.month)
                    return f;
            });
        }
        return list;
    };
    ContractListComponent.prototype._responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    ContractListComponent.prototype.downloadFile = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.download(EEndpoints.TemplateContractDocumentCreate, { contractId: id }).subscribe(function (fileData) {
            var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "Contract Contrato");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ContractListComponent.prototype.getContracts = function (url) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(url).subscribe(function (response) {
            if (response.code == 100) {
                var result = _this._filterProjectsByMonthYear(response.result);
                _this.contracts = result;
                _this.filteredContracts = result;
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ContractListComponent.prototype._deleteContract = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.Contract, { id: id }).subscribe(function (response) {
            if (response.code == 100) {
                var found = _this.contracts.findIndex(function (f) { return f.id == id; });
                if (found >= 0) {
                    _this.contracts.splice(found, 1);
                    _this.filteredContracts = _this.contracts;
                    _this.searchInput.nativeElement.value = '';
                }
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild("searchInput"),
        __metadata("design:type", ElementRef)
    ], ContractListComponent.prototype, "searchInput", void 0);
    ContractListComponent = __decorate([
        Component({
            selector: 'app-contract-list',
            templateUrl: './contract-list.component.html',
            styleUrls: ['./contract-list.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            ActivatedRoute,
            FuseTranslationLoaderService,
            Router])
    ], ContractListComponent);
    return ContractListComponent;
}());
export { ContractListComponent };
//# sourceMappingURL=contract-list.component.js.map