var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared/shared.module";
import { FuseSharedModule } from '@fuse/shared.module';
import { ReportRoutingModule } from "./report-routing.module";
import { ReportMenuBudgetTemplateComponent } from './components/report-menu-budget-template/report-menu-budget-template.component';
import { ReportGeneralComponent } from './components/report-general/report-general.component';
import { TabProjectComponent } from './components/report-general/tab-project/tab-project.component';
import { TabContactComponent } from './components/report-general/tab-contact/tab-contact.component';
import { TabWorksComponent } from './components/report-general/tab-works/tab-works.component';
import { Ng5SliderModule } from 'ng5-slider';
import { ReportActivitiesComponent } from './components/report-activities/report-activities.component';
import { TabMarketingComponent } from './components/report-general/tab-marketing/tab-marketing.component';
var ReportModule = /** @class */ (function () {
    function ReportModule() {
    }
    ReportModule = __decorate([
        NgModule({
            declarations: [
                ReportMenuBudgetTemplateComponent,
                ReportGeneralComponent,
                TabProjectComponent,
                TabContactComponent,
                TabWorksComponent,
                ReportActivitiesComponent,
                TabMarketingComponent,
            ],
            entryComponents: [
                ReportMenuBudgetTemplateComponent,
                ReportGeneralComponent,
                TabProjectComponent,
                TabContactComponent,
                TabWorksComponent,
            ],
            imports: [
                CommonModule,
                SharedModule,
                FuseSharedModule,
                ReportRoutingModule,
                Ng5SliderModule
            ]
        })
    ], ReportModule);
    return ReportModule;
}());
export { ReportModule };
//# sourceMappingURL=report.module.js.map