import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { RoleComponent } from './components/role/role.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PermissionComponent } from './components/permission/permission.component';
import { RolepermissionComponent } from './components/rolepermission/rolepermission.component';
import { ModuleGuard } from '@guards/module.guard';

const routes: Routes = [
    {
        path: 'user',
        component: UserComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Permission'}
    },
    {
        path: 'role',
        component: RoleComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Permission'}
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
        data: {access: 'Permission'}
    },    
    {
        path: 'rolepermission',
        component: RolepermissionComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Permission'}
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SecurityRoutingModule { }
