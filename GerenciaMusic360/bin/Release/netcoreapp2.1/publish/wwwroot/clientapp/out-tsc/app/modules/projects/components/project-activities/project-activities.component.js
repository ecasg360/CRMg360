var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ComponentsComunicationService } from '@services/components-comunication.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
var ProjectActivitiesComponent = /** @class */ (function () {
    function ProjectActivitiesComponent(toaster, apiService, translationLoader, notification) {
        this.toaster = toaster;
        this.apiService = apiService;
        this.translationLoader = translationLoader;
        this.notification = notification;
        this.isWorking = false;
        this.activitiesList = [];
        this.unsubscribeAll = new Subject();
    }
    ProjectActivitiesComponent.prototype.ngOnInit = function () {
        var _a;
        var _this = this;
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        this.notification.listenTaskChange().pipe(takeUntil(this.unsubscribeAll)).subscribe(function () {
            _this._getActivities();
        });
    };
    ProjectActivitiesComponent.prototype.ngOnChanges = function (changes) {
        if (changes.projectId.currentValue > 0) {
            this._getActivities();
        }
    };
    ProjectActivitiesComponent.prototype.ngOnDestroy = function () {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    };
    ProjectActivitiesComponent.prototype._responseError = function (err) {
        console.log(err);
        this.toaster.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    //#region API
    ProjectActivitiesComponent.prototype._getActivities = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Activities, { projectId: this.projectId })
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100)
                _this.activitiesList = response.result;
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectActivitiesComponent.prototype, "projectId", void 0);
    ProjectActivitiesComponent = __decorate([
        Component({
            selector: 'app-project-activities',
            templateUrl: './project-activities.component.html',
            styleUrls: ['./project-activities.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            FuseTranslationLoaderService,
            ComponentsComunicationService])
    ], ProjectActivitiesComponent);
    return ProjectActivitiesComponent;
}());
export { ProjectActivitiesComponent };
//# sourceMappingURL=project-activities.component.js.map