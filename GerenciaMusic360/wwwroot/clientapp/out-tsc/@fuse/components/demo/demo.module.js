var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDividerModule, MatListModule } from '@angular/material';
import { FuseDemoContentComponent } from './demo-content/demo-content.component';
import { FuseDemoSidebarComponent } from './demo-sidebar/demo-sidebar.component';
var FuseDemoModule = /** @class */ (function () {
    function FuseDemoModule() {
    }
    FuseDemoModule = __decorate([
        NgModule({
            declarations: [
                FuseDemoContentComponent,
                FuseDemoSidebarComponent
            ],
            imports: [
                RouterModule,
                MatDividerModule,
                MatListModule
            ],
            exports: [
                FuseDemoContentComponent,
                FuseDemoSidebarComponent
            ]
        })
    ], FuseDemoModule);
    return FuseDemoModule;
}());
export { FuseDemoModule };
//# sourceMappingURL=demo.module.js.map