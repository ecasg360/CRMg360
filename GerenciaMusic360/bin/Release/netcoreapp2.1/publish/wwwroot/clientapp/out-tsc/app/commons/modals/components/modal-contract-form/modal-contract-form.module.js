var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { ModalContractFormComponent } from './modal-contract-form.component';
import { MatDialogModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalsSharedModule } from '../../shared.module';
import { ContractFormModule } from '@app/commons/forms/components/contract-form/contract-form.module';
var ModalContractFormModule = /** @class */ (function () {
    function ModalContractFormModule() {
    }
    ModalContractFormModule = __decorate([
        NgModule({
            declarations: [
                ModalContractFormComponent,
            ],
            entryComponents: [
                ModalContractFormComponent,
            ],
            imports: [
                ModalsSharedModule,
                MatDialogModule,
                MatButtonModule,
                FormsModule,
                ReactiveFormsModule,
                MatProgressSpinnerModule,
                ContractFormModule,
            ]
        })
    ], ModalContractFormModule);
    return ModalContractFormModule;
}());
export { ModalContractFormModule };
//# sourceMappingURL=modal-contract-form.module.js.map