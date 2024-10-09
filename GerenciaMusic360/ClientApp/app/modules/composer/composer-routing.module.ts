import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorksComponent } from './components/works/works.component';
import { ComposerComponent } from './components/composer/composer.component';
import { ModuleGuard } from '@guards/module.guard';

const routes: Routes = [
  {
    path: '',
    component: ComposerComponent,
    canActivate: [ModuleGuard],
    data: {access: 'Composer'}
  },
  {
    path: 'manage',
    component: ComposerComponent,
    canActivate: [ModuleGuard],
    data: {access: 'Composer'}
  },
  {
    path: 'works',
    component: WorksComponent,
    canActivate: [ModuleGuard],
    data: {access: 'Work'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComposerRoutingModule { }
