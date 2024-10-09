var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContractListComponent } from './components/contract-list/contract-list.component';
import { ContractManagerComponent } from './components/contract-manager/contract-manager.component';
import { ContractResolve } from '@resolve/contracts.resolve';
import { ModuleGuard } from '@guards/module.guard';
var routes = [
    {
        path: '',
        component: ContractListComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Contract' }
    },
    {
        path: 'list',
        component: ContractListComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Contract' }
    },
    {
        path: 'list/:status',
        component: ContractListComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Contract' }
    },
    {
        path: 'list/:month/:year',
        component: ContractListComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Contract' }
    },
    {
        path: 'manage/:contractId',
        component: ContractManagerComponent,
        resolve: {
            contract: ContractResolve
        },
        canActivate: [ModuleGuard],
        data: { access: 'Contract,ContractTerms' }
    },
    {
        path: ':menuFilter/list',
        component: ContractListComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Contract' }
    },
];
var ContractsRoutingModule = /** @class */ (function () {
    function ContractsRoutingModule() {
    }
    ContractsRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], ContractsRoutingModule);
    return ContractsRoutingModule;
}());
export { ContractsRoutingModule };
//# sourceMappingURL=contract-routing.module.js.map