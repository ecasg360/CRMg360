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


@NgModule({
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
export class DashboardModule { }
