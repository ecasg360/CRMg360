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
import { Component, Input, Optional, Inject } from '@angular/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
var ProjectArtistEventComponent = /** @class */ (function () {
    function ProjectArtistEventComponent(dialogRef, ApiService, toasterService, translate, actionData) {
        this.dialogRef = dialogRef;
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.actionData = actionData;
        this.budgetEventList = [];
        this.eventsSelect = [];
        this.isWorking = false;
        this.showList = false;
        this.artistList = [];
    }
    ProjectArtistEventComponent.prototype.ngOnInit = function () {
        this.artistId = this.actionData.artistId;
        this.projectTypeId = this.actionData.projectTypeId;
        this.projectId = this.actionData.projectId;
        if (this.artistId > 0) {
            this.getEventsByArtist(this.artistId, this.projectTypeId, this.projectId);
        }
        else {
            this.showList = true;
            this.getArtists();
        }
    };
    ProjectArtistEventComponent.prototype.getArtists = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.Artists).subscribe(function (response) {
            if (response.code == 100) {
                _this.artistList = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectArtistEventComponent.prototype.onSelectedEvents = function (selectArtist) {
        this.artistId = selectArtist.value;
        this.getEventsByArtist(this.artistId, this.projectTypeId, this.projectId);
    };
    ProjectArtistEventComponent.prototype.getEventsByArtist = function (artistId, projectTypeId, projectId) {
        var _this = this;
        this.isWorking = true;
        var params = { artistId: artistId, projectTypeId: projectTypeId, projectId: projectId };
        this.ApiService.get(EEndpoints.EventsByArtist, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.budgetEventList = response.result;
                _this.eventsSelect = response.result.map(function (m) {
                    return {
                        checked: false,
                        event: m
                    };
                });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectArtistEventComponent.prototype.checkedEvent = function (event, events) {
        events.checked = event.checked;
        console.log(events);
    };
    ProjectArtistEventComponent.prototype.downloadReportBudget = function () {
        var _this = this;
        var events = this.eventsSelect.filter(function (event) { return event.checked == true; }).map(function (event) { return event.event; });
        console.log(events);
        if (events.length > 0) {
            this.isWorking = true;
            var eventsJSON = JSON.stringify(events);
            var params = { eventsJSON: eventsJSON };
            this.ApiService.download(EEndpoints.ReportEventsArtist, params).subscribe(function (fileData) {
                var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "Project Budget Template");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                _this.isWorking = false;
            }, function (err) { return _this.responseError(err); });
        }
        else {
            this.toasterService.showToaster(this.translate.instant('eventsArtist.messages.selectEvent'));
            this.isWorking = false;
        }
    };
    ProjectArtistEventComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    ProjectArtistEventComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectArtistEventComponent.prototype, "artistId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectArtistEventComponent.prototype, "projectId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectArtistEventComponent.prototype, "projectTypeId", void 0);
    ProjectArtistEventComponent = __decorate([
        Component({
            selector: 'app-project-artist-event',
            templateUrl: './project-artist-event.component.html',
            styleUrls: ['./project-artist-event.component.css']
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ApiService,
            ToasterService,
            TranslateService, Object])
    ], ProjectArtistEventComponent);
    return ProjectArtistEventComponent;
}());
export { ProjectArtistEventComponent };
//# sourceMappingURL=project-artist-event.component.js.map