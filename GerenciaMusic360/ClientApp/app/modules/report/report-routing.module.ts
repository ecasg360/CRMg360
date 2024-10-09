import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportMenuBudgetTemplateComponent } from './components/report-menu-budget-template/report-menu-budget-template.component';
import { ReportGeneralComponent } from './components/report-general/report-general.component';
import { ModuleGuard } from '@guards/module.guard';

const routes: Routes = [
    {
        path: 'budget-template',
        component: ReportMenuBudgetTemplateComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Report'}
    },
    {
        path: 'general',
        component: ReportGeneralComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Report'}
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportRoutingModule { }
