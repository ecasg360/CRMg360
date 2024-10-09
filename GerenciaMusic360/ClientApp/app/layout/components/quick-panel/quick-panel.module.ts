import { NgModule } from '@angular/core';
import { MatDividerModule, MatListModule, MatSlideToggleModule, MatProgressSpinnerModule, MatIconModule, MatDialogModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { QuickPanelComponent } from '@app/layout/components/quick-panel/quick-panel.component';
import { TranslateModule } from '@ngx-translate/core';
import { FuseWidgetModule, FuseConfirmDialogModule } from '@fuse/components';

@NgModule({
    declarations: [
        QuickPanelComponent
    ],
    imports: [
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        FuseSharedModule,
        TranslateModule,
        MatIconModule,
        FuseWidgetModule,
        FuseConfirmDialogModule,
    ],
    exports: [
        QuickPanelComponent
    ]
})
export class QuickPanelModule {
}
