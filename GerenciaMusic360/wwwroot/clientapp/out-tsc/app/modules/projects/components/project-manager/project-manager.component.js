var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { EEventType } from '@enums/modules-types';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import { ComponentsComunicationService } from "@services/components-comunication.service";
var ProjectManagerComponent = /** @class */ (function () {
    function ProjectManagerComponent(toaster, apiService, translate, route, router, fb, comunication, _translationLoaderService) {
        var _a;
        this.toaster = toaster;
        this.apiService = apiService;
        this.translate = translate;
        this.route = route;
        this.router = router;
        this.fb = fb;
        this.comunication = comunication;
        this._translationLoaderService = _translationLoaderService;
        this.projectTypeId = 0;
        this.projectId = 0;
        this.project = {};
        this.id = 0;
        this.isWorking = true;
        this.saveAction = false;
        this.projectContacts = [];
        this.currencies = [];
        this.taskList = [];
        this.eventType = EEventType;
        this.perm = {};
        this.perm = this.route.snapshot.data;
        (_a = this._translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    ProjectManagerComponent.prototype.ngOnInit = function () {
        this.budgetLabel = this.translate.instant('general.budget');
        this.tabBudgetLabel = this.translate.instant('general.budgetAndTravel');
        this.projectId = this.route.snapshot.params.projectId;
        this.projectTypeId = this.route.snapshot.params.projectTypeId;
        this.addProjectForm = this.fb.group({});
        if (!this.projectId) {
            this.router.navigate(['projects']);
        }
        this.getProjectApi();
    };
    Object.defineProperty(ProjectManagerComponent.prototype, "f", {
        get: function () { return this.addProjectForm.controls; },
        enumerable: false,
        configurable: true
    });
    ProjectManagerComponent.prototype.bindExternalForm = function (controlName, form) {
        this.addProjectForm = this.fb.group({});
        this.addProjectForm.setControl(controlName, form);
    };
    ProjectManagerComponent.prototype.goBack = function ($event) {
        if (window.history.state.navigationId <= 1)
            this.router.navigate(['/projects']);
        else
            window.history.back();
        return;
    };
    ProjectManagerComponent.prototype.prepareArtistProject = function (userList, projectId) {
        var artists = [];
        userList.forEach(function (value) {
            artists.push({
                projectId: projectId,
                guestArtistId: value.id
            });
        });
        return artists;
    };
    ProjectManagerComponent.prototype.downloadLabelCopy = function (projectId, name) {
        var _this = this;
        this.isWorking = true;
        this.apiService.download(EEndpoints.LabelCopyDownload, { projectId: projectId }).subscribe(function (fileData) {
            var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "Label Copy " + name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectManagerComponent.prototype._formatLabel = function () {
        if (this.projectTypeId == 5 || this.projectTypeId == 6) {
            this.budgetLabel = this.translate.instant('general.expenses');
            this.tabBudgetLabel = this.translate.instant('general.expenseAndTravel');
        }
    };
    ProjectManagerComponent.prototype.responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    ProjectManagerComponent.prototype.update = function () {
        var _this = this;
        this.isWorking = true;
        this.saveAction = true;
        var project = Object.assign({}, this.f['generalData'].value);
        var artists = (project['selectedArtist']) ? project['selectedArtist'] : [];
        delete project['artistName'];
        delete project['selectedArtist'];
        this.apiService.update(EEndpoints.Project, project).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showTranslate("messages.itemUpdated");
                if (artists.length > 0) {
                    var projectArtists = _this.prepareArtistProject(artists, response.result.id);
                    _this.deleteArtistProjectApi(projectArtists, project.id);
                }
                else
                    _this.isWorking = false;
                _this.project = response.result;
                console.log(response.result);
                _this.comunication.notifyProjectChange(response.result);
            }
            else {
                _this.toaster.showTranslate("errors.errorEditingItem");
                _this.isWorking = false;
            }
        }, function (err) { return _this.responseError(err); });
    };
    ProjectManagerComponent.prototype.saveArtistProjectApi = function (artists) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectArtists, artists).subscribe(function (response) {
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectManagerComponent.prototype.deleteArtistProjectApi = function (artists, projectId) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.ProjectArtists, { projectId: projectId }).subscribe(function (response) {
            if (response.code == 100)
                _this.saveArtistProjectApi(artists);
            else
                _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectManagerComponent.prototype.getProjectApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Project, { id: this.projectId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.project = response.result;
                _this.projectTypeId = response.result.projectTypeId;
                _this._formatLabel();
            }
            else {
                _this.toaster.showToaster(response.message);
                _this.router.navigate(['projects']);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectManagerComponent.prototype.getCurrencies = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Currencies).subscribe(function (response) {
            if (response.code == 100) {
                _this.currencies = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.code
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    ProjectManagerComponent = __decorate([
        Component({
            selector: 'app-project-manager',
            templateUrl: './project-manager.component.html',
            styleUrls: ['./project-manager.component.scss'],
            animations: fuseAnimations
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            TranslateService,
            ActivatedRoute,
            Router,
            FormBuilder,
            ComponentsComunicationService,
            FuseTranslationLoaderService])
    ], ProjectManagerComponent);
    return ProjectManagerComponent;
}());
export { ProjectManagerComponent };
//# sourceMappingURL=project-manager.component.js.map