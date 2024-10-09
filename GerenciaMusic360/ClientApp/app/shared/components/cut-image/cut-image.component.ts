import { Component, Optional, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { CropImage } from 'ClientApp/app/shared/models/crop-image.model';

@Component({
    selector: 'app-cut-image',
    templateUrl: './cut-image.component.html',
})
export class CutImageComponent {
    imageChangedEvent: any = '';
    cropImage: CropImage;
    constructor(
        @Optional() public dialogRef: MatDialogRef<CutImageComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public cropImageData: CropImage
    ) {
        this.imageChangedEvent = cropImageData.event;
        this.cropImage = cropImageData;
    }

    onNoClick(): void {
        // console.log(this.cropImage);
        this.dialogRef.close(this.cropImage);
    }

    imageLoaded() {

    }

    imageCropped(event: ImageCroppedEvent) {
        this.cropImage.imageSRC = event.base64;
    }
}
