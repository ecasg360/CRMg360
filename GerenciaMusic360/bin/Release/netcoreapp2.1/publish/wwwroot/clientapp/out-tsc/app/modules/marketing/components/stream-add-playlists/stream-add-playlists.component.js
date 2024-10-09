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
import { Component, ViewChild, Optional, Inject } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { startWith, map } from 'rxjs/operators';
var StreamAddPlaylistsComponent = /** @class */ (function () {
    function StreamAddPlaylistsComponent(apiService, toaster, translationLoaderService, fb, translate, dialogRef, data) {
        var _a;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translationLoaderService = translationLoaderService;
        this.fb = fb;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.data = data;
        this.playlists = [];
        this.selectedPlaylists = [];
        this.networkPlaylist = [];
        this.playlistFC = new FormControl();
        this.question = '';
        this.isWorking = false;
        this.displayedColumns = ['social', 'playlist', 'action'];
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    StreamAddPlaylistsComponent.prototype.ngOnInit = function () {
        this.marketingOverviews = this.data;
        this._getPlaylists();
        this.initForm();
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    };
    StreamAddPlaylistsComponent.prototype.initForm = function () {
        this.formStreamPlaylist = this.fb.group({
            playlists: [null, [Validators.required]],
        });
    };
    Object.defineProperty(StreamAddPlaylistsComponent.prototype, "f", {
        get: function () { return this.formStreamPlaylist.controls; },
        enumerable: false,
        configurable: true
    });
    StreamAddPlaylistsComponent.prototype.enter = function () {
        var value = this.playlistFC.value;
        if (value.indexOf(this.question) < 0) {
            var found_1 = this.playlists.find(function (f) { return f.viewValue == value; });
            if (found_1) {
                this.selectedPlaylists.push(found_1);
                this.playlists = this.playlists.filter(function (f) { return f.value != found_1.value; });
                this._fillTable();
            }
            else
                this._setPlaylist(value);
        }
    };
    StreamAddPlaylistsComponent.prototype.autocompleteOptionSelected = function ($event) {
        if ($event.option.id != '0') {
            var found_2 = this.playlists.find(function (f) { return f.value == $event.option.id; });
            if (found_2) {
                this.selectedPlaylists.push(found_2);
                this.playlists = this.playlists.filter(function (f) { return f.value != found_2.value; });
                this._fillTable();
            }
        }
        else {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            this._setPlaylist(newItem);
        }
        this.playlistFC.patchValue('');
    };
    StreamAddPlaylistsComponent.prototype.deletePlaylistTable = function (row) {
        var found = this.selectedPlaylists.find(function (f) { return f.value == row.playlistId; });
        if (found) {
            this.selectedPlaylists = this.selectedPlaylists.filter(function (f) { return f.value != row.playlistId; });
            this.networkPlaylist = this.networkPlaylist.filter(function (f) { return f.playlistId != row.playlistId; });
            this.playlists.push(found);
            this._fillTable();
        }
    };
    StreamAddPlaylistsComponent.prototype.save = function () {
        var details = this._formatOverviewDetail();
        if (details.length > 0) {
            this._saveMarketingOverViewDetail(details);
        }
    };
    StreamAddPlaylistsComponent.prototype._setPlaylist = function (playlistName) {
        var playlist = {
            name: playlistName,
            active: true,
            socialNetworkTypeId: this.marketingOverviews.socialId
        };
        this._savePlaylist(playlist);
    };
    StreamAddPlaylistsComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        var result = this.playlists.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (result.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + value.trim() + "\"?"
                }]
            : result;
    };
    StreamAddPlaylistsComponent.prototype._fillTable = function () {
        var _this = this;
        this.networkPlaylist = this.selectedPlaylists.map(function (m) {
            return {
                socialNetworkId: _this.marketingOverviews.socialId,
                socialNetworkName: _this.marketingOverviews.socialName,
                playlistId: m.value,
                playlistName: m.viewValue,
            };
        });
        this.dataSource = new MatTableDataSource(this.networkPlaylist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.f.playlists.patchValue(this.selectedPlaylists);
    };
    StreamAddPlaylistsComponent.prototype._formatOverviewDetail = function () {
        var _this = this;
        var data = [];
        if (this.selectedPlaylists.length > 0) {
            this.selectedPlaylists.forEach(function (value, index) {
                data.push({
                    marketingOverviewId: _this.marketingOverviews.overview.id,
                    socialNetworkTypeId: _this.marketingOverviews.socialId,
                    playListId: value.value,
                    position: _this.marketingOverviews.detail.length + index
                });
            });
        }
        return data;
    };
    StreamAddPlaylistsComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    StreamAddPlaylistsComponent.prototype.onNoClick = function (overview) {
        if (overview === void 0) { overview = undefined; }
        this.dialogRef.close(overview);
    };
    //#region API
    StreamAddPlaylistsComponent.prototype._getPlaylists = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.PlayLists).subscribe(function (response) {
            if (response.code == 100) {
                var _loop_1 = function (index) {
                    var element = response.result[index];
                    var found = _this.marketingOverviews.detail.find(function (f) { return f.playListId == element.id; });
                    if (!found) {
                        _this.playlists.push({
                            value: element.id,
                            viewValue: element.name
                        });
                    }
                };
                for (var index = 0; index < response.result.length; index++) {
                    _loop_1(index);
                }
                _this.filteredOptions = _this.playlistFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    StreamAddPlaylistsComponent.prototype._savePlaylist = function (playlist) {
        var _this = this;
        this.apiService.save(EEndpoints.PlayList, playlist).subscribe(function (response) {
            if (response.code == 100) {
                var data = {
                    value: response.result.id,
                    viewValue: response.result.name
                };
                _this.selectedPlaylists.push(data);
                _this.playlists.push(data);
                _this._fillTable();
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
            }
            _this.playlistFC.patchValue('');
        }, function (err) { return _this._responseError(err); });
    };
    StreamAddPlaylistsComponent.prototype._saveMarketingOverViewDetail = function (details) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingOverviewDetails, details).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(_this.marketingOverviews);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild(MatPaginator, { static: true }),
        __metadata("design:type", MatPaginator)
    ], StreamAddPlaylistsComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], StreamAddPlaylistsComponent.prototype, "sort", void 0);
    StreamAddPlaylistsComponent = __decorate([
        Component({
            selector: 'app-stream-add-playlists',
            templateUrl: './stream-add-playlists.component.html',
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            FormBuilder,
            TranslateService,
            MatDialogRef, Object])
    ], StreamAddPlaylistsComponent);
    return StreamAddPlaylistsComponent;
}());
export { StreamAddPlaylistsComponent };
//# sourceMappingURL=stream-add-playlists.component.js.map