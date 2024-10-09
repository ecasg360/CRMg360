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
import { EEndpoints } from '@enums/endpoints';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
var AlbumesComponent = /** @class */ (function () {
    function AlbumesComponent(apiService, toaster) {
        this.apiService = apiService;
        this.toaster = toaster;
        this.artistsList = [];
        this.isAdmin = true;
    }
    AlbumesComponent.prototype.ngOnInit = function () {
        //TODO: crear condicion mostrar o no el select, se deberia toomar el id de artista cuando el rol sea ese
        this.getArtists();
    };
    //#region API
    AlbumesComponent.prototype.getArtists = function () {
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
    AlbumesComponent = __decorate([
        Component({
            selector: 'app-albumes',
            templateUrl: './albumes.component.html',
            styleUrls: ['./albumes.component.scss']
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService])
    ], AlbumesComponent);
    return AlbumesComponent;
}());
export { AlbumesComponent };
//# sourceMappingURL=albumes.component.js.map