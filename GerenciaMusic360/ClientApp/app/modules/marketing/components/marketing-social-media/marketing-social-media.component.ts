import { Component, OnInit, Optional, Inject } from '@angular/core';
import { SocialNetworkType } from '@models/socialNetworkType';
import { IMarketingOverview, IMarketingOverViewDetail } from '@models/marketing-overview';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';

@Component({
  selector: 'app-marketing-social-media',
  templateUrl: './marketing-social-media.component.html',
  styleUrls: ['./marketing-social-media.component.scss']
})
export class MarketingSocialMediaComponent implements OnInit {

  socialNetworksList: SocialNetworkType[] = [];
  marketingOverviews: IMarketingOverview;
  formSocialMedia: FormGroup;
  isWorking: boolean = false;
  activeSocial: number = -1;

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private translationLoaderService: FuseTranslationLoaderService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MarketingSocialMediaComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IMarketingOverview,
  ) {
    this.translationLoaderService.loadTranslations(...allLang);
    this._getSocialNetworkTypes();
  }

  ngOnInit() {
    this.marketingOverviews = this.data;
    this.initForm();
  }

  initForm() {
    this.formSocialMedia = this.fb.group({
      social: [null, [Validators.required]]
    });
  }

  get f() { return this.formSocialMedia.controls; }

  addSocialNetwork(item: SocialNetworkType) {
    this.activeSocial = item.id;
    this.f.social.patchValue(item.id);
  }

  private _formatDetail(overviewId: number): IMarketingOverViewDetail {
    let pictureUrl = null;
    this.socialNetworksList.forEach(social => {
      if (social.id === parseInt(this.f.social.value)) {
        pictureUrl = social.pictureUrl;
      }
    });
    const detail = <IMarketingOverViewDetail>{
      marketingOverviewId: overviewId,
      socialNetworkTypeId: this.f.social.value,
      position: (new Date()).getMilliseconds(),
      pictureUrl: pictureUrl ? pictureUrl : null,
    }
    return detail;
  }

  save() {
    if (this.marketingOverviews.id) {
      const detail = this._formatDetail(this.marketingOverviews.id);
      this._saveMarketingOverViewDetail(detail);
    } else {
      delete this.marketingOverviews['id'];
      this._saveMarketingOverView(this.marketingOverviews);
    }
  }

  private _responseError(error: any): void {
    this.isWorking = false;
    this.toaster.showTranslate('general.errors.serverError');
  }

  onNoClick(overview: IMarketingOverview = undefined): void {
    this.dialogRef.close(overview);
  }

  //#region API
  private _getSocialNetworkTypes(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.SocialNetworkTypes).subscribe(
      (response: ResponseApi<SocialNetworkType[]>) => {
        if (response.code == 100) {
          this.socialNetworksList = response.result;//.filter(f => f.statusRecordId == 1);
        } else {
          this.toaster.showTranslate('general.errors.requestError');
        }
        this.isWorking = false;
      }, this._responseError
    );
  }

  private _saveMarketingOverView(overview: IMarketingOverview) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingOverview, overview).subscribe(
      (response: ResponseApi<IMarketingOverview>) => {
        if (response.code == 100) {
          this.marketingOverviews = response.result;
          const detail = this._formatDetail(response.result.id);
          this._saveMarketingOverViewDetail(detail);
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }
      }, this._responseError
    )
  }

  private _saveMarketingOverViewDetail(detail: IMarketingOverViewDetail) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingOverviewDetail, detail).subscribe(
      (response: ResponseApi<IMarketingOverview>) => {
        if (response.code == 100) {
          this.onNoClick(this.marketingOverviews);
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }
      }, this._responseError
    )
  }
  //#endregion
}
