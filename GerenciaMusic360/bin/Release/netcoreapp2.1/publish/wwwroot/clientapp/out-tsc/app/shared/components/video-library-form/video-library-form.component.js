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
import { Component, Optional, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ApiService } from '@services/api.service';
import { map, startWith } from 'rxjs/operators';
var VideoLibraryFormComponent = /** @class */ (function () {
    function VideoLibraryFormComponent(fb, translate, service, _fuseTranslationLoaderService, actionData, dialogRef) {
        this.fb = fb;
        this.translate = translate;
        this.service = service;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.actionData = actionData;
        this.dialogRef = dialogRef;
        this.artistCtrl = new FormControl();
        this.isWorking = true;
        this.allArtists = []; //workListSource
        this.artists = []; //workList
        this.artistVideo = []; //userWorkList
        this.videoTypes = [];
    }
    VideoLibraryFormComponent.prototype.ngOnInit = function () {
        var _a;
        this.isWorking = true;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.video = this.actionData.model;
        this.configureForm();
        this.artistCtrl.disable();
        this.getArtists();
        this.getVideoTypes();
    };
    VideoLibraryFormComponent.prototype.initComposers = function () {
        if (!this.video.id) {
            this.action = this.translate.instant('general.save');
        }
        else {
            this.action = this.translate.instant('general.edit');
            this.pictureUrl = this.video.pictureUrl;
            this.getVideoComposers();
        }
        this.isWorking = false;
    };
    Object.defineProperty(VideoLibraryFormComponent.prototype, "f", {
        get: function () { return this.videoForm.controls; },
        enumerable: false,
        configurable: true
    });
    VideoLibraryFormComponent.prototype.configureForm = function () {
        var _this = this;
        this.videoForm = this.fb.group({
            name: [this.video.name, [Validators.required]],
            videoTypeId: [this.video.videoTypeId, [Validators.required]],
            videoUrl: [this.video.videoUrl, [Validators.required]],
            cover: [this.video.cover, []],
            pictureUrl: [this.video.pictureUrl, []],
            videoTypeName: [this.video.videoTypeName, []]
        });
        this.filteredArtists = this.artistCtrl.valueChanges
            .pipe(startWith(''), map(function (artist) { return artist ? _this._filterArtist(artist) : _this.artists.slice(); }));
    };
    VideoLibraryFormComponent.prototype.selectImage = function ($evt) {
        this.pictureUrl = $evt;
        this.videoForm.controls['pictureUrl'].patchValue($evt);
    };
    VideoLibraryFormComponent.prototype.onNoClick = function (data) {
        if (data === void 0) { data = undefined; }
        this.dialogRef.close(data);
    };
    VideoLibraryFormComponent.prototype.setVideo = function () {
        if (!this.videoForm.invalid) {
            this.video = this.videoForm.value;
            this.video.artists = this.artistVideo;
            this.isWorking = true;
            this.video.pictureUrl = (this.pictureUrl.indexOf('assets') >= 0)
                ? null : this.video.pictureUrl;
            this.onNoClick(this.video);
        }
    };
    VideoLibraryFormComponent.prototype.getArtists = function () {
        var _this = this;
        this.service.get(EEndpoints.Artists).subscribe(function (response) {
            if (response.code == 100) {
                _this.initComposers();
                _this.allArtists = response.result;
                _this.artists = _this.allArtists;
                _this.artistCtrl.enable();
            }
        }, function (err) { return _this.responseError(err); });
    };
    VideoLibraryFormComponent.prototype.getVideoComposers = function () {
        var _this = this;
        var params = {
            videoId: this.video.id,
            typeId: 1
        };
        this.service.get(EEndpoints.VideoComposers, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.artistVideo = response.result.map(function (m) {
                    return _this.allArtists.find(function (f) { return f.id == m.personComposerId; });
                });
            }
            else
                console.log('response', response);
        }, function (err) { return console.log('http', err); });
    };
    VideoLibraryFormComponent.prototype._filterArtist = function (value) {
        var filterValue = value.toLowerCase();
        return this.artists.filter(function (artist) { return artist.name.toLowerCase().indexOf(filterValue) === 0; });
    };
    VideoLibraryFormComponent.prototype.selectedArtist = function ($event) {
        var artistId = parseInt($event.option.id);
        var artist = this.artists.find(function (f) { return f.id == artistId; });
        this.artistVideo.push(artist);
        this.artists = this.artists.filter(function (f) { return f.id != artistId; });
        this.artistCtrl.setValue('');
    };
    VideoLibraryFormComponent.prototype.removeChip = function (chip) {
        var index = this.artistVideo.findIndex(function (fi) { return fi.id == chip.id; });
        if (index >= 0) {
            this.artistVideo.splice(index, 1);
            var found = this.allArtists.find(function (f) { return f.id == chip.id; });
            if (found) {
                this.artists.push(found);
                this.artists.slice();
                //Nota: para forzar el evento valueChanges de control y asi actualizar el datasource
                this.artistCtrl.setValue(this.artistCtrl.value);
            }
        }
    };
    VideoLibraryFormComponent.prototype.getVideoTypes = function () {
        var _this = this;
        var params = [];
        params['typeId'] = 4;
        this.service.get(EEndpoints.Types, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.videoTypes = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    VideoLibraryFormComponent.prototype.responseError = function (err) {
        console.log('http error', err);
    };
    VideoLibraryFormComponent = __decorate([
        Component({
            selector: 'app-video-library-form',
            templateUrl: './video-library-form.component.html',
            styleUrls: ['video-library-form.component.scss']
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            TranslateService,
            ApiService,
            FuseTranslationLoaderService, Object, MatDialogRef])
    ], VideoLibraryFormComponent);
    return VideoLibraryFormComponent;
}());
export { VideoLibraryFormComponent };
//# sourceMappingURL=video-library-form.component.js.map