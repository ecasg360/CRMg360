import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EAnnouncementType } from '../enums/types';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {

    private announcement = new Subject<EAnnouncementType>();

    constructor() { }

    sendAnnouncement(type: EAnnouncementType) {
        this.announcement.next(type);
    }

    clearAnnouncement() {
        this.announcement.next();
    }

    getAnnouncement(): Observable<any> {
        return this.announcement.asObservable();
    }
}
