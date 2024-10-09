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
import { Component, Input, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
var ProjectDetailComponent = /** @class */ (function () {
    function ProjectDetailComponent(actionData, ApiService, toasterService, translate, dialogRef) {
        this.actionData = actionData;
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.projectId = 0;
        this.project = {};
        this.isWorking = false;
    }
    ProjectDetailComponent.prototype.ngOnInit = function () {
        this.projectId = this.actionData.projectId;
        if (this.projectId > 0) {
            this.getProjectDetail();
        }
    };
    ProjectDetailComponent.prototype.getProjectDetail = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.Project, { id: this.projectId }).subscribe(function (response) {
            console.log(response);
            if (response.code == 100) {
                _this.project = response.result;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectDetailComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    ProjectDetailComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectDetailComponent.prototype, "projectId", void 0);
    ProjectDetailComponent = __decorate([
        Component({
            selector: 'app-project-detail',
            templateUrl: './project-detail.component.html',
            styleUrls: ['./project-detail.component.css']
        }),
        __param(0, Optional()),
        __param(0, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, ApiService,
            ToasterService,
            TranslateService,
            MatDialogRef])
    ], ProjectDetailComponent);
    return ProjectDetailComponent;
}());
export { ProjectDetailComponent };
//# sourceMappingURL=project-detail.component.js.map