import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { IAddress } from '@models/address';


@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {

  addressForm: FormGroup;
  fromComponent: boolean = false;
  titleAction: string;
  id: number = 0;
  action: string;
  isWorking: boolean = true;
  data: IAddress = <IAddress>{};
  isArtist: boolean = false;

  constructor(
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    public dialogRef: MatDialogRef<IAddress>
  ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.id = this.actionData.id;
      this.fromComponent = this.actionData.fromComponent;
      this.data = this.actionData.model;
      this.isArtist = this.actionData.isArtist;

    if (this.id == 0) {
      this.data = <IAddress>{};
      this.titleAction = this.translate.instant('general.save');
      this.action = this.translate.instant('general.save');
    } else {
        this.titleAction = this.translate.instant('general.edit');
        this.action = this.translate.instant('general.edit');
      this.data = (this.actionData.model) ? this.actionData.model : <IAddress>{};
    }
    this.isWorking = false;

    this.addressForm = this.fb.group({});
  }

  bindExternalForm(name: string, form: FormGroup) {
    this.addressForm.setControl(name, form);
  }

  get f() { return this.addressForm.controls; }

  setAddress(): void {
    this.isWorking = true;
    if (!this.addressForm.invalid) {
      this.isWorking = true;
      this.data = <IAddress>this.addressForm.value.address;
      this.data.id = this.id;
      this.dialogRef.close(this.data);
    }
    this.isWorking = false;
  }

  onNoClick(status = false): void {
    this.dialogRef.close(undefined);
  }
}

