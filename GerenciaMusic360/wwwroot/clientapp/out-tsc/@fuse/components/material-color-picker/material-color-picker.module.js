var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule } from '@angular/material';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { FuseMaterialColorPickerComponent } from '@fuse/components/material-color-picker/material-color-picker.component';
var FuseMaterialColorPickerModule = /** @class */ (function () {
    function FuseMaterialColorPickerModule() {
    }
    FuseMaterialColorPickerModule = __decorate([
        NgModule({
            declarations: [
                FuseMaterialColorPickerComponent
            ],
            imports: [
                CommonModule,
                FlexLayoutModule,
                MatButtonModule,
                MatIconModule,
                MatMenuModule,
                MatTooltipModule,
                FusePipesModule
            ],
            exports: [
                FuseMaterialColorPickerComponent
            ],
        })
    ], FuseMaterialColorPickerModule);
    return FuseMaterialColorPickerModule;
}());
export { FuseMaterialColorPickerModule };
//# sourceMappingURL=material-color-picker.module.js.map