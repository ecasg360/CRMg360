import { NgModule } from '@angular/core';
import { ContractFormComponent } from './contract-form.component';
import { MatAutocompleteModule, MatDatepickerModule } from '@angular/material';
import { FormsSharedModule } from '../../shared.module';

@NgModule({
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

export class ContractFormModule {
}
