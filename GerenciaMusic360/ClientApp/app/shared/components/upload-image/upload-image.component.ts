import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CropImage } from '@shared/models/crop-image.model';
import { CutImageComponent } from '../cut-image/cut-image.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialog } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { Console } from 'console';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})

export class UploadImageComponent implements OnInit, OnChanges, OnDestroy {
  @Input('image') croppedImage: any = '';
  @Input() errorImage: any = '';
  @Input() canCut: boolean = true;
  @Input() rounded: boolean = true;
  @Output() selectImage: EventEmitter<any> = new EventEmitter();
  cropImage: CropImage;
  uniqueId: any = (new Date()).getMilliseconds();

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private dialog: MatDialog,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const errorImg = changes.errorImage;
    if (!errorImg)
      this.errorImage = 'assets/images/avatars/defaultProfile5.jpg';
  }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
  }

  ngAfterViewInit(): void {
    if (!this.croppedImage) {
      const img = document.getElementById(this.uniqueId) as HTMLImageElement;
      if (img.src.indexOf('assets') >= 0) {
        this.convertToBase64Image(img);
      }
    }
  }

  ngOnDestroy(): void {
    this.selectImage.complete();
  }

  //Imagen methods
  removeImage() {
    this.croppedImage = '';
    this.selectImage.emit('');
  }

  uploadIconClick(evt) {
    document.getElementById(`fileToUpload${this.uniqueId}`).click();
  }

  fileChangeEvent(event: any): void {
    if (this.canCut) {
      this.openCutDialog(event);
      return;
    }

    const img = document.getElementById(this.uniqueId) as HTMLImageElement;
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.croppedImage = e.target['result'];
      }
      reader.readAsDataURL(file);
    }
  }

  openCutDialog(event: any): void {
    this.cropImage = { event: event, numberImage: 0, imageSRC: "" };
    const dialogCut = this.dialog.open(CutImageComponent, {
      width: "500px",
      data: this.cropImage
    });
    dialogCut.afterClosed().subscribe(result => {
      if (result) {
        this.croppedImage = result.imageSRC;
        this.selectImage.emit(result.imageSRC);
      }
    });
  }

  setErrorImage($event) {
    $event.target.src = this.errorImage;
  }

  convertToBase64Image(img: HTMLImageElement) {
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
  }
}
