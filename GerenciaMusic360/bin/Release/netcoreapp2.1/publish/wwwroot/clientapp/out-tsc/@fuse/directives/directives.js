var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { FuseIfOnDomDirective } from '@fuse/directives/fuse-if-on-dom/fuse-if-on-dom.directive';
import { FuseInnerScrollDirective } from '@fuse/directives/fuse-inner-scroll/fuse-inner-scroll.directive';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseMatSidenavHelperDirective, FuseMatSidenavTogglerDirective } from '@fuse/directives/fuse-mat-sidenav/fuse-mat-sidenav.directive';
var FuseDirectivesModule = /** @class */ (function () {
    function FuseDirectivesModule() {
    }
    FuseDirectivesModule = __decorate([
        NgModule({
            declarations: [
                FuseIfOnDomDirective,
                FuseInnerScrollDirective,
                FuseMatSidenavHelperDirective,
                FuseMatSidenavTogglerDirective,
                FusePerfectScrollbarDirective
            ],
            imports: [],
            exports: [
                FuseIfOnDomDirective,
                FuseInnerScrollDirective,
                FuseMatSidenavHelperDirective,
                FuseMatSidenavTogglerDirective,
                FusePerfectScrollbarDirective
            ]
        })
    ], FuseDirectivesModule);
    return FuseDirectivesModule;
}());
export { FuseDirectivesModule };
//# sourceMappingURL=directives.js.map