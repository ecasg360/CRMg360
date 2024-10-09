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
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { CutImageComponent } from '@shared/components/cut-image/cut-image.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var AddMusicalInstrumentComponent = /** @class */ (function () {
    function AddMusicalInstrumentComponent(dialog, dialogRef, formBuilder, apiService, toasterService, actionData, translate, _fuseTranslationLoaderService) {
        this.dialog = dialog;
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.id = 0;
        this.croppedImage = "";
        this.isWorking = true;
    }
    AddMusicalInstrumentComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = this.actionData.id;
        this.configureForm();
        if (this.id == 0) {
            this.isWorking = false;
            this.titleAction = this.translate.instant('settings.formMusicalInstrument.saveTitle');
            this.action = this.translate.instant('general.save');
        }
        else {
            this.titleAction = this.translate.instant('settings.formMusicalInstrument.editTitle');
            this.action = this.translate.instant('general.save');
            this.getAll();
        }
    };
    Object.defineProperty(AddMusicalInstrumentComponent.prototype, "f", {
        get: function () { return this.formMusicalInstrument.controls; },
        enumerable: false,
        configurable: true
    });
    AddMusicalInstrumentComponent.prototype.configureForm = function () {
        this.formMusicalInstrument = this.formBuilder.group({
            name: ['', [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.minLength(3),
                ]],
        });
    };
    AddMusicalInstrumentComponent.prototype.populateForm = function (data) {
        var _this = this;
        Object.keys(this.formMusicalInstrument.controls).forEach(function (name) {
            if (_this.formMusicalInstrument.controls[name]) {
                _this.formMusicalInstrument.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
        this.croppedImage =
            data.pictureUrl !== null
                ? "" + data.pictureUrl
                : "";
    };
    AddMusicalInstrumentComponent.prototype.set = function () {
        if (!this.formMusicalInstrument.invalid) {
            this.isWorking = true;
            if (this.id == 0) {
                this.save();
            }
            else {
                this.update();
            }
        }
    };
    AddMusicalInstrumentComponent.prototype.save = function () {
        var _this = this;
        this.formMusicalInstrument.value.pictureUrl = this.croppedImage;
        this.apiService.save(EEndpoints.MusicalInstrument, this.formMusicalInstrument.value).subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('messages.itemSaved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddMusicalInstrumentComponent.prototype.update = function () {
        var _this = this;
        this.isWorking = true;
        if (!this.formMusicalInstrument.invalid) {
            this.formMusicalInstrument.value.id = this.id;
            this.formMusicalInstrument.value.pictureUrl = this.croppedImage;
            this.apiService.update(EEndpoints.MusicalInstrument, this.formMusicalInstrument.value)
                .subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick(true);
                    _this.toasterService.showToaster(_this.translate.instant('messages.itemUpdated'));
                }
                else {
                    _this.toasterService.showToaster(data.message);
                }
                _this.isWorking = false;
            }, function (err) { return _this.reponseError(err); });
        }
    };
    AddMusicalInstrumentComponent.prototype.getAll = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MusicalInstrument, { id: this.id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.populateForm(data.result);
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.reponseError(err); });
    };
    AddMusicalInstrumentComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddMusicalInstrumentComponent.prototype.reponseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddMusicalInstrumentComponent.prototype.removeImage = function () {
        this.croppedImage = "";
    };
    AddMusicalInstrumentComponent.prototype.uploadIconClick = function (evt) {
        document.getElementById('filetoupload').click();
    };
    AddMusicalInstrumentComponent.prototype.fileChangeEvent = function (event) {
        this.openCutDialog(event);
    };
    AddMusicalInstrumentComponent.prototype.openCutDialog = function (event) {
        var _this = this;
        this.cropImage = { event: event, numberImage: 0, imageSRC: "" };
        var dialogRef = this.dialog.open(CutImageComponent, {
            width: "500px",
            data: this.cropImage
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.croppedImage = result.imageSRC;
        });
    };
    AddMusicalInstrumentComponent = __decorate([
        Component({
            selector: 'app-add-musical-instrument',
            templateUrl: './add-musical-instrument.component.html',
            styleUrls: ['./add-musical-instrument.component.scss']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialog,
            MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddMusicalInstrumentComponent);
    return AddMusicalInstrumentComponent;
}());
export { AddMusicalInstrumentComponent };
//# sourceMappingURL=add-musical-instrument.component.js.map