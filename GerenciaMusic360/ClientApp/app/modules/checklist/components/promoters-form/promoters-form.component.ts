import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from "@angular/material";
import { FuseTranslationLoaderService } from "../../../../../@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
import { ResponseApi } from '@models/response-api';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from "@services/toaster.service";

@Component({
  selector: 'app-promoters-form',
  templateUrl: './promoters-form.component.html',
  styleUrls: ['./promoters-form.component.scss']
})
export class PromotersFormComponent implements OnInit {

  checklistForm: FormGroup;
  isWorking: boolean = false;
  model: any;
  dateContact: Date = new Date(2120, 0, 1);
  contactType = 'llamada';
  callChecked = true;
  action = '';

  constructor(
    private formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    public dialogRef: MatDialogRef<PromotersFormComponent>,
    private apiService: ApiService,
    private translate: TranslateService,
    private toaster: ToasterService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.model = this.actionData.model ? this.actionData.model : {};
    this.action = this.actionData.action;
    this.buildForm();
    if (this.model && this.model.contactType) {
      if (this.model.contactType === 'llamada') {
        this.callChecked = true;
      } else {
        this.callChecked = false;
      }
      this.checklistForm.controls.contactType.setValue(this.model.contactType);
    } else {
      this.checklistForm.controls.contactType.setValue('llamada');
    }
  }

  private buildForm() {
    this.checklistForm = this.formBuilder.group({
      id:[
        this.model.id
      ],
      name: [
        this.model.name,
        [
          Validators.required
        ]
      ],
      lastName: [
        this.model.lastname,
        [
          Validators.required
        ]
      ],
      phone: [
        this.model.phone,
        [
          Validators.required
        ]
      ],
      email: [
        this.model.email,
        [
          Validators.required
        ]
      ],
      terms: [
        this.model.terms,
        [
          Validators.required
        ]
      ],
      contactType: [
        this.model.contactType
          ? this.model.contactType
          : 'llamada',
        [
          Validators.required
        ]
      ],
      deal: [
        this.model.deal
      ],
      dateContact: [
        this.model.dateContact, [
          Validators.required,
          Validators.maxLength(150),
          Validators.minLength(3),
        ]
      ],
      by: [
        this.model.by,
        [
          Validators.required
        ]
      ]
    });
  }

  save() {
    if (!this.checklistForm.invalid) {
      this.model.name = this.f.name.value;
      this.model.lastName = this.f.lastName.value;
      this.model.phone = this.f.phone.value;
      this.model.email = this.f.email.value;
      this.model.terms = this.f.terms.value;
      this.model.contactType = this.f.contactType.value;
      this.model.deal = this.f.deal.value ? 1 : 0;
      this.model.dateContact = this.f.dateContact.value;
      this.model.by = this.f.by.value;
      if (!this.model.id) {
        this.saveApi();
      } else {
        this.updateApi();
      }
    }
  }

  saveApi(): void {
    this.isWorking = true;
    this.apiService.save(EEndpoints.Checklist, this.model).subscribe(
        (response: ResponseApi<number>) => {
          if (response.code == 100) {
              this.toaster.showToaster(this.translate.instant('messages.itemSaved'));
              this.dialogRef.close(response.result);
          } else {
              this.toaster.showToaster(this.translate.instant('messages.savedArtistFailed'));
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
    );
  }

  updateApi(): void {
    this.isWorking = true;
    this.apiService.update(EEndpoints.Checklist, this.model).subscribe(
        (response: ResponseApi<number>) => {
          if (response.code == 100) {
              this.toaster.showToaster(this.translate.instant('messages.itemUpdated'));
              this.dialogRef.close(response.result);
          } else {
              this.toaster.showToaster(this.translate.instant('messages.savedChecklistFailed'));
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
    );
  }

  changeFilter(option) {
    var id = option.id;
    this.checklistForm.controls.contactType.setValue(id);
  }

  dateChangeEvent(event: MatDatepickerInputEvent<Date>) {
    this.f.dateContact.patchValue(event.value);
  }

  responseError(err: any) {
    this.isWorking = false;
}

  get f() { return this.checklistForm.controls; }

}
