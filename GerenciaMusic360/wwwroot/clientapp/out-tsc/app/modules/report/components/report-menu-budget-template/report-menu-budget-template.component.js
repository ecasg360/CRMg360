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
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ProjectArtistEventComponent } from '@shared/components/project-artist-event/project-artist-event.component';
var ReportMenuBudgetTemplateComponent = /** @class */ (function () {
    function ReportMenuBudgetTemplateComponent(toaster, dialog, router, route, translate, translationLoader) {
        this.toaster = toaster;
        this.dialog = dialog;
        this.router = router;
        this.route = route;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.projectTypeId = 0;
        this.isWorking = true;
        this.perm = {};
        this.perm = this.route.snapshot.data;
        if (!this.perm.Report.ReportBudgetTemplate)
            this.router.navigate(["/"]);
    }
    ReportMenuBudgetTemplateComponent.prototype.ngOnInit = function () {
        // this.projectTypeId = (this.route.snapshot.params['projectType'])
        //   ? parseInt(this.route.snapshot.params['projectType'])
        //   : 0;
        // this.translationLoader.loadTranslations(...allLang);
        // if (this.projectTypeId == NaN || this.projectTypeId == undefined || this.projectTypeId <= 0)
        //   this.router.navigate(['/projects']);
    };
    ReportMenuBudgetTemplateComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () { return _this.openModal(); }, 2000);
    };
    ReportMenuBudgetTemplateComponent.prototype.openModal = function () {
        var _this = this;
        var dialogRef = this.dialog.open(ProjectArtistEventComponent, {
            width: '700px',
            data: {
                artistId: 0,
                projectTypeId: 6,
                projectId: 0,
            }
        });
        this.isWorking = false;
        dialogRef.afterClosed().subscribe(function (result) {
            if (result != undefined) {
                _this.router.navigate(['/']);
            }
            else {
                _this.router.navigate(['/']);
            }
        });
    };
    ReportMenuBudgetTemplateComponent = __decorate([
        Component({
            selector: 'app-report-menu-budget-template',
            templateUrl: './report-menu-budget-template.component.html',
            styleUrls: ['./report-menu-budget-template.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            MatDialog,
            Router,
            ActivatedRoute,
            TranslateService,
            FuseTranslationLoaderService])
    ], ReportMenuBudgetTemplateComponent);
    return ReportMenuBudgetTemplateComponent;
}());
export { ReportMenuBudgetTemplateComponent };
//# sourceMappingURL=report-menu-budget-template.component.js.map