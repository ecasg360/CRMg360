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
import { Component, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from "@services/api.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
var AddArtistModalComponent = /** @class */ (function () {
    function AddArtistModalComponent(dialogRef, ApiService, toasterService, translate, formBuilder, actionData) {
        this.dialogRef = dialogRef;
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.formBuilder = formBuilder;
        this.actionData = actionData;
        this.workRecording = {};
        this.formReady = new EventEmitter();
        this.isWorking = false;
        this.artists = [];
        this.modelArtist = {};
        this.itemName = "";
        this.listArtists = [];
        this.action = this.translate.instant('general.save');
        this.isAddArtist = false;
        this.isEditArtist = false;
        this.idArtistEdit = 0;
    }
    AddArtistModalComponent.prototype.ngOnInit = function () {
        this.getArtists();
        this.workRecording = this.actionData.workRecording;
        this.itemName = this.actionData.itemName;
        if (this.actionData.isAddArtist) {
            this.isAddArtist = this.actionData.isAddArtist;
            this.isEditArtist = this.actionData.isEditArtist;
            this.idArtistEdit = this.actionData.idArtistEdit;
        }
        if (this.workRecording.id > 0) {
            this.action = this.translate.instant('general.save');
        }
        this.configureArtistForm();
    };
    AddArtistModalComponent.prototype.configureArtistForm = function () {
        this.dataArtistForm = this.formBuilder.group({
            id: [this.workRecording.id, []],
            workId: [this.workRecording.workId, []],
            artistId: [this.workRecording.artistId, [
                    Validators.required
                ]],
        });
        this.formReady.emit(this.dataArtistForm);
    };
    AddArtistModalComponent.prototype.getArtists = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.Artists).subscribe(function (response) {
            if (response.code == 100)
                _this.listArtists = response.result;
            _this.artists = response.result.map(function (m) {
                return {
                    value: m.id,
                    viewValue: m.name + ' ' + m.lastName,
                };
            });
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistModalComponent.prototype.saveArtist = function () {
        this.modelArtist = this.dataArtistForm.value;
        var objModelArtist = Object.assign({}, this.modelArtist);
        if (this.isAddArtist) {
            this.onNoClickReturn(this.modelArtist);
        }
        else {
            //Update
            if (this.modelArtist.id) {
                this._updateArtist(this.modelArtist);
            }
            else {
                //Create
                delete objModelArtist["id"];
                this._createArtist(objModelArtist);
            }
        }
    };
    AddArtistModalComponent.prototype._createArtist = function (model) {
        var _this = this;
        model.amountRevenue = 0;
        this.isWorking = true;
        this.ApiService.save(EEndpoints.Artist, model).subscribe(function (data) {
            if (data.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('artist.messages.saved'));
                _this.onNoClick(true);
            }
            else
                _this.toasterService.showToaster(data.message);
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistModalComponent.prototype._updateArtist = function (model) {
        var _this = this;
        model.amountRevenue = 0;
        this.isWorking = true;
        this.ApiService.update(EEndpoints.WorkCollaborator, model).subscribe(function (data) {
            if (data.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('artist.messages.saved'));
                _this.onNoClick(true);
            }
            else
                _this.toasterService.showToaster(data.message);
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddArtistModalComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddArtistModalComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddArtistModalComponent.prototype.onNoClickReturn = function (artist) {
        if (artist === void 0) { artist = undefined; }
        var artistFind = this.listArtists.find(function (x) { return x.id == artist.artistId; });
        artist.isEdit = this.isEditArtist;
        artist.idEdit = this.idArtistEdit;
        if (artistFind != undefined && artistFind != null) {
            artist.detail = artistFind;
        }
        this.dialogRef.close(artist);
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AddArtistModalComponent.prototype, "workRecording", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AddArtistModalComponent.prototype, "formReady", void 0);
    AddArtistModalComponent = __decorate([
        Component({
            selector: 'app-add-artist-modal',
            templateUrl: './add-artist-modal.component.html',
            styleUrls: ['./add-artist-modal.component.css']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ApiService,
            ToasterService,
            TranslateService,
            FormBuilder, Object])
    ], AddArtistModalComponent);
    return AddArtistModalComponent;
}());
export { AddArtistModalComponent };
//# sourceMappingURL=add-artist-modal.component.js.map