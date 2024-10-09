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
import { Component, Optional, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from "@ngx-translate/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
import { MusicalGenre } from "@shared/models/musical-genre";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
var AddMusicalGenreComponent = /** @class */ (function () {
    function AddMusicalGenreComponent(dialogRef, formBuilder, apiService, toasterService, actionData, translate, _fuseTranslationLoaderService) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.musicalGenre = new MusicalGenre();
        this.id = 0;
        this.musicalGenresList = [];
    }
    AddMusicalGenreComponent.prototype.ngOnInit = function () {
        var _a;
        var _this = this;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = (this.actionData.id) ? this.actionData.id : 0;
        this.musicalGenresList = this.actionData.data;
        if (this.id == 0) {
            this.isWorking = false;
            this.action = this.translate.instant('general.save');
        }
        else {
            this.action = this.translate.instant('general.save');
            this.musicalGenre = this.musicalGenresList.find(function (f) { return f.id == _this.id; });
        }
        this.configureForm();
    };
    Object.defineProperty(AddMusicalGenreComponent.prototype, "f", {
        get: function () { return this.musicalGenreForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddMusicalGenreComponent.prototype.configureForm = function () {
        this.musicalGenreForm = this.formBuilder.group({
            name: [this.musicalGenre.name, [
                    Validators.required
                ]],
            description: [this.musicalGenre.description, []]
        });
    };
    //#region api
    AddMusicalGenreComponent.prototype.saveMusicalGenreApi = function () {
        var _this = this;
        this.apiService.save(EEndpoints.MusicalGenre, this.musicalGenreForm.value).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showTranslate('messages.itemSaved');
            }
            else {
                _this.toasterService.showToaster(response.message);
            }
            _this.onNoClick(true);
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddMusicalGenreComponent.prototype.updateMusicalGenreApi = function (id) {
        var _this = this;
        this.isWorking = true;
        this.musicalGenreForm.value.id = id;
        this.apiService.update(EEndpoints.MusicalGenre, this.musicalGenreForm.value).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showTranslate('messages.itemUpdated');
            }
            else {
                _this.toasterService.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    //#endregion
    AddMusicalGenreComponent.prototype.setMusicalGenre = function () {
        if (!this.musicalGenreForm.invalid) {
            var musicalGenre_1 = this.musicalGenreForm.value;
            if (this.id == 0) {
                var found = this.musicalGenresList.find(function (f) { return f.name == musicalGenre_1.name; });
                if (found) {
                    this.toasterService.showToaster('no puede repetir el nombre');
                    return;
                }
                this.saveMusicalGenreApi();
            }
            else {
                var found = this.musicalGenresList.filter(function (f) { return f.name == musicalGenre_1.name; });
                if (found.length > 1) {
                    this.toasterService.showToaster('no puede repetir el nombre');
                    return;
                }
                this.updateMusicalGenreApi(this.id);
            }
        }
    };
    AddMusicalGenreComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddMusicalGenreComponent.prototype.reponseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        console.log(error);
        this.isWorking = false;
    };
    AddMusicalGenreComponent = __decorate([
        Component({
            selector: 'app-add-musical-genre',
            templateUrl: './add-musical-genre.component.html',
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddMusicalGenreComponent);
    return AddMusicalGenreComponent;
}());
export { AddMusicalGenreComponent };
//# sourceMappingURL=add-musical-genre.component.js.map