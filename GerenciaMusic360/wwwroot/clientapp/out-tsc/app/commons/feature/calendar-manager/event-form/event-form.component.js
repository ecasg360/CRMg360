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
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatColors } from '@fuse/mat-colors';
import { CalendarEventModel } from '@models/event.model';
var CalendarEventFormDialogComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {MatDialogRef<CalendarEventFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    function CalendarEventFormDialogComponent(matDialogRef, _data, _formBuilder) {
        this.matDialogRef = matDialogRef;
        this._data = _data;
        this._formBuilder = _formBuilder;
        this.presetColors = MatColors.presets;
        this.isProjectRelease = false;
        this.event = _data.event;
        this.action = _data.action;
        if (_data.isProjectRelease) {
            this.isProjectRelease = true;
        }
        if (this.action === 'edit') {
            this.dialogTitle = this.event.title;
        }
        else {
            this.dialogTitle = 'New Event';
            this.event = new CalendarEventModel({
                start: _data.date,
                end: _data.date
            });
        }
        this.eventForm = this.createEventForm();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Create the event form
     *
     * @returns {FormGroup}
     */
    CalendarEventFormDialogComponent.prototype.createEventForm = function () {
        return new FormGroup({
            title: new FormControl(this.event.title),
            start: new FormControl(this.event.start),
            end: new FormControl(this.event.end),
            allDay: new FormControl(this.event.allDay),
            pictureUrl: new FormControl(this.pictureUrl),
            color: this._formBuilder.group({
                primary: new FormControl(this.event.color.primary),
                secondary: new FormControl(this.event.color.secondary)
            }),
            meta: this._formBuilder.group({
                location: new FormControl(this.event.meta.location),
                notes: new FormControl(this.event.meta.notes),
                pictureUrl: new FormControl(this.event.meta.pictureUrl),
                dbId: new FormControl(this.event.meta.dbId)
            })
        });
    };
    CalendarEventFormDialogComponent.prototype.selectImage = function ($event) {
        this.pictureUrl = $event;
        this.eventForm.value.meta.pictureUrl = $event;
    };
    CalendarEventFormDialogComponent = __decorate([
        Component({
            selector: 'calendar-event-form-dialog',
            templateUrl: './event-form.component.html',
            styleUrls: ['./event-form.component.scss'],
            encapsulation: ViewEncapsulation.None
        }),
        __param(1, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef, Object, FormBuilder])
    ], CalendarEventFormDialogComponent);
    return CalendarEventFormDialogComponent;
}());
export { CalendarEventFormDialogComponent };
//# sourceMappingURL=event-form.component.js.map