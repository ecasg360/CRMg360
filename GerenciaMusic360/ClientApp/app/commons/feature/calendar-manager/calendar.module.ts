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


@NgModule({
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
export class CalendarModule {
}
