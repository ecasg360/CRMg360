import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';

@Injectable({
    providedIn: 'root',
})
export class ToasterService {

    constructor(
        private snackBar: MatSnackBar,
        private translate: TranslateService,
        private translationLoaderService: FuseTranslationLoaderService
    ) {
        this.translationLoaderService.loadTranslations(...allLang);
    }

    showToaster(msg: string, timeDuration: number = 5000) {
        this.snackBar.open(msg, 'X', {
            duration: timeDuration,
        });
    }

    show(msg: string, timeDuration: number = 5000) {
        this.snackBar.open(msg, 'X', {
            duration: timeDuration,
        });
    }

    showTranslate(msg: string, timeDuration: number = 5000) {
        this.snackBar.open(this.translate.instant(msg), 'X', {
            duration: timeDuration,
        });
    }
}