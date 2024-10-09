var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { ManageComponent } from './components/manage/manage.component';
import { MarketingResolve } from '@app/core/resolve/marketing.resolve';
import { ModuleGuard } from '@guards/module.guard';
var routes = [
    {
        path: '',
        component: ListComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Marketing' }
    },
    {
        path: 'list',
        component: ListComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Marketing' }
    },
    {
        path: 'list/:status',
        component: ListComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Marketing' }
    },
    {
        path: 'list/:month/:year',
        component: ListComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Marketing' }
    },
    {
        path: ':menuFilter/list',
        component: ListComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Marketing' }
    },
    {
        path: 'manage/:marketingId',
        component: ManageComponent,
        resolve: {
            marketingResolve: MarketingResolve
        },
        canActivate: [ModuleGuard],
        data: { access: 'Marketing,MarketingGoal,MarketingPlan,MarketingDemographic,File,MarketingOverview,MarketingKeyIdeas,MarketingAsset' }
    },
];
var MarketingRoutingModule = /** @class */ (function () {
    function MarketingRoutingModule() {
    }
    MarketingRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], MarketingRoutingModule);
    return MarketingRoutingModule;
}());
export { MarketingRoutingModule };
//# sourceMappingURL=marketing-routing.module.js.map