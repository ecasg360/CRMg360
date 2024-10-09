var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
var FuseSharedModule = /** @class */ (function () {
    function FuseSharedModule() {
    }
    FuseSharedModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                FlexLayoutModule,
                FuseDirectivesModule,
                FusePipesModule
            ],
            exports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                FlexLayoutModule,
                FuseDirectivesModule,
                FusePipesModule
            ]
        })
    ], FuseSharedModule);
    return FuseSharedModule;
}());
export { FuseSharedModule };
//# sourceMappingURL=shared.module.js.map