var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
var ComponentsComunicationService = /** @class */ (function () {
    function ComponentsComunicationService() {
        this.travelLogisticBudget = new Subject();
        this.profileManage = new Subject();
        this.taskChange = new Subject();
        this.projectChange = new Subject();
    }
    ComponentsComunicationService.prototype.sendTravelLogisticBudget = function (status) {
        this.travelLogisticBudget.next(status);
    };
    ComponentsComunicationService.prototype.clearTravelLogisticBudget = function () {
        this.travelLogisticBudget.next();
    };
    ComponentsComunicationService.prototype.getTravelLogisticBudget = function () {
        return this.travelLogisticBudget.asObservable();
    };
    ComponentsComunicationService.prototype.sendProfileChangeNotification = function (status) {
        this.travelLogisticBudget.next(status);
    };
    ComponentsComunicationService.prototype.clearProfileChangeNotification = function () {
        this.travelLogisticBudget.next();
    };
    ComponentsComunicationService.prototype.getProfileChangeNotification = function () {
        return this.travelLogisticBudget.asObservable();
    };
    ComponentsComunicationService.prototype.notifyTaskChange = function (status) {
        this.taskChange.next(status);
    };
    ComponentsComunicationService.prototype.clearTaskChange = function () {
        this.taskChange.next();
    };
    ComponentsComunicationService.prototype.listenTaskChange = function () {
        return this.taskChange.asObservable();
    };
    ComponentsComunicationService.prototype.notifyProjectChange = function (project) {
        this.projectChange.next(project);
    };
    ComponentsComunicationService.prototype.clearProjectChange = function () {
        this.projectChange.next();
    };
    ComponentsComunicationService.prototype.listenProjectChange = function () {
        return this.projectChange.asObservable();
    };
    ComponentsComunicationService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], ComponentsComunicationService);
    return ComponentsComunicationService;
}());
export { ComponentsComunicationService };
//# sourceMappingURL=components-comunication.service.js.map