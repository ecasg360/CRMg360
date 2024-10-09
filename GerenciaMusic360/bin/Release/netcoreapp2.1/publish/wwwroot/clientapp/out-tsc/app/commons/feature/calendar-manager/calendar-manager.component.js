var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AccountService } from '@services/account.service';
import { endOfDay, isSameDay, isSameMonth, startOfDay } from 'date-fns';
import { allLang } from '@i18n/allLang';
import { ApiService } from '@services/api.service';
import { CalendarEventModel } from '@models/event.model';
import { Component, ViewEncapsulation, Input } from '@angular/core';
import { EEndpoints } from '@enums/endpoints';
import { environment } from '@environments/environment';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialog } from '@angular/material';
import { EProjectStatusName } from '@enums/status';
import { Subject } from 'rxjs';
import { ToasterService } from '@services/toaster.service';
import { CalendarEventFormDialogComponent } from './event-form/event-form.component';
import { EventTaskComponent } from './event-task/event-task.component';
import { EEventType } from '@enums/modules-types';
import { ActivatedRoute } from '@angular/router';
var CalendarManagerComponent = /** @class */ (function () {
    function CalendarManagerComponent(_matDialog, apiService, accountService, toaster, translationLoader, activatedRoute) {
        var _this = this;
        this._matDialog = _matDialog;
        this.apiService = apiService;
        this.accountService = accountService;
        this.toaster = toaster;
        this.translationLoader = translationLoader;
        this.activatedRoute = activatedRoute;
        this.triggetUpdate = false;
        this.create = true;
        this.menuProjectType = '';
        this.refresh = new Subject();
        this.model = {};
        this.perm = {};
        this.perm = this.activatedRoute.snapshot.data;
        console.log('this.perm: ', this.perm);
        // Set the defaults
        this.view = 'month';
        this.viewDate = new Date();
        this.activeDayIsOpen = true;
        this.selectedDay = { date: startOfDay(new Date()) };
        this.EventActions = [
            {
                label: '<i class="material-icons s-16">edit</i>',
                onClick: function (_a) {
                    var event = _a.event;
                    _this.editEvent('edit', event);
                }
            },
            {
                label: '<i class="material-icons s-16">delete</i>',
                onClick: function (_a) {
                    var event = _a.event;
                    _this.deleteEvent(event);
                }
            }
        ];
        this.EventTaskActions = [
            {
                label: '<i class="material-icons s-16">assignment</i>',
                onClick: function (_a) {
                    var event = _a.event;
                    if (event.color.primary != EProjectStatusName.completed)
                        _this.showEventTask(event);
                }
            },
        ];
        this.EventReleasesActions = [];
        if (this.perm.Calendar && this.perm.Calendar.PostReleases) {
            this.EventReleasesActions.push({
                label: '<i class="material-icons s-16">edit</i>',
                onClick: function (_a) {
                    var event = _a.event;
                    _this.editEvent('edit', event);
                }
            });
        }
        var l = localStorage.getItem(environment.lang);
        this.lang = l ? l : 'en';
        this.user = this.accountService.getLocalUserProfile();
    }
    //#region Lifecycle hooks
    CalendarManagerComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        this.manageEventRequest();
        this.events = [];
        /**
         * Watch re-render-refresh for updating db
         */
        this.refresh.subscribe(function (updateDB) {
            if (updateDB) {
                console.log(updateDB);
            }
        });
    };
    CalendarManagerComponent.prototype.ngOnChanges = function (changes) {
        if (changes.triggetUpdate) {
            var triggetUpdate = changes.triggetUpdate;
            if (!triggetUpdate.firstChange && triggetUpdate.currentValue) {
                this.triggetUpdate = false;
                this.manageEventRequest();
            }
        }
    };
    //#endregion
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    CalendarManagerComponent.prototype.manageEventRequest = function () {
        if (this.eventType == EEventType.project) {
            this._getEvents(EEndpoints.CalendarEventsByProject, { projectId: this.moduleId });
        }
        else if (this.eventType == EEventType.all) {
            this._getEvents(EEndpoints.CalendarEventsByUser, { personId: this.user.id });
        }
        else if (this.eventType == EEventType.marketing) { }
        else if (this.eventType == EEventType.menuProjectType) {
            this.manageMenuProjectRequest();
        }
        else if (this.eventType == EEventType.releases) {
            console.log('Entró a la opción de releases en calendar manager: ', this.eventType);
            this.getReleasesProjects();
        }
    };
    CalendarManagerComponent.prototype.manageMenuProjectRequest = function () {
        if (this.menuProjectType == 'label') {
            this._getEvents(EEndpoints.CalendarEventsByLabel, { userId: this.user.id });
        }
        else if (this.menuProjectType == 'event') {
            this._getEvents(EEndpoints.CalendarEventsByEvent, { userId: this.user.id });
        }
        else if (this.menuProjectType == 'agency') {
            this._getEvents(EEndpoints.CalendarEventsByAgency, { userId: this.user.id });
        }
    };
    CalendarManagerComponent.prototype.getReleasesProjects = function () {
        this._getEvents(EEndpoints.CalendarReleasesProjects, {});
    };
    CalendarManagerComponent.prototype.setEvents = function (events) {
        var _this = this;
        console.log('setEvents this.eventType.releases: ', this.eventType);
        this.events = events.map(function (item) {
            var color = _this._defineEventColor(item);
            return new CalendarEventModel({
                start: startOfDay(item.startDate),
                end: endOfDay(item.endDate),
                //title: item.title + ' | ' + item.userName,
                title: _this.eventType == EEventType.releases
                    ? item.title + " (" + item.notes + ") - " + item.artistName
                    : item.title,
                allDay: (item.allDay > 0),
                color: {
                    primary: color,
                    secondary: color
                },
                resizable: {
                    beforeStart: false,
                    afterEnd: true
                },
                draggable: true,
                meta: {
                    dbId: item.id,
                    location: item.location,
                    notes: item.notes,
                    pictureUrl: item.pictureUrl,
                    projectTaskId: item.projectTaskId,
                    completed: (item.checked == 1),
                },
                actions: _this.eventType === EEventType.releases
                    ? _this.EventReleasesActions
                    : (item.projectTaskId)
                        ? _this.EventTaskActions
                        : _this.EventActions,
            });
        });
    };
    CalendarManagerComponent.prototype.beforeMonthViewRender = function (_a) {
        var _this = this;
        var header = _a.header, body = _a.body;
        /**
         * Get the selected day
         */
        var _selectedDay = body.find(function (_day) {
            return _day.date.getTime() === _this.selectedDay.date.getTime();
        });
        if (_selectedDay) {
            /**
             * Set selected day style
             * @type {string}
             */
            _selectedDay.cssClass = 'cal-selected';
        }
    };
    CalendarManagerComponent.prototype.dayClicked = function (day) {
        var date = day.date;
        var events = day.events;
        if (isSameMonth(date, this.viewDate)) {
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;
            }
            else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
        this.selectedDay = day;
        this.refresh.next();
    };
    /**
     * Event times changed
     * Event dropped or resized
     *
     * @param {CalendarEvent} event
     * @param {Date} newStart
     * @param {Date} newEnd
     */
    CalendarManagerComponent.prototype.eventTimesChanged = function (_a) {
        var event = _a.event, newStart = _a.newStart, newEnd = _a.newEnd;
        event.start = newStart;
        event.end = newEnd;
        // console.warn('Dropped or resized', event);
        this.refresh.next(true);
    };
    CalendarManagerComponent.prototype.deleteEvent = function (event) {
        var _this = this;
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.deleteEventApi(event);
            }
            _this.confirmDialogRef = null;
        });
    };
    /**
     * Edit Event
     *
     * @param {string} action
     * @param {CalendarEvent} event
     */
    CalendarManagerComponent.prototype.editEvent = function (action, event) {
        var _this = this;
        var eventIndex = this.events.indexOf(event);
        if (this.eventType == EEventType.releases) {
            var title = event.title.split('(');
            console.log('title split: ', title);
            event.title = title[0];
        }
        console.log('antes de abrir event-form-dialog action: ', action);
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                event: event,
                action: action,
                isProjectRelease: this.perm.Calendar.PostReleases ? true : false
            }
        });
        this.dialogRef.afterClosed().subscribe(function (response) {
            if (!response) {
                return;
            }
            var actionType = response[0];
            var formData = response[1];
            switch (actionType) {
                case 'save':
                    _this.updateEventApi(formData.getRawValue(), eventIndex);
                    break;
                case 'delete':
                    _this.deleteEvent(event);
                    break;
            }
        });
    };
    CalendarManagerComponent.prototype.showEventTask = function (event) {
        var _this = this;
        var eventIndex = this.events.indexOf(event);
        this.dialogRef = this._matDialog.open(EventTaskComponent, {
            panelClass: 'event-form-dialog',
            width: '600px',
            data: {
                event: event,
            }
        });
        this.dialogRef.afterClosed().subscribe(function (response) {
            if (!response) {
                return;
            }
            _this.events[eventIndex] = Object.assign(_this.events[eventIndex], response);
            _this.refresh.next(true);
        });
    };
    CalendarManagerComponent.prototype.addEvent = function () {
        var _this = this;
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                action: 'new',
                date: this.selectedDay.date
            }
        });
        this.dialogRef.afterClosed().subscribe(function (response) {
            if (!response) {
                return;
            }
            var newEvent = response.getRawValue();
            newEvent.actions = _this.EventActions;
            _this.saveEventApi(newEvent);
        });
    };
    //#region API
    CalendarManagerComponent.prototype.saveEventApi = function (data) {
        var _this = this;
        var params = this._prepareDataApi(data);
        delete params.id;
        this.apiService.save(EEndpoints.CalendarEvent, params).subscribe(function (response) {
            if (response.code == 100) {
                data.meta.dbId = response.result.id;
                _this.events.push(data);
                _this.refresh.next(true);
            }
            else {
                _this.toaster.showTranslate('errors.savingItem');
            }
        }, function (err) { return _this._responseError(err); });
    };
    CalendarManagerComponent.prototype.updateEventApi = function (data, eventIndex) {
        var _this = this;
        var params = this._prepareDataApi(data);
        if (this.perm.Calendar.PostReleases) {
            this.apiService.update(EEndpoints.CalendarEvent, params).subscribe(function (response) {
                if (response.code == 100) {
                    _this.events[eventIndex] = Object.assign(_this.events[eventIndex], data);
                    _this.refresh.next(true);
                    if (_this.perm.Calendar.PostReleases) {
                        _this.manageEventRequest();
                    }
                }
                else {
                    _this.toaster.showTranslate('errors.error.updatingItem');
                }
            }, function (err) { return _this._responseError(err); });
        }
    };
    CalendarManagerComponent.prototype.deleteEventApi = function (event) {
        var _this = this;
        this.apiService.delete(EEndpoints.CalendarEvent, { id: event.meta.dbId }).subscribe(function (response) {
            if (response.code == 100) {
                var eventIndex = _this.events.indexOf(event);
                _this.events.splice(eventIndex, 1);
                _this.refresh.next(true);
            }
            else {
                _this.toaster.showTranslate('errors.errorDeletingItem');
            }
        }, function (err) { return _this._responseError(err); });
    };
    CalendarManagerComponent.prototype._getEvents = function (route, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        this.apiService.get(route, params).subscribe(function (response) {
            console.log('response de _getEvents: ', response);
            if (response.code == 100) {
                _this.setEvents(response.result);
            }
            else {
                _this.toaster.showTranslate('errors.errorGettingEvents');
            }
        }, function (err) { return _this._responseError(err); });
    };
    //#endregion
    CalendarManagerComponent.prototype._prepareDataApi = function (data) {
        var model = {};
        model.allDay = data.allDay ? 1 : 0;
        model.checked = data.meta.completed;
        model.endDate = data.end.toISOString();
        model.endDateString = data.end.toISOString();
        model.location = data.meta.location;
        model.notes = data.meta.notes;
        model.personId = 0;
        model.pictureUrl = data.meta.pictureUrl;
        model.startDate = data.start.toISOString();
        model.startDateString = data.start.toISOString();
        model.title = data.title;
        model.id = data.meta.dbId;
        model.isProjectRelease = this.perm.Calendar.PostReleases ? true : false;
        return model;
    };
    CalendarManagerComponent.prototype._defineEventColor = function (event) {
        var endDate = new Date(event.endDate);
        var current = new Date();
        current.setHours(0, 0, 0, 0);
        event.projectTaskId = (!event.projectTaskId) ? 0 : event.projectTaskId;
        var endDateTime = endDate.getTime();
        var currentTime = current.getTime();
        if ((endDateTime > currentTime) && event.projectTaskId > 0) {
            return (event.checked) ? EProjectStatusName.completed : EProjectStatusName.waiting;
        }
        else if ((endDateTime == currentTime) && event.projectTaskId > 0) {
            return (event.checked) ? EProjectStatusName.completed : EProjectStatusName.inProgress;
        }
        else if ((endDateTime < currentTime) && event.projectTaskId > 0) {
            return (event.checked) ? EProjectStatusName.completed : EProjectStatusName.canceled;
        }
        else if (endDateTime > currentTime)
            return EProjectStatusName.waiting;
        else if (endDateTime < currentTime)
            return EProjectStatusName.canceled;
        else
            return EProjectStatusName.default;
    };
    CalendarManagerComponent.prototype._responseError = function (err) {
        console.log(err);
        this.toaster.showTranslate('general.errors.serverError');
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarManagerComponent.prototype, "moduleId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], CalendarManagerComponent.prototype, "triggetUpdate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], CalendarManagerComponent.prototype, "create", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarManagerComponent.prototype, "eventType", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CalendarManagerComponent.prototype, "menuProjectType", void 0);
    CalendarManagerComponent = __decorate([
        Component({
            selector: 'app-calendar-manager',
            templateUrl: './calendar-manager.component.html',
            styleUrls: ['./calendar-manager.component.scss'],
            encapsulation: ViewEncapsulation.None,
            animations: fuseAnimations,
        }),
        __metadata("design:paramtypes", [MatDialog,
            ApiService,
            AccountService,
            ToasterService,
            FuseTranslationLoaderService,
            ActivatedRoute])
    ], CalendarManagerComponent);
    return CalendarManagerComponent;
}());
export { CalendarManagerComponent };
//# sourceMappingURL=calendar-manager.component.js.map