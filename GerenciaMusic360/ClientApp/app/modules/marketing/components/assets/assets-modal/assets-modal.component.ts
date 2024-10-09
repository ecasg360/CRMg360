import { Component, OnInit, ChangeDetectionStrategy, Optional, Inject } from '@angular/core';
import { IMarketingAsset } from '@models/marketing-assets';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';

@Component({
  selector: 'app-assets-modal',
  templateUrl: './assets-modal.component.html',
  styleUrls: ['./assets-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetsModalComponent implements OnInit {

  formAssets: FormGroup;
  isWorking: boolean = false;
  model: IMarketingAsset = <IMarketingAsset>{};

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private translationLoaderService: FuseTranslationLoaderService,
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<AssetsModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IMarketingAsset,
  ) {
    this.translationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.model = this.data;
    this.initForm();
  }

  initForm() {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.formAssets = this.fb.group({
      id: [this.model.id, []],
      description: [this.model.description, [Validators.required]],
      //url: [this.model.url, [Validators.required, Validators.pattern(reg)]],
      url: [this.model.url, [Validators.required]],
      position: [this.model.position, [Validators.required]],
      marketingId: [this.model.marketingId, [Validators.required]],
    });
  }

  get f() { return this.formAssets.controls; }

  onNoClick(overview: IMarketingAsset = undefined): void {
    this.dialogRef.close(overview);
  }

  save() {
    this.model = <IMarketingAsset>this.formAssets.value;
    if (this.model.url.indexOf('http') < 0) {
      this.model.url = `https://${this.model.url}`;
    }
    if (this.model.id) {
      this._editAsset(this.model);
    } else {
      delete this.model['id'];
      this._createAsset(this.model);
    }
  }

  private _responseError(error: any): void {
    this.isWorking = false;
    this.toaster.showTranslate('general.errors.serverError');
  }

  //#region API
  private _createAsset(asset: IMarketingAsset) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingAsset, asset).subscribe(
      (response: ResponseApi<IMarketingAsset>) => {
        if (response.code == 100) {
          this.onNoClick(response.result);
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err));
  }

  private _editAsset(asset: IMarketingAsset) {
    this.isWorking = true;
    this.apiService.update(EEndpoints.MarketingAsset, asset).subscribe(
      (response: ResponseApi<IMarketingAsset>) => {
        if (response.code == 100) {
          this.onNoClick(asset);
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err));
  }

  //#endregion
}
