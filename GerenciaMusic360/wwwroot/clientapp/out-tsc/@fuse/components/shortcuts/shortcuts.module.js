var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatTooltipModule } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import { FuseShortcutsComponent } from './shortcuts.component';
var FuseShortcutsModule = /** @class */ (function () {
    function FuseShortcutsModule() {
    }
    FuseShortcutsModule = __decorate([
        NgModule({
            declarations: [
                FuseShortcutsComponent
            ],
            imports: [
                CommonModule,
                RouterModule,
                FlexLayoutModule,
                MatButtonModule,
                MatDividerModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
                MatMenuModule,
                MatListModule,
                MatTooltipModule
            ],
            exports: [
                FuseShortcutsComponent
            ],
            providers: [
                CookieService
            ]
        })
    ], FuseShortcutsModule);
    return FuseShortcutsModule;
}());
export { FuseShortcutsModule };
//# sourceMappingURL=shortcuts.module.js.map