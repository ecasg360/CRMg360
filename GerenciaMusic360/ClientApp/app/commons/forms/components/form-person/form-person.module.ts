import { NgModule } from '@angular/core';
import { MatAutocompleteModule, MatDatepickerModule } from '@angular/material';
import { FormsSharedModule } from '../../shared.module';
import { FormPersonComponent } from './form-person.component';


@NgModule({
    declarations: [
        FormPersonComponent,
    ],
    imports: [
        FormsSharedModule,
        MatAutocompleteModule,
        MatDatepickerModule,
    ],
    exports: [
        FormPersonComponent,
    ]
})

export class FormPersonModule {
}
