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
import { Component, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@app/core/i18n/allLang';
var ImagePreviewComponent = /** @class */ (function () {
    function ImagePreviewComponent(dialogRef, confirmData, translate, _fuseTranslationLoaderService) {
        var _a;
        this.dialogRef = dialogRef;
        this.confirmData = confirmData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.caption = false;
        this.imageUrl = '';
        this.title = '';
        this.caption = confirmData.caption;
        this.imageUrl = confirmData.imageUrl;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.title = this.translate.instant('general.preview');
    }
    ImagePreviewComponent.prototype.ngOnInit = function () {
    };
    ImagePreviewComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    ImagePreviewComponent = __decorate([
        Component({
            selector: 'app-image-preview',
            templateUrl: './image-preview.component.html',
            styleUrls: ['./image-preview.component.scss']
        }),
        __param(1, Optional()),
        __param(1, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef, Object, TranslateService,
            FuseTranslationLoaderService])
    ], ImagePreviewComponent);
    return ImagePreviewComponent;
}());
export { ImagePreviewComponent };
//# sourceMappingURL=image-preview.component.js.map