import { Component, OnInit, Input, Optional, Inject, ViewChild } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IPlayList } from '@models/playlist';
import { SelectOption } from '@models/select-option.models';
import { SocialNetworkType } from '@models/socialNetworkType';
import { Validators } from '@angular/forms';
import { IMarketingOverview, IPlaylistStreamingTable, IMarketingOverViewDetail } from '@models/marketing-overview';

@Component({
  selector: 'app-streaming-playlist',
  templateUrl: './streaming-playlist.component.html',
  styleUrls: ['./streaming-playlist.component.scss']
})
export class StreamingPlaylistComponent implements OnInit {
  marketingOverviews: IMarketingOverview;
  playlists: SelectOption[] = [];
  selectedPlaylists: SelectOption[] = [];
  networkPlaylist: IPlaylistStreamingTable[] = [];
  socialNetworksList: SocialNetworkType[] = [];
  playlistFC = new FormControl();
  filteredOptions: Observable<SelectOption[]>;
  question = '';
  formStreamPlaylist: FormGroup;
  isWorking: boolean = false;
  activeSocial: number = -1;

  displayedColumns: string[] = ['social', 'playlist', 'action'];
  dataSource: MatTableDataSource<IPlaylistStreamingTable>;
  @ViewChild(MatPaginator, { static: true } as any) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private translationLoaderService: FuseTranslationLoaderService,
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<StreamingPlaylistComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IMarketingOverview,
  ) {
    this.translationLoaderService.loadTranslations(...allLang);
    this._getSocialNetworkTypes();
  }

  ngOnInit() {
    this.marketingOverviews = this.data;
    this._getPlaylists();
    this.initForm();
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
  }

  initForm() {
    this.formStreamPlaylist = this.fb.group({
      id: [this.marketingOverviews.id, []],
      marketingId: [this.marketingOverviews.marketingId, []],
      sectionId: [this.marketingOverviews.sectionId, []],
      descriptionExt: ['', []],
      position: [this.marketingOverviews.position, []],
      playlists: [null, [Validators.required]],
      social: [null, [Validators.required]]
    });
  }

  get f() { return this.formStreamPlaylist.controls; }

  enter() {
    if (this.activeSocial <= 0) {
      this.activeSocial = 0;
      this.playlistFC.patchValue('');
      return;
    }

    const value = this.playlistFC.value;
    if (value.indexOf(this.question) < 0) {
      const found = this.playlists.find(f => f.viewValue == value);
      if (found) {
        this.selectedPlaylists.push(found);
        this.playlists = this.playlists.filter(f => f.value != found.value);
        this._fillTable();
      } else
        this._setPlaylist(value);
    }
  }

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
    if (this.activeSocial <= 0) {
      this.activeSocial = 0;
      this.playlistFC.patchValue('');
      return;
    }

    if ($event.option.id != '0') {
      const found = this.playlists.find(f => f.value == $event.option.id);
      if (found) {
        this.selectedPlaylists.push(found);
        this.playlists = this.playlists.filter(f => f.value != found.value);
        this._fillTable();
      }
    } else {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
      this._setPlaylist(newItem);
    }
    this.playlistFC.patchValue('');
  }

  addSocialNetwork(item: SocialNetworkType) {
    this.activeSocial = item.id;
    this.f.social.patchValue(item.id);
    this._fillTable();
  }

  deletePlaylistTable(row: IPlaylistStreamingTable) {
    const found = this.selectedPlaylists.find(f => f.value == row.playlistId);
    if (found) {
      this.selectedPlaylists = this.selectedPlaylists.filter(f => f.value != row.playlistId);
      this.networkPlaylist = this.networkPlaylist.filter(f => f.playlistId != row.playlistId);
      this.playlists.push(found);
      this._fillTable();
    }
  }

  save() {
    this.marketingOverviews = this.formStreamPlaylist.value;
    delete this.marketingOverviews['playlists'];
    delete this.marketingOverviews['social'];
    if (this.marketingOverviews.id) {
      const details = this._formatOverviewDetail(this.marketingOverviews.id);
      if (details.length > 0) {
        this._saveMarketingOverViewDetail(details);
      }
    } else {
      delete this.marketingOverviews['id'];
      this._saveMarketingOverView(this.marketingOverviews);
    }
  }

  private _setPlaylist(playlistName: string) {
    const playlist = <IPlayList>{
      name: playlistName,
      active: true,
      socialNetworkTypeId: this.activeSocial
    };
    this._savePlaylist(playlist);
  }

  private _filter(value: string): SelectOption[] {
    const filterValue = value.toLowerCase();
    let result = this.playlists.filter(option => option.viewValue.toLowerCase().includes(filterValue));
    return (result.length == 0)
      ? [{
        value: 0,
        viewValue: `${this.question}${value.trim()}"?`
      }]
      : result;
  }

  private _fillTable(): void {
    const social = this.socialNetworksList.find(f => f.id == this.activeSocial);
    if (!social) {
      return;
    }
    this.networkPlaylist = this.selectedPlaylists.map(m => {
      return <IPlaylistStreamingTable>{
        socialNetworkId: social.id,
        socialNetworkName: social.name,
        playlistId: m.value,
        playlistName: m.viewValue,
      }
    });
    this.dataSource = new MatTableDataSource(this.networkPlaylist);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.f.playlists.patchValue(this.selectedPlaylists);
  }

  private _formatOverviewDetail(overviewId: number): IMarketingOverViewDetail[] {
    let data = [];
    if (overviewId && this.selectedPlaylists.length > 0) {
      this.selectedPlaylists.forEach((value: SelectOption, index: number) => {
        data.push({
          marketingOverviewId: overviewId,
          socialNetworkTypeId: this.activeSocial,
          playListId: value.value,
          position: index + 1
        })
      });
    }
    return data;
  }

  private _responseError(error: any): void {
    this.isWorking = false;
    this.toaster.showTranslate('general.errors.serverError');
  }

  onNoClick(overview: IMarketingOverview = undefined): void {
    this.dialogRef.close(overview);
  }

  //#region API
  private _getPlaylists() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.PlayLists).subscribe(
      (response: ResponseApi<IPlayList[]>) => {
        if (response.code == 100) {
          this.playlists = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name
            }
          });
          this.filteredOptions = this.playlistFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        }
        this.isWorking = false;
      }, this._responseError
    );
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

  private _savePlaylist(playlist: IPlayList) {
    this.apiService.save(EEndpoints.PlayList, playlist).subscribe(
      (response: ResponseApi<IPlayList>) => {
        if (response.code == 100) {
          const data = <SelectOption>{
            value: response.result.id,
            viewValue: response.result.name
          };
          this.selectedPlaylists.push(data);
          this.playlists.push(data);
          this._fillTable();
        } else {
          this.toaster.showTranslate('general.errors.requestError');
        }
        this.playlistFC.patchValue('');
      }, this._responseError
    )
  }

  private _saveMarketingOverView(overview: IMarketingOverview) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingOverview, overview).subscribe(
      (response: ResponseApi<IMarketingOverview>) => {
        if (response.code == 100) {
          this.marketingOverviews = response.result;
          const details = this._formatOverviewDetail(response.result.id);
          if (details.length > 0) {
            this._saveMarketingOverViewDetail(details);
          }
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }
      }, this._responseError
    )
  }

  private _saveMarketingOverViewDetail(details: IMarketingOverViewDetail[]) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingOverviewDetails, details).subscribe(
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
