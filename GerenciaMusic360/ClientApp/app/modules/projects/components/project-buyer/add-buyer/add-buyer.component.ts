import { Component, OnInit, Optional, Inject, Input } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from "@services/api.service";
import { IProjectType } from "@models/project-type";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from "@models/response-api";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ResponseSelect } from "@models/select-response";
import { SelectOption } from "@models/select-option.models";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { AddCompanyComponent } from "@shared/components/add-company/add-company.component";
import { AddArtistComponent } from "@modules/artist/components/artist/add-artist.component";
import { entity } from "@enums/entity";
import { ICompany } from '@models/company';

@Component({
  selector: 'app-add-buyer',
  templateUrl: './add-buyer.component.html'
})
export class AddBuyerComponent implements OnInit {
  projectId: number =0;
  form: FormGroup;
  id: number = 0;
  titleAction: string;
  action: string;
  isWorking: boolean = true;
  buyerTypes: SelectOption[] = [];

  personFiltered: Observable<SelectOption[]>;
  companyFiltered: Observable<SelectOption[]>;

  persons: SelectOption[] = [];
  companies: SelectOption[] = [];
  get f() { return this.form.controls; }

  constructor(
    public dialogRef: MatDialogRef<AddBuyerComponent>,
    private formBuilder: FormBuilder,
    private service: ApiService,
    private dialog: MatDialog,
    private toasterService: ToasterService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.id = this.actionData.id;
    this.projectId = this.actionData.projectId;
    this.configureForm();
    this.getBuyerTypes();
    this.getCompanies();
    this.getPersons();
    if (this.id == 0) {
      this.isWorking = false;
      this.titleAction = this.translate.instant('settings.projectBuyers.saveTitle');
      this.action = this.translate.instant('general.save');
    } else {
      this.titleAction = this.translate.instant('settings.projectBuyers.editTitle');
      this.action = this.translate.instant('general.save');
      //this.getCurrency();
    }
  }

  getBuyerTypes(): void {
    this.service.get(EEndpoints.BuyerTypes).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.buyerTypes = response.result.map((s: ResponseSelect) => ({
            value: s.id,
            viewValue: s.name
          }));
        }
      }, (err) => this.responseError(err)
    )
  }

  getCompanies(): void {
    this.service.get(EEndpoints.Companies).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.companies = response.result.map((s: any) => ({
            value: s.id,
            viewValue: s.businessName
          }));
          this.companyFiltered = this.f.businessName.valueChanges.pipe(
            startWith(''),
            map(state => state ? this._filterCompanies(state) : this.companies.slice())
          );
        }
      }, (err) => this.responseError(err)
    )
  }

  getPersons(): void {
    this.service.get(EEndpoints.Buyers)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.persons = response.result.map((s: any) => ({
            value: s.id,
            viewValue: s.name + ' ' + s.lastName
          }));

          this.personFiltered = this.f.personName.valueChanges.pipe(
            startWith(''),
            map(state => state ? this._filterPersons(state) : this.persons.slice())
          );
        }
      }, (err) => this.responseError(err));
  }

  private _filterPersons(value: any): SelectOption[] {
    const filterValue = value.toLowerCase();
    return this.persons.filter((person) => person.viewValue.toLowerCase().indexOf(filterValue) === 0);
  }


  private _filterCompanies(value: any): SelectOption[] {
    const filterValue = value.toLowerCase();
    return this.companies.filter((company) => company.viewValue.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(value): string {
    return value ? value.viewValue : value;
  }

  onSelectionChanged(e) {
    this.f.companyId.setValue(e.option.value.value)
  }

  private configureForm(): void {
    this.form = this.formBuilder.group({
      buyerTypeId: ['', [
        Validators.required
      ]],
      personId: [],
      personName: [''],
      projectId: [this.projectId],
      companyId: [],
      businessName: [''],
      representativeLegalName: ['']
    });
  }

  private populateForm(data: IProjectType): void {
    Object.keys(this.form.controls).forEach(name => {
      if (this.form.controls[name]) {
        this.form.controls[name].patchValue(data[name]);
      }
    });
    this.id = data.id;
  }

  set(): void {
    if (this.form.valid) {
      this.isWorking = true;
      if (this.id == 0) {
        this.save();
      } else {
        this.update();
      }
    }
  }

  save(): void {
      const model = this.form.value;
      model.id = 0;  
      const find = this.persons.find((x) => x.viewValue === this.f.representativeLegalName.value);
      if (find) {
          model.personId = find.value;
    }

    this.service.save(EEndpoints.ProjectBuyer, model)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick(true);
            this.toasterService.showToaster(this.translate.instant('settings.projectbuyer.messages.saved'));
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  update(): void {
    this.form.value.id = this.id;
    this.service.update(EEndpoints.ProjectBuyers, this.form.value)
      .subscribe(data => {
        if (data.code == 100) {
          this.onNoClick(true);
          this.toasterService.showToaster(this.translate.instant('settings.projectbuyer.messages.saved'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
      )
  }
  showModalCompany(): void {
    const dialogRef = this.dialog.open(AddCompanyComponent, {
      width: '1000px',
      data: {
        id: 0,
        model: <ICompany>{}
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getCompanies();
    });
  }

  showModalPerson(): void {
    const dialogRef = this.dialog.open(AddArtistComponent, {
      width: '1024px',
      data: {
        id: 0,
        entityType: entity.Buyer,
        isBuyer: true, 
        title: this.translate.instant('general.buyers')
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getCompanies();
    });
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }
}