import { Component, OnInit, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { MatDatepickerInputEvent, MatDialogRef, MatCheckboxChange, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { EModules } from "@enums/modules";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from '@models/select-option.models';
import { ResponseApi } from '@models/response-api';
import { IField } from '@models/field';
import { IFieldType } from '@models/field-type';
import { IFieldValue } from '@models/field-value';

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.css']
})
export class AddFieldComponent implements OnInit {

  //Input
  @Input() field: IField = <IField>{};
  @Output() formReady = new EventEmitter<FormGroup>();

  //VARIABLES
  id: number = 0;
  dataFieldForm: FormGroup;
  isWorking: boolean = false;
  isRequired: boolean = false;

  //MODELOS PARA LA INSERCION Y ACTUALIZACION
  modelField: IField = <IField>{};

  fieldTypes: SelectOption[] = [];
  modules: SelectOption[] = [];
  moduleTypes: SelectOption[] = [];

  projectTypes: SelectOption[] = [];
  contractTypes: SelectOption[] = [];
  
  
  action: string = this.translate.instant('general.save');

  constructor(
    public dialogRef: MatDialogRef<AddFieldComponent>,
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
  ) { }

  ngOnInit() {

    this.field = this.actionData.field;
    if(this.field.id > 0){
      this.action = this.translate.instant('general.save');
    }

    this.isRequired = false;
    this.getFieldTypes();
    this.getModules();
    this.getProjectTypes();
    this.getContractTypes();
    this.configureFieldForm();
  }

  get fieldForm() { return this.dataFieldForm.controls; }

  private configureFieldForm(): void {
    this.dataFieldForm = this.formBuilder.group({
        id: [this.field.id, []],
        fieldTypeId: [this.field.fieldTypeId, [
            Validators.required
        ]],
        key: [this.field.key, [
          Validators.maxLength(50),
          Validators.minLength(1),
          Validators.required
        ]],
        text: [this.field.text, [
          Validators.maxLength(450),
          Validators.minLength(1),
          Validators.required
        ]],
        valueDefault: [this.field.valueDefault, [
            Validators.maxLength(450),
            Validators.minLength(0),
        ]],
        moduleId: [this.field.moduleId, [
            Validators.required,
        ]],
        dimension: [this.field.dimension, [
            Validators.required,
        ]],
        moduleTypeId: [this.field.moduleTypeId, [
            Validators.maxLength(3),
        ]],
        position: [this.field.position, [
            Validators.required,
            Validators.maxLength(3),
        ]],
        marker: [this.field.marker, [
          Validators.maxLength(100),
          Validators.minLength(1),
          Validators.required
        ]],
        required: [this.field.required? true : false, [
          Validators.required,
        ]]
    });
  }

  getFieldTypes() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.FieldTypes).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.fieldTypes = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  getModules() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.Modules).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.modules = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  getModuleTypes() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.ModuleTypes).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.moduleTypes = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  getProjectTypes() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.ProjectTypes).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.projectTypes = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });

          if(this.field.moduleId == EModules.Project){
            this.moduleTypes = this.projectTypes;
          }
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  getContractTypes() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.ContractTypes).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.contractTypes = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });

          if(this.field.moduleId == EModules.Contract){
            this.moduleTypes = this.contractTypes;
          }
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  //#region Events
  saveField() {
    this.modelField = <IField>this.dataFieldForm.value;
    let objModelField = Object.assign({}, this.modelField);

    //Update
    if (objModelField.id){
      this._updateFieldApi(objModelField);
    }
    else{
    //Create
      delete objModelField["id"];
      this._createFieldApi(objModelField);
    }
  }

  _updateFieldApi(modelField: IField): void {
    //Registro Field
    this.ApiService.update(EEndpoints.Field, modelField)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick(true);
              this.toasterService.showToaster(this.translate.instant('messages.itemUpdated'));
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  _createFieldApi(modelField: IField): void {
    //Registro Field
    this.ApiService.save(EEndpoints.Field, modelField)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick(true);
              this.toasterService.showToaster(this.translate.instant('messages.itemSaved'));
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  changeRequired(event: MatCheckboxChange) {
    this.isRequired = event.checked;
  }

  onItemSelect(item: any) {
    if(item == EModules.Project){
      this.moduleTypes = this.projectTypes;
    }else if(item == EModules.Contract){
      this.moduleTypes = this.contractTypes;
    }else{
      this.moduleTypes = [];
    }
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }
}
