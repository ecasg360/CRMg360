import { OnInit, Optional, Inject, Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from "@angular/material";
import { ToasterService } from "@services/toaster.service";
import { SelectOption } from "@models/select-option.models";
import { ResponseApi } from "@models/response-api";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { IAddress } from "@models/address";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { ICompany } from "@models/company";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
import { HttpErrorResponse } from "@angular/common/http";


@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html'
})

export class AddCompanyComponent implements OnInit {

  CompanyForm: FormGroup;
  model: ICompany = <ICompany>{};
  action: string;
  isWorking: boolean = false;
  personFiltered: Observable<SelectOption[]>;
  persons: SelectOption[] = [];
  address: IAddress = <IAddress>{};

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddCompanyComponent>,
    private fb: FormBuilder,
    private toaster: ToasterService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private translate: TranslateService,
    private translationLoaderService: FuseTranslationLoaderService,
  ) {
  }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.model = <ICompany>this.actionData.model;
    this.configureForm();
    this.getPersonsApi();
    if (!this.model.id) {
      this.action = this.translate.instant('general.save');
    } else {
      this.action = this.translate.instant('general.save');
      this.getAddressApi(this.model.addressId);
    }
  }

  get f() { return this.CompanyForm.controls; }

  configureForm(): void {
    this.CompanyForm = this.fb.group({
      id: [this.model.id, []],
      businessName: [this.model.businessName, [Validators.required]],
      legalName: [this.model.legalName],
      businessShortName: [this.model.businessShortName, [Validators.required]],
      taxId: [this.model.taxId],
      representativeLegalId: [this.model.representativeLegalId],
      representativeLegalName: ['', [Validators.required]],
      addressId: [this.model.addressId]
    });
  }

  bindExternalForm(name: string, form: FormGroup) {
    this.CompanyForm.setControl(name, form);
  }

  legalRepSelected($event: MatAutocompleteSelectedEvent) {
    this.f['representativeLegalId'].patchValue($event.option.id);
  }

  saveCompany() {
    let address = <IAddress>this.CompanyForm.value.address;
    let company = <ICompany>this.CompanyForm.value;

    if (this.model.id)
      this.updateAddressApi(address, company);
    else
      this.createAddressApi(address, company);
  }

  onNoClick(status: ICompany = undefined): void {
    this.dialogRef.close(status);
  }

  private _filterPersons(value: any): SelectOption[] {
    const filterValue = value.toLowerCase();
    return this.persons.filter((person) => person.viewValue.toLowerCase().indexOf(filterValue) === 0);
  }

  private _responseError(error: HttpErrorResponse): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    console.error(error);
    this.isWorking = false;
  }

  //#region API

  getAddressApi(id: number): void {
    this.isWorking = true;
    const params = { id: id };
    this.apiService.get(EEndpoints.AddressById, params).subscribe(
      (response: ResponseApi<IAddress>) => {
        if (response.code == 100) {
          this.address = response.result;
        } else
          this.toaster.showToaster(this.translate.instant('errors.errorGettingAddress'));
        this.isWorking = false;
      }, err => this._responseError(err));
  }

  getPersonsApi(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Artists).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.persons = response.result.map((s: any) => ({
            value: s.id,
            viewValue: s.name + ' ' + s.lastName
          }));

          this.personFiltered = this.f.representativeLegalName.valueChanges.pipe(
            startWith(''),
            map(state => state ? this._filterPersons(state) : this.persons.slice())
          );
          if (this.model.id) {
            const found = this.persons.find(f => f.value == this.model.representativeLegalId);
            this.f['representativeLegalName'].patchValue(found.viewValue);
          }
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  createAddressApi(address: IAddress, company: ICompany): void {
    this.isWorking = true;
    delete address.id;
    this.apiService.save(EEndpoints.Address, address).subscribe(
      (response: ResponseApi<IAddress>) => {
        if (response.code == 100) {
          company.addressId = response.result.id;
          this.createCompanyApi(company);
        } else
          this.toaster.showToaster(this.translate.instant('errors.errorGettingItem'));
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  updateAddressApi(address: IAddress, company: ICompany): void {
    this.isWorking = true;
    this.apiService.update(EEndpoints.Address, address).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100)
          this.updateCompanyApi(company);
        else
          this.toaster.showToaster(this.translate.instant('errors.errorGettingItem'));
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  createCompanyApi(company: ICompany): void {
    this.isWorking = true;
    delete company.id;
    delete company['address'];
    this.apiService.save(EEndpoints.Company, company).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.itemSaved'));
          this.onNoClick(this.model);
        } else {
          this.toaster.showToaster(this.translate.instant('errors.errorSavingItem'));
          this.onNoClick();
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  updateCompanyApi(company: ICompany): void {
    this.isWorking = true;
    delete company['address'];
    this.apiService.update(EEndpoints.Company, company).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.itemUpdated'));
          this.onNoClick(this.model);
        } else {
          this.toaster.showToaster(this.translate.instant('errors.errorUpdatingItem'));
          this.onNoClick();
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }
  //#endregion
}
