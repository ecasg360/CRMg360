import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { TranslateService } from '@ngx-translate/core';
import { IMarketingMediaTarget, IMarketingOverview, IMarketingOverViewDetail } from '@models/marketing-overview';
import { IMarketingOverviews } from '@models/marketing-view-models';

@Component({
  selector: 'app-media-targets',
  templateUrl: './media-targets.component.html',
  styleUrls: ['./media-targets.component.scss']
})
export class MediaTargetsComponent implements OnInit {

  media: IMarketingMediaTarget = <IMarketingMediaTarget>{};
  overview: IMarketingOverview = <IMarketingOverview>{};
  formMedia: FormGroup;
  isWorking: boolean = false;
  croppedImage: any;

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private translationLoaderService: FuseTranslationLoaderService,
    private translate: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MediaTargetsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.translationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.overview = <IMarketingOverview>this.data;
    this.initForm();
  }

  initForm() {
    this.formMedia = this.fb.group({
      name: [this.media.name, [Validators.required]],
      pictureUrl: [this.media.pictureUrl, []],
    });
  }

  get f() { return this.formMedia.controls; }

  save() {
    this.media = <IMarketingMediaTarget>this.formMedia.value;
    if (this.overview.id) {
      this._saveMediaTarget(this.media);
    } else {
      this._saveMarketingOverview(this.overview);
    }
  }

  selectImage($event: any): void {
    this.croppedImage = $event;
    this.f.pictureUrl.patchValue(this.croppedImage);
  }

  onNoClick(overview: IMarketingOverviews = undefined): void {
    this.dialogRef.close(overview);
  }

  private _responseError(error: any): void {
    this.isWorking = false;
    console.log(error);
    this.toaster.showTranslate('general.errors.serverError');
  }

  //#region API
  private _saveMarketingOverview(overview: IMarketingOverview) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingOverview, overview).subscribe(
      (response: ResponseApi<IMarketingOverview>) => {
        if (response.code == 100) {
          this.overview = response.result;
          this._saveMediaTarget(this.media);
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }
      }, err => this._responseError(err)
    )
  }

  private _saveMarketingOverViewDetail(details: IMarketingOverViewDetail) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingOverviewDetail, details).subscribe(
      (response: ResponseApi<IMarketingOverViewDetail>) => {
        if (response.code == 100) {
          this.onNoClick(this.overview);
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }
      }, err => this._responseError(err)
    )
  }

  private _saveMediaTarget(media: IMarketingMediaTarget) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.Media, media).subscribe(
      (response: ResponseApi<IMarketingMediaTarget>) => {
        if (response.code == 100) {
          this.media = response.result;
          const detail = <IMarketingOverViewDetail>{
            marketingOverviewId: this.overview.id,
            mediaId: this.media.id,
            position: this.media.id,
          }
          this._saveMarketingOverViewDetail(detail);
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }
      }, err => this._responseError(err)
    )
  }
  //endregion
}
