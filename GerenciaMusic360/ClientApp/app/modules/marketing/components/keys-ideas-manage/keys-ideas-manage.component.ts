import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IConfigurationKeysIdeas, IMarketingKeyIdeas, IMarketingKeyIdeasNames, IKeysIdeas, IMarketingKeyIdeasBudget, IKeysIdeasWithBudget } from '@models/keys-ideas-view-models';
import { EMarketingKeyIdeasSections } from '@enums/modules';
import { ConventionalMediaComponent } from './../conventional-media/conventional-media.component';
import { DigitalPlatformComponent } from './../digital-platform/digital-platform.component';
import { TouringComponent } from './../touring/touring.component';
import { SocialMediaComponent } from '../social-media/social-media.component';
import { SocialNetworkTypeWithCss } from '@models/socialNetworkType';

@Component({
  selector: 'app-keys-ideas-manage',
  templateUrl: './keys-ideas-manage.component.html',
  styleUrls: ['./keys-ideas-manage.component.scss'],
})
export class KeysIdeasManageComponent implements OnInit {

  @Input() marketingId: number = 0;
  @Input() perm:any = {};

  keysIdeasSection = EMarketingKeyIdeasSections;
  isWorking: boolean = false;
  configurationKeysIdeas: IConfigurationKeysIdeas[] = [];
  marketingKeyIdeasList: IMarketingKeyIdeas[] = [];
  keysIdeasName: IMarketingKeyIdeasNames[] = [];

  conventionalList: IKeysIdeas[] = [];
  socialMediaList: IKeysIdeas[] = [];
  touringList: IKeysIdeas[] = [];
  digitalPlatformList: IKeysIdeasWithBudget[] = [];
  keyBudgets: IMarketingKeyIdeasBudget[] = [];

