import { Component, OnInit, OnDestroy } from '@angular/core';
import { IArtist } from '@models/artist';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { Subject } from 'rxjs';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})

export class ArtistListComponent implements OnInit, OnDestroy {

  artists: IArtist[] = [];
  artistsList: IArtist[] = [];
  isWorking: boolean = true;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.getArtistsApi();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  openModal(): void {

  }

  applyFilter(filterValue: string): void {
    this.artistsList = this.artists.filter(f => f.name.includes(filterValue));
  }

  confirmDelete(id: number, name: string): void {

  }

  private _responseError(error: any): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API
  getArtistsApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Artists)
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(
        (response: ResponseApi<IArtist[]>) => {
          if (response.code == 100) {
            this.artists = response.result;
            this.artistsList = response.result;
          } else
            this.toaster.showToaster(response.message);
          this.isWorking = false;
        }, err => this._responseError(err)
      );
  }
  //#endregion

}
