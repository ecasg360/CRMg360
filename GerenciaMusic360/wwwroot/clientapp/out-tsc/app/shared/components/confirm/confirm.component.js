var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Optional, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { allLang } from '@i18n/allLang';
var ConfirmComponent = /** @class */ (function () {
    function ConfirmComponent(dialogRef, confirmData, translate, _fuseTranslationLoaderService) {
        var _a;
        this.dialogRef = dialogRef;
        this.confirmData = confirmData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.confirmAction = false;
        this.confirmText = '';
        this.confirmActionText = '';
        this.confirmActionIcon = '';
        this.title = '';
        this.confirmText = confirmData.text;
        this.confirmActionText = confirmData.action;
        this.confirmActionIcon = confirmData.icon;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.title = this.translate.instant('general.confirm');
    }
    ConfirmComponent.prototype.confirm = function () {
        this.confirmAction = true;
        this.onNoClick();
    };
    ConfirmComponent.prototype.onNoClick = function () {
        this.dialogRef.close({ confirm: this.confirmAction });
    };
    ConfirmComponent = __decorate([
        Component({
            selector: 'app-confirm',
            templateUrl: './confirm.component.html'
        }),
        __param(1, Optional()),
        __param(1, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef, Object, TranslateService,
            FuseTranslationLoaderService])
    ], ConfirmComponent);
    return ConfirmComponent;
}());
export { ConfirmComponent };
//# sourceMappingURL=confirm.component.js.map