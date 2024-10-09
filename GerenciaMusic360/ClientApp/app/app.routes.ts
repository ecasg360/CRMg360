import { AuthGuard } from '@guards/auth.guard';
import { Error404Component } from './core/components/404/error-404.component';
import { Error500Component } from './core/components/500/error-500.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: '@modules/dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'auth',
        loadChildren: '@modules/auth/auth.module#AuthModule',
    },
    {
        path: 'dashboard',
        loadChildren: '@modules/dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'customers',
        loadChildren: '@modules/customers/customers.module#CustomersModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'security',
        loadChildren: '@modules/security/security.module#SecurityModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'operations',
        loadChildren: '@modules/operations/operations.module#OperationsModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'artist',
        loadChildren: '@modules/artist/artist.module#ArtistModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'settings',
        loadChildren: '@modules/settings/settings.module#SettingsModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'library',
        loadChildren: '@modules/library/library.module#LibraryModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'composer',
        loadChildren: '@modules/composer/composer.module#ComposerModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'projects',
        loadChildren: '@modules/projects/projects.module#ProjectsModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'contracts',
        loadChildren: '@modules/contracts/contracts.module#ContractsModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'general',
        loadChildren: '@modules/general/general.module#GeneralModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'marketing',
        loadChildren: '@modules/marketing/marketing.module#MarketingModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'report',
        loadChildren: '@modules/report/report.module#ReportModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'checklist/promoters',
        loadChildren: '@modules/checklist/checklist.module#ChecklistModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'releases',
        loadChildren: '@modules/general/general.module#GeneralModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'metas',
        loadChildren: '@modules/metas/metas.module#MetasModule',
        canActivate: [AuthGuard]
    },
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
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
