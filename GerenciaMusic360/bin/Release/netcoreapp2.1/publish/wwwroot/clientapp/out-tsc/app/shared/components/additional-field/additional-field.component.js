var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
var AdditionalFieldComponent = /** @class */ (function () {
    function AdditionalFieldComponent(ApiService, toasterService, translate, formBuilder) {
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.formBuilder = formBuilder;
        this.moduleTypeId = 0;
        this.documentId = 0;
        this.formReady = new EventEmitter();
        this.dataForm = new FormGroup({});
        this.isWorking = false;
        this.fields = [];
        this.action = "Guardar";
        //public fieldType: EFieldType;
        this.modelField = {};
        this.modelFieldsValue = [];
        this.fieldsValue = [];
    }
    AdditionalFieldComponent.prototype.ngOnInit = function () {
        this.getFieldsByModule(this.moduleId, this.moduleTypeId, this.documentId);
    };
    AdditionalFieldComponent.prototype.getFieldsByModule = function (moduleId, moduleTypeId, documentId) {
        var _this = this;
        if (moduleTypeId === void 0) { moduleTypeId = 0; }
        if (documentId === void 0) { documentId = 0; }
        //aca debo llamar a las categorias del pryecto
        this.isWorking = true;
        var params = [];
        params['moduleId'] = moduleId;
        params['moduleTypeId'] = moduleTypeId;
        params['documentId'] = documentId;
        this.ApiService.get(EEndpoints.FieldsByModule, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.fields = [];
                _this.fields = response.result;
                var formGroup_1 = new FormGroup({});
                _this.dataForm = new FormGroup({});
                _this.fields.forEach(function (field) {
                    var formControl = new FormControl(true, (field.required ? Validators.required : null));
                    if (field.fieldTypeName == 'Checkbox') {
                        field.value = !field.value ? 'false' : 'true';
                    }
                    formControl.setValue(field.value);
                    var nameControl = field.key + '-' + field.id + (field.fieldValueId > 0 ? '-' + field.fieldValueId : '');
                    field.formControlName = nameControl;
                    formGroup_1.addControl(nameControl, formControl);
                });
                _this.dataForm = formGroup_1;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AdditionalFieldComponent.prototype.saveField = function () {
        var _this = this;
        this.modelFieldsValue = [];
        Object.keys(this.dataForm.controls).forEach(function (key) {
            var keySplit = key.split('-');
            var fieldValueId = 0;
            var id = +keySplit[1];
            if (keySplit.length > 2) {
                fieldValueId = +key.split('-')[2];
            }
            var fieldValue = {};
            fieldValue.id = fieldValueId;
            fieldValue.moduleId = _this.moduleId;
            fieldValue.moduleTypeId = _this.moduleTypeId;
            fieldValue.documentId = _this.documentId;
            fieldValue.fieldId = id;
            fieldValue.value = _this.dataForm.controls[key].value;
            //push the elements into the array object
            _this.modelFieldsValue.push(fieldValue);
        });
        if (this.modelFieldsValue.length > 0) {
            this._saveFieldValue(this.modelFieldsValue);
        }
    };
    AdditionalFieldComponent.prototype._saveFieldValue = function (modelFieldsValue) {
        var _this = this;
        //Registro Field
        this.ApiService.save(EEndpoints.FieldValue, modelFieldsValue)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('additionalFields.messages.saved'));
                // this.getFieldsByModule(this.moduleId, this.moduleTypeId);
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AdditionalFieldComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AdditionalFieldComponent.prototype, "moduleId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AdditionalFieldComponent.prototype, "moduleTypeId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AdditionalFieldComponent.prototype, "documentId", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AdditionalFieldComponent.prototype, "formReady", void 0);
    AdditionalFieldComponent = __decorate([
        Component({
            selector: 'app-additional-field',
            templateUrl: './additional-field.component.html',
            styleUrls: ['./additional-field.component.scss']
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            TranslateService,
            FormBuilder])
    ], AdditionalFieldComponent);
    return AdditionalFieldComponent;
}());
export { AdditionalFieldComponent };
//# sourceMappingURL=additional-field.component.js.map