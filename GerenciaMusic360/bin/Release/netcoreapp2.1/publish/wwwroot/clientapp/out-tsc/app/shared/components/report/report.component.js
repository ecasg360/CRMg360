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
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { EReportType } from '@enums/report-type';
import { ProjectArtistEventComponent } from '../project-artist-event/project-artist-event.component';
import { MatDialog } from '@angular/material';
var ReportComponent = /** @class */ (function () {
    function ReportComponent(dialog, apiService, toasterService, translate) {
        this.dialog = dialog;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.projectTypeId = 0;
        this.artistId = 0;
        this.projectId = 0;
        this.isWorking = false;
        this.reportTypeEnum = EReportType;
    }
    ReportComponent.prototype.ngOnInit = function () {
    };
    ReportComponent.prototype.showModalEvent = function (projectTypeId, artistId, projectId) {
        var dialogRef = this.dialog.open(ProjectArtistEventComponent, {
            width: '700px',
            data: {
                projectTypeId: projectTypeId,
                artistId: artistId,
                projectId: projectId,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                console.log('accepted');
            }
            else {
                console.log('refused');
            }
        });
    };
    ReportComponent.prototype._responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ReportComponent.prototype, "projectTypeId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ReportComponent.prototype, "artistId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ReportComponent.prototype, "projectId", void 0);
    ReportComponent = __decorate([
        Component({
            selector: 'app-report',
            templateUrl: './report.component.html',
            styleUrls: ['./report.component.css']
        }),
        __metadata("design:paramtypes", [MatDialog,
            ApiService,
            ToasterService,
            TranslateService])
    ], ReportComponent);
    return ReportComponent;
}());
export { ReportComponent };
//# sourceMappingURL=report.component.js.map