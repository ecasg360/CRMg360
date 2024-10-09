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


@NgModule({
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
export class ReportModule { }
