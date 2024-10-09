import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Work } from '@models/work';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatCheckboxChange } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { SelectOption } from '@models/select-option.models';

@Component({
  selector: 'app-work-form',
  templateUrl: './work-form.component.html',
  styleUrls: ['./work-form.component.scss']
})
export class WorkFormComponent implements OnInit {

  action: string;
  isWorking: boolean = true;
  isWorkRegistered: boolean = false;
  isWorkCertified: boolean = false;
  work: Work;
  workForm: FormGroup;
  pictureUrl: any;
  certificationAuthority: SelectOption[] = [];

  constructor(
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    public dialogRef: MatDialogRef<Work>
  ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.work = <Work>this.actionData.model;

    this.action = (this.work.id == 0)
      ? this.translate.instant('general.save')
      : this.action = this.translate.instant('general.save');

    this.isWorkRegistered = (this.work.registeredWork)
      ? this.work.registeredWork
      : false;

    this.isWorkCertified = (this.work.certifiedWork)
      ? this.work.certifiedWork
      : false;
    this.pictureUrl = this.work.pictureUrl;

    this.initializeForm();
    this.isWorking = false;
  }

  get f() { return this.workForm.controls; }

  initializeForm(): void {
    const createdDateString = (this.work.createdDateString)
      ? (new Date(this.work.createdDateString)).toISOString()
      : this.work.createdDateString;

    const registerDateString = (this.work.registerDateString)
      ? (new Date(this.work.registerDateString)).toISOString()
      : this.work.registerDateString;

    this.workForm = this.fb.group({
      name: [this.work.name, [Validators.required]],
      description: [this.work.description, []],
      createdDateString: [createdDateString, [Validators.required]],
      registerDateString: [registerDateString, []],
      registeredWork: [this.isWorkRegistered, []],
      registerNum: [this.work.registerNum, []],
      certifiedWork: [this.isWorkCertified, []],
      certificationAuthorityId: [this.work.certificationAuthorityId, []],
      licenseNum: [this.work.licenseNum, [Validators.required]],
      pictureUrl: [this.work.pictureUrl, []],
    });
  }

  setWork() {
    if (!this.workForm.invalid) {
      this.isWorking = true;
      this.work = <Work>this.workForm.value;
      this.work.pictureUrl = (this.pictureUrl.indexOf('assets') >= 0)
        ? null : this.work.pictureUrl;
      this.onNoClick(this.work);
    }
  }

  selectImage($evt: any): void {
    this.pictureUrl = $evt;
    this.work.pictureUrl = $evt;
    this.workForm.controls['pictureUrl'].patchValue($evt);
  }

  checkRegisteredWork($event: MatCheckboxChange) {
    this.isWorkRegistered = $event.checked;
    if (!this.isWorkRegistered) {
      this.workForm.controls['registerDateString'].patchValue(null);
      this.workForm.controls['registerNum'].patchValue(null);
    }
  }

  checkCertifiedWork($event: MatCheckboxChange) {
    this.isWorkCertified = $event.checked;
    if (!this.isWorkCertified) {
      this.workForm.controls['certificationAuthorityId'].patchValue(null);
    }
  }

  onNoClick(data: Work = undefined) {
    this.dialogRef.close(data);
  }
}
