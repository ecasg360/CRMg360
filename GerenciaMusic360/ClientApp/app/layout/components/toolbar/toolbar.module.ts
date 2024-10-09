import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule, MatBadgeModule, MatSnackBarModule } from '@angular/material';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ToolbarComponent } from '@app/layout/components/toolbar/toolbar.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatBadgeModule,
        MatToolbarModule,
        TranslateModule,
        FuseSharedModule,
        FuseSearchBarModule,
        MatSnackBarModule,
        FuseShortcutsModule,
    ],
    exports: [
        ToolbarComponent
    ]
})
export class ToolbarModule {
}
