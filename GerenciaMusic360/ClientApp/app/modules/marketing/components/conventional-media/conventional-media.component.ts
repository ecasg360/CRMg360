import { Component, OnInit, Optional, Inject } from '@angular/core';
import { IMarketingKeyIdeas, IKeysIdeas, IMarketingKeyIdeasNames, IKeysIdeasCss } from '@models/keys-ideas-view-models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/Response-api';
import { SocialNetworkType, SocialNetworkTypeWithCss } from '@models/socialNetworkType';

@Component({
  selector: 'app-conventional-media',
  templateUrl: './conventional-media.component.html',
  styleUrls: ['./conventional-media.component.scss']
})
export class ConventionalMediaComponent implements OnInit {

  isWorking: boolean = false;
  model: IMarketingKeyIdeas = <IMarketingKeyIdeas>{};
  usedKeysIdeas: IKeysIdeas[] = [];
  keysIdeasList: IKeysIdeasCss[] = [];
  socialNetworksList: SocialNetworkTypeWithCss[] = [];
  showSocialList: boolean = false;
  cssClass = 'mat-elevation-z4 p-4 accent-bg';

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private translationLoaderService: FuseTranslationLoaderService,
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ConventionalMediaComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.translationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.model = <IMarketingKeyIdeas>this.data.marketingKey;
    this.usedKeysIdeas = <IKeysIdeas[]>this.data.keysIdeas;
    this._getKeyIdeas();
  }

  onNoClick(overview: IMarketingKeyIdeas = undefined): void {
    this.dialogRef.close(overview);
  }

  selectKeyIdea(item: IKeysIdeasCss) {
    item.cssClass = (item.cssClass == undefined || item.cssClass == '') ? this.cssClass : '';
  }

  toggleSocialList() {
    this.socialNetworksList.forEach((item) => {
      item.cssClass = '';
    });
    this.showSocialList = !this.showSocialList;
  }

  selectSocialNetwork(item: SocialNetworkTypeWithCss) {
    item.cssClass = (item.cssClass == '' || item.cssClass == undefined) ? this.cssClass : '';
  }

  saveSocialNetwork() {
    const list = this.socialNetworksList.filter(f => f.cssClass != undefined && f.cssClass != '');
    if (list.length > 0) {
      const keysIdeas = list.map((m, index) => {
        return <IKeysIdeas>{
          keyIdeasTypeId: this.model.keyIdeasTypeId,
          categoryId: this.model.categoryId,
          socialNetworkTypeId: m.id,
          name: '',
          position: this.keysIdeasList.length + (index + 1)
        }
      });
      this._saveKeysIdeas(keysIdeas);
    }
  }

  save() {
    const list = this.keysIdeasList.filter(f => f.cssClass != undefined && f.cssClass != '');
    if (list.length > 0) {
      const keysNames = list.map((m, index) => {
        return <IMarketingKeyIdeasNames>{
          marketingKeyIdeasId: this.model.id,
          keyIdeasId: m.id
        }
      });
      this._deleteKeysNames(this.model.id, keysNames);
    }
  }

  private _responseError(error: any): void {
    this.isWorking = false;
    this.toaster.showTranslate('general.errors.serverError');
  }

  //#region API

  private _getKeyIdeas() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.KeyIdeasByType, { keyIdeasTypeId: this.model.keyIdeasTypeId }).subscribe(
      (response: ResponseApi<IKeysIdeas[]>) => {
        if (response.code == 100) {
          this.keysIdeasList = response.result.map(m => {
            const item = <IKeysIdeasCss>m;
            const found = this.usedKeysIdeas.findIndex(f => f.id == m.id);
            if (found >= 0)
              item.cssClass = this.cssClass;

            return item;
          });
          this._getSocialNetworkTypes();
        } else
          this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _saveKeyIdeasNames(keyNames: IMarketingKeyIdeasNames[]) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingKeyIdeaNames, keyNames).subscribe(
      (response: ResponseApi<IMarketingKeyIdeasNames[]>) => {
        if (response.code == 100) {
          this.onNoClick(this.model);
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _deleteKeysNames(marketingKeyIdeasId: number, marketingKeyIdeasNames: IMarketingKeyIdeasNames[]) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.MarketingKeyIdeaNameByMarketingKeysId, { marketingKeyIdeasId: marketingKeyIdeasId }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100)
          this._saveKeyIdeasNames(marketingKeyIdeasNames);
        else
          this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _getSocialNetworkTypes(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.SocialNetworkTypes).subscribe(
      (response: ResponseApi<SocialNetworkTypeWithCss[]>) => {
        if (response.code == 100) {
          response.result.forEach((value) => {
            const found = this.keysIdeasList.findIndex(f => f.socialNetworkTypeId == value.id);
            if (found < 0) {
              this.socialNetworksList.push(value);
            }
          });
          this.isWorking = false;
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }
      }, err => this._responseError(err)
    );
  }

  private _saveKeysIdeas(keysIdeas: IKeysIdeas[]) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.KeyIdeas, keysIdeas).subscribe(
      (response: ResponseApi<IKeysIdeas[]>) => {
        if (response.code == 100) {
          this._getKeyIdeas();
          this.toggleSocialList();
          this.socialNetworksList = [];
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }
      }, err => this._responseError(err)
    )
  }

  //#endregion
}
