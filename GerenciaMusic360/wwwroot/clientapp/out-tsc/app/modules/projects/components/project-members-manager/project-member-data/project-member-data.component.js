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
import { Component, Optional, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ToasterService } from '@services/toaster.service';
var ProjectMemberDataComponent = /** @class */ (function () {
    function ProjectMemberDataComponent(fb, translate, _translationLoaderService, actionData, dialogRef, toaster, apiService) {
        this.fb = fb;
        this.translate = translate;
        this._translationLoaderService = _translationLoaderService;
        this.actionData = actionData;
        this.dialogRef = dialogRef;
        this.toaster = toaster;
        this.apiService = apiService;
        this.member = {};
        this.isWorking = false;
        this.projectRolesList = [];
    }
    ProjectMemberDataComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._translationLoaderService).loadTranslations.apply(_a, allLang);
        this.member = this.actionData.user;
        this.projectRolesList = this.actionData.projectRoles;
        this.action = this.actionData.action;
        this.initForm();
    };
    //#region form
    ProjectMemberDataComponent.prototype.initForm = function () {
        if (this.member.projectRoleId == 0)
            this.member.projectRoleId = undefined;
        this.memberDataForm = this.fb.group({
            projectRol: [this.member.projectRoleId, Validators.required],
        });
    };
    Object.defineProperty(ProjectMemberDataComponent.prototype, "f", {
        get: function () { return this.memberDataForm.controls; },
        enumerable: false,
        configurable: true
    });
    //#endregion
    ProjectMemberDataComponent.prototype.addMember = function () {
        var _this = this;
        this.isWorking = true;
        this.member.projectRoleId = this.f['projectRol'].value;
        this.member.rolName = this.projectRolesList.find(function (f) { return f.value == _this.member.projectRoleId; }).viewValue;
        var params = {
            userId: this.member.id,
            projectRoleId: this.member.projectRoleId,
            projectId: this.member.projectId,
        };
        this.bindProjectMemberApi(params);
    };
    ProjectMemberDataComponent.prototype.onNoClick = function (userProject) {
        if (userProject === void 0) { userProject = undefined; }
        this.dialogRef.close(userProject);
    };
    ProjectMemberDataComponent.prototype._responseError = function (err) {
        console.log(err);
        this.isWorking = false;
    };
    //#region API
    ProjectMemberDataComponent.prototype.bindProjectMemberApi = function (params) {
        if (this.action == 'add')
            this.saveMemberApi(params);
        else
            this.updateMemberApi(params);
    };
    ProjectMemberDataComponent.prototype.saveMemberApi = function (params) {
        var _this = this;
        this.apiService.save(EEndpoints.ProjectMemberRelation, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(_this.member);
            }
            else {
                _this.onNoClick();
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProjectMemberDataComponent.prototype.updateMemberApi = function (params) {
        var _this = this;
        this.apiService.update(EEndpoints.ProjectMemberRelation, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(_this.member);
            }
            else {
                _this.onNoClick();
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProjectMemberDataComponent = __decorate([
        Component({
            selector: 'app-project-member-data',
            templateUrl: './project-member-data.component.html',
            styleUrls: ['./project-member-data.component.scss']
        }),
        __param(3, Optional()),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            TranslateService,
            FuseTranslationLoaderService, Object, MatDialogRef,
            ToasterService,
            ApiService])
    ], ProjectMemberDataComponent);
    return ProjectMemberDataComponent;
}());
export { ProjectMemberDataComponent };
//# sourceMappingURL=project-member-data.component.js.map