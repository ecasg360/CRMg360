import { Component, OnInit, Optional, Inject, OnDestroy } from '@angular/core';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IContact } from '@models/contact';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatAutocompleteSelectedEvent } from '@angular/material';
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { IPerson } from '@models/person';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { SelectOption } from '@models/select-option.models';
import { ToasterService } from "@services/toaster.service";
import { Observable, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { IPersonType } from '@models/person-type';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})

export class AddContactComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  action: string;
  contact: IContact = <IContact>{};
  person: IPerson = <IPerson>{};
  projectId: number;
  id: number = 0;
  isWorking = true;
  showSelectType: boolean = true;
  pictureUrl: any;
  personTypes: SelectOption[] = [];
  personTypeFC: FormControl = new FormControl();
  filteredOptions: Observable<SelectOption[]>;
  personTypeId: number = 0;
  question = '';

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    public dialogRef: MatDialogRef<AddContactComponent>,
    private service: ApiService,
    private toasterService: ToasterService,
  ) {
    this._getPersonTypes();
  }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.id = this.actionData.id;
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    this.projectId = this.actionData.projectId;
    if (this.actionData.showSelectType != undefined) {
      this.showSelectType = this.actionData.showSelectType;
    }

    this.contact = (this.actionData.model) ? <IContact>this.actionData.model : <IContact>{};
    this.person = <IPerson>this.contact;
    this.pictureUrl = this.contact.pictureUrl;

    if (this.id == 0) {
      this.personTypeId = this.actionData.personTypeId;
      this.action = this.translate.instant('general.save');
    } else {
      this.action = this.translate.instant('general.save');
      this.getProjectContact(this.id);
    }

    this.contact.personTypeId = this.personTypeId;

    this.initForm();

    if (this.personTypeId > 0) {
      this.f.typeId.setValue(this.personTypeId);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initForm(): void {
    this.contactForm = this.formBuilder.group({
      typeId: [this.contact.personTypeId, [
        Validators.required
      ]]
    });
    this.isWorking = false;
  }

  enter() {
    const value = this.personTypeFC.value;
    if (value.indexOf(this.question) < 0) {
      const found = this.personTypes.find(f => f.viewValue.toLowerCase() == value.toLowerCase());
      if (found) {
        this.f.typeId.patchValue(found.value);
      } else
        this._savePersonType(value);
    }
  }

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
    if ($event.option.id != '0') {
      const found = this.personTypes.find(f => f.value == $event.option.id);
      if (found) {
        this.f.typeId.patchValue(found.value);
      }
    } else {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
      this._savePersonType(newItem);
    }
  }

  bindExternalForm(name: string, form: FormGroup) {
    this.contactForm.setControl(name, form);
  }

  get f() { return this.contactForm.controls; }

  setContact(): void {
    if (!this.contactForm.invalid) {
      this.isWorking = true;
      const formValues = this.contactForm.value;
      this.contact = <IContact>formValues.generalData;
      //this.contact.typeId = formValues.typeId;
      this.contact.id = this.id;
      this.contact.personTypeId = formValues.typeId;
      for (const key in formValues) {
        if (key != 'generalData') {
          let value = formValues[key];
          this.contact[key] = value;
        }
      }
      this.contact.projectId = this.projectId;
      this.contact.typeId = 1;
      if (this.contact.id > 0) {
        this.update();
      } else {
        this.save();
      }
    }
  }

  onNoClick(status: IContact = undefined): void {
    this.dialogRef.close(status);
  }

  private _filter(value: string): SelectOption[] {
    const filterValue = value.toLowerCase();
    let result = this.personTypes.filter(option => option.viewValue.toLowerCase().includes(filterValue));
    return (result.length == 0)
      ? [{
        value: 0,
        viewValue: `${this.question}${value.trim()}"?`
      }]
      : result;
  }

  private responseError(err: any) {
    this.isWorking = false;
    console.log('http error', err);
  }

  //#region API

  getProjectContact(id: number) {
    this.isWorking = true;
    this.service.get(EEndpoints.ProjectContact, { id: id })
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(
        (data: ResponseApi<IContact>) => {
          if (data.code == 100) {
            this.contact = <IContact>data.result;
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      )
  }

  private _getPersonTypes() {
    this.isWorking = true;
    const params = { entityId: 9 };
    this.service.get(EEndpoints.PersonTypes, params)
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(
        (response: ResponseApi<IPersonType[]>) => {
          if (response.code == 100) {
            this.personTypes = response.result.map((s: IPersonType) => ({
              value: s.id,
              viewValue: s.name
            }));

            this.filteredOptions = this.personTypeFC.valueChanges
              .pipe(
                startWith(''),
                map(value => this._filter(value))
              );
          }
        }, err => this.responseError(err)
      );
  }

  private _savePersonType(name: string) {
    this.isWorking = true;
    const person = <IPersonType>{
      name: name,
      description: name,
      entityId: 9
    }
    this.service.save(EEndpoints.PersonType, person)
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(
        (response: ResponseApi<IPersonType>) => {
          if (response.code == 100) {
            this.personTypes.push({
              value: response.result.id,
              viewValue: response.result.name
            });
            setTimeout(() => {
              this.f.typeId.patchValue(response.result.id);
              this.personTypeFC.patchValue(response.result.name);
            });
          } else
            this.toasterService.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }, err => this.responseError(err)
      )
  }

  update(): void {
    this.service.update(EEndpoints.ProjectContact, this.contact)
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
        if (data.code == 100) {
          this.toasterService.showToaster(this.translate.instant('settings.contact.messages.saved'));
          this.onNoClick(this.contact);
        } else {
          this.toasterService.showToaster(data.message);
          this.onNoClick();
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
      )
  }

  save(): void {
    delete this.contact.id;
    this.service.save(EEndpoints.ProjectContact, this.contact)
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
        if (data.code == 100) {
          this.toasterService.showTranslate('messages.itemSaved');
          this.contact.id = data.result;
          this.onNoClick(this.contact);
        } else {
          this.toasterService.showToaster(data.message);
          this.onNoClick();
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
      )
  }
  //#endregion
}
