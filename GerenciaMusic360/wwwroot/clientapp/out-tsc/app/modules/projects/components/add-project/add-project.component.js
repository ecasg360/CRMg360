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
import { allLang } from '@i18n/allLang';
import { ApiService } from '@services/api.service';
import { Component, Inject, Optional } from '@angular/core';
import { EEndpoints } from '@enums/endpoints';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, } from '@angular/forms';
var AddProjectComponent = /** @class */ (function () {
    function AddProjectComponent(fb, apiService, toaster, translate, dialogRef, data, translationLoaderService) {
        this.fb = fb;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.data = data;
        this.translationLoaderService = translationLoaderService;
        this.projectId = 0;
        this.projectType = 0;
        this.projectTypeDesc = "";
        this.isWorking = false;
        this.moduleFilter = '';
    }
    AddProjectComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.projectForm = this.fb.group({});
        this.projectId = this.data.projectId;
        this.projectType = this.data.projectType;
        this.projectTypeDesc = this.data.projectTypeDesc;
        if (this.data.moduleType != undefined) {
            this.moduleFilter = this.data.moduleType;
        }
    };
    Object.defineProperty(AddProjectComponent.prototype, "f", {
        //#region form
        get: function () { return this.projectForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddProjectComponent.prototype.bindExternalForm = function (controlName, form) {
        this.projectForm.setControl(controlName, form);
    };
    //#endregion
    AddProjectComponent.prototype.saveProject = function () {
        var project = this.f['generalData'].value;
        var artists = (project['selectedArtist']) ? project['selectedArtist'] : [];
        delete project.id;
        delete project['artistName'];
        delete project['selectedArtist'];
        this.saveProjectApi(project, artists);
    };
    AddProjectComponent.prototype.onNoClick = function (project) {
        if (project === void 0) { project = undefined; }
        this.dialogRef.close(project);
    };
    AddProjectComponent.prototype.prepareArtistProject = function (userList, projectId) {
        var artists = [];
        userList.forEach(function (value) {
            artists.push({
                projectId: projectId,
                guestArtistId: value.id
            });
        });
        return artists;
    };
    AddProjectComponent.prototype.receiveProjectType = function ($event) {
        this.projectTypeDesc = $event;
    };
    AddProjectComponent.prototype.responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    AddProjectComponent.prototype.saveProjectApi = function (project, userList) {
        var _this = this;
        if (userList === void 0) { userList = []; }
        this.isWorking = true;
        this.apiService.save(EEndpoints.Project, project).subscribe(function (response) {
            if (response.code == 100) {
                if (userList.length > 0) {
                    var projectArtists = _this.prepareArtistProject(userList, response.result.id);
                    _this.saveArtistProjectApi(projectArtists, response.result);
                }
                else
                    _this.onNoClick(response.result);
            }
            else {
                _this.toaster.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectComponent.prototype.saveArtistProjectApi = function (artists, project) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectArtists, artists).subscribe(function (response) {
            _this.onNoClick(project);
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectComponent = __decorate([
        Component({
            selector: 'app-add-project',
            templateUrl: './add-project.component.html',
            styleUrls: ['./add-project.component.scss']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            ApiService,
            ToasterService,
            TranslateService,
            MatDialogRef, Object, FuseTranslationLoaderService])
    ], AddProjectComponent);
    return AddProjectComponent;
}());
export { AddProjectComponent };
//# sourceMappingURL=add-project.component.js.map