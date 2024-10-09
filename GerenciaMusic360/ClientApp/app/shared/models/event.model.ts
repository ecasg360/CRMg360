import { CalendarEventAction } from 'angular-calendar';
import { startOfDay, endOfDay } from 'date-fns';

export class CalendarEventModel {
    start: Date;
    end?: Date;
    title: string;
    color: {
        primary: string;
        secondary: string;
    };
    actions?: CalendarEventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: {
        dbId: number,
        location: string,
        notes: string,
        pictureUrl: any,
        projectTaskId?: number,
        completed: boolean,
    };

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data?) {
        data = data || {};
        this.start = new Date(data.start) || startOfDay(new Date());
        this.end = new Date(data.end) || endOfDay(new Date());
        this.title = data.title || '';
        this.color = {
            primary: data.color && data.color.primary || '#1e90ff',
            secondary: data.color && data.color.secondary || '#D1E8FF'
        };
        this.draggable = data.draggable;
        this.resizable = {
            beforeStart: false,
            afterEnd: data.resizable && data.resizable.afterEnd || true
        };
        this.actions = data.actions || [];
        this.allDay = data.allDay || false;
        this.cssClass = data.cssClass || '';
        this.meta = {
            dbId: data.meta && data.meta.dbId || 0,
            location: data.meta && data.meta.location || '',
            notes: data.meta && data.meta.notes || '',
            pictureUrl: data.meta && data.meta.pictureUrl || '',
            projectTaskId: data.meta && data.meta.projectTaskId || 0,
            completed: data.meta && data.meta.completed || false,
        };
    }
}
