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
import { Component, Optional, Inject, ViewChild } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { Validators } from '@angular/forms';
var StreamingPlaylistComponent = /** @class */ (function () {
    function StreamingPlaylistComponent(apiService, toaster, translationLoaderService, fb, translate, dialogRef, data) {
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
        this.socialNetworksList = [];
        this.playlistFC = new FormControl();
        this.question = '';
        this.isWorking = false;
        this.activeSocial = -1;
        this.displayedColumns = ['social', 'playlist', 'action'];
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this._getSocialNetworkTypes();
    }
    StreamingPlaylistComponent.prototype.ngOnInit = function () {
        this.marketingOverviews = this.data;
        this._getPlaylists();
        this.initForm();
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    };
    StreamingPlaylistComponent.prototype.initForm = function () {
        this.formStreamPlaylist = this.fb.group({
            id: [this.marketingOverviews.id, []],
            marketingId: [this.marketingOverviews.marketingId, []],
            sectionId: [this.marketingOverviews.sectionId, []],
            descriptionExt: ['', []],
            position: [this.marketingOverviews.position, []],
            playlists: [null, [Validators.required]],
            social: [null, [Validators.required]]
        });
    };
    Object.defineProperty(StreamingPlaylistComponent.prototype, "f", {
        get: function () { return this.formStreamPlaylist.controls; },
        enumerable: false,
        configurable: true
    });
    StreamingPlaylistComponent.prototype.enter = function () {
        if (this.activeSocial <= 0) {
            this.activeSocial = 0;
            this.playlistFC.patchValue('');
            return;
        }
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
    StreamingPlaylistComponent.prototype.autocompleteOptionSelected = function ($event) {
        if (this.activeSocial <= 0) {
            this.activeSocial = 0;
            this.playlistFC.patchValue('');
            return;
        }
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
    StreamingPlaylistComponent.prototype.addSocialNetwork = function (item) {
        this.activeSocial = item.id;
        this.f.social.patchValue(item.id);
        this._fillTable();
    };
    StreamingPlaylistComponent.prototype.deletePlaylistTable = function (row) {
        var found = this.selectedPlaylists.find(function (f) { return f.value == row.playlistId; });
        if (found) {
            this.selectedPlaylists = this.selectedPlaylists.filter(function (f) { return f.value != row.playlistId; });
            this.networkPlaylist = this.networkPlaylist.filter(function (f) { return f.playlistId != row.playlistId; });
            this.playlists.push(found);
            this._fillTable();
        }
    };
    StreamingPlaylistComponent.prototype.save = function () {
        this.marketingOverviews = this.formStreamPlaylist.value;
        delete this.marketingOverviews['playlists'];
        delete this.marketingOverviews['social'];
        if (this.marketingOverviews.id) {
            var details = this._formatOverviewDetail(this.marketingOverviews.id);
            if (details.length > 0) {
                this._saveMarketingOverViewDetail(details);
            }
        }
        else {
            delete this.marketingOverviews['id'];
            this._saveMarketingOverView(this.marketingOverviews);
        }
    };
    StreamingPlaylistComponent.prototype._setPlaylist = function (playlistName) {
        var playlist = {
            name: playlistName,
            active: true,
            socialNetworkTypeId: this.activeSocial
        };
        this._savePlaylist(playlist);
    };
    StreamingPlaylistComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        var result = this.playlists.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (result.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + value.trim() + "\"?"
                }]
            : result;
    };
    StreamingPlaylistComponent.prototype._fillTable = function () {
        var _this = this;
        var social = this.socialNetworksList.find(function (f) { return f.id == _this.activeSocial; });
        if (!social) {
            return;
        }
        this.networkPlaylist = this.selectedPlaylists.map(function (m) {
            return {
                socialNetworkId: social.id,
                socialNetworkName: social.name,
                playlistId: m.value,
                playlistName: m.viewValue,
            };
        });
        this.dataSource = new MatTableDataSource(this.networkPlaylist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.f.playlists.patchValue(this.selectedPlaylists);
    };
    StreamingPlaylistComponent.prototype._formatOverviewDetail = function (overviewId) {
        var _this = this;
        var data = [];
        if (overviewId && this.selectedPlaylists.length > 0) {
            this.selectedPlaylists.forEach(function (value, index) {
                data.push({
                    marketingOverviewId: overviewId,
                    socialNetworkTypeId: _this.activeSocial,
                    playListId: value.value,
                    position: index + 1
                });
            });
        }
        return data;
    };
    StreamingPlaylistComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    StreamingPlaylistComponent.prototype.onNoClick = function (overview) {
        if (overview === void 0) { overview = undefined; }
        this.dialogRef.close(overview);
    };
    //#region API
    StreamingPlaylistComponent.prototype._getPlaylists = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.PlayLists).subscribe(function (response) {
            if (response.code == 100) {
                _this.playlists = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name
                    };
                });
                _this.filteredOptions = _this.playlistFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
            }
            _this.isWorking = false;
        }, this._responseError);
    };
    StreamingPlaylistComponent.prototype._getSocialNetworkTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.SocialNetworkTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.socialNetworksList = response.result; //.filter(f => f.statusRecordId == 1);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
            }
            _this.isWorking = false;
        }, this._responseError);
    };
    StreamingPlaylistComponent.prototype._savePlaylist = function (playlist) {
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
        }, this._responseError);
    };
    StreamingPlaylistComponent.prototype._saveMarketingOverView = function (overview) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingOverview, overview).subscribe(function (response) {
            if (response.code == 100) {
                _this.marketingOverviews = response.result;
                var details = _this._formatOverviewDetail(response.result.id);
                if (details.length > 0) {
                    _this._saveMarketingOverViewDetail(details);
                }
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, this._responseError);
    };
    StreamingPlaylistComponent.prototype._saveMarketingOverViewDetail = function (details) {
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
        }, this._responseError);
    };
    __decorate([
        ViewChild(MatPaginator, { static: true }),
        __metadata("design:type", MatPaginator)
    ], StreamingPlaylistComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], StreamingPlaylistComponent.prototype, "sort", void 0);
    StreamingPlaylistComponent = __decorate([
        Component({
            selector: 'app-streaming-playlist',
            templateUrl: './streaming-playlist.component.html',
            styleUrls: ['./streaming-playlist.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            FormBuilder,
            TranslateService,
            MatDialogRef, Object])
    ], StreamingPlaylistComponent);
    return StreamingPlaylistComponent;
}());
export { StreamingPlaylistComponent };
//# sourceMappingURL=streaming-playlist.component.js.map