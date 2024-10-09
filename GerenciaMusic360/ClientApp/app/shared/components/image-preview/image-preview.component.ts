import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@app/core/i18n/allLang';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {

  caption: boolean = false;
  imageUrl: string = '';
  title: string = '';

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public confirmData: any,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) {
    this.caption = confirmData.caption;
    this.imageUrl = confirmData.imageUrl;
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.title = this.translate.instant('general.preview');
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
