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
import { NavbarVerticalStyle2Component } from '@app/layout/components/navbar/vertical/style-2/style-2.component';
var NavbarVerticalStyle2Module = /** @class */ (function () {
    function NavbarVerticalStyle2Module() {
    }
    NavbarVerticalStyle2Module = __decorate([
        NgModule({
            declarations: [
                NavbarVerticalStyle2Component
            ],
            imports: [
                MatButtonModule,
                MatIconModule,
                FuseSharedModule,
                FuseNavigationModule
            ],
            exports: [
                NavbarVerticalStyle2Component
            ]
        })
    ], NavbarVerticalStyle2Module);
    return NavbarVerticalStyle2Module;
}());
export { NavbarVerticalStyle2Module };
//# sourceMappingURL=style-2.module.js.map