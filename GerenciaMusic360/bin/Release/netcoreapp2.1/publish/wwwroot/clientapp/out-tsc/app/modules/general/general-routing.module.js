var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { EditorComponent } from './components/editor/editor.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { WorksmanageComponent } from './components/worksmanage/worksmanage.component';
import { ReleasesComponent } from './components/releases/releases.component';
import { ModuleGuard } from '@guards/module.guard';
var routes = [
    {
        path: 'category',
        component: CategoryComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Category' }
    },
    {
        path: 'editor',
        component: EditorComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Editor' }
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
        data: { access: 'Work' }
    },
    {
        path: 'calendar',
        component: ReleasesComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Calendar' }
    },
];
var GeneralRoutingModule = /** @class */ (function () {
    function GeneralRoutingModule() {
    }
    GeneralRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], GeneralRoutingModule);
    return GeneralRoutingModule;
}());
export { GeneralRoutingModule };
//# sourceMappingURL=general-routing.module.js.map