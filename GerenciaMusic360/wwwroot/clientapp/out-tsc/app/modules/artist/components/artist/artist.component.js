var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from "@angular/core";
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AddArtistComponent } from "./add-artist.component";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from "@angular/router";
var ArtistComponent = /** @class */ (function () {
    function ArtistComponent(toaster, apiService, dialog, translate, _fuseTranslationLoaderService, activatedRoute) {
        var _this = this;
        this.toaster = toaster;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.activatedRoute = activatedRoute;
        this.artists = [];
        this.artistsFiltered = [];
        this.isWorking = true;
        this.artistDetail = false;
        this.albumList = [];
        this.albumsWorks = [];
        this.displayedColumns = ['picture', 'name', 'artistName', 'status', 'action'];
        this.viewLabel = this.translate.instant('general.table');
        this.isTable = false;
        this.viewIcon = 'dashboard';
        this.activatedRoute.data.subscribe(function (data) {
            _this.permisions = data;
        });
    }
    ArtistComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.innerWidth = window.outerWidth - 60;
        this.getArtistsApi();
    };
    ArtistComponent.prototype.changeView = function () {
        this.isTable = !this.isTable;
        if (this.isTable) {
            this.viewLabel = this.translate.instant('general.cards');
            this.viewIcon = 'featured_play_list';
        }
        else {
            this.viewLabel = this.translate.instant('general.table');
            this.viewIcon = 'dashboard';
        }
    };
    ArtistComponent.prototype.applyFilter = function (filterValue) {
        if (filterValue)
            this.artistsFiltered = this.artists.filter(function (f) { return ("" + f.name + f.lastName).toLowerCase().includes(filterValue.toLowerCase()); });
        else
            this.artistsFiltered = this.artists;
        this.fillTable();
    };
    ArtistComponent.prototype.fillTable = function () {
        this.dataSource = new MatTableDataSource(this.artistsFiltered);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    //#region API
    ArtistComponent.prototype.getArtistsApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Artists).subscribe(function (response) {
            if (response.code == 100) {
                _this.artists = response.result;
                _this.artistsFiltered = response.result;
                _this.fillTable();
            }
            else {
                _this.toaster.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.resposeError(err); });
    };
    ArtistComponent.prototype.updateStatusApi = function (params) {
        var _this = this;
        this.apiService.save(EEndpoints.ArtistStatus, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.getArtistsApi();
            }
            else {
                _this.toaster.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.resposeError(err); });
    };
    ArtistComponent.prototype.deleteArtistApi = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.Artist, { id: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.getArtistsApi();
                _this.toaster.showToaster(_this.translate.instant('messages.artistDeleted'));
            }
            else {
                _this.toaster.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.resposeError(err); });
    };
    //#endregion
    ArtistComponent.prototype.confirmDelete = function (id, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteArtistApi(id);
            }
        });
    };
    ArtistComponent.prototype.updateStatus = function (id, status) {
        this.isWorking = true;
        var statusId = (status == 1) ? 2 : 1;
        this.updateStatusApi({ id: id, status: statusId });
    };
    ArtistComponent.prototype.resposeError = function (err) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    ArtistComponent.prototype.openModal = function (id) {
        var _this = this;
        var dialogRef = this.dialog.open(AddArtistComponent, {
            width: this.innerWidth,
            maxWidth: this.innerWidth,
            data: {
                personId: id,
                model: this.artists.find(function (f) { return f.id == id; }),
                isArtist: true
            }
        });
        dialogRef.afterClosed().subscribe(function (data) {
            _this.getArtistsApi();
        });
    };
    ArtistComponent.prototype.openDetail = function () {
        this.artistDetail = !this.artistDetail;
    };
    ArtistComponent.prototype.getArtist = function (id) {
        this.openDetail();
        this.artist = this.artists.find(function (i) { return i.id == id; });
        this.getSocialMedias(id);
        this.getAlbums(id);
        this.getArtistMembers(id);
        return;
    };
    ArtistComponent.prototype.getSocialMedias = function (id) {
        var _this = this;
        this.apiService.get(EEndpoints.SocialNetworks, { personId: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.socialsMedia = response.result;
            }
            else {
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    ArtistComponent.prototype.getAlbums = function (id) {
        var _this = this;
        this.apiService.get(EEndpoints.AlbumsByPerson, { personId: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.albumList = response.result;
                _this.albumsWorks = [];
                _this.albumList.forEach(function (item) { return _this.getAlbumsWork(item.id); });
            }
            else {
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    ArtistComponent.prototype.getAlbumsWork = function (id) {
        var _this = this;
        this.isWorking = true;
        var param = { albumId: id };
        this.apiService.get(EEndpoints.AlbumWorks, param).subscribe(function (response) {
            if (response.code == 100) {
                _this.albumsWorks.push(response.result);
            }
            else {
                _this.toaster.showToaster('Error obteniendo datos del album');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ArtistComponent.prototype.getArtistMembers = function (id) {
        var _this = this;
        this.apiService.get(EEndpoints.ArtistMembers, { personId: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.artistMembers = response.result;
                console.log(_this.artistMembers);
            }
            else {
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    ArtistComponent.prototype.responseError = function (err) {
        console.log('http error', err);
        this.isWorking = false;
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], ArtistComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], ArtistComponent.prototype, "sort", void 0);
    ArtistComponent = __decorate([
        Component({
            selector: 'app-artist',
            templateUrl: './artist.component.html',
            styleUrls: ['./artist.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService,
            ActivatedRoute])
    ], ArtistComponent);
    return ArtistComponent;
}());
export { ArtistComponent };
//# sourceMappingURL=artist.component.js.map