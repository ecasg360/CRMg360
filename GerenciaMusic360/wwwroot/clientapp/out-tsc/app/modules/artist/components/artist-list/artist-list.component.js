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
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { Subject } from 'rxjs';
import { EEndpoints } from '@enums/endpoints';
import { takeUntil } from 'rxjs/operators';
var ArtistListComponent = /** @class */ (function () {
    function ArtistListComponent(toaster, apiService, dialog, translate, _fuseTranslationLoaderService) {
        this.toaster = toaster;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.artists = [];
        this.artistsList = [];
        this.isWorking = true;
        this._unsubscribeAll = new Subject();
    }
    ArtistListComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.getArtistsApi();
    };
    ArtistListComponent.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    ArtistListComponent.prototype.openModal = function () {
    };
    ArtistListComponent.prototype.applyFilter = function (filterValue) {
        this.artistsList = this.artists.filter(function (f) { return f.name.includes(filterValue); });
    };
    ArtistListComponent.prototype.confirmDelete = function (id, name) {
    };
    ArtistListComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    ArtistListComponent.prototype.getArtistsApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Artists)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.artists = response.result;
                _this.artistsList = response.result;
            }
            else
                _this.toaster.showToaster(response.message);
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ArtistListComponent = __decorate([
        Component({
            selector: 'app-artist-list',
            templateUrl: './artist-list.component.html',
            styleUrls: ['./artist-list.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService])
    ], ArtistListComponent);
    return ArtistListComponent;
}());
export { ArtistListComponent };
//# sourceMappingURL=artist-list.component.js.map