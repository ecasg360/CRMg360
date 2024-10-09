import { AccountService } from '@services/account.service';
import {
  endOfDay,
  isSameDay,
  isSameMonth,
  startOfDay,
  subDays
} from 'date-fns';
import { allLang } from '@i18n/allLang';
import { ApiService } from '@services/api.service';
import { Calendar } from '@models/Calendar';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay
} from 'angular-calendar';

import { CalendarEventModel } from '@models/event.model';
import { Component, OnInit, ViewEncapsulation, Input, OnChanges } from '@angular/core';
import { EEndpoints } from '@enums/endpoints';
import { environment } from '@environments/environment';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EProjectStatusName } from '@enums/status';
import { ResponseApi } from '@models/response-api';
import { Subject } from 'rxjs';
import { ToasterService } from '@services/toaster.service';
import { CalendarEventFormDialogComponent } from './event-form/event-form.component';
import { EventTaskComponent } from './event-task/event-task.component';
import { EEventType } from '@enums/modules-types';
import { IUser } from '@models/user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calendar-manager',
  templateUrl: './calendar-manager.component.html',
  styleUrls: ['./calendar-manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})

export class CalendarManagerComponent implements OnInit, OnChanges {

  @Input() moduleId: number;
  @Input() triggetUpdate: boolean = false;
  @Input() create: boolean = true;
  @Input() eventType: EEventType;
  @Input() menuProjectType: string = '';

  EventActions: CalendarEventAction[];
  EventTaskActions: CalendarEventAction[];
  activeDayIsOpen: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogRef: any;
  events: CalendarEvent[];
  refresh: Subject<any> = new Subject();
  selectedDay: any;
  view: string;
  viewDate: Date;
  model: Calendar = <Calendar>{};
  lang: string;
  user: IUser;
  EventReleasesActions: CalendarEventAction[];
  perm: any = {};

  constructor(
    private _matDialog: MatDialog,
    private apiService: ApiService,
    private accountService: AccountService,
    private toaster: ToasterService,
    private translationLoader: FuseTranslationLoaderService,
    private activatedRoute: ActivatedRoute,
  ) {
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
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.editEvent('edit', event);
        }
      },
      {
        label: '<i class="material-icons s-16">delete</i>',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.deleteEvent(event);
        }
      }
    ];

    this.EventTaskActions = [
      {
        label: '<i class="material-icons s-16">assignment</i>',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          if (event.color.primary != EProjectStatusName.completed)
            this.showEventTask(event);
        }
      },
    ];

    this.EventReleasesActions = [];

    if (this.perm.Calendar && this.perm.Calendar.PostReleases) {
      this.EventReleasesActions.push(
        {
          label: '<i class="material-icons s-16">edit</i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.editEvent('edit', event);
          }
        }
      );
    }

    const l = localStorage.getItem(environment.lang);
    this.lang = l ? l : 'en';

    this.user = this.accountService.getLocalUserProfile();
  }


  //#region Lifecycle hooks

  ngOnInit(): void {
    this.translationLoader.loadTranslations(...allLang);
    this.manageEventRequest();
    this.events = [];
    /**
     * Watch re-render-refresh for updating db
     */
    this.refresh.subscribe(updateDB => {
      if (updateDB) {
        console.log(updateDB);
      }
    });
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.triggetUpdate) {
      const triggetUpdate = changes.triggetUpdate;
      if (!triggetUpdate.firstChange && triggetUpdate.currentValue) {
        this.triggetUpdate = false;
        this.manageEventRequest();
      }
    }
  }

  //#endregion

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  manageEventRequest() {
    if (this.eventType == EEventType.project) {
      this._getEvents(EEndpoints.CalendarEventsByProject, { projectId: this.moduleId });
    } else if (this.eventType == EEventType.all) {
      this._getEvents(EEndpoints.CalendarEventsByUser, { personId: this.user.id });
    } else if (this.eventType == EEventType.marketing) { }
    else if (this.eventType == EEventType.menuProjectType) {
      this.manageMenuProjectRequest();
    } else if (this.eventType == EEventType.releases) {
      console.log('Entró a la opción de releases en calendar manager: ', this.eventType);
      this.getReleasesProjects();
    }
  }

  manageMenuProjectRequest() {
    if (this.menuProjectType == 'label') {
      this._getEvents(EEndpoints.CalendarEventsByLabel, { userId: this.user.id });
    } else if (this.menuProjectType == 'event') {
      this._getEvents(EEndpoints.CalendarEventsByEvent, { userId: this.user.id });
    } else if (this.menuProjectType == 'agency') {
      this._getEvents(EEndpoints.CalendarEventsByAgency, { userId: this.user.id });
    }
  }

  getReleasesProjects() {
    this._getEvents(EEndpoints.CalendarReleasesProjects, {});
  }

  setEvents(events: Calendar[]): void {
    console.log('setEvents this.eventType.releases: ', this.eventType);
    this.events = events.map(item => {
      const color = this._defineEventColor(item);
      return new CalendarEventModel({
        start: startOfDay(item.startDate),
        end: endOfDay(item.endDate),
        //title: item.title + ' | ' + item.userName,
        title: this.eventType == EEventType.releases
          ? `${item.title} (${item.notes}) - ${item.artistName}`
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
        actions: this.eventType === EEventType.releases
          ? this.EventReleasesActions
          : (item.projectTaskId)
            ? this.EventTaskActions
            : this.EventActions,
      });
    });
  }

  beforeMonthViewRender({ header, body }): void {
    /**
     * Get the selected day
     */
    const _selectedDay = body.find((_day) => {
      return _day.date.getTime() === this.selectedDay.date.getTime();
    });

    if (_selectedDay) {
      /**
       * Set selected day style
       * @type {string}
       */
      _selectedDay.cssClass = 'cal-selected';
    }

  }

  dayClicked(day: CalendarMonthViewDay): void {
    const date: Date = day.date;
    const events: CalendarEvent[] = day.events;

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
  }

  /**
   * Event times changed
   * Event dropped or resized
   *
   * @param {CalendarEvent} event
   * @param {Date} newStart
   * @param {Date} newEnd
   */
  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    // console.warn('Dropped or resized', event);
    this.refresh.next(true);
  }

  deleteEvent(event): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteEventApi(event);
      }
      this.confirmDialogRef = null;
    });

  }

  /**
   * Edit Event
   *
   * @param {string} action
   * @param {CalendarEvent} event
   */
  editEvent(action: string, event: CalendarEvent): void {
    const eventIndex = this.events.indexOf(event);
    if (this.eventType == EEventType.releases) {
      let title = event.title.split('(');
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

    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const actionType: string = response[0];
      const formData: FormGroup = response[1];
      switch (actionType) {
        case 'save':
          this.updateEventApi(formData.getRawValue(), eventIndex);
          break;
        case 'delete':
          this.deleteEvent(event);
          break;
      }
    });
  }

  showEventTask(event: CalendarEvent): void {
    const eventIndex = this.events.indexOf(event);
    this.dialogRef = this._matDialog.open(EventTaskComponent, {
      panelClass: 'event-form-dialog',
      width: '600px',
      data: {
        event: event,
      }
    });

    this.dialogRef.afterClosed().subscribe((response: CalendarEvent) => {
      if (!response) {
        return;
      }
      this.events[eventIndex] = Object.assign(this.events[eventIndex], response);
      this.refresh.next(true);
    });
  }

  addEvent(): void {
    this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
      panelClass: 'event-form-dialog',
      data: {
        action: 'new',
        date: this.selectedDay.date
      }
    });
    this.dialogRef.afterClosed().subscribe(
      (response: FormGroup) => {
        if (!response) {
          return;
        }
        const newEvent = response.getRawValue();
        newEvent.actions = this.EventActions;
        this.saveEventApi(newEvent);
      });
  }

  //#region API
  saveEventApi(data: CalendarEvent) {
    let params = this._prepareDataApi(data);
    delete params.id;
    this.apiService.save(EEndpoints.CalendarEvent, params).subscribe(
      (response: ResponseApi<Calendar>) => {
        if (response.code == 100) {
          data.meta.dbId = response.result.id;
          this.events.push(data);
          this.refresh.next(true);
        } else {
          this.toaster.showTranslate('errors.savingItem');
        }
      }, err => this._responseError(err)
    )
  }

  public updateEventApi(data: CalendarEvent, eventIndex: number) {
    const params = this._prepareDataApi(data);
    if (this.perm.Calendar.PostReleases) {
      this.apiService.update(EEndpoints.CalendarEvent, params).subscribe(
        (response: ResponseApi<Calendar>) => {
          if (response.code == 100) {
            this.events[eventIndex] = Object.assign(this.events[eventIndex], data);
            this.refresh.next(true);
            if (this.perm.Calendar.PostReleases) {
              this.manageEventRequest();
            }
          } else {
            this.toaster.showTranslate('errors.error.updatingItem');
          }
        }, err => this._responseError(err)
      )
    }
    
  }

  public deleteEventApi(event: CalendarEvent) {
    this.apiService.delete(EEndpoints.CalendarEvent, { id: event.meta.dbId }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          const eventIndex = this.events.indexOf(event);
          this.events.splice(eventIndex, 1);
          this.refresh.next(true);
        } else {
          this.toaster.showTranslate('errors.errorDeletingItem');
        }
      }, err => this._responseError(err)
    )
  }

  private _getEvents(route: EEndpoints, params: any = {}) {
    this.apiService.get(route, params).subscribe(
      (response: ResponseApi<Calendar[]>) => {
        console.log('response de _getEvents: ', response);
        if (response.code == 100) {
          this.setEvents(response.result);
        } else {
          this.toaster.showTranslate('errors.errorGettingEvents');
        }
      }, err => this._responseError(err)
    )
  }

  //#endregion

  private _prepareDataApi(data: CalendarEvent): Calendar {
    const model = <Calendar>{};
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
  }

  private _defineEventColor(event: Calendar): string {
    const endDate = new Date(event.endDate);
    const current = new Date();
    current.setHours(0, 0, 0, 0);
    event.projectTaskId = (!event.projectTaskId) ? 0 : event.projectTaskId;

    const endDateTime = endDate.getTime();
    const currentTime = current.getTime();

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
  }

  private _responseError(err: any) {
    console.log(err);
    this.toaster.showTranslate('general.errors.serverError');
  }
}
