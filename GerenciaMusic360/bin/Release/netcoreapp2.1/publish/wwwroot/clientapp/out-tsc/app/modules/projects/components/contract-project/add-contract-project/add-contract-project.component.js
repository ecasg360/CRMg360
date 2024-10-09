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
import { Component, Input, ViewChild, Optional, Inject } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@enums/endpoints';
import { EContractType } from '@enums/contract-type';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
var AddContractProjectComponent = /** @class */ (function () {
    function AddContractProjectComponent(dialogRef, toasterService, ApiService, dialog, translate, actionData) {
        this.dialogRef = dialogRef;
        this.toasterService = toasterService;
        this.ApiService = ApiService;
        this.dialog = dialog;
        this.translate = translate;
        this.actionData = actionData;
        this.collaboratorsArray = [];
        this.isDataAvailable = false;
        this.isWorking = true;
        this.project = {};
        this.contractModel = {};
    }
    AddContractProjectComponent.prototype.ngOnInit = function () {
        this.projectId = this.actionData.projectId;
        this.projectTypeId = this.actionData.projectTypeId;
        this.getProject();
    };
    AddContractProjectComponent.prototype.getProjectContract = function () {
        var _this = this;
        this.isDataAvailable = true;
        this.isWorking = true;
        this.dataSource = undefined;
        var params = [];
        params['projectId'] = this.projectId;
        this.ApiService.get(EEndpoints.ProjectContracts, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.isDataAvailable = (response.result.length > 0);
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
                _this.collaborators = _this.dataSource.data;
                //Consulta de la configuracion
                var params_1 = [];
                params_1['projectTypeId'] = _this.projectTypeId;
                _this.ApiService.get(EEndpoints.ConfigurationProjectTaskContract, params_1)
                    .subscribe(function (response) {
                    if (response.code == 100) {
                        _this.configurationProjectTaskContract = response.result; //.filter(f => f.contractTypeId == EContractType.PublishingAgreement || f.contractTypeId == EContractType.WorkForHire_RecordingProducer);
                        //Ubico la configuracion de cada Persona
                        _this.collaborators.forEach(function (value) {
                            var configurationProjectContract = null;
                            if (value.type == "Compositor") {
                                configurationProjectContract = _this.configurationProjectTaskContract.find(function (f) { return f.contractTypeId == EContractType.PublishingAgreement; });
                            }
                            else if (value.type == "Productor") {
                                configurationProjectContract = _this.configurationProjectTaskContract.find(function (f) { return f.contractTypeId == EContractType.WorkForHire_RecordingProducer; });
                            }
                            _this.collaboratorsArray.push({
                                projectContract: value,
                                configurationProjectContract: configurationProjectContract,
                            });
                        });
                    }
                    _this.isWorking = false;
                }, function (err) { return _this.responseError(err); });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddContractProjectComponent.prototype.getProject = function () {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = this.projectId;
        this.ApiService.get(EEndpoints.Project, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.project = response.result;
                _this.getProjectContract();
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddContractProjectComponent.prototype.confirmCreate = function (configurationProjectContract, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.saveContractQuestion', { field: name }),
                action: this.translate.instant('general.create'),
                icon: 'save'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1) {
                    _this.createContract(configurationProjectContract, _this.project, name);
                }
            }
        });
    };
    AddContractProjectComponent.prototype.createContract = function (configurationProjectContract, project, name) {
        var _this = this;
        this.isWorking = true;
        this.contractModel = {};
        this.contractModel.startDate = project.initialDate;
        this.contractModel.endDate = project.endDate;
        this.contractModel.name = project.name + ' - ' + name;
        this.contractModel.description = project.description + ' - ' + name;
        this.contractModel.currencyId = project.currencyId;
        this.contractModel.contractTypeId = configurationProjectContract.contractTypeId;
        this.contractModel.projectTaskId = configurationProjectContract.projectTaskId;
        this.contractModel.projectId = project.id;
        this.contractModel.contractTypeName = configurationProjectContract.contractType.name;
        this.contractModel.localCompanyId = configurationProjectContract.contractType.localCompanyId;
        this.ApiService.save(EEndpoints.Contract, this.contractModel)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('contractProject.messages.created'));
                _this.onNoClick(true);
            }
            else {
                _this.toasterService.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddContractProjectComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        this.collaborators = this.dataSource.filteredData;
    };
    AddContractProjectComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddContractProjectComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AddContractProjectComponent.prototype, "projectId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AddContractProjectComponent.prototype, "projectTypeId", void 0);
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], AddContractProjectComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], AddContractProjectComponent.prototype, "sort", void 0);
    AddContractProjectComponent = __decorate([
        Component({
            selector: 'app-add-contract-project',
            templateUrl: './add-contract-project.component.html',
            styleUrls: ['./add-contract-project.component.scss']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ToasterService,
            ApiService,
            MatDialog,
            TranslateService, Object])
    ], AddContractProjectComponent);
    return AddContractProjectComponent;
}());
export { AddContractProjectComponent };
//# sourceMappingURL=add-contract-project.component.js.map