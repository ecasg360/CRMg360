var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';
import { ContractsRoutingModule } from './contract-routing.module';
import { ContractListComponent } from './components/contract-list/contract-list.component';
import { ContractManagerComponent } from './components/contract-manager/contract-manager.component';
import { ContractMembersManagerComponent } from './components/contract-members-manager/contract-members-manager.component';
import { ContractTermsManagerComponent } from './components/contract-terms-manager/contract-terms-manager.component';
import { ContractDataComponent } from './components/contract-data/contract-data.component';
import { ContractPreviewComponent } from './components/contract-preview/contract-preview.component';
import { ContractMembersImageComponent } from './components/contract-members-image/contract-members-image.component';
import { ContractFormModule } from '@app/commons/forms/components/contract-form/contract-form.module';
import { ModalContractFormModule } from '@app/commons/modals/components/modal-contract-form/modal-contract-form.module';
import { SelectionContractTermsComponent } from './components/selection-contract-terms/selection-contract-terms.component';
import { AddTermTypeComponent } from './components/add-term-type/add-term-type.component';
import { AddStatusContractComponent } from './components/add-status-contract/add-status-contract.component';
import { StatusContractManagerComponent } from './components/status-contract-manager/status-contract-manager.component';
import { ContractResolve } from '@resolve/contracts.resolve';
import { FlexLayoutModule } from '@angular/flex-layout';
var ContractsModule = /** @class */ (function () {
    function ContractsModule() {
    }
    ContractsModule = __decorate([
        NgModule({
            declarations: [
                ContractListComponent,
                ContractManagerComponent,
                ContractMembersManagerComponent,
                ContractTermsManagerComponent,
                ContractDataComponent,
                ContractPreviewComponent,
                ContractMembersImageComponent,
                SelectionContractTermsComponent,
                AddTermTypeComponent,
                AddStatusContractComponent,
                StatusContractManagerComponent
            ],
            entryComponents: [
                ContractPreviewComponent,
                SelectionContractTermsComponent,
                AddTermTypeComponent,
                AddStatusContractComponent
            ],
            imports: [
                CommonModule,
                ContractsRoutingModule,
                SharedModule,
                FuseConfirmDialogModule,
                FlexLayoutModule,
                ContractFormModule,
                ModalContractFormModule,
            ],
            providers: [
                ContractResolve
            ],
        })
    ], ContractsModule);
    return ContractsModule;
}());
export { ContractsModule };
//# sourceMappingURL=contracts.module.js.map