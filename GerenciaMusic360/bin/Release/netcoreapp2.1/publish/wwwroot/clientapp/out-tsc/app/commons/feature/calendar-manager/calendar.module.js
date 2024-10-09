var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorPickerModule } from 'ngx-color-picker';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FuseConfirmDialogModule } from '@fuse/components';
import { CalendarEventFormDialogComponent } from './event-form/event-form.component';
import { EventTaskComponent } from './event-task/event-task.component';
import { CalendarManagerComponent } from './calendar-manager.component';
import { FeaturesSharedModule } from '../shared.module';
import { MatListModule, MatCheckboxModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
var CalendarModule = /** @class */ (function () {
    function CalendarModule() {
    }
    CalendarModule = __decorate([
        NgModule({
            declarations: [
                CalendarEventFormDialogComponent,
                EventTaskComponent,
                CalendarManagerComponent,
            ],
            imports: [
                MatButtonModule,
                MatDatepickerModule,
                MatDialogModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
                MatSlideToggleModule,
                MatToolbarModule,
                MatTooltipModule,
                MatCheckboxModule,
                AngularCalendarModule.forRoot({
                    provide: DateAdapter,
                    useFactory: adapterFactory
                }),
                ColorPickerModule,
                FuseSharedModule,
                FeaturesSharedModule,
                FuseConfirmDialogModule,
                MatListModule,
            ],
            entryComponents: [
                CalendarEventFormDialogComponent,
                EventTaskComponent,
            ],
            exports: [CalendarManagerComponent],
        })
    ], CalendarModule);
    return CalendarModule;
}());
export { CalendarModule };
//# sourceMappingURL=calendar.module.js.map