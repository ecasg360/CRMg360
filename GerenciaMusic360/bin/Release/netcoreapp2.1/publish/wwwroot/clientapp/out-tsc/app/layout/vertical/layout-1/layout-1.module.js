var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { ContentModule } from '@app/layout/components/content/content.module';
import { FooterModule } from '@app/layout/components/footer/footer.module';
import { NavbarModule } from '@app/layout/components/navbar/navbar.module';
import { QuickPanelModule } from '@app/layout/components/quick-panel/quick-panel.module';
import { ToolbarModule } from '@app/layout/components/toolbar/toolbar.module';
import { VerticalLayout1Component } from '@app/layout/vertical/layout-1/layout-1.component';
import { ChatPanelModule } from '@app/layout/components/chat-panel/chat-panel.module';
import { NgChatModule } from 'ng-chat';
var VerticalLayout1Module = /** @class */ (function () {
    function VerticalLayout1Module() {
    }
    VerticalLayout1Module = __decorate([
        NgModule({
            declarations: [
                VerticalLayout1Component
            ],
            imports: [
                RouterModule,
                FuseSharedModule,
                FuseSidebarModule,
                ChatPanelModule,
                ContentModule,
                FooterModule,
                NavbarModule,
                QuickPanelModule,
                ToolbarModule,
                NgChatModule,
                TranslateModule.forRoot(),
            ],
            exports: [
                VerticalLayout1Component,
                NgChatModule
            ]
        })
    ], VerticalLayout1Module);
    return VerticalLayout1Module;
}());
export { VerticalLayout1Module };
//# sourceMappingURL=layout-1.module.js.map