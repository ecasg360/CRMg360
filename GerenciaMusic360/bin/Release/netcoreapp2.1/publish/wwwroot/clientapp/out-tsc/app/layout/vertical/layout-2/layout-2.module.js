var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { ContentModule } from '@app/layout/components/content/content.module';
import { FooterModule } from '@app/layout/components/footer/footer.module';
import { NavbarModule } from '@app/layout/components/navbar/navbar.module';
import { QuickPanelModule } from '@app/layout/components/quick-panel/quick-panel.module';
import { ToolbarModule } from '@app/layout/components/toolbar/toolbar.module';
import { VerticalLayout2Component } from '@app/layout/vertical/layout-2/layout-2.component';
var VerticalLayout2Module = /** @class */ (function () {
    function VerticalLayout2Module() {
    }
    VerticalLayout2Module = __decorate([
        NgModule({
            declarations: [
                VerticalLayout2Component
            ],
            imports: [
                RouterModule,
                FuseSharedModule,
                FuseSidebarModule,
                ContentModule,
                FooterModule,
                NavbarModule,
                QuickPanelModule,
                ToolbarModule
            ],
            exports: [
                VerticalLayout2Component
            ]
        })
    ], VerticalLayout2Module);
    return VerticalLayout2Module;
}());
export { VerticalLayout2Module };
//# sourceMappingURL=layout-2.module.js.map