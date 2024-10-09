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
import { AddProjectComponent } from '../add-project/add-project.component';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
var ProjectAddMenuComponent = /** @class */ (function () {
    function ProjectAddMenuComponent(toaster, dialog, router, route, translate, translationLoader) {
        this.toaster = toaster;
        this.dialog = dialog;
        this.router = router;
        this.route = route;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.projectTypeId = 0;
        this.isWorking = true;
    }
    ProjectAddMenuComponent.prototype.ngOnInit = function () {
        var _a;
        this.projectTypeId = (this.route.snapshot.params['projectType'])
            ? parseInt(this.route.snapshot.params['projectType'])
            : 0;
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        if (this.projectTypeId == NaN || this.projectTypeId == undefined || this.projectTypeId <= 0)
            this.router.navigate(['/projects']);
    };
    ProjectAddMenuComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () { return _this.openModal(); }, 2000);
    };
    ProjectAddMenuComponent.prototype.openModal = function () {
        var _this = this;
        var dialogRef = this.dialog.open(AddProjectComponent, {
            width: '700px',
            data: {
                projectId: 0,
                projectType: this.projectTypeId
            }
        });
        this.isWorking = false;
        dialogRef.afterClosed().subscribe(function (result) {
            if (result != undefined) {
                _this.toaster.showToaster(_this.translate.instant('messages.projectSaved'));
                _this.router.navigate(['/projects/manage/', result.id]);
            }
            else {
                //this.toaster.showToaster(this.translate.instant('errors.savedProjectError'));
                _this.router.navigate(['/projects']);
            }
        });
    };
    ProjectAddMenuComponent = __decorate([
        Component({
            selector: 'app-project-add-menu',
            templateUrl: './project-add-menu.component.html',
            styleUrls: ['./project-add-menu.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            MatDialog,
            Router,
            ActivatedRoute,
            TranslateService,
            FuseTranslationLoaderService])
    ], ProjectAddMenuComponent);
    return ProjectAddMenuComponent;
}());
export { ProjectAddMenuComponent };
//# sourceMappingURL=project-add-menu.component.js.map