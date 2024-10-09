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

@NgModule({
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
export class VerticalLayout1Module {
}
