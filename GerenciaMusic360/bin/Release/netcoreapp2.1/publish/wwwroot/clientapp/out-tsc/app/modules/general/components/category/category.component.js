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
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ActivatedRoute } from '@angular/router';
var CategoryComponent = /** @class */ (function () {
    function CategoryComponent(toasterService, service, dialog, translate, route, translationLoaderService) {
        this.toasterService = toasterService;
        this.service = service;
        this.dialog = dialog;
        this.translate = translate;
        this.route = route;
        this.translationLoaderService = translationLoaderService;
        this.displayedColumns = ['name', 'description', 'module', 'status', 'action'];
        this.isDataAvailable = false;
        this.isWorking = true;
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    CategoryComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.getCategories();
    };
    CategoryComponent.prototype.getCategories = function () {
        var _this = this;
        this.isWorking = false;
        this.dataSource = undefined;
        this.service.get(EEndpoints.Categories)
            .subscribe(function (response) {
            if (response.code == 100) {
                if (response.result.length > 0) {
                    _this.isDataAvailable = (response.result.length > 0);
                    _this.dataSource = new MatTableDataSource(response.result);
                    _this.dataSource.paginator = _this.paginator;
                    _this.dataSource.sort = _this.sort;
                }
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    CategoryComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        var dialogRef = this.dialog.open(AddCategoryComponent, {
            width: '600px',
            data: {
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result)
                _this.getCategories();
        });
    };
    CategoryComponent.prototype.confirmDelete = function (id, name) {
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
    CategoryComponent.prototype.deleteType = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = id;
        this.service.delete(EEndpoints.Category, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getCategories();
                _this.toasterService.showToaster(_this.translate.instant('messages.itemDeleted'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    CategoryComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.service.save(EEndpoints.CategoryStatus, { id: id, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getCategories();
                _this.toasterService.showToaster(_this.translate.instant('messages.changeStatusSuccess'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    CategoryComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    CategoryComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], CategoryComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], CategoryComponent.prototype, "sort", void 0);
    CategoryComponent = __decorate([
        Component({
            selector: 'app-category',
            templateUrl: './category.component.html',
            styleUrls: ['./category.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            ActivatedRoute,
            FuseTranslationLoaderService])
    ], CategoryComponent);
    return CategoryComponent;
}());
export { CategoryComponent };
//# sourceMappingURL=category.component.js.map