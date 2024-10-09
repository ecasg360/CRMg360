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
import { Component, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from "@services/api.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
var AddWorkAdminComponent = /** @class */ (function () {
    function AddWorkAdminComponent(dialogRef, ApiService, toasterService, translate, formBuilder, actionData) {
        this.dialogRef = dialogRef;
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.formBuilder = formBuilder;
        this.actionData = actionData;
        this.formReady = new EventEmitter();
        this.isWorking = false;
        this.editors = [];
        this.model = {};
        this.itemName = "";
        this.workId = 0;
        this.projectWorkId = 0;
        this.percentagePending = 100;
        this.action = this.translate.instant('general.save');
    }
    AddWorkAdminComponent.prototype.ngOnInit = function () {
        this.getEditors();
        this.workId = this.actionData.workId;
        this.projectWorkId = this.actionData.projectWorkId;
        this.percentagePending = this.actionData.percentagePending;
        this.itemName = this.actionData.itemName;
        this.configureComposerForm();
    };
    AddWorkAdminComponent.prototype.configureComposerForm = function () {
        this.Form = this.formBuilder.group({
            projectWorkId: [this.projectWorkId],
            workId: [this.workId],
            editorId: [0],
            percentage: [0, [Validators.required, Validators.max(this.percentagePending)]]
        });
        this.formReady.emit(this.Form);
    };
    AddWorkAdminComponent.prototype.getEditors = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.Editors).subscribe(function (response) {
            if (response.code == 100)
                console.log(response.result);
            _this.editors = response.result.map(function (m) {
                return {
                    value: m.id,
                    viewValue: m.dba,
                };
            });
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddWorkAdminComponent.prototype.save = function () {
        var _this = this;
        if (this.Form.valid) {
            this.isWorking = true;
            this.ApiService.save(EEndpoints.ProjectWorkAdmin, this.Form.value).subscribe(function (data) {
                if (data.code == 100) {
                    _this.toasterService.showToaster(_this.translate.instant('composer.messages.saved'));
                    _this.onNoClick(true);
                }
                else
                    _this.toasterService.showToaster(data.message);
                _this.isWorking = false;
            }, function (err) { return _this.responseError(err); });
        }
    };
    AddWorkAdminComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddWorkAdminComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AddWorkAdminComponent.prototype, "formReady", void 0);
    AddWorkAdminComponent = __decorate([
        Component({
            selector: 'app-add-work-admin',
            templateUrl: './add-work-admin.component.html',
            styleUrls: ['./add-work-admin.component.scss']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ApiService,
            ToasterService,
            TranslateService,
            FormBuilder, Object])
    ], AddWorkAdminComponent);
    return AddWorkAdminComponent;
}());
export { AddWorkAdminComponent };
//# sourceMappingURL=add-work-admin.component.js.map