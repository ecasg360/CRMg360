var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
var ToasterService = /** @class */ (function () {
    function ToasterService(snackBar, translate, translationLoaderService) {
        var _a;
        this.snackBar = snackBar;
        this.translate = translate;
        this.translationLoaderService = translationLoaderService;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    ToasterService.prototype.showToaster = function (msg, timeDuration) {
        if (timeDuration === void 0) { timeDuration = 5000; }
        this.snackBar.open(msg, 'X', {
            duration: timeDuration,
        });
    };
    ToasterService.prototype.show = function (msg, timeDuration) {
        if (timeDuration === void 0) { timeDuration = 5000; }
        this.snackBar.open(msg, 'X', {
            duration: timeDuration,
        });
    };
    ToasterService.prototype.showTranslate = function (msg, timeDuration) {
        if (timeDuration === void 0) { timeDuration = 5000; }
        this.snackBar.open(this.translate.instant(msg), 'X', {
            duration: timeDuration,
        });
    };
    ToasterService = __decorate([
        Injectable({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [MatSnackBar,
            TranslateService,
            FuseTranslationLoaderService])
    ], ToasterService);
    return ToasterService;
}());
export { ToasterService };
//# sourceMappingURL=toaster.service.js.map