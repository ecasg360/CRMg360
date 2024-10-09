var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, Input } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ApiService } from "@services/api.service";
import { AddContractProjectComponent } from "./add-contract-project/add-contract-project.component";
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
var ContractProjectComponent = /** @class */ (function () {
    function ContractProjectComponent(toasterService, ApiService, dialog, translate) {
        this.toasterService = toasterService;
        this.ApiService = ApiService;
        this.dialog = dialog;
        this.translate = translate;
        this.isDataAvailable = false;
        this.isWorking = true;
    }
    ContractProjectComponent.prototype.ngOnInit = function () {
        this.getContractsProject();
    };
    ContractProjectComponent.prototype.getContractsProject = function () {
        var _this = this;
        this.isDataAvailable = true;
        this.isWorking = true;
        this.dataSource = undefined;
        var params = { projectId: this.projectId };
        this.ApiService.get(EEndpoints.ContractsByProjectId, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.isDataAvailable = (response.result.length > 0);
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
                _this.contracts = _this.dataSource.data;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ContractProjectComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        var dialogRef = this.dialog.open(AddContractProjectComponent, {
            width: '500px',
            data: {
                id: id,
                projectId: this.projectId,
                projectTypeId: this.projectTypeId,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getContractsProject();
        });
    };
    ContractProjectComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        this.contracts = this.dataSource.filteredData;
    };
    ContractProjectComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ContractProjectComponent.prototype, "projectId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ContractProjectComponent.prototype, "projectTypeId", void 0);
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], ContractProjectComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], ContractProjectComponent.prototype, "sort", void 0);
    ContractProjectComponent = __decorate([
        Component({
            selector: 'app-contract-project',
            templateUrl: './contract-project.component.html',
            styleUrls: ['./contract-project.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService])
    ], ContractProjectComponent);
    return ContractProjectComponent;
}());
export { ContractProjectComponent };
//# sourceMappingURL=contract-project.component.js.map