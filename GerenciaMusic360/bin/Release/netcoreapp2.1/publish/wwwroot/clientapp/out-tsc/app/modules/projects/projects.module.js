var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { FuseSharedModule } from '@fuse/shared.module';
import { ProjectsRoutingModule } from "./project-routing.module";
import { AddProjectComponent } from './components/add-project/add-project.component';
import { ProjectContactComponent } from "./components/project-contact/project-contact.component";
import { ProjectTaskComponent } from './components/project-task/project-task.component';
import { ProjectManagerComponent } from './components/project-manager/project-manager.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { AddTaskInfoComponent } from './components/project-task/add-task-info/add-task-info.component';
import { ProjectContactFormComponent } from './components/project-contact/project-contact-form/project-contact-form.component';
import { AddBuyerComponent } from './components/project-buyer/add-buyer/add-buyer.component';
import { ProjectBuyerComponent } from "./components/project-buyer/project-buyer.component";
import { ProjectDataComponent } from './components/project-data/project-data.component';
import { ProjectMembersManagerComponent } from './components/project-members-manager/project-members-manager.component';
import { ProjectMemberDataComponent } from './components/project-members-manager/project-member-data/project-member-data.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProjectMembersImageComponent } from './components/project-members-image/project-members-image.component';
import { ProjectAddMenuComponent } from './components/project-add-menu/project-add-menu.component';
import { ProjectBudgetComponent } from './components/project-budget/project-budget.component';
import { ProjectBudgetModalComponent } from './components/project-budget/project-budget-modal/project-budget-modal.component';
import { ProjectBudgetDetailComponent } from './components/project-budget/project-budget-detail/project-budget-detail.component';
import { ProjectLabelCopyComponent } from './components/project-label-copy/project-label-copy.component';
import { ProjectActivitiesComponent } from './components/project-activities/project-activities.component';
import { AddEditorComponent } from "@modules/general/components/editor/add-editor/add-editor.component";
import { ProjectContactsManageComponent } from './components/project-contacts-manage/project-contacts-manage.component';
import { ProjectEventComponent } from './components/project-data/project-event/project-event.component';
import { ProjectStatusResolve } from "@resolve/project-status.resolve";
import { ContractProjectComponent } from "./components/contract-project/contract-project.component";
import { AddContractProjectComponent } from "./components/contract-project/add-contract-project/add-contract-project.component";
import { ProjectCalendarComponent } from "./components/project-calendar/project-calendar.component";
import { CalendarModule } from "@commons/feature/calendar-manager/calendar.module";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { ProjectResolve } from "@resolve/project.resolve";
import { RoleResolve } from "@resolve/role.resolve";
import { ProjectTaskCompleteComponent } from './components/project-task-complete/project-task-complete.component';
import { ProjectLabelCopyModalComponent } from './components/project-label-copy/project-label-copy-modal/project-label-copy-modal.component';
var ProjectsModule = /** @class */ (function () {
    function ProjectsModule() {
    }
    ProjectsModule = __decorate([
        NgModule({
            declarations: [
                ProjectManagerComponent,
                ProjectListComponent,
                AddProjectComponent,
                ProjectTaskComponent,
                ProjectContactComponent,
                AddTaskInfoComponent,
                ProjectListComponent,
                ProjectContactComponent,
                ProjectContactFormComponent,
                ProjectBuyerComponent,
                AddBuyerComponent,
                ProjectDataComponent,
                ProjectMembersManagerComponent,
                ProjectMemberDataComponent,
                ProjectDetailComponent,
                ProjectMembersImageComponent,
                ProjectAddMenuComponent,
                ProjectBudgetComponent,
                ProjectBudgetModalComponent,
                ProjectBudgetDetailComponent,
                ProjectLabelCopyComponent,
                ProjectActivitiesComponent,
                ProjectContactsManageComponent,
                ProjectEventComponent,
                ContractProjectComponent,
                AddContractProjectComponent,
                ProjectCalendarComponent,
                CalendarComponent,
                ProjectTaskCompleteComponent,
                ProjectLabelCopyModalComponent,
            ],
            entryComponents: [
                AddTaskInfoComponent,
                ProjectContactFormComponent,
                AddProjectComponent,
                AddBuyerComponent,
                ProjectDataComponent,
                ProjectMemberDataComponent,
                ProjectBudgetModalComponent,
                ProjectBudgetDetailComponent,
                AddEditorComponent,
                ProjectEventComponent,
                AddContractProjectComponent,
                ProjectTaskCompleteComponent,
                ProjectLabelCopyModalComponent,
            ],
            imports: [
                CommonModule,
                ProjectsRoutingModule,
                FuseSharedModule,
                SharedModule,
                CalendarModule,
            ],
            providers: [
                ProjectStatusResolve,
                ProjectResolve,
                RoleResolve,
            ],
        })
    ], ProjectsModule);
    return ProjectsModule;
}());
export { ProjectsModule };
//# sourceMappingURL=projects.module.js.map