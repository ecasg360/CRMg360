import { Component, OnInit, Inject } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IEditor } from '@models/editor';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectOption } from '@models/select-option.models';
import { IAssociation } from '@models/association';
import { ILocalCompany } from '@models/localCompany';

@Component({
  selector: 'app-add-editor',
  templateUrl: './add-editor.component.html',
  styleUrls: ['./add-editor.component.scss']
})
export class AddEditorComponent implements OnInit {

  model: IEditor;
  action: string;
  editorForm: FormGroup;
  isWorking: boolean = false;
  showName: boolean = false;
  showDba: boolean = false;
  companiesList: SelectOption[] = [];
  associationsList: SelectOption[] = [];

  constructor(
    private translationLoaderService: FuseTranslationLoaderService,
    private translate: TranslateService,
    private apiService: ApiService,
    private toaster: ToasterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.model = <IEditor>this.data.model;
    this.translationLoaderService.loadTranslations(...allLang);
    this.action = this.model.id
      ? this.translate.instant('general.save')
      : this.translate.instant('general.new');
    this._getAssociationsApi();
    this._getCompaniesApi();
    this.initForm();
  }

  //#region form

  get f() { return this.editorForm.controls; }

  initForm() {
    this.editorForm = this.fb.group({
      id: [this.model.id, []],
      dba: [this.model.dba, []],
      name: [this.model.name, []],
      localCompanyId: [this.model.localCompanyId, [Validators.required]],
      associationId: [this.model.associationId, [Validators.required]],
      IsInternal: [this.model.isInternal, [Validators.required]],
    });

    if (this.model.isInternal != undefined) {
      if (this.model.isInternal) {
        this.showName = false;
        this.showDba = true;
        this._manageFormFieldValidation('name', 'dba');
      } else {
        this.showName = true;
        this.showDba = false;
        this._manageFormFieldValidation('dba', 'name');
      }
    }
  }

  //#endregion

  //#region Events
  saveEditor() {
    this.model = <IEditor>this.editorForm.value;
    this.model.name = (this.model.name) ? this.model.name : '';
    this.model.dba = (this.model.dba) ? this.model.dba : '';
    if (this.model.id)
      this._updateEditorApi(this.model);
    else
      this._createEditorApi(this.model);
  }

  checkboxChange($event: MatCheckboxChange) {
    if ($event.checked) {
      this.showName = false;
      this.showDba = true;
      this._manageFormFieldValidation('name', 'dba');
    } else {
      this.showName = true;
      this.showDba = false;
      this._manageFormFieldValidation('dba', 'name');
    }
  }

  onNoClick(data: IEditor = undefined): void {
    this.dialogRef.close(data);
  }

  private _manageFormFieldValidation(fieldToDisable: string, fieldToEnable: string) {
    this.f[fieldToDisable].clearValidators();
    this.f[fieldToDisable].updateValueAndValidity();
    this.f[fieldToDisable].patchValue(null);
    this.f[fieldToEnable].setValidators([Validators.required]);
    this.f[fieldToEnable].updateValueAndValidity();
  }

  //#endregion

  private _responseError(err: HttpErrorResponse) {
    console.log(err);
    this.isWorking = false;
  }

  //#region API
  private _getCompaniesApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.LocalCompanies).subscribe(
      (response: ResponseApi<ILocalCompany[]>) => {
        if (response.code == 100)
          this.companiesList = response.result.map(m => ({ value: m.id, viewValue: m.name }));
        else
          this.toaster.showToaster(this.translate.instant('errors.errorGettingItems'));
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _getAssociationsApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Associations).subscribe(
      (response: ResponseApi<IAssociation[]>) => {
        if (response.code == 100)
          this.associationsList = response.result.map(m => ({ value: m.id, viewValue: m.name }));
        else
          this.toaster.showToaster(this.translate.instant('errors.errorGettingItems'));
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _createEditorApi(editor: IEditor) {
    this.isWorking = true;
    delete editor.id;
    this.apiService.save(EEndpoints.Editor, editor).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.itemSaved'));
          this.onNoClick(editor);
        } else {
          this.toaster.showToaster(this.translate.instant('errors.errorSavingItem'));
          this.onNoClick();
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }
  private _updateEditorApi(editor: IEditor) {
    this.isWorking = true;
    this.apiService.update(EEndpoints.Editor, editor).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.itemUpdated'));
          this.onNoClick(editor);
        } else {
          this.toaster.showToaster(this.translate.instant('errors.errorEditingItem'));
          this.onNoClick();
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }
  //#endregion
}
