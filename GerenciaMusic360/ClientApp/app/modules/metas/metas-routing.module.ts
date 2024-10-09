import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetasListComponent } from './components/metas-list/metas-list.component';
import { ModuleGuard } from '@guards/module.guard';

const routes: Routes = [
  {
    path: '',
    component: MetasListComponent,
    canActivate: [ModuleGuard],
    data: {access: 'Metas'}
  },
  {
    path: 'list',
    component: MetasListComponent,
    canActivate: [ModuleGuard],
    data: {access: 'Metas'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetasRoutingModule { }
