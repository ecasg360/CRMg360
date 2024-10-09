import { Component, OnInit, ViewChild, Optional, Inject } from '@angular/core';
import { IMarketingOverviewStreaming, IPlaylistStreamingTable, IMarketingOverViewDetail, IMarketingOverview } from '@models/marketing-overview';
import { SelectOption } from '@models/select-option.models';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from '@angular/material';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { IPlayList } from '@models/playlist';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-stream-add-playlists',
  templateUrl: './stream-add-playlists.component.html',
})
export class StreamAddPlaylistsComponent implements OnInit {
  marketingOverviews: IMarketingOverviewStreaming;
  playlists: SelectOption[] = [];
  selectedPlaylists: SelectOption[] = [];
  networkPlaylist: IPlaylistStreamingTable[] = [];
  playlistFC = new FormControl();
  filteredOptions: Observable<SelectOption[]>;
  question = '';
  formStreamPlaylist: FormGroup;
  isWorking: boolean = false;

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
    public dialogRef: MatDialogRef<StreamAddPlaylistsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IMarketingOverviewStreaming,
  ) {
    this.translationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.marketingOverviews = this.data;
    this._getPlaylists();
    this.initForm();
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
  }

  initForm() {
    this.formStreamPlaylist = this.fb.group({
      playlists: [null, [Validators.required]],
    });
  }

  get f() { return this.formStreamPlaylist.controls; }

  enter() {
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
    const details = this._formatOverviewDetail();
    if (details.length > 0) {
      this._saveMarketingOverViewDetail(details);
    }
  }

  private _setPlaylist(playlistName: string) {
    const playlist = <IPlayList>{
      name: playlistName,
      active: true,
      socialNetworkTypeId: this.marketingOverviews.socialId
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
    this.networkPlaylist = this.selectedPlaylists.map(m => {
      return <IPlaylistStreamingTable>{
        socialNetworkId: this.marketingOverviews.socialId,
        socialNetworkName: this.marketingOverviews.socialName,
        playlistId: m.value,
        playlistName: m.viewValue,
      }
    });
    this.dataSource = new MatTableDataSource(this.networkPlaylist);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.f.playlists.patchValue(this.selectedPlaylists);
  }

  private _formatOverviewDetail(): IMarketingOverViewDetail[] {
    let data = [];
    if (this.selectedPlaylists.length > 0) {
      this.selectedPlaylists.forEach((value: SelectOption, index: number) => {
        data.push({
          marketingOverviewId: this.marketingOverviews.overview.id,
          socialNetworkTypeId: this.marketingOverviews.socialId,
          playListId: value.value,
          position: this.marketingOverviews.detail.length + index
        })
      });
    }
    return data;
  }

  private _responseError(error: any): void {
    this.isWorking = false;
    this.toaster.showTranslate('general.errors.serverError');
  }

  onNoClick(overview: IMarketingOverviewStreaming = undefined): void {
    this.dialogRef.close(overview);
  }

  //#region API
  private _getPlaylists() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.PlayLists).subscribe(
      (response: ResponseApi<IPlayList[]>) => {
        if (response.code == 100) {
          for (let index = 0; index < response.result.length; index++) {
            const element = response.result[index];
            const found = this.marketingOverviews.detail.find(f => f.playListId == element.id);
            if (!found) {
              this.playlists.push({
                value: element.id,
                viewValue: element.name
              });
            }
          }

          this.filteredOptions = this.playlistFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        }
        this.isWorking = false;
      }, err => this._responseError(err)
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
      }, err => this._responseError(err)
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
      }, err => this._responseError(err)
    )
  }
  //#endregion

}
