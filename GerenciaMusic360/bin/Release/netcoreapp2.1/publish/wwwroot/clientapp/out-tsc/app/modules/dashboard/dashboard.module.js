var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContractsComponent } from './components/contracts/contracts.component';
import { MarketingComponent } from './components/marketing/marketing.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FuseWidgetModule } from '@fuse/components';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '@shared/shared.module';
var DashboardModule = /** @class */ (function () {
    function DashboardModule() {
    }
    DashboardModule = __decorate([
        NgModule({
            declarations: [
                DashboardComponent,
                ProjectsComponent,
                ContractsComponent,
                MarketingComponent
            ],
            imports: [
                CommonModule,
                DashboardRoutingModule,
                SharedModule,
                TranslateModule,
                FuseSharedModule,
                NgxChartsModule,
                FuseWidgetModule
            ],
            exports: [
                DashboardComponent
            ]
        })
    ], DashboardModule);
    return DashboardModule;
}());
export { DashboardModule };
//# sourceMappingURL=dashboard.module.js.map