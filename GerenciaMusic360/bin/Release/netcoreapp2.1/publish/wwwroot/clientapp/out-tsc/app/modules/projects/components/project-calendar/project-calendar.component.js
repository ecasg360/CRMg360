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
import { EEventType } from '@enums/modules-types';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { allLang } from '@i18n/allLang';
var ProjectCalendarComponent = /** @class */ (function () {
    function ProjectCalendarComponent(translationLoaderService, activatedRoute, router) {
        var _this = this;
        this.translationLoaderService = translationLoaderService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.eventType = EEventType;
        this.menuProjectType = '';
        this.perm = {};
        this.perm = this.activatedRoute.snapshot.data;
        this.activatedRoute.params.subscribe(function (params) {
            _this.menuProjectType = params.projectFilter;
            if (params.projectFilter === 'label' && !_this.perm.Calendar.GetByLabel) {
                _this.router.navigateByUrl('/');
            }
            if (params.projectFilter === 'event' && !_this.perm.Calendar.GetByEvent) {
                _this.router.navigateByUrl('/');
            }
            if (params.projectFilter === 'agency' && !_this.perm.Calendar.GetByAgency) {
                _this.router.navigateByUrl('/');
            }
        });
    }
    ProjectCalendarComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    };
    ProjectCalendarComponent = __decorate([
        Component({
            selector: 'app-project-calendar',
            templateUrl: './project-calendar.component.html',
            styleUrls: ['./project-calendar.component.scss']
        }),
        __metadata("design:paramtypes", [FuseTranslationLoaderService,
            ActivatedRoute,
            Router])
    ], ProjectCalendarComponent);
    return ProjectCalendarComponent;
}());
export { ProjectCalendarComponent };
//# sourceMappingURL=project-calendar.component.js.map