var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { fuseAnimations } from '@fuse/animations';
var ProjectDetailComponent = /** @class */ (function () {
    function ProjectDetailComponent(toaster, apiService, route, router, _translationLoaderService) {
        this.toaster = toaster;
        this.apiService = apiService;
        this.route = route;
        this.router = router;
        this._translationLoaderService = _translationLoaderService;
        this.project = {};
        this.projectTaskList = [];
    }
    ProjectDetailComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._translationLoaderService).loadTranslations.apply(_a, allLang);
        this.projectId = this.route.snapshot.params.projectId;
        if (!this.projectId) {
            this.router.navigate(['projects']);
        }
        else {
            this.getProjectApi();
            this.getTaskProject();
        }
    };
    ProjectDetailComponent.prototype._responseError = function (err) {
        console.log(err);
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    ProjectDetailComponent.prototype.getProjectApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Project, { id: this.projectId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.project = response.result;
            }
            else {
                _this.toaster.showToaster(response.message);
                _this.router.navigate(['projects']);
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProjectDetailComponent.prototype.getTaskProject = function () {
        var _this = this;
        this.apiService.get(EEndpoints.ProjectTasksByProject, { projectId: this.projectId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectTaskList = response.result.map(function (m) {
                    var dateVerfication = new Date(m.estimatedDateVerfication);
                    var detail = m;
                    detail.year = dateVerfication.getFullYear();
                    detail.day = dateVerfication.getDate();
                    detail.weekDay = dateVerfication.getDay();
                    detail.month = (dateVerfication.getMonth() + 1);
                    return detail;
                });
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProjectDetailComponent = __decorate([
        Component({
            selector: 'app-project-detail',
            templateUrl: './project-detail.component.html',
            styleUrls: ['./project-detail.component.scss'],
            animations: fuseAnimations,
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            ActivatedRoute,
            Router,
            FuseTranslationLoaderService])
    ], ProjectDetailComponent);
    return ProjectDetailComponent;
}());
export { ProjectDetailComponent };
//# sourceMappingURL=project-detail.component.js.map