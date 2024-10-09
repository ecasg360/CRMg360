var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
var ReportGeneralComponent = /** @class */ (function () {
    function ReportGeneralComponent(route) {
        this.route = route;
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    ReportGeneralComponent.prototype.ngOnInit = function () {
    };
    ReportGeneralComponent = __decorate([
        Component({
            selector: 'app-report-general',
            templateUrl: './report-general.component.html',
            styleUrls: ['./report-general.component.css'],
            animations: fuseAnimations
        }),
        __metadata("design:paramtypes", [ActivatedRoute])
    ], ReportGeneralComponent);
    return ReportGeneralComponent;
}());
export { ReportGeneralComponent };
//# sourceMappingURL=report-general.component.js.map