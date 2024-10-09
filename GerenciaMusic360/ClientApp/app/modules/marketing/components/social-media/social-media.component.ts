import { Component, OnInit, Optional, Inject } from '@angular/core';
import { IMarketingKeyIdeas, IKeysIdeas, IKeysIdeasCss, IMarketingKeyIdeasNames, IPlatformData, IMarketingKeyIdeasBudget } from '@models/keys-ideas-view-models';
import { SocialNetworkTypeWithCss } from '@models/socialNetworkType';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ConventionalMediaComponent } from '../conventional-media/conventional-media.component';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {
  formPlatform: FormGroup;
  isWorking: boolean = false;
  model: IMarketingKeyIdeas = <IMarketingKeyIdeas>{};
  usedKeysIdeas: IKeysIdeas[] = [];
  keysIdeasList: IKeysIdeasCss[] = [];
  valuesList: IPlatformData[] = [];
  keysBudgets: IMarketingKeyIdeasBudget[] = [];
  objetive: string = '';
  percentage: number = 0;
  socialNetworksList: SocialNetworkTypeWithCss[] = [];
  showSocialList: boolean = false;
  cssClass = 'mat-elevation-z4 p-4 accent-bg';

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private translationLoaderService: FuseTranslationLoaderService,
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<SocialMediaComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.translationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.model = <IMarketingKeyIdeas>this.data.marketingKey;
    this.usedKeysIdeas = <IKeysIdeas[]>this.data.keysIdeas;
    this.keysBudgets = this.data.keysBudgets;
    this._getKeyIdeas();
    this.initForm();
    this._fillTable();
  }

  initForm() {
    this.formPlatform = this.fb.group({
    });
  }

  get f() { return this.formPlatform.controls; }

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


  addPlatformValues() {
    if (this.objetive && this.percentage) {
      this.valuesList.push(<IPlatformData>{
        objetive: this.objetive,
        percentage: this.percentage
      });
      this.percentage = 0;
      this.objetive = '';
    }
  }

  deleteValue(index) {
    this.valuesList.splice(index, 1);
  }

  save() {
    const list = this.keysIdeasList.filter(f => f.cssClass != undefined && f.cssClass != '');
    if (list.length > 0 && this.valuesList.length > 0) {
      const keysNames = list.map((m, index) => {
        return <IMarketingKeyIdeasNames>{
          marketingKeyIdeasId: this.model.id,
          keyIdeasId: m.id
        }
      });

      const keyBudgets = this.valuesList.map(m => {
        return <IMarketingKeyIdeasBudget>{
          marketingKeyIdeasId: this.model.id,
          target: m.objetive,
          percentageBudget: m.percentage,
        }
      });

      this._deleteKeysNames(this.model.id, keysNames, keyBudgets);
    }
  }

  private _fillTable() {
    if (this.keysBudgets.length > 0) {
      this.valuesList = this.keysBudgets.map(m => {
        return <IPlatformData>{
          objetive: m.target,
          percentage: m.percentageBudget
        }
      });
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

  private _saveKeyIdeasNames(keyNames: IMarketingKeyIdeasNames[], keyBudget: IMarketingKeyIdeasBudget[]) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingKeyIdeaNames, keyNames).subscribe(
      (response: ResponseApi<IMarketingKeyIdeasNames[]>) => {
        if (response.code == 100) {
          if (keyBudget.length > 0)
            this._saveKeyIdeasBudget(keyBudget);
          else
            this.onNoClick(this.model);
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _saveKeyIdeasBudget(keyNames: IMarketingKeyIdeasBudget[]) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingKeyIdeasBudgets, keyNames).subscribe(
      (response: ResponseApi<IMarketingKeyIdeasBudget[]>) => {
        if (response.code == 100)
          this.onNoClick(this.model);
        else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _deleteKeysNames(marketingKeyIdeasId: number, marketingKeyIdeasNames: IMarketingKeyIdeasNames[], keyBudget: IMarketingKeyIdeasBudget[]) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.MarketingKeyIdeaNameByMarketingKeysId, { marketingKeyIdeasId: marketingKeyIdeasId }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100)
          this._deleteKeysBudget(marketingKeyIdeasId, marketingKeyIdeasNames, keyBudget);
        else
          this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _deleteKeysBudget(marketingKeyIdeasId: number, marketingKeyIdeasNames: IMarketingKeyIdeasNames[], keyBudget: IMarketingKeyIdeasBudget[]) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.MarketingKeyIdeasBudgets, { marketingKeyIdeaId: marketingKeyIdeasId }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100)
          this._saveKeyIdeasNames(marketingKeyIdeasNames, keyBudget);
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
