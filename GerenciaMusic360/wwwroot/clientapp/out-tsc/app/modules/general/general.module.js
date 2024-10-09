var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { ReleasesComponent } from './components/releases/releases.component';
import { CalendarModule } from '@commons/feature/calendar-manager/calendar.module';
var GeneralModule = /** @class */ (function () {
    function GeneralModule() {
    }
    GeneralModule = __decorate([
        NgModule({
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
    ], GeneralModule);
    return GeneralModule;
}());
export { GeneralModule };
//# sourceMappingURL=general.module.js.map