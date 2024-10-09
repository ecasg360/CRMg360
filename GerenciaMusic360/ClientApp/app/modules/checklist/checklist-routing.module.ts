import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotersIndexComponent } from './components/promoters-index/promoters-index.component';
import { ModuleGuard } from '@guards/module.guard';

const routes: Routes = [
  {
    path: '',
    component: PromotersIndexComponent,
    canActivate: [ModuleGuard],
    data: {access: 'Checklist'}
  },
  {
    path: 'manage',
    component: PromotersIndexComponent,
    canActivate: [ModuleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChecklistRoutingModule { }
