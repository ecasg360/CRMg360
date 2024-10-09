var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CutImageComponent } from '../cut-image/cut-image.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialog } from '@angular/material';
import { allLang } from '@i18n/allLang';
var UploadImageComponent = /** @class */ (function () {
    function UploadImageComponent(_fuseTranslationLoaderService, dialog) {
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.dialog = dialog;
        this.croppedImage = '';
        this.errorImage = '';
        this.canCut = true;
        this.rounded = true;
        this.selectImage = new EventEmitter();
        this.uniqueId = (new Date()).getMilliseconds();
    }
    UploadImageComponent.prototype.ngOnChanges = function (changes) {
        var errorImg = changes.errorImage;
        if (!errorImg)
            this.errorImage = 'assets/images/avatars/defaultProfile5.jpg';
    };
    UploadImageComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    };
    UploadImageComponent.prototype.ngAfterViewInit = function () {
        if (!this.croppedImage) {
            var img = document.getElementById(this.uniqueId);
            if (img.src.indexOf('assets') >= 0) {
                this.convertToBase64Image(img);
            }
        }
    };
    UploadImageComponent.prototype.ngOnDestroy = function () {
        this.selectImage.complete();
    };
    //Imagen methods
    UploadImageComponent.prototype.removeImage = function () {
        this.croppedImage = '';
        this.selectImage.emit('');
    };
    UploadImageComponent.prototype.uploadIconClick = function (evt) {
        document.getElementById("fileToUpload" + this.uniqueId).click();
    };
    UploadImageComponent.prototype.fileChangeEvent = function (event) {
        var _this = this;
        if (this.canCut) {
            this.openCutDialog(event);
            return;
        }
        var img = document.getElementById(this.uniqueId);
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                _this.croppedImage = e.target['result'];
            };
            reader.readAsDataURL(file);
        }
    };
    UploadImageComponent.prototype.openCutDialog = function (event) {
        var _this = this;
        this.cropImage = { event: event, numberImage: 0, imageSRC: "" };
        var dialogCut = this.dialog.open(CutImageComponent, {
            width: "500px",
            data: this.cropImage
        });
        dialogCut.afterClosed().subscribe(function (result) {
            if (result) {
                _this.croppedImage = result.imageSRC;
                _this.selectImage.emit(result.imageSRC);
            }
        });
    };
    UploadImageComponent.prototype.setErrorImage = function ($event) {
        $event.target.src = this.errorImage;
    };
    UploadImageComponent.prototype.convertToBase64Image = function (img) {
        var canvas = document.createElement('canvas');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var base64String = canvas.toDataURL();
        img.src = base64String;
        if (base64String != 'data:,') {
            this.selectImage.emit(base64String);
        }
    };
    __decorate([
        Input('image'),
        __metadata("design:type", Object)
    ], UploadImageComponent.prototype, "croppedImage", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], UploadImageComponent.prototype, "errorImage", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], UploadImageComponent.prototype, "canCut", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], UploadImageComponent.prototype, "rounded", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], UploadImageComponent.prototype, "selectImage", void 0);
    UploadImageComponent = __decorate([
        Component({
            selector: 'app-upload-image',
            templateUrl: './upload-image.component.html',
            styleUrls: ['./upload-image.component.scss']
        }),
        __metadata("design:paramtypes", [FuseTranslationLoaderService,
            MatDialog])
    ], UploadImageComponent);
    return UploadImageComponent;
}());
export { UploadImageComponent };
//# sourceMappingURL=upload-image.component.js.map