import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractListComponent } from './components/contract-list/contract-list.component';
import { ContractManagerComponent } from './components/contract-manager/contract-manager.component';
import { ContractResolve } from '@resolve/contracts.resolve';
import { ModuleGuard } from '@guards/module.guard';

const routes: Routes = [
    {
        path: '',
        component: ContractListComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Contract'}
    },
    {
        path: 'list',
        component: ContractListComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Contract'}
    },
    {
        path: 'list/:status',
        component: ContractListComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Contract'}
    },
    {
        path: 'list/:month/:year',
        component: ContractListComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Contract'}
    },
    {
        path: 'manage/:contractId',
        component: ContractManagerComponent,
        resolve: {
            contract: ContractResolve
        },
        canActivate: [ModuleGuard],
        data: {access: 'Contract,ContractTerms'}
    },
    {
        path: ':menuFilter/list',
        component: ContractListComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Contract'}
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContractsRoutingModule { }