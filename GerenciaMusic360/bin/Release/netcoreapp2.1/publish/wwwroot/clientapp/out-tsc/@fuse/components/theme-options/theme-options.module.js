var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCheckboxModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatOptionModule, MatRadioModule, MatSelectModule, MatSlideToggleModule } from '@angular/material';
import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FuseMaterialColorPickerModule } from '@fuse/components/material-color-picker/material-color-picker.module';
import { FuseSidebarModule } from '@fuse/components/sidebar/sidebar.module';
import { FuseThemeOptionsComponent } from '@fuse/components/theme-options/theme-options.component';
var FuseThemeOptionsModule = /** @class */ (function () {
    function FuseThemeOptionsModule() {
    }
    FuseThemeOptionsModule = __decorate([
        NgModule({
            declarations: [
                FuseThemeOptionsComponent
            ],
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                FlexLayoutModule,
                MatButtonModule,
                MatCheckboxModule,
                MatDividerModule,
                MatFormFieldModule,
                MatIconModule,
                MatOptionModule,
                MatRadioModule,
                MatSelectModule,
                MatSlideToggleModule,
                FuseDirectivesModule,
                FuseMaterialColorPickerModule,
                FuseSidebarModule
            ],
            exports: [
                FuseThemeOptionsComponent
            ]
        })
    ], FuseThemeOptionsModule);
    return FuseThemeOptionsModule;
}());
export { FuseThemeOptionsModule };
//# sourceMappingURL=theme-options.module.js.map