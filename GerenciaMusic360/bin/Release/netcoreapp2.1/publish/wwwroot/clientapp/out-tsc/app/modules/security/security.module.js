var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var SecurityModule = /** @class */ (function () {
    function SecurityModule() {
    }
    SecurityModule = __decorate([
        NgModule({
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
    ], SecurityModule);
    return SecurityModule;
}());
export { SecurityModule };
//# sourceMappingURL=security.module.js.map