import { Component, Optional, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { allLang } from '@i18n/allLang';


@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html'
})

export class ConfirmComponent {

    confirmAction: boolean = false;
    confirmText: string = '';
    confirmActionText: string = '';
    confirmActionIcon: string = '';
    title: string = '';

    constructor(
        public dialogRef: MatDialogRef<ConfirmComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public confirmData: any,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this.confirmText = confirmData.text;
        this.confirmActionText = confirmData.action;
        this.confirmActionIcon = confirmData.icon;
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.title = this.translate.instant('general.confirm');
    }

    confirm() {
        this.confirmAction = true;
        this.onNoClick();
    }

    onNoClick(): void {
        this.dialogRef.close({ confirm: this.confirmAction });
    }
}