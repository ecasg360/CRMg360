import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IMarketingAsset } from '@models/marketing-assets';
import { AssetsModalComponent } from './assets-modal/assets-modal.component';
import { EMarketingSection } from '@enums/modules';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent implements OnInit {

  @Input() marketingId: number = 0;
  @Input() perm: any = {};

  assetsList: IMarketingAsset[] = [];
  isWorking: boolean = true;
  permisions:any;

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.data.subscribe((data: any) => {
        this.permisions = data;
    });
    this.translationLoader.loadTranslations(...allLang);
  }

  ngOnInit() {
    console.log('this.permisions: ', this.permisions);
      this._getAssets();
  }

  modalAsset(asset: IMarketingAsset = <IMarketingAsset>{}) {

    if (!asset.id) {
      asset.position = this.assetsList.length + 1;
      asset.marketingId = this.marketingId;
    }
    const dialogRef = this.dialog.open(AssetsModalComponent, {
      width: '500px',
      data: asset
    });
    dialogRef.afterClosed().subscribe((result: IMarketingAsset) => {
      if (result) {
        if (asset.id) {
          const index = this.assetsList.findIndex(f => f.id == asset.id);
          if (index >= 0)
            this.assetsList.splice(index, 1, result);
        } else
          this.assetsList.push(result);
      }
    });
  }

  deleteAsset(asset: IMarketingAsset) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: asset.description }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this._deleteAsset(asset.id);
      }
    });
  }

  private _responseError(error: any): void {
    this.isWorking = false;
    this.toaster.showTranslate('general.errors.serverError');
  }

  //#region API
  private _getAssets() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.MarketingAssets, { marketingId: this.marketingId }).subscribe(
      (response: ResponseApi<IMarketingAsset[]>) => {
        if (response.code == 100) {
          this.assetsList = response.result;
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _deleteAsset(id: number) {
    this.apiService.delete(EEndpoints.MarketingAsset, { id: id }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this.assetsList = this.assetsList.filter(f => f.id != id);
        }
      }, err => this._responseError(err)
    )
  }
  //#endregion
}
