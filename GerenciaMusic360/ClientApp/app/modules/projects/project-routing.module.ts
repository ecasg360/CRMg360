import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectManagerComponent } from './components/project-manager/project-manager.component';
import { ProjectBuyerComponent } from './components/project-buyer/project-buyer.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProjectAddMenuComponent } from './components/project-add-menu/project-add-menu.component';
import { ProjectContactsManageComponent } from './components/project-contacts-manage/project-contacts-manage.component';
import { ProjectCalendarComponent } from './components/project-calendar/project-calendar.component';
import { ProjectStatusResolve } from '@resolve/project-status.resolve';
import { ProjectResolve } from '@resolve/project.resolve';
import { ModuleGuard } from '@guards/module.guard';

const routes: Routes = [
    {
        path: '',
        component: ProjectListComponent,
        resolve: {
            projectsStatus: ProjectStatusResolve
        },
        canActivate: [ModuleGuard],
        data: {access: 'Project'}
    },
    {
        path: 'list',
        component: ProjectListComponent,
        resolve: {
            projectsStatus: ProjectStatusResolve
        },
        canActivate: [ModuleGuard],
        data: {access: 'Project'}
    },
    {
        path: 'list/:status',
        component: ProjectListComponent,
        resolve: {
            projectsStatus: ProjectStatusResolve
        },
        canActivate: [ModuleGuard],
        data: {access: 'Project'}
    },
    {
        path: ':projectFilter/list',
        component: ProjectListComponent,
        resolve: {
            projectsStatus: ProjectStatusResolve
        },
        canActivate: [ModuleGuard],
        data: {access: 'Project'}
    },
    {
        path: 'list/:month/:year',
        component: ProjectListComponent,
        resolve: {
            projectsStatus: ProjectStatusResolve
        },
        canActivate: [ModuleGuard],
        data: {access: 'Project'}
    },
    {
        path: 'contacts/:projectFilter/list',
        component: ProjectContactsManageComponent,
        canActivate: [ModuleGuard],
        data: {access: 'ProjectContact'}
    },
    {
        path: 'events/:projectFilter/list',
        component: ProjectCalendarComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Calendar'}
    },
    {
        path: 'manage/:projectId',
        component: ProjectManagerComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Project,ProjectWork,LabelCopy,ProjectTask,ProjectBudget,ProjectTravelLogistics,ProjectContact,ProjectBuyer'},
        resolve: {
            project: ProjectResolve
        }
    },
    {
        path: 'add/:projectType',
        component: ProjectAddMenuComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Project'}
    },
    {
        path: 'manage/:projectId/:projectTypeId',
        component: ProjectManagerComponent,
        resolve: {
            project: ProjectResolve
        },
        canActivate: [ModuleGuard],
        data: {access: 'Project,ProjectWork,LabelCopy,ProjectTask,ProjectBudget,ProjectBuyer'}
    },
    {
        path: 'detail/:projectId',
        component: ProjectDetailComponent,
        resolve: {
            project: ProjectResolve
        },
        canActivate: [ModuleGuard],
        data: {access: 'Project'}
    },
    {
        path: 'event-calendar',
        component: CalendarComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Project'}
    },
    {
        path: 'projectbuyer',
        component: ProjectBuyerComponent,
        canActivate: [ModuleGuard],
        data: {access: 'ProjectBuyer'}
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule { }
