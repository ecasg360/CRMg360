import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalContractFormComponent } from './modal-contract-form.component';
import { MatDialogModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalsSharedModule } from '../../shared.module';
import { ContractFormModule } from '@app/commons/forms/components/contract-form/contract-form.module';

@NgModule({
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
export class ModalContractFormModule { }
