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
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CropImage } from 'ClientApp/app/shared/models/crop-image.model';
var CutImageComponent = /** @class */ (function () {
    function CutImageComponent(dialogRef, cropImageData) {
        this.dialogRef = dialogRef;
        this.cropImageData = cropImageData;
        this.imageChangedEvent = '';
        this.imageChangedEvent = cropImageData.event;
        this.cropImage = cropImageData;
    }
    CutImageComponent.prototype.onNoClick = function () {
        // console.log(this.cropImage);
        this.dialogRef.close(this.cropImage);
    };
    CutImageComponent.prototype.imageLoaded = function () {
    };
    CutImageComponent.prototype.imageCropped = function (event) {
        this.cropImage.imageSRC = event.base64;
    };
    CutImageComponent = __decorate([
        Component({
            selector: 'app-cut-image',
            templateUrl: './cut-image.component.html',
        }),
        __param(0, Optional()),
        __param(1, Optional()),
        __param(1, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            CropImage])
    ], CutImageComponent);
    return CutImageComponent;
}());
export { CutImageComponent };
//# sourceMappingURL=cut-image.component.js.map