var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRippleModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { ChatPanelComponent } from '@app/layout/components/chat-panel/chat-panel.component';
import { ChatPanelService } from '@app/layout/components/chat-panel/chat-panel.service';
var ChatPanelModule = /** @class */ (function () {
    function ChatPanelModule() {
    }
    ChatPanelModule = __decorate([
        NgModule({
            declarations: [
                ChatPanelComponent
            ],
            providers: [
                ChatPanelService
            ],
            imports: [
                MatButtonModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
                MatTabsModule,
                MatTooltipModule,
                MatRippleModule,
                FuseSharedModule
            ],
            exports: [
                ChatPanelComponent
            ]
        })
    ], ChatPanelModule);
    return ChatPanelModule;
}());
export { ChatPanelModule };
//# sourceMappingURL=chat-panel.module.js.map