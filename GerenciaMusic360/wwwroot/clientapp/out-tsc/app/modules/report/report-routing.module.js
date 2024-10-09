var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportMenuBudgetTemplateComponent } from './components/report-menu-budget-template/report-menu-budget-template.component';
import { ReportGeneralComponent } from './components/report-general/report-general.component';
import { ModuleGuard } from '@guards/module.guard';
var routes = [
    {
        path: 'budget-template',
        component: ReportMenuBudgetTemplateComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Report' }
    },
    {
        path: 'general',
        component: ReportGeneralComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Report' }
    },
];
var ReportRoutingModule = /** @class */ (function () {
    function ReportRoutingModule() {
    }
    ReportRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], ReportRoutingModule);
    return ReportRoutingModule;
}());
export { ReportRoutingModule };
//# sourceMappingURL=report-routing.module.js.map