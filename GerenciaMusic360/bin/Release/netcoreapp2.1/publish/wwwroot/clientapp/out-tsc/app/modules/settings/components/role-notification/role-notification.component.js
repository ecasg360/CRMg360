var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { ToasterService } from "@services/toaster.service";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
import { AddRoleNotificationComponent } from './add-role-notification/add-role-notification.component';
import { allLang } from "@i18n/allLang";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from "@angular/router";
var RoleNotificationComponent = /** @class */ (function () {
    function RoleNotificationComponent(apiService, translationLoaderService, translate, toasterService, dialog, route) {
        this.apiService = apiService;
        this.translationLoaderService = translationLoaderService;
        this.translate = translate;
        this.toasterService = toasterService;
        this.dialog = dialog;
        this.route = route;
        this.displayedColumns = ['id', 'role', 'notifications', 'status', 'add'];
        this.isWorking = true;
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    RoleNotificationComponent.prototype.ngOnInit = function () {
        var _a;
        this.getRoleNotifications();
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    };
    RoleNotificationComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    RoleNotificationComponent.prototype.getRoleNotifications = function () {
        var _this = this;
        this.apiService.get(EEndpoints.RoleNotifications).subscribe(function (response) {
            if (response.code == 100) {
                _this.roleNotifications = response.result;
                _this.getRoles();
            }
            else {
                //TODO: translate
                _this.toasterService.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    RoleNotificationComponent.prototype.getRoles = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Roles).subscribe(function (response) {
            if (response.code == 100) {
                var table = response.result.map(function (s) { return ({
                    id: s.id,
                    role: s.name,
                    notifications: _this.roleNotifications.filter(function (w) { return w.roleProfileId == s.id; }),
                    status: s.statusRecordId == 1 ? true : false
                }); });
                _this.dataSource = new MatTableDataSource(table);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            else {
                //TODO: translate
                _this.toasterService.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    RoleNotificationComponent.prototype.addRoleNotification = function (id, role) {
        var _this = this;
        if (id === void 0) { id = 0; }
        var dialogRef = this.dialog.open(AddRoleNotificationComponent, {
            width: '500px',
            data: {
                id: id,
                role: role
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.getRoleNotifications();
            }
        });
    };
    RoleNotificationComponent.prototype.updateStatus = function (roleId, status) {
        var _this = this;
        var modelStatus = {
            id: roleId,
            status: status == true ? 1 : 2
        };
        this.apiService.save(EEndpoints.RoleNotificationStatus, modelStatus).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('settings.roleNotification.messages.modified'));
            }
            else {
                //TODO: translate
                _this.toasterService.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    RoleNotificationComponent.prototype.deleteNotification = function (roleId, id) {
        var _this = this;
        this.apiService.delete(EEndpoints.RoleNotification, { roleProfileId: roleId, id: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.getRoleNotifications();
                _this.toasterService.showToaster(_this.translate.instant('settings.roleNotification.messages.deleted'));
            }
            else {
                //TODO: translate
                _this.toasterService.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    RoleNotificationComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log('http error', err);
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], RoleNotificationComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], RoleNotificationComponent.prototype, "sort", void 0);
    RoleNotificationComponent = __decorate([
        Component({
            selector: 'app-role-notification',
            templateUrl: './role-notification.component.html',
            styleUrls: ['./role-notification.component.scss']
        }),
        __metadata("design:paramtypes", [ApiService,
            FuseTranslationLoaderService,
            TranslateService,
            ToasterService,
            MatDialog,
            ActivatedRoute])
    ], RoleNotificationComponent);
    return RoleNotificationComponent;
}());
export { RoleNotificationComponent };
//# sourceMappingURL=role-notification.component.js.map