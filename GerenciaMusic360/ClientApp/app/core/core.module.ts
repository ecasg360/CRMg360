import { AccountService } from './services/account.service';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ToasterService } from './services/toaster.service';
import { Error500Component } from './components/500/error-500.component';
import { Error404Component } from './components/404/error-404.component';

const CORE_COMPONENTS = [
    Error500Component,
    Error404Component
];

@NgModule({
    declarations: [
        ...CORE_COMPONENTS,
    ],
    imports: [
        CommonModule,
        SharedModule,
        FuseSharedModule,
    ],
    providers: [
        AccountService,
        ToasterService,
    ],
    entryComponents: [
        ...CORE_COMPONENTS
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: []
        };
    }
}
