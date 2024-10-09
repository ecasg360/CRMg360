import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/404/error-404.component';
import { Error500Component } from './components/500/error-500.component';


export const routes: Routes = [
    {
        path: 'not-found',
        component: Error404Component
    },
    {
        path: '**',
        component: Error404Component,
    },
    {
        path: '404',
        component: Error404Component,
    },
    {
        path: '500',
        component: Error500Component,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CoreRoutingModule { }
