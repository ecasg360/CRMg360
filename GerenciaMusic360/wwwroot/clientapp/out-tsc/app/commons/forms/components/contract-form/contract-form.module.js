var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { ContractFormComponent } from './contract-form.component';
import { MatAutocompleteModule, MatDatepickerModule } from '@angular/material';
import { FormsSharedModule } from '../../shared.module';
var ContractFormModule = /** @class */ (function () {
    function ContractFormModule() {
    }
    ContractFormModule = __decorate([
        NgModule({
            declarations: [
                ContractFormComponent,
            ],
            imports: [
                FormsSharedModule,
                MatAutocompleteModule,
                MatDatepickerModule,
            ],
            exports: [
                ContractFormComponent,
            ]
        })
    ], ContractFormModule);
    return ContractFormModule;
}());
export { ContractFormModule };
//# sourceMappingURL=contract-form.module.js.map