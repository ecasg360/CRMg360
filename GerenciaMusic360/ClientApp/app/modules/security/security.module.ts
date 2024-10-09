import { AddUserComponent } from './components/user/add-user.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SecurityRoutingModule } from './security-routing.module';
import { SharedModule } from 'ClientApp/app/shared/shared.module';
import { UserComponent } from './components/user/user.component';
import { RoleComponent } from './components/role/role.component';
import { AddRoleComponent } from './components/role/add-role.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PermissionComponent } from './components/permission/permission.component';
import { AddPermissionComponent } from './components/permission/add-permission/add-permission.component';
import { RolepermissionComponent } from './components/rolepermission/rolepermission.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BackgroundImageComponent } from './components/background-image/background-image.component';

@NgModule({
    declarations: [
        UserComponent,
        AddUserComponent,
        RoleComponent,
        AddRoleComponent,
        ProfileComponent,
        PermissionComponent,
        AddPermissionComponent,
        RolepermissionComponent,
        BackgroundImageComponent,

    ],
    entryComponents: [
        AddRoleComponent,
        AddUserComponent,
        AddPermissionComponent,
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        SharedModule,
        SecurityRoutingModule,
    ]
})
export class SecurityModule { }
