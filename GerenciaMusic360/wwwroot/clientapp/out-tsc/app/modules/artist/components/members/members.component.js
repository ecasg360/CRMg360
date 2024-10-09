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
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { EEndpoints } from '@enums/endpoints';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
var MembersComponent = /** @class */ (function () {
    function MembersComponent(apiService, toaster, _fuseTranslationLoaderService) {
        this.apiService = apiService;
        this.toaster = toaster;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.artistsList = [];
        this.isAdmin = true;
    }
    MembersComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        //TODO: crear condicion mostrar o no el select, se deberia toomar el id de artista cuando el rol sea ese
        this.getArtists();
    };
    //#region API
    MembersComponent.prototype.getArtists = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Artists).subscribe(function (response) {
            if (response.code == 100) {
                _this.artistsList = response.result.map(function (artist) {
                    return {
                        value: artist.id,
                        viewValue: artist.name + " " + artist.lastName + " " + artist.secondLastName
                    };
                });
            }
            else {
                _this.toaster.showToaster('Error obtenido listado de artistas');
            }
        }, function (err) { return console.log('http', err); });
    };
    MembersComponent = __decorate([
        Component({
            selector: 'app-members',
            templateUrl: './members.component.html',
            styleUrls: ['./members.component.scss']
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService])
    ], MembersComponent);
    return MembersComponent;
}());
export { MembersComponent };
//# sourceMappingURL=members.component.js.map