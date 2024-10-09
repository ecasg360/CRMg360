import { Component, OnInit, Optional, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from "@models/response-api";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SelectOption } from "@models/select-option.models";
import { ILocation } from "@models/location";
import { IAddress } from "@models/address";

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html'
})
export class AddLocationComponent implements OnInit {
  form: FormGroup;
  addressForm: FormGroup;
  id: number = 0;
  titleAction: string;
  action: string;
  isWorking: boolean = true;
  addresses: SelectOption[] = [];
  address: IAddress;
  croppedImage: string;
  data: any;

  constructor(
    public dialogRef: MatDialogRef<AddLocationComponent>,
    private formBuilder: FormBuilder,
    private service: ApiService,
    public dialog: MatDialog,
    private toasterService: ToasterService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.id = this.actionData.id;
    this.data = <IAddress>{};
    this.addressForm = this.formBuilder.group({});
    this.configureForm();
    if (this.id == 0) {
      this.isWorking = false;
      this.titleAction = this.translate.instant('general.save');
      this.action = this.translate.instant('general.save');
    } else {
      this.titleAction = this.translate.instant('general.save');
      this.action = this.translate.instant('general.save');
      this.getLocation();
    }
  }

  getAddress() {
    const params = [];
    params['id'] = this.f.addressId.value;
    this.service.get(EEndpoints.AddressById, params).subscribe(
      (response: ResponseApi<any>) => {
            this.data = {};
        if (response.code == 100) {
          this.data = <IAddress>response.result;
        }
      }, (err) => this.responseError(err)
    )
  }

  getLocation() {
    this.isWorking = true;
    const params = [];
    params['id'] = this.id;
    this.service.get(EEndpoints.Location, params).subscribe(
      (data: ResponseApi<ILocation>) => {
        if (data.code == 100) {
          this.croppedImage = data.result.pictureUrl;
          this.populateForm(data.result);
          this.getAddress();
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
    )
  }

  get f() { return this.form.controls; }

  private configureForm(): void {
    this.form = this.formBuilder.group({
      capacity: ['', [
        Validators.required
      ]],
      webSite: ['', [
        Validators.maxLength(250)
      ]],
      pictureUrl: [''],
      addressId: ['']
    });
  }

  private populateForm(data: ILocation): void {
    Object.keys(this.form.controls).forEach(name => {
      if (this.form.controls[name]) {
        this.form.controls[name].patchValue(data[name]);
      }
    });
    this.id = data.id;
  }

  bindExternalForm(name: string, form: FormGroup) {
    this.addressForm.setControl(name, form);
  }

  set(): void {
    if (this.form.valid) {
      if (this.id == 0) {
        if (this.addressForm.valid) {
          this.saveAddress();
        }
      } else {
        if (this.addressForm.valid) {
          this.updateAddress();
        }
      }
    }
  }

  save(): void {
    this.form.value.id = 0;
    this.service.save(EEndpoints.Location, this.form.value)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick(data.result);
              this.toasterService.showToaster(this.translate.instant('messages.itemSaved'));
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  update(): void {
    this.form.value.id = this.id;
    this.service.update(EEndpoints.Location, this.form.value)
      .subscribe(data => {
        if (data.code == 100) {
          this.onNoClick(true);
            this.toasterService.showToaster(this.translate.instant('messages.itemUpdated'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
      )
  }

  saveAddress(): void {
    this.addressForm.value.address.id = 0;
    this.service.save(EEndpoints.AddressLocation, this.addressForm.value.address)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.f.addressId.setValue(data.result);
            this.save();
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  updateAddress(): void {
    this.service.update(EEndpoints.Address, this.addressForm.value.address)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.update();
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  selectImage(image: any) {
    this.f.pictureUrl.setValue(image);
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }
}