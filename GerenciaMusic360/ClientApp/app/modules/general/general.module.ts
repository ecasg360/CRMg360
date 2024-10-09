import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from '@shared/shared.module';
import { GeneralRoutingModule } from './general-routing.module';
import { DepartmentComponent } from './components/department/department.component';
import { AddDepartmentComponent } from './components/department/add-department/add-department.component';
import { CategoryComponent } from './components/category/category.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { EditorComponent } from './components/editor/editor.component';

import { InboxComponent } from './components/inbox/inbox.component';
import { WorksmanageComponent } from './components/worksmanage/worksmanage.component';
import { AddWorksmanageComponent } from './components/worksmanage/add-worksmanage/add-worksmanage.component';
import { AddPublisherComponent } from './components/worksmanage/add-publisher/add-publisher.component';
import { ReleasesComponent } from './components/releases/releases.component';
import { CalendarModule } from '@commons/feature/calendar-manager/calendar.module';

@NgModule({
    declarations: [
        DepartmentComponent, 
        AddDepartmentComponent, 
        CategoryComponent, 
        AddCategoryComponent, 
        EditorComponent, 
        InboxComponent, 
        WorksmanageComponent, 
        AddWorksmanageComponent,
        ReleasesComponent,
    ],
    entryComponents: [
        AddDepartmentComponent,
        AddCategoryComponent,        
        AddWorksmanageComponent,
    ],
    imports: [
        CommonModule,
        GeneralRoutingModule,
        FuseSharedModule,
        SharedModule,
        CalendarModule       
    ]
})
export class GeneralModule { }
