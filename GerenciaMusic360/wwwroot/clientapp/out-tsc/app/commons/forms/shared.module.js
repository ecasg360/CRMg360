var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
var SHARED_MODULES = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    TranslateModule,
    MatIconModule,
];
var FormsSharedModule = /** @class */ (function () {
    function FormsSharedModule() {
    }
    FormsSharedModule = __decorate([
        NgModule({
            imports: __spreadArray([], SHARED_MODULES),
            exports: __spreadArray([], SHARED_MODULES),
        })
    ], FormsSharedModule);
    return FormsSharedModule;
}());
export { FormsSharedModule };
//# sourceMappingURL=shared.module.js.map