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
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "@services/toaster.service";
import { ApiService } from '@services/api.service';
import { TranslateService } from "@ngx-translate/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
import { EEndpoints } from '@enums/endpoints';
var AddArtistTypeComponent = /** @class */ (function () {
    function AddArtistTypeComponent(dialogRef, formBuilder, apiService, toaster, actionData, translate, translationLoaderService) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toaster = toaster;
        this.actionData = actionData;
        this.translate = translate;
        this.translationLoaderService = translationLoaderService;
        this.isWorking = false;
    }
    AddArtistTypeComponent.prototype.ngOnInit = function () {
        this.translationLoaderService.loadTranslationsList(allLang);
        this.model = this.actionData.model;
        this.action = (this.model.id)
            ? this.translate.instant('general.save')
            : this.translate.instant('general.save');
        this.addArtistTypeForm = this.formBuilder.group({
            id: [this.model.id, []],
            name: [this.model.name, [Validators.required]],
            entityId: [this.model.entityId, []],
            description: [this.model.description, []],
        });
    };
    Object.defineProperty(AddArtistTypeComponent.prototype, "f", {
        get: function () { return this.addArtistTypeForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddArtistTypeComponent.prototype.setArtistType = function () {
        this.model = this.addArtistTypeForm.value;
        if (this.model.id)
            this._updateArtistTypeApi(this.model);
        else
            this._createArtistTypeApi(this.model);
    };
    AddArtistTypeComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddArtistTypeComponent.prototype._reponseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        console.error(error);
        this.isWorking = false;
    };
    //#region API
    AddArtistTypeComponent.prototype._createArtistTypeApi = function (params) {
        var _this = this;
        this.isWorking = true;
        delete params.id;
        this.apiService.save(EEndpoints.PersonType, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemSaved'));
                _this.onNoClick(_this.model);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('messages.errorSavingItem'));
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this._reponseError(err); });
    };
    AddArtistTypeComponent.prototype._updateArtistTypeApi = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.PersonType, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemUpdated'));
                _this.onNoClick(_this.model);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('messages.errorEditingItem'));
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this._reponseError(err); });
    };
    AddArtistTypeComponent = __decorate([
        Component({
            selector: 'app-add-artist-type',
            templateUrl: './add-artist-type.component.html'
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddArtistTypeComponent);
    return AddArtistTypeComponent;
}());
export { AddArtistTypeComponent };
//# sourceMappingURL=add-artist-type.component.js.map