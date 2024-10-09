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
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
var ProjectTaskCompleteComponent = /** @class */ (function () {
    function ProjectTaskCompleteComponent(translate, dialogRef, translationLoaderService, data, apiService, toaster) {
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.translationLoaderService = translationLoaderService;
        this.data = data;
        this.apiService = apiService;
        this.toaster = toaster;
        this.model = {};
        this.isWorking = false;
    }
    ProjectTaskCompleteComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.model = this.data.model;
    };
    ProjectTaskCompleteComponent.prototype.onNoClick = function (task) {
        if (task === void 0) { task = undefined; }
        this.dialogRef.close(task);
    };
    ProjectTaskCompleteComponent.prototype.setTaskData = function () {
        var params = {
            id: this.model.id,
            notes: this.model.notes
        };
        this.apiMarkComplete(params);
    };
    ProjectTaskCompleteComponent.prototype.apiMarkComplete = function (params) {
        var _this = this;
        this.apiService.save(EEndpoints.ProjectTaskComplete, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(_this.model);
                _this.toaster.showTranslate('messages.statusChanged');
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.onNoClick(undefined);
            }
        }, function (err) { return _this.toaster.showTranslate('general.errors.requestError'); });
    };
    ProjectTaskCompleteComponent = __decorate([
        Component({
            selector: 'app-project-task-complete',
            templateUrl: './project-task-complete.component.html',
            styleUrls: ['./project-task-complete.component.scss']
        }),
        __param(3, Optional()),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [TranslateService,
            MatDialogRef,
            FuseTranslationLoaderService, Object, ApiService,
            ToasterService])
    ], ProjectTaskCompleteComponent);
    return ProjectTaskCompleteComponent;
}());
export { ProjectTaskCompleteComponent };
//# sourceMappingURL=project-task-complete.component.js.map