var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { RoleComponent } from './components/role/role.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PermissionComponent } from './components/permission/permission.component';
import { RolepermissionComponent } from './components/rolepermission/rolepermission.component';
import { ModuleGuard } from '@guards/module.guard';
var routes = [
    {
        path: 'user',
        component: UserComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Permission' }
    },
    {
        path: 'role',
        component: RoleComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Permission' }
    },
    {
        path: 'profile',
        component: ProfileComponent,
        // se deja libre ya que los usuarios deberian tener este acceso pord efecto
        // canActivate: [ModuleGuard],
        // data: {access: 'UserProfile'}
    },
    {
        path: 'permission',
        component: PermissionComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Permission' }
    },
    {
        path: 'rolepermission',
        component: RolepermissionComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Permission' }
    },
];
var SecurityRoutingModule = /** @class */ (function () {
    function SecurityRoutingModule() {
    }
    SecurityRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], SecurityRoutingModule);
    return SecurityRoutingModule;
}());
export { SecurityRoutingModule };
//# sourceMappingURL=security-routing.module.js.map