  allSocialNetworksList: SocialNetworkTypeWithCss[] = [];

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
  ) {
    this.translationLoader.loadTranslations(...allLang);
    this._getConfigurations();
  }

  ngOnInit() {
    this._getSocialNetworkTypes();
  }

  openPanel(section: EMarketingKeyIdeasSections, keyIdeasTypeId: number, categoryId: number) {
    const found = this.marketingKeyIdeasList.find(f => f.keyIdeasTypeId == keyIdeasTypeId && f.categoryId == categoryId);
    if (found) {
      this._getKeysIdeasName(section, found.id);
    } else {
      const model = <IMarketingKeyIdeas>{
        marketingId: this.marketingId,
        keyIdeasTypeId: keyIdeasTypeId,
        categoryId: categoryId
      };
      this._createMarketingKeyIdea(model, section);
    }
  }

  showModal(section: EMarketingKeyIdeasSections, keyIdeasTypeId: number, categoryId: number) {
    let model = null;
    let component = null;
    const found = this.marketingKeyIdeasList.find(f => f.keyIdeasTypeId == keyIdeasTypeId && f.categoryId == categoryId);
    console.log('section: ', section);
    switch (section) {
      case EMarketingKeyIdeasSections.conventionalMedia:
        model = {
          marketingKey: found,
          keysIdeas: this.conventionalList,
        };
        component = ConventionalMediaComponent;
        break;
      case EMarketingKeyIdeasSections.digitalPlatform:
        model = {
          marketingKey: found,
          keysIdeas: this.digitalPlatformList,
          keysBudgets: this.keyBudgets,
        };
        component = DigitalPlatformComponent;
        break;

      case EMarketingKeyIdeasSections.socialMedia:
        model = {
          marketingKey: found,
          keysIdeas: this.socialMediaList,
          keysBudgets: this.keyBudgets,
        };
        component = SocialMediaComponent;
        break;

      case EMarketingKeyIdeasSections.touring:
        model = {
          marketingKey: found,
          keysIdeas: this.touringList,
        };
        component = TouringComponent;
        break;
    }

    console.log('component: ', component);
    const dialogRef = this.dialog.open(component, {
      width: '700px',
      data: model
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this._getKeysIdeasName(section, found.id);
      }
    });
  }

  delete(section: EMarketingKeyIdeasSections, item: IKeysIdeas) {
    const found = this.keysIdeasName.find(f => f.id == item.marketingKeyIdeasNameId);
    this._deleteKeyName(item.marketingKeyIdeasNameId, section, found.marketingKeyIdeasId);
    if (section == EMarketingKeyIdeasSections.digitalPlatform || EMarketingKeyIdeasSections.socialMedia)
      this._deleteKeyBudget(found.marketingKeyIdeasId);
  }

  private _responseError(error: any): void {
    this.isWorking = false;
    this.toaster.showTranslate('general.errors.serverError');
  }

  //#region API
  private _getConfigurations() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ConfigurationMarketingKeyIdeasCategory).subscribe(
      (response: ResponseApi<IConfigurationKeysIdeas[]>) => {
        if (response.code == 100) {
          this.configurationKeysIdeas = response.result;
          this.isWorking = false;
          this._getMarketingKeyIdeas();
        }
      }, err => this._responseError(err)
    )
  }

  private _getMarketingKeyIdeas() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.MarketingKeyIdeas, { marketingId: this.marketingId }).subscribe(
      (response: ResponseApi<IMarketingKeyIdeas[]>) => {
        if (response.code == 100) {
          this.marketingKeyIdeasList = response.result ? response.result : [];
          this.isWorking = false;
        }
      }, err => this._responseError(err)
    )
  }

  private _createMarketingKeyIdea(keyIdea: IMarketingKeyIdeas, section: EMarketingKeyIdeasSections = null) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingKeyIdea, keyIdea).subscribe(
      (response: ResponseApi<IMarketingKeyIdeas>) => {
        if (response.code == 100) {
          this.marketingKeyIdeasList.push(response.result);
          this.isWorking = false;
          if (section) {
            this._getKeysIdeasName(section, response.result.id);
          }
        }
      }, err => this._responseError(err)
    )
  }

  private _getKeysIdeasName(section: EMarketingKeyIdeasSections, marketingKeyIdeasId: number) {
    this.isWorking = true;
    this.apiService.get(EEndpoints.MarketingKeyIdeasNames, { marketingKeyIdeasId: marketingKeyIdeasId }).subscribe(
      (response: ResponseApi<IMarketingKeyIdeasNames[]>) => {
        if (response.code == 100) {
          this.keysIdeasName = response.result;
          this._getKeyIdeas(section, marketingKeyIdeasId);
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _getKeyIdeas(section: EMarketingKeyIdeasSections, marketingKeyIdeasId: number) {
    this.isWorking = true;
    const param = { marketingKeyIdeasId: marketingKeyIdeasId };
    this.apiService.get(EEndpoints.KeyIdeasByMarketingKeyIdeas, param).subscribe(
      (response: ResponseApi<IKeysIdeas[]>) => {
        if (response.code == 100) {
          switch (section) {
            case EMarketingKeyIdeasSections.conventionalMedia: this.conventionalList = response.result; break;
            case EMarketingKeyIdeasSections.socialMedia:
              this.socialMediaList = response.result;
              this._getKeyBudget(marketingKeyIdeasId, section);
              break;
            case EMarketingKeyIdeasSections.touring:
              this.touringList = response.result;
              break;
            case EMarketingKeyIdeasSections.digitalPlatform:
              this.digitalPlatformList = <IKeysIdeasWithBudget[]>response.result;
              this._getKeyBudget(marketingKeyIdeasId, section);
              break;
          }
          console.log('this.digitalPlatformList: ', this.digitalPlatformList);
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _deleteKeyName(id: number, section: EMarketingKeyIdeasSections, marketingKeyIdeasId: number) {
    this.apiService.delete(EEndpoints.MarketingKeyIdeaName, { id: id }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this._getKeysIdeasName(section, marketingKeyIdeasId)
        } else
          this.toaster.showTranslate('errors.errorDeletingItem');
      }, err => this._responseError(err)
    )
  }

  private _getKeyBudget(marketingKeyIdeasId: number, section: EMarketingKeyIdeasSections) {
    this.apiService.get(EEndpoints.MarketingKeyIdeasBudgets, { marketingKeyIdeasId: marketingKeyIdeasId }).subscribe(
      (response: ResponseApi<IMarketingKeyIdeasBudget[]>) => {
        this.keyBudgets = response.result;
        console.log('this.keyBudgets: ', this.keyBudgets);
      }, err => this._responseError(err)
    )
  }

  private _deleteKeyBudget(marketingKeyIdeaId: number) {
    this.apiService.delete(EEndpoints.MarketingKeyIdeasBudget, { merketingKeyIdeaId: marketingKeyIdeaId }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code != 100)
          this.toaster.showTranslate('errors.errorDeletingItem');
      }, err => this._responseError(err)
    )
  }

  private _getSocialNetworkTypes(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.SocialNetworkTypes).subscribe(
      (response: ResponseApi<SocialNetworkTypeWithCss[]>) => {
        if (response.code == 100) {
          this.allSocialNetworksList = response.result;
          this.isWorking = false;
          console.log('this.allSocialNetworksList ESR1: ', this.allSocialNetworksList);
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }
      }, err => this._responseError(err)
    );
  }

  public getNetworkName(networkId) {
    let name = '';
    this.allSocialNetworksList.forEach(element => {
      if (element.id === networkId) {
        name = element.name;
      }
    });
    return name;
  }
  //#endregion
}
