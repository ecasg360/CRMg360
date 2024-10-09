import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatRadioModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';


const SHARED_MODULES = [
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

@NgModule({
    imports: [...SHARED_MODULES],
    exports: [...SHARED_MODULES],
})
export class FormsSharedModule {
}
