var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { AddCompanyComponent } from '@shared/components/add-company/add-company.component';
import { ActivatedRoute } from '@angular/router';
var CompanyManagerComponent = /** @class */ (function () {
    function CompanyManagerComponent(dialog, translationLoaderService, translate, apiService, toaster, route) {
        var _a;
        this.dialog = dialog;
        this.translationLoaderService = translationLoaderService;
        this.translate = translate;
        this.apiService = apiService;
        this.toaster = toaster;
        this.route = route;
        this.displayedColumns = ['businessName', 'legalName', 'status', 'action'];
        this.isWorking = true;
        this.isDataAvailable = true;
        this.perm = {};
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.perm = this.route.snapshot.data;
    }
    ;
    CompanyManagerComponent.prototype.ngOnInit = function () {
        this.getCompaniesApi();
    };
    CompanyManagerComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    CompanyManagerComponent.prototype.showModalForm = function (row) {
        var _this = this;
        if (row === void 0) { row = {}; }
        var dialogRef = this.dialog.open(AddCompanyComponent, {
            width: '900px',
            data: {
                model: row
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result)
                _this.getCompaniesApi();
        });
    };
    CompanyManagerComponent.prototype.confirmDelete = function (row) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: row.businessName }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result.confirm)
                _this.deleteCompanyApi(row.id);
        });
    };
    CompanyManagerComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        console.error(error);
        this.isWorking = false;
    };
    //#region API
    CompanyManagerComponent.prototype.getCompaniesApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Companies).subscribe(function (response) {
            if (response.code == 100) {
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorChangingStatus'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    CompanyManagerComponent.prototype.updateStatusApi = function (id, status) {
        var _this = this;
        this.isWorking = true;
        var statusId = status == 1 ? 2 : 1;
        var params = { id: id, status: statusId };
        this.apiService.save(EEndpoints.CompanyStatus, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.changeStatusSuccess'));
                _this.getCompaniesApi();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
            _this.isWorking = false;
        }, function (err) {
            _this._responseError(err);
        });
    };
    CompanyManagerComponent.prototype.deleteCompanyApi = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = { id: id };
        this.apiService.delete(EEndpoints.Company, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemDeleted'));
                _this.getCompaniesApi();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('messages.errorDeletingItem'));
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], CompanyManagerComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], CompanyManagerComponent.prototype, "sort", void 0);
    CompanyManagerComponent = __decorate([
        Component({
            selector: 'app-company-manager',
            templateUrl: './company-manager.component.html',
            styleUrls: ['./company-manager.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            FuseTranslationLoaderService,
            TranslateService,
            ApiService,
            ToasterService,
            ActivatedRoute])
    ], CompanyManagerComponent);
    return CompanyManagerComponent;
}());
export { CompanyManagerComponent };
//# sourceMappingURL=company-manager.component.js.map