import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from '@shared/shared.module';
import { PromotersIndexComponent } from './components/promoters-index/promoters-index.component';
import { ChecklistRoutingModule } from './checklist-routing.module';
import { PromotersFormComponent } from './components/promoters-form/promoters-form.component';
import { PromotersViewComponent } from './components/promoters-view/promoters-view.component';

@NgModule({
  declarations: [
    PromotersIndexComponent,
    PromotersFormComponent,
    PromotersViewComponent
  ],
  entryComponents: [
    PromotersFormComponent,
    PromotersViewComponent
  ],
  imports: [
    CommonModule,
    ChecklistRoutingModule,
    FuseSharedModule,
    SharedModule
  ]
})
export class ChecklistModule { }
