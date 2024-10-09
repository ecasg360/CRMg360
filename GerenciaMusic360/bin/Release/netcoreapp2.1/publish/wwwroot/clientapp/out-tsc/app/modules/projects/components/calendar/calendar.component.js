var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { EEventType } from '@enums/modules-types';
var CalendarComponent = /** @class */ (function () {
    function CalendarComponent(toaster, translate, translationLoader) {
        this.toaster = toaster;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.eventType = EEventType;
    }
    //#region Lifecycle hooks
    CalendarComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
    };
    CalendarComponent = __decorate([
        Component({
            selector: 'calendar',
            templateUrl: './calendar.component.html',
            styleUrls: ['./calendar.component.scss'],
        }),
        __metadata("design:paramtypes", [ToasterService,
            TranslateService,
            FuseTranslationLoaderService])
    ], CalendarComponent);
    return CalendarComponent;
}());
export { CalendarComponent };
//# sourceMappingURL=calendar.component.js.map