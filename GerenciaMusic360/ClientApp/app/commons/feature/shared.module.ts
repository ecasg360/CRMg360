import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';


const SHARED_MODULES = [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
];

@NgModule({
    imports: [...SHARED_MODULES],
    exports: [...SHARED_MODULES],
})
export class FeaturesSharedModule {
}
