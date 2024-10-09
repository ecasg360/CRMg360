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
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder } from '@angular/forms';
var AlbumDetailComponent = /** @class */ (function () {
    function AlbumDetailComponent(translate, _fuseTranslationLoaderService, fb) {
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.fb = fb;
    }
    AlbumDetailComponent.prototype.ngOnInit = function () {
    };
    AlbumDetailComponent.prototype.ngOnDestroy = function () {
        throw new Error("Method not implemented.");
    };
    AlbumDetailComponent = __decorate([
        Component({
            selector: 'app-album-detail',
            templateUrl: './album-detail.component.html',
            styleUrls: ['./album-detail.component.css']
        }),
        __metadata("design:paramtypes", [TranslateService,
            FuseTranslationLoaderService,
            FormBuilder])
    ], AlbumDetailComponent);
    return AlbumDetailComponent;
}());
export { AlbumDetailComponent };
//# sourceMappingURL=album-detail.component.js.map