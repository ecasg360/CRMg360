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
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ToasterService } from '@services/toaster.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { allLang } from '@app/core/i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { AddTypeComponent } from '@shared/components/add-type/add-type.component';
import { ActivatedRoute } from '@angular/router';
var MaintenanceTypeComponent = /** @class */ (function () {
    function MaintenanceTypeComponent(toasterService, dialog, apiService, translate, route, _fuseTranslationLoaderService) {
        var _a;
        this.toasterService = toasterService;
        this.dialog = dialog;
        this.apiService = apiService;
        this.translate = translate;
        this.route = route;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.displayedColumns = ['name', 'status', 'action'];
        this.isWorking = true;
        this.isDataAvailable = false;
        this.typeNames = [];
        this.perm = {};
        this.perm = this.route.snapshot.data;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    }
    MaintenanceTypeComponent.prototype.ngOnInit = function () {
        this.innerWidth = window.innerWidth;
        this.getTypeNames();
    };
    MaintenanceTypeComponent.prototype.getTypeNames = function () {
        var _this = this;
        this.isWorking = false;
        this.dataSource = undefined;
        this.apiService.get(EEndpoints.TypeNames)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.typeNames = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.description
                }); });
            }
        }, function (err) { return _this.reponseError(err); });
    };
    MaintenanceTypeComponent.prototype.SelectionChangeCatalogType = function (id) {
        var _this = this;
        this.isWorking = true;
        this.typeId = id;
        var params = [];
        params['typeId'] = id;
        this.apiService.get(EEndpoints.Types, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.isDataAvailable = (response.result.length > 0);
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
                _this.isWorking = false;
            }
        }, function (err) { return _this.reponseError(err); });
    };
    MaintenanceTypeComponent.prototype.reponseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    MaintenanceTypeComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    MaintenanceTypeComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.apiService.save(EEndpoints.TypeStatus, { id: id, typeId: this.typeId, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.SelectionChangeCatalogType(_this.typeId);
                _this.toasterService.showToaster(_this.translate.instant('messages.changeStatusSuccess'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.reponseError(err);
        });
    };
    MaintenanceTypeComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        if (this.typeId === undefined) {
            this.toasterService.showToaster(this.translate.instant('settings.catalogTypes.messages.selectCatalogType'));
            return;
        }
        var dialogRef = this.dialog.open(AddTypeComponent, {
            width: '500px',
            data: {
                id: id,
                typeId: this.typeId
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.SelectionChangeCatalogType(_this.typeId);
            }
        });
    };
    MaintenanceTypeComponent.prototype.confirmDelete = function (id, name) {
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
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteType(id);
            }
        });
    };
    MaintenanceTypeComponent.prototype.deleteType = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['typeId'] = this.typeId;
        params['id'] = id;
        this.apiService.delete(EEndpoints.Type, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.SelectionChangeCatalogType(_this.typeId);
                _this.toasterService.showToaster(_this.translate.instant('messages.itemDeleted'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.reponseError(err);
        });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], MaintenanceTypeComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], MaintenanceTypeComponent.prototype, "sort", void 0);
    MaintenanceTypeComponent = __decorate([
        Component({
            selector: 'app-maintenance-type',
            templateUrl: './maintenance-type.component.html',
            styleUrls: ['./maintenance-type.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            MatDialog,
            ApiService,
            TranslateService,
            ActivatedRoute,
            FuseTranslationLoaderService])
    ], MaintenanceTypeComponent);
    return MaintenanceTypeComponent;
}());
export { MaintenanceTypeComponent };
//# sourceMappingURL=maintenance-type.component.js.map