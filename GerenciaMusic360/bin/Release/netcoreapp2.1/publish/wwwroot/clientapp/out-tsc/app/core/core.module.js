var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { AccountService } from './services/account.service';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ToasterService } from './services/toaster.service';
import { Error500Component } from './components/500/error-500.component';
import { Error404Component } from './components/404/error-404.component';
var CORE_COMPONENTS = [
    Error500Component,
    Error404Component
];
var CoreModule = /** @class */ (function () {
    function CoreModule() {
    }
    CoreModule_1 = CoreModule;
    CoreModule.forRoot = function () {
        return {
            ngModule: CoreModule_1,
            providers: []
        };
    };
    var CoreModule_1;
    CoreModule = CoreModule_1 = __decorate([
        NgModule({
            declarations: __spreadArray([], CORE_COMPONENTS),
            imports: [
                CommonModule,
                SharedModule,
                FuseSharedModule,
            ],
            providers: [
                AccountService,
                ToasterService,
            ],
            entryComponents: __spreadArray([], CORE_COMPONENTS)
        })
    ], CoreModule);
    return CoreModule;
}());
export { CoreModule };
//# sourceMappingURL=core.module.js.map