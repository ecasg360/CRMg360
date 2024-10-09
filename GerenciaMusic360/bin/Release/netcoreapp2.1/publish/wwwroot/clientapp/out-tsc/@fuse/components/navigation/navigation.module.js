var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatRippleModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { FuseNavigationComponent } from './navigation.component';
import { FuseNavVerticalItemComponent } from './vertical/item/item.component';
import { FuseNavVerticalCollapsableComponent } from './vertical/collapsable/collapsable.component';
import { FuseNavVerticalGroupComponent } from './vertical/group/group.component';
import { FuseNavHorizontalItemComponent } from './horizontal/item/item.component';
import { FuseNavHorizontalCollapsableComponent } from './horizontal/collapsable/collapsable.component';
var FuseNavigationModule = /** @class */ (function () {
    function FuseNavigationModule() {
    }
    FuseNavigationModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                RouterModule,
                MatIconModule,
                MatRippleModule,
                TranslateModule.forChild()
            ],
            exports: [
                FuseNavigationComponent
            ],
            declarations: [
                FuseNavigationComponent,
                FuseNavVerticalGroupComponent,
                FuseNavVerticalItemComponent,
                FuseNavVerticalCollapsableComponent,
                FuseNavHorizontalItemComponent,
                FuseNavHorizontalCollapsableComponent
            ]
        })
    ], FuseNavigationModule);
    return FuseNavigationModule;
}());
export { FuseNavigationModule };
//# sourceMappingURL=navigation.module.js.map