import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificationAuthority } from '@models/certification-authority';
import { ToasterService } from '@services/toaster.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IAddress } from '@models/address';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';


@Component({
  selector: 'app-add-certification-authority',
  templateUrl: './add-certification-authority.component.html',
  styleUrls: ['./add-certification-authority.component.scss']
})

export class AddCertificationAuthorityComponent implements OnInit {

  certification: CertificationAuthority = <CertificationAuthority>{};
  address: IAddress = <IAddress>{};
  certAuthForm: FormGroup;
  isWorking: boolean;
  action: string;

  constructor(
    private translationLoaderService: FuseTranslationLoaderService,
    private apiService: ApiService,
    private translate: TranslateService,
    private toaster: ToasterService,
    public dialogRef: MatDialogRef<AddCertificationAuthorityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CertificationAuthority,
    private fb: FormBuilder, ) { }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.certification = this.data;
    if (this.certification.addressId) {
      this.action = this.translate.instant('general.save');
      this._getAddressApi(this.certification.addressId);
    } else {
      this.action = this.translate.instant('general.save');
    }
    this.initForm();
  }

  initForm(): void {
    this.certAuthForm = this.fb.group({
      id: [this.certification.id, []],
      name: [this.certification.name, [
        Validators.required
      ]],
      businessName: [this.certification.businessName, [
        Validators.required
      ]],
      phone: [this.certification.phone, []],
      contact: [this.certification.contact, [Validators.required]],
    });
  }

  get f() { return this.certAuthForm.controls; }

  bindExternalForm(name: string, form: FormGroup) {
    this.certAuthForm.setControl(name, form);
  }

  save() {
    if (this.certAuthForm.valid) {
      this.data = <CertificationAuthority>this.certAuthForm.value;

      if (this.certification.id)
        this._updateAddressApi(<IAddress>this.certAuthForm.value.address);
      else
        this._createAddressApi(<IAddress>this.certAuthForm.value.address);
    }
  }

  private _prepareParams() {

  }

  onNoClick(certificationAuth = undefined): void {
    this.dialogRef.close(certificationAuth);
  }

  private _reponseError(error: HttpErrorResponse): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    console.error(error);
    this.isWorking = false;
  }

  //#region API

  private _createAddressApi(params: IAddress): void {
    this.isWorking = true;
    delete params.id;
    this.apiService.save(EEndpoints.Address, params).subscribe(
      (response: ResponseApi<IAddress>) => {
        if (response.code == 100) {
          this.data.addressId = response.result.id;
          delete this.data.address;
            delete this.data.id;
            this.isWorking = true;
          this._createCertificationApi(this.data);
        }
        else {
          this.toaster.showToaster(this.translate.instant('errors.savedAddressFailed'));
            this.onNoClick();
            this.isWorking = true;
        }
        this.isWorking = false;
      }, err => this._reponseError(err)
    )
  }

    private _updateAddressApi(params: IAddress): void {
        this.isWorking = true;
    this.apiService.update(EEndpoints.Address, params).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this.isWorking = false;
          this._updateCertificationApi(this.data);
        } else {
          this.toaster.showToaster(this.translate.instant('errors.savedAddressFailed'));
          this.onNoClick();
          this.isWorking = false;
        }
      }, err => this._reponseError(err)
    )
  }

  private _getAddressApi(addressId: number) {
    this.isWorking = true;
    this.apiService.get(EEndpoints.AddressById, { id: addressId }).subscribe(
      (response: ResponseApi<IAddress>) => {
        if (response.code == 100)
          this.address = <IAddress>response.result;
        else {
          this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
          this.onNoClick();
        }
        this.isWorking = false;
      }, err => this._reponseError(err)
    )
  }

  private _createCertificationApi(params: CertificationAuthority): void {
    this.isWorking = true;
    this.apiService.save(EEndpoints.CertificationAuthority, params).subscribe(
      (response: ResponseApi<number>) => {
        if (response.code == 100) {
          this.data.id = response.result;
          this.onNoClick(this.data);
        } else {
          this.toaster.showToaster(this.translate.instant('errors.savedCertificationAuthorityFailed'));
          this.onNoClick();
        }
        this.isWorking = false;
      }, err => this._reponseError(err)
    );
  }

  private _updateCertificationApi(params: CertificationAuthority): void {
      delete params.address;
      this.isWorking = true;
    this.apiService.update(EEndpoints.CertificationAuthority, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100)
          this.onNoClick(this.data);
        else
          this.onNoClick(this.data);
          this.isWorking = false;
      }, err => this._reponseError(err)
    )
  }
  //endregion

}
