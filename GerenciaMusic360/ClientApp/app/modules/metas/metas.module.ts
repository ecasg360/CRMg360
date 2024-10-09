import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from '@shared/shared.module';
import { MetasRoutingModule } from './metas-routing.module';
import { MetasListComponent } from './components/metas-list/metas-list.component';
import { MetasAddComponent } from './components/metas-add/metas-add.component';
import { MetasReplyComponent } from './components/metas-reply/metas-reply.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportAddComponent } from './components/report-add/report-add.component';



@NgModule({
  declarations: [
    MetasListComponent,
    MetasAddComponent,
    MetasReplyComponent,
    ReportAddComponent
  ],
  entryComponents: [
    MetasAddComponent,
    MetasReplyComponent,
    ReportAddComponent
  ],
  imports: [
    CommonModule,
    MetasRoutingModule,
    FuseSharedModule,
    SharedModule,
    PickerModule,
    NgxChartsModule
  ]
})
export class MetasModule { }
