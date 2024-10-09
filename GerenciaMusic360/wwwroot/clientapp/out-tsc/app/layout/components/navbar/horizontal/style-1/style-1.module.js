var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { FuseNavigationModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NavbarHorizontalStyle1Component } from '@app/layout/components/navbar/horizontal/style-1/style-1.component';
var NavbarHorizontalStyle1Module = /** @class */ (function () {
    function NavbarHorizontalStyle1Module() {
    }
    NavbarHorizontalStyle1Module = __decorate([
        NgModule({
            declarations: [
                NavbarHorizontalStyle1Component
            ],
            imports: [
                MatButtonModule,
                MatIconModule,
                FuseSharedModule,
                FuseNavigationModule
            ],
            exports: [
                NavbarHorizontalStyle1Component
            ]
        })
    ], NavbarHorizontalStyle1Module);
    return NavbarHorizontalStyle1Module;
}());
export { NavbarHorizontalStyle1Module };
//# sourceMappingURL=style-1.module.js.map