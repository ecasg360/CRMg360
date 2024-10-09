var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, Input } from "@angular/core";
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@app/core/enums/endpoints";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { AddBuyerComponent } from "./add-buyer/add-buyer.component";
var ProjectBuyerComponent = /** @class */ (function () {
    function ProjectBuyerComponent(toasterService, service, dialog, router, translate, activatedRoute, _fuseTranslationLoaderService) {
        var _this = this;
        this.toasterService = toasterService;
        this.service = service;
        this.dialog = dialog;
        this.router = router;
        this.translate = translate;
        this.activatedRoute = activatedRoute;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.displayedColumns = ['personcompany', 'type', 'action'];
        this.isDataAvailable = false;
        this.isWorking = true;
        this.projectId = 0;
        this.perm = {};
        this.activatedRoute.data.subscribe(function (data) {
            _this.permisions = data;
        });
    }
    ProjectBuyerComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.getProjectBuyers();
    };
    ProjectBuyerComponent.prototype.getProjectBuyers = function () {
        var _this = this;
        this.isWorking = false;
        this.dataSource = undefined;
        var params = [];
        params['projectId'] = this.projectId;
        this.service.get(EEndpoints.ProjectBuyers, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.isDataAvailable = (response.result.length > 0);
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectBuyerComponent.prototype.addData = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        var dialogRef = this.dialog.open(AddBuyerComponent, {
            width: '500px',
            data: {
                id: id,
                projectId: this.projectId
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getProjectBuyers();
        });
    };
    ProjectBuyerComponent.prototype.confirmDelete = function (id, name, company) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: '' }),
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
    ProjectBuyerComponent.prototype.deleteType = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = id;
        this.service.delete(EEndpoints.ProjectType, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getProjectBuyers();
                _this.toasterService.showToaster(_this.translate.instant('settings.catalogTypes.messages.deleteSuccess'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    ProjectBuyerComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.service.save(EEndpoints.CurrencyStatus, { id: id, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getProjectBuyers();
                _this.toasterService.showToaster(_this.translate.instant('settings.preferences.messages.statusChanged'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    ProjectBuyerComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    ProjectBuyerComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], ProjectBuyerComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], ProjectBuyerComponent.prototype, "sort", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectBuyerComponent.prototype, "projectId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectBuyerComponent.prototype, "perm", void 0);
    ProjectBuyerComponent = __decorate([
        Component({
            selector: 'app-project-buyer',
            templateUrl: './project-buyer.component.html',
            styleUrls: ['./project-buyer.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            Router,
            TranslateService,
            ActivatedRoute,
            FuseTranslationLoaderService])
    ], ProjectBuyerComponent);
    return ProjectBuyerComponent;
}());
export { ProjectBuyerComponent };
//# sourceMappingURL=project-buyer.component.js.map