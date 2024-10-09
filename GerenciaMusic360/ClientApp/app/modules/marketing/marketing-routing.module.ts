import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { ManageComponent } from './components/manage/manage.component';
import { MarketingResolve } from '@app/core/resolve/marketing.resolve';
import { ModuleGuard } from '@guards/module.guard';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [ModuleGuard],
    data: {access: 'Marketing'}
  },
  {
    path: 'list',
    component: ListComponent,
    canActivate: [ModuleGuard],
    data: {access: 'Marketing'}
  },
  {
    path: 'list/:status',
    component: ListComponent,
    canActivate: [ModuleGuard],
    data: {access: 'Marketing'}
  },
  {
    path: 'list/:month/:year',
    component: ListComponent,
    canActivate: [ModuleGuard],
    data: {access: 'Marketing'}
  },
  {
    path: ':menuFilter/list',
    component: ListComponent,
    canActivate: [ModuleGuard],
    data: {access: 'Marketing'}
  },
  {
    path: 'manage/:marketingId',
    component: ManageComponent,
    resolve: {
      marketingResolve: MarketingResolve
    },
    canActivate: [ModuleGuard],
    data: {access: 'Marketing,MarketingGoal,MarketingPlan,MarketingDemographic,File,MarketingOverview,MarketingKeyIdeas,MarketingAsset'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule {

}
