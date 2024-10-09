import { NgModule, } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContractsComponent } from './components/contracts/contracts.component';
import { MarketingComponent } from './components/marketing/marketing.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'start-center',
        component: DashboardComponent
    },
    {
        path: 'dashboard-projects',
        component: ProjectsComponent
    },
    {
        path: 'dashboard-contracts',
        component: ContractsComponent
    },
    {
        path: 'dashboard-marketing',
        component: MarketingComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule { }
