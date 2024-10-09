import { allLang } from '@i18n/allLang';
import { ApiService } from '@services/api.service';
import { Component, Input, OnInit } from '@angular/core';
import { EEndpoints } from '@enums/endpoints';
import { EMarketingSection } from '@enums/modules';
import { ETypeName } from '@enums/type-name';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import {
  IConfigurationMarketingOverviewSection,
  IMarketingOverview,
  IMarketingOverViewDetail,
  IMarketingOverviewStreaming
} from '@models/marketing-overview';
import { IType } from '@models/type';
import { map, startWith } from 'rxjs/operators';
import { MarketingSocialMediaComponent } from '../marketing-social-media/marketing-social-media.component';
import { MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { MediaTargetsComponent } from '../media-targets/media-targets.component';
import { Observable } from 'rxjs';
import { ResponseApi } from '@models/response-api';
import { StreamAddPlaylistsComponent } from '../stream-add-playlists/stream-add-playlists.component';
import { StreamingPlaylistComponent } from '../streaming-playlist/streaming-playlist.component';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { SocialNetworkType } from '@models/socialNetworkType';

@Component({
  selector: 'app-general-view-container',
  templateUrl: './general-view-container.component.html',
  styleUrls: ['./general-view-container.component.scss'],
  animations: fuseAnimations
})
export class GeneralViewContainerComponent implements OnInit {

  @Input() marketingId: number = 0;

  marketingSection = EMarketingSection;
  marketingOverviews: IMarketingOverview[] = [];
  isWorking: boolean = false;
  configurationMarketing: IConfigurationMarketingOverviewSection[] = [];
  streamingList: IMarketingOverviewStreaming[] = [];
  mediaList: IMarketingOverViewDetail[] = [];
  socialMediaList: IMarketingOverViewDetail[] = [];
  materialFC = new FormControl();
  filteredOptions: Observable<IMarketingOverViewDetail[]>;
  question = '';
  materialList: IMarketingOverViewDetail[] = [];
  selectedMaterial: IMarketingOverViewDetail[] = [];
  materialOverview: IMarketingOverview;
  socialNetworksList: SocialNetworkType[] = [];

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
  ) {
    this.translationLoader.loadTranslations(...allLang);
    this._getConfigurations();
    this._getSocialNetworkTypes();

  }

  ngOnInit() {
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
  }

  openPanel(section: EMarketingSection, sectionId: number) {
    const found = this.marketingOverviews.find(f => f.sectionId == sectionId);
    if (found && section) {
      this._getOverViewDetail(section, found);
    }
  }

  showModal(sectionId: number, position: number, section: EMarketingSection) {
    let model = null;
    let component = null;
    switch (section) {
      case EMarketingSection.streaming:
        model = this._getOverviewModel(sectionId, position);
        component = StreamingPlaylistComponent;
        break;
      case EMarketingSection.mediaTargets:
        model = this._getOverviewModel(sectionId, position);
        component = MediaTargetsComponent;
        break;

      case EMarketingSection.marketingSocialMedia:
        model = this._getOverviewModel(sectionId, position);
        component = MarketingSocialMediaComponent;
        break;
    }

    const dialogRef = this.dialog.open(component, {
      width: '700px',
      data: model
    });

    dialogRef.afterClosed().subscribe((result: IMarketingOverview) => {
      if (result) {
        let found = this.marketingOverviews.find(f => f.id == result.id);
        if (!found) {
          this.marketingOverviews.push(result);
          found = result;
        }
        this._getOverViewDetail(section, found);
      }
    });
  }

  openPanelMaterial(sectionId: number, position: number, section: EMarketingSection) {
    const found = this.marketingOverviews.find(f => f.sectionId == sectionId);
    if (found) {
      this.materialOverview = found;
      this._getOverViewDetail(EMarketingSection.OverviewMaterialRelease, found);
    }
    else {
      const overview = this._getOverviewModel(sectionId, position);
      this._saveMarketingOverView(overview);
    }
  }

  addPlaylist(item: IMarketingOverviewStreaming) {
    const dialogRef = this.dialog.open(StreamAddPlaylistsComponent, {
      width: '700px',
      data: item
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result)
        this._getOverViewDetail(EMarketingSection.streaming, item.overview);
    });
  }

  enter() {
    const value = this.materialFC.value;
    if (value.indexOf(this.question) < 0) {
      const found = this.materialList.find(f => f.name == value);
      if (found) {
        this.selectedMaterial.push(found);
        this.materialList = this.materialList.filter(f => f.id != found.id);
        this.materialFC.patchValue('');
      } else
        this._createMaterial(value);
    }
  }

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {

    if ($event.option.id != '0') {
      const found = this.materialList.find(f => f.id == parseInt($event.option.id));
      if (found) {
        this.selectedMaterial.push(found);
        this.materialList = this.materialList.filter(f => f.id != found.id);
      }
    } else {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
      this._createMaterial(newItem);
    }
    this.materialFC.patchValue('');
  }

  deleteStream(id: number, type: string, overview: IMarketingOverview) {
    if (type == 'overview') {
      const params = {
        overviewId: overview.id,
        socialNetworkId: id
      };
      this._deleteOverview(EEndpoints.MarketingOverviewDetailsByOverviewSocial, params, overview, EMarketingSection.streaming);
    } else {
      const params = { id: id };
      this._deleteOverview(EEndpoints.MarketingOverviewDetail, params, overview, EMarketingSection.streaming);
    }
  }

  deleteMedia(item: IMarketingOverViewDetail) {
    const found = this.marketingOverviews.find(f => f.id == item.marketingOverviewId);
    if (found) {
      this._deleteOverview(EEndpoints.MarketingOverviewDetail, { id: item.id }, found, EMarketingSection.mediaTargets);
    }
  }

  deleteSocial(item: IMarketingOverViewDetail) {
    const found = this.marketingOverviews.find(f => f.id == item.marketingOverviewId);
    if (found) {
      this._deleteOverview(EEndpoints.MarketingOverviewDetail, { id: item.id }, found, EMarketingSection.marketingSocialMedia);
    }
  }

  private _getOverviewModel(sectionId: number, position: number): IMarketingOverview {
    const found = this.marketingOverviews.find(f => f.sectionId == sectionId);
    let model = null;
    if (found)
      model = found;
    else {
      model = <IMarketingOverview>{
        marketingId: this.marketingId,
        sectionId: sectionId,
        position: position,
        descriptionExt: '',
      }
    }
    return model;
  }

  private _formatStreaming(detail: IMarketingOverViewDetail[], overview: IMarketingOverview) {
    this.streamingList = [];
    //filtro para obtener los registros bajo el id de social network
    const unique = detail.filter((value, index, self) =>
      self.findIndex(f => f.socialNetworkTypeId == value.socialNetworkTypeId) == index);
    unique.forEach((value: IMarketingOverViewDetail) => {
      this.streamingList.push(<IMarketingOverviewStreaming>{
        overviewId: value.marketingOverviewId,
        overview: overview,
        socialName: value.socialNetwork,
        socialId: value.socialNetworkTypeId,
        pictureUrl: value.pictureUrl,
        detail: detail.filter(f => f.socialNetworkTypeId == value.socialNetworkTypeId)
      });
    });
  }

  private _filter(value: string): IMarketingOverViewDetail[] {
    const filterValue = value.toLowerCase();
    let result = this.materialList.filter(option => option.name.toLowerCase().includes(filterValue));
    return (result.length == 0)
      ? [<IMarketingOverViewDetail>{
        id: 0,
        name: `${this.question}${value.trim()}"?`
      }]
      : result;
  }

  private _responseError(error: any): void {
    this.isWorking = false;
    this.toaster.showTranslate('general.errors.serverError');
  }

  //#region API
  private _getConfigurations() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.CMarketingOverviewSections).subscribe(
      (response: ResponseApi<IConfigurationMarketingOverviewSection[]>) => {
        if (response.code == 100) {
          this.configurationMarketing = response.result;
          this._getOverviews();
        }
        else {
          this.isWorking = false;
          this.toaster.showTranslate('general.errors.requestError');
        }
      }, err => this._responseError(err)
    )
  }

  private _getOverviews() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.MarketingOverviews, { marketingId: this.marketingId }).subscribe(
      (response: ResponseApi<IMarketingOverview[]>) => {
        if (response.code == 100)
          this.marketingOverviews = response.result;
        else {
          this.toaster.showTranslate('general.errors.requestError');
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _getOverViewDetail(section: EMarketingSection, overview: IMarketingOverview) {
    this.isWorking = true;
    this.apiService.get(EEndpoints.MarketingOverviewDetails, { marketingOverviewId: overview.id }).subscribe(
      (response: ResponseApi<IMarketingOverViewDetail[]>) => {
        switch (section) {
          case EMarketingSection.streaming: this._formatStreaming(response.result, overview); break;
          case EMarketingSection.mediaTargets: this.mediaList = response.result; break;
          case EMarketingSection.marketingSocialMedia: {
            let items = [];
            response.result.forEach(element => {
              let socialN = null;
              this.socialNetworksList.forEach(socialNetwork => {
                if (socialNetwork.name === element.socialNetwork) {
                  socialN = socialNetwork.pictureUrl;
                }
              });
              items.push({
                id: element.id,
                marketingOverviewId: element.marketingOverviewId,
                materialId: element.materialId,
                mediaId: element.mediaId,
                name: element.name,
                pictureUrl: socialN,
                playListId: element.playListId,
                position: element.position,
                socialNetwork: element.socialNetwork,
                socialNetworkTypeId: element.socialNetworkTypeId
              });
            });
            this.socialMediaList = items;
            break;
          }
          case EMarketingSection.OverviewMaterialRelease:
            this.materialList = response.result;
            this.selectedMaterial = response.result;
            this.filteredOptions = this.materialFC.valueChanges
              .pipe(
                startWith(''),
                map(value => this._filter(value))
              );
            break;
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _createMaterial(name: string) {
    this.isWorking = true;
    const type = <IType>{
      typeId: ETypeName.Material,
      name: name,
      description: '',
    }

    this.apiService.save(EEndpoints.Type, type).subscribe(
      (response: ResponseApi<IType>) => {
        if (response.code == 100) {
          const overviewDetail = <IMarketingOverViewDetail>{
            marketingOverviewId: this.materialOverview.id,
            materialId: response.result.id,
            position: this.materialList.length + 1,
            name: name,
          };
          this._saveMarketingOverViewDetail(overviewDetail);
        } else {
          this.isWorking = false;
        }
        this.materialFC.patchValue('');
      }, err => this._responseError(err)
    )
  }

  private _deleteOverview(endpoint: EEndpoints, param: any, overview: IMarketingOverview, type: EMarketingSection) {
    this.isWorking = true;
    this.apiService.delete(endpoint, param).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this._getOverViewDetail(type, overview);
        } else {
          this.isWorking = false;
          this.toaster.showTranslate('general.errors.requestError');
        }
      }, err => this._responseError(err)
    )
  }

  private _saveMarketingOverView(overview: IMarketingOverview) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingOverview, overview).subscribe(
      (response: ResponseApi<IMarketingOverview>) => {
        if (response.code == 100) {

          this.materialOverview = response.result;
          this.marketingOverviews.push(response.result);
          this._getOverViewDetail(EMarketingSection.OverviewMaterialRelease, response.result);
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _saveMarketingOverViewDetail(detail: IMarketingOverViewDetail) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingOverviewDetail, detail).subscribe(
      (response: ResponseApi<IMarketingOverViewDetail>) => {
        if (response.code == 100) {
          detail.id = response.result.id;
          this.selectedMaterial.push(detail);
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  deleteMaterial(detail: IMarketingOverViewDetail) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.MarketingOverviewDetail, { id: detail.id }).subscribe(
      (response: ResponseApi<IMarketingOverViewDetail>) => {
        if (response.code == 100) {
          this.selectedMaterial = this.selectedMaterial.filter(f => f.id != detail.id);
          this.materialList = this.selectedMaterial;
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

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

  //#endregion
}
