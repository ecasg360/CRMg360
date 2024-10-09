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
import { entity } from '@enums/entity';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
var ArtistManageComponent = /** @class */ (function () {
    function ArtistManageComponent(apiService, toaster, translate, route, router, _fuseTranslationLoaderService) {
        this.apiService = apiService;
        this.toaster = toaster;
        this.translate = translate;
        this.route = route;
        this.router = router;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.artist = {};
        this.entityType = entity.Artist;
        this.isBuyer = false;
    }
    ArtistManageComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.artist = this.route.snapshot.data.artist.result;
        if (!this.artist.id) {
            this.router.navigate(['/artist']);
        }
    };
    ArtistManageComponent.prototype.ngOnDestroy = function () {
    };
    ArtistManageComponent = __decorate([
        Component({
            selector: 'app-artist-manage',
            templateUrl: './artist-manage.component.html',
            styleUrls: ['./artist-manage.component.scss'],
            animations: fuseAnimations
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            TranslateService,
            ActivatedRoute,
            Router,
            FuseTranslationLoaderService])
    ], ArtistManageComponent);
    return ArtistManageComponent;
}());
export { ArtistManageComponent };
//# sourceMappingURL=artist-manage.component.js.map