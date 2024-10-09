var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { NavbarComponent } from '@app/layout/components/navbar/navbar.component';
import { NavbarHorizontalStyle1Module } from '@app/layout/components/navbar/horizontal/style-1/style-1.module';
import { NavbarVerticalStyle1Module } from '@app/layout/components/navbar/vertical/style-1/style-1.module';
import { NavbarVerticalStyle2Module } from '@app/layout/components/navbar/vertical/style-2/style-2.module';
var NavbarModule = /** @class */ (function () {
    function NavbarModule() {
    }
    NavbarModule = __decorate([
        NgModule({
            declarations: [
                NavbarComponent
            ],
            imports: [
                FuseSharedModule,
                NavbarHorizontalStyle1Module,
                NavbarVerticalStyle1Module,
                NavbarVerticalStyle2Module
            ],
            exports: [
                NavbarComponent
            ]
        })
    ], NavbarModule);
    return NavbarModule;
}());
export { NavbarModule };
//# sourceMappingURL=navbar.module.js.map