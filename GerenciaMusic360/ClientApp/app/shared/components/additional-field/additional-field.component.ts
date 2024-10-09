import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from '@models/response-api';
import { IField } from '@models/field';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IFieldValue } from '@models/field-value';

@Component({
  selector: 'app-additional-field',
  templateUrl: './additional-field.component.html',
  styleUrls: ['./additional-field.component.scss']
})
export class AdditionalFieldComponent implements OnInit {

  constructor(
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
  ) { }

  //Input
  @Input() moduleId: number;
  @Input() moduleTypeId: number = 0;
  @Input() documentId: number = 0;
  @Output() formReady = new EventEmitter<FormGroup>();

  dataForm: FormGroup = new FormGroup({});

  lstFormGroup: FormGroup[];
  isWorking: boolean = false;
  fields: IField[] = [];
  action: string = "Guardar";
  //public fieldType: EFieldType;

  modelField: IField = <IField>{};
  modelFieldsValue: IFieldValue[] = [];
  fieldsValue: IFieldValue[] = [];

  ngOnInit() {
    this.getFieldsByModule(this.moduleId, this.moduleTypeId, this.documentId);
  }

  getFieldsByModule(moduleId: number, moduleTypeId: number = 0, documentId: number = 0): void {
    //aca debo llamar a las categorias del pryecto
    this.isWorking = true;
    const params = [];
    params['moduleId'] = moduleId;
    params['moduleTypeId'] = moduleTypeId;
    params['documentId'] = documentId;
    this.ApiService.get(EEndpoints.FieldsByModule, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.fields = [];
          this.fields = <IField[]>response.result;
          let formGroup = new FormGroup({});
          this.dataForm = new FormGroup({});

          this.fields.forEach((field: IField) => {
            let formControl: FormControl = new FormControl(true, (field.required ? Validators.required : null));
            if (field.fieldTypeName == 'Checkbox') {
              field.value = !field.value ? 'false': 'true';
            }
            formControl.setValue(field.value);
            let nameControl = field.key + '-' + field.id + (field.fieldValueId > 0 ? '-' + field.fieldValueId : '');
            field.formControlName = nameControl;
            formGroup.addControl(nameControl, formControl);
          });

          this.dataForm = formGroup;
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  saveField() {
    this.modelFieldsValue = [];
    Object.keys(this.dataForm.controls).forEach(key => {
      let keySplit = key.split('-');
      let fieldValueId: number = 0;
      let id: number = + keySplit[1];

      if (keySplit.length > 2) {
        fieldValueId = + key.split('-')[2];
      }

      let fieldValue: IFieldValue = <IFieldValue>{};
      fieldValue.id = fieldValueId;
      fieldValue.moduleId = this.moduleId;
      fieldValue.moduleTypeId = this.moduleTypeId;
      fieldValue.documentId = this.documentId;
      fieldValue.fieldId = id;
      fieldValue.value = this.dataForm.controls[key].value;
      //push the elements into the array object
      this.modelFieldsValue.push(fieldValue);
    });

    if (this.modelFieldsValue.length > 0) {
      this._saveFieldValue(this.modelFieldsValue);
    }
  }

  private _saveFieldValue(modelFieldsValue: IFieldValue[]): void {
    //Registro Field
    this.ApiService.save(EEndpoints.FieldValue, modelFieldsValue)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.toasterService.showToaster(this.translate.instant('additionalFields.messages.saved'));
            // this.getFieldsByModule(this.moduleId, this.moduleTypeId);
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
