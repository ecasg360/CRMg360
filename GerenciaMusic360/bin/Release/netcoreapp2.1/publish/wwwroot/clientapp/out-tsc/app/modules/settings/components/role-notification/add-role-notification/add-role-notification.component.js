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
import { Optional, Inject, Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from '@services/api.service';
import { EEndpoints } from "@enums/endpoints";
var AddRoleNotificationComponent = /** @class */ (function () {
    function AddRoleNotificationComponent(apiService, dialogRef, formBuilder, toasterService, actionData, translate) {
        this.apiService = apiService;
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this.notifications = [];
        this.role = '';
    }
    AddRoleNotificationComponent.prototype.ngOnInit = function () {
        this.configureForm();
        this.getRoleNotification();
        this.role = this.actionData.role;
    };
    Object.defineProperty(AddRoleNotificationComponent.prototype, "f", {
        get: function () { return this.addRoleNotificationForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddRoleNotificationComponent.prototype.configureForm = function () {
        this.addRoleNotificationForm = this.formBuilder.group({
            notificationIds: ['', [
                    Validators.required
                ]]
        });
    };
    AddRoleNotificationComponent.prototype.setRoleNotification = function () {
        var _this = this;
        var roleNotifications = [];
        var notifications = this.addRoleNotificationForm.value.notificationIds;
        notifications.forEach(function (item) {
            roleNotifications.push({
                notificationId: item,
                roleProfileId: _this.actionData.id
            });
        });
        this.apiService.save(EEndpoints.RoleNotifications, roleNotifications).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('settings.roleNotification.messages.saved'));
            }
            else {
                //TODO: translate
                _this.toasterService.showToaster(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddRoleNotificationComponent.prototype.getRoleNotification = function () {
        var _this = this;
        this.apiService.get(EEndpoints.RoleNotification, { roleProfileId: this.actionData.id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.getNotifications(response.result);
            }
            else {
                //TODO: translate
                _this.toasterService.showToaster(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddRoleNotificationComponent.prototype.getNotifications = function (roleNotifications) {
        var _this = this;
        this.apiService.get(EEndpoints.Notifications).subscribe(function (response) {
            if (response.code == 100) {
                response.result.forEach(function (item) {
                    var contains = roleNotifications.some(function (e) { return e.notificationId === item.id; });
                    if (!contains)
                        _this.notifications.push({
                            value: item.id,
                            viewValue: item.name
                        });
                });
            }
            else {
                //TODO: translate
                _this.toasterService.showToaster(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddRoleNotificationComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddRoleNotificationComponent.prototype.responseError = function (err) {
        console.log('http error', err);
    };
    AddRoleNotificationComponent = __decorate([
        Component({
            selector: 'app-add-role-notification',
            templateUrl: './add-role-notification.component.html'
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            MatDialogRef,
            FormBuilder,
            ToasterService, Object, TranslateService])
    ], AddRoleNotificationComponent);
    return AddRoleNotificationComponent;
}());
export { AddRoleNotificationComponent };
//# sourceMappingURL=add-role-notification.component.js.map