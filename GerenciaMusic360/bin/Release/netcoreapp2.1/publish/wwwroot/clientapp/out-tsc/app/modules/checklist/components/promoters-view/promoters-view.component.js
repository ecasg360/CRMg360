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
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FuseTranslationLoaderService } from "../../../../../@fuse/services/translation-loader.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from "@i18n/allLang";
var PromotersViewComponent = /** @class */ (function () {
    function PromotersViewComponent(actionData, _fuseTranslationLoaderService, dialogRef, translate) {
        var _a;
        this.actionData = actionData;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.dialogRef = dialogRef;
        this.translate = translate;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    }
    PromotersViewComponent.prototype.ngOnInit = function () {
        this.model = this.actionData.model ? this.actionData.model : {};
        console.log(this.model);
    };
    PromotersViewComponent = __decorate([
        Component({
            selector: 'app-promoters-view',
            templateUrl: './promoters-view.component.html',
            styleUrls: ['./promoters-view.component.scss']
        }),
        __param(0, Optional()),
        __param(0, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, FuseTranslationLoaderService,
            MatDialogRef,
            TranslateService])
    ], PromotersViewComponent);
    return PromotersViewComponent;
}());
export { PromotersViewComponent };
//# sourceMappingURL=promoters-view.component.js.map