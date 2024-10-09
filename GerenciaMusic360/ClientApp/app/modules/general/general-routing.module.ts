import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { EditorComponent } from './components/editor/editor.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { WorksmanageComponent } from './components/worksmanage/worksmanage.component';
import { ReleasesComponent } from './components/releases/releases.component';
import { ModuleGuard } from '@guards/module.guard';

const routes: Routes = [
    {
        path: 'category',
        component: CategoryComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Category'}
    },
    {
        path: 'editor',
        component: EditorComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Editor'}
    },
    {
        path: 'inbox',
        component: InboxComponent,
        // canActivate: [ModuleGuard],
        // data: {access: 'Project'}
    },
    {
        path: 'works',
        component: WorksmanageComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Work'}
    },
    {
        path: 'calendar',
        component: ReleasesComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Calendar'}
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneralRoutingModule { }
