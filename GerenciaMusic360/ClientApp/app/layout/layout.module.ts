import { NgModule } from '@angular/core';

import { VerticalLayout1Module } from '@app/layout/vertical/layout-1/layout-1.module';
import { ChatPanelModule } from './components/chat-panel/chat-panel.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        VerticalLayout1Module,
        ChatPanelModule,
        HttpClientModule
    ],
    exports: [
        VerticalLayout1Module
    ]
})
export class LayoutModule {
}
