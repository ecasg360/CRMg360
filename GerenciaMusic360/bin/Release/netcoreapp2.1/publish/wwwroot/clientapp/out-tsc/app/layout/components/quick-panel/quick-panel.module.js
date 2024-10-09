var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { MatDividerModule, MatListModule, MatSlideToggleModule, MatProgressSpinnerModule, MatIconModule, MatDialogModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { QuickPanelComponent } from '@app/layout/components/quick-panel/quick-panel.component';
import { TranslateModule } from '@ngx-translate/core';
import { FuseWidgetModule, FuseConfirmDialogModule } from '@fuse/components';
var QuickPanelModule = /** @class */ (function () {
    function QuickPanelModule() {
    }
    QuickPanelModule = __decorate([
        NgModule({
            declarations: [
                QuickPanelComponent
            ],
            imports: [
                MatDividerModule,
                MatListModule,
                MatSlideToggleModule,
                MatDialogModule,
                MatProgressSpinnerModule,
                FuseSharedModule,
                TranslateModule,
                MatIconModule,
                FuseWidgetModule,
                FuseConfirmDialogModule,
            ],
            exports: [
                QuickPanelComponent
            ]
        })
    ], QuickPanelModule);
    return QuickPanelModule;
}());
export { QuickPanelModule };
//# sourceMappingURL=quick-panel.module.js.map