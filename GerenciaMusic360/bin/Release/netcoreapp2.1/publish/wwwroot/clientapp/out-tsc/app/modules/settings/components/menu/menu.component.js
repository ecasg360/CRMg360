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
import { allLang } from '@app/core/i18n/allLang';
import { EEndpoints } from '@app/core/enums/endpoints';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { ActivatedRoute } from '@angular/router';
var MenuComponent = /** @class */ (function () {
    function MenuComponent(toasterService, dialog, service, translate, route, _fuseTranslationLoaderService) {
        var _a;
        this.toasterService = toasterService;
        this.dialog = dialog;
        this.service = service;
        this.translate = translate;
        this.route = route;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.displayedColumns = ['id', 'title', 'url', 'status', 'edit', 'delete'];
        this.isWorking = true;
        this.perm = {};
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.perm = this.route.snapshot.data;
    }
    MenuComponent.prototype.ngOnInit = function () {
        this.getMenus();
    };
    MenuComponent.prototype.getMenus = function () {
        var _this = this;
        this.service.get(EEndpoints.Menus).subscribe(function (response) {
            if (response.code == 100) {
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
                _this.isWorking = false;
            }
        }, function (err) { return _this.responseError(err); });
    };
    MenuComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    MenuComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    MenuComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.service.save(EEndpoints.MenuStatus, { id: id, typeId: 0, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getMenus();
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
    MenuComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        var dialogRef = this.dialog.open(AddMenuComponent, {
            width: '500px',
            data: {
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.getMenus();
            }
        });
    };
    MenuComponent.prototype.confirmDelete = function (id, name) {
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
                    _this.delete(id);
            }
        });
    };
    MenuComponent.prototype.delete = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = id;
        this.service.delete(EEndpoints.Menu, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getMenus();
                _this.toasterService.showToaster(_this.translate.instant('settings.preferences.messages.deleteSuccess'));
            }
            else {
                _this.toasterService.showToaster(data.message);
                _this.isWorking = false;
            }
        }, function (err) {
            _this.responseError(err);
        });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], MenuComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], MenuComponent.prototype, "sort", void 0);
    MenuComponent = __decorate([
        Component({
            selector: 'app-menu',
            templateUrl: './menu.component.html',
            styleUrls: ['./menu.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            MatDialog,
            ApiService,
            TranslateService,
            ActivatedRoute,
            FuseTranslationLoaderService])
    ], MenuComponent);
    return MenuComponent;
}());
export { MenuComponent };
//# sourceMappingURL=menu.component.js.map