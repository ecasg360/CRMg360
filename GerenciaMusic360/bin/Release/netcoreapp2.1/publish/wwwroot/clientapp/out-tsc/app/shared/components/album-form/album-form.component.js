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
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { startWith, map } from 'rxjs/operators';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
var AlbumFormComponent = /** @class */ (function () {
    function AlbumFormComponent(formBuilder, translate, apiService, _fuseTranslationLoaderService, actionData, dialogRef) {
        this.formBuilder = formBuilder;
        this.translate = translate;
        this.apiService = apiService;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.actionData = actionData;
        this.dialogRef = dialogRef;
        this.workCtrl = new FormControl();
        this.workListSource = [];
        this.workList = [];
        this.model = {};
        this.userWorkList = [];
    }
    AlbumFormComponent.prototype.ngOnInit = function () {
        var _a;
        this.isWorking = true;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.model = this.actionData.model;
        this.getWoksApi();
        if (!this.model.id) {
            this.action = this.translate.instant('general.save');
        }
        else {
            this.action = this.translate.instant('general.save');
            this.pictureURL = this.model.pictureUrl;
            //this.getAlbumWorksApi();
        }
        this.configureForm();
        this.workCtrl.disable();
        this.isWorking = false;
    };
    Object.defineProperty(AlbumFormComponent.prototype, "f", {
        get: function () { return this.albumForm.controls; },
        enumerable: false,
        configurable: true
    });
    AlbumFormComponent.prototype.configureForm = function () {
        var _this = this;
        var releaseDateString = (this.model.releaseDate)
            ? (new Date(this.model.releaseDate)).toISOString()
            : '';
        this.albumForm = this.formBuilder.group({
            name: [this.model.name, [Validators.required]],
            numRecord: [this.model.numRecord, []],
            pictureUrl: [this.model.pictureUrl, []],
            releaseDateString: [releaseDateString, [Validators.required]],
        });
        this.filteredWorks = this.workCtrl.valueChanges
            .pipe(startWith(''), map(function (work) { return work ? _this._filterWorks(work) : _this.workList.slice(); }));
    };
    AlbumFormComponent.prototype.selectImage = function ($evt) {
        this.pictureURL = $evt;
        this.albumForm.controls['pictureUrl'].patchValue($evt);
    };
    AlbumFormComponent.prototype.onNoClick = function (data) {
        if (data === void 0) { data = undefined; }
        this.dialogRef.close(data);
    };
    AlbumFormComponent.prototype.setAlbum = function () {
        if (!this.albumForm.invalid) {
            this.model = this.albumForm.value;
            this.model.numRecord = this.userWorkList.length.toString();
            this.model.works = this.userWorkList;
            this.model.pictureUrl = (this.pictureURL)
                ? this.pictureURL : this.model.pictureUrl;
            this.onNoClick(this.model);
        }
    };
    AlbumFormComponent.prototype.getWoksApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Works).subscribe(function (response) {
            if (response.code == 100) {
                _this.workListSource = response.result;
                _this.workList = _this.workListSource;
                _this.workCtrl.enable();
                _this.getAlbumWorksApi();
            }
        }, function (err) { return console.log('http', err); });
    };
    AlbumFormComponent.prototype.getAlbumWorksApi = function () {
        var _this = this;
        var params = {
            albumId: this.model.id,
            typeId: 1
        };
        console.log('getAlbumWorksApi');
        this.apiService.get(EEndpoints.AlbumWorks, params).subscribe(function (response) {
            if (response.code == 100) {
                var works = [];
                response.result.works.map(function (item) {
                    works.push(_this.workListSource.find(function (work) { return work.id === item.id; }));
                });
                _this.userWorkList = works;
            }
            else
                console.log('response', response);
        }, function (err) { return console.log('http', err); });
    };
    AlbumFormComponent.prototype._filterWorks = function (value) {
        var filterValue = value.toLowerCase();
        return this.workList.filter(function (state) { return state.name.toLowerCase().indexOf(filterValue) === 0; });
    };
    AlbumFormComponent.prototype.selectedWork = function ($event) {
        var workId = parseInt($event.option.id);
        var work = this.workList.find(function (f) { return f.id == workId; });
        this.userWorkList.push(work);
        this.workList = this.workList.filter(function (f) { return f.id != workId; });
        this.workCtrl.setValue('');
    };
    AlbumFormComponent.prototype.removeChip = function (chip) {
        var index = this.userWorkList.findIndex(function (fi) { return fi.id == chip.id; });
        if (index >= 0) {
            this.userWorkList.splice(index, 1);
            var found = this.workListSource.find(function (f) { return f.id == chip.id; });
            if (found) {
                this.workList.push(found);
                this.workList.slice();
                //Nota: para forzar el evento valueChanges de control y asi actualizar el datasource
                this.workCtrl.setValue(this.workCtrl.value);
            }
        }
    };
    AlbumFormComponent = __decorate([
        Component({
            selector: 'app-album-form',
            templateUrl: './album-form.component.html',
            styleUrls: ['album-form.component.scss']
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            TranslateService,
            ApiService,
            FuseTranslationLoaderService, Object, MatDialogRef])
    ], AlbumFormComponent);
    return AlbumFormComponent;
}());
export { AlbumFormComponent };
//# sourceMappingURL=album-form.component.js.map