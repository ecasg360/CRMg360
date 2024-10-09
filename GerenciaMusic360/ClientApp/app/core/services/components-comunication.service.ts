import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IProject } from '../../shared/models/project';

@Injectable({
  providedIn: 'root'
})
export class ComponentsComunicationService {

  private travelLogisticBudget = new Subject<boolean>();
    private profileManage = new Subject<boolean>();
    private taskChange = new Subject<any>();
    private projectChange = new Subject<IProject>();

  constructor() { }

  sendTravelLogisticBudget(status: boolean) {
    this.travelLogisticBudget.next(status);
  }

  clearTravelLogisticBudget() {
    this.travelLogisticBudget.next();
  }

  getTravelLogisticBudget(): Observable<boolean> {
    return this.travelLogisticBudget.asObservable();
  }

  sendProfileChangeNotification(status: boolean) {
    this.travelLogisticBudget.next(status);
  }

  clearProfileChangeNotification() {
    this.travelLogisticBudget.next();
  }

  getProfileChangeNotification(): Observable<boolean> {
    return this.travelLogisticBudget.asObservable();
  }


    notifyTaskChange(status: boolean) {
        this.taskChange.next(status);
    }

    clearTaskChange() {
        this.taskChange.next();
    }

    listenTaskChange(): Observable<any> {
        return this.taskChange.asObservable();
    }

    notifyProjectChange(project: IProject) {
        this.projectChange.next(project);
    }

    clearProjectChange() {
        this.projectChange.next();
    }

    listenProjectChange(): Observable<IProject> {
        return this.projectChange.asObservable();
    }
}
