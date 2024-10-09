var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { EModules } from "@enums/modules";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
var AddFieldComponent = /** @class */ (function () {
    function AddFieldComponent(dialogRef, formBuilder, ApiService, toasterService, translate, actionData) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.actionData = actionData;
        //Input
        this.field = {};
        this.formReady = new EventEmitter();
        //VARIABLES
        this.id = 0;
        this.isWorking = false;
        this.isRequired = false;
        //MODELOS PARA LA INSERCION Y ACTUALIZACION
        this.modelField = {};
        this.fieldTypes = [];
        this.modules = [];
        this.moduleTypes = [];
        this.projectTypes = [];
        this.contractTypes = [];
        this.action = this.translate.instant('general.save');
    }
    AddFieldComponent.prototype.ngOnInit = function () {
        this.field = this.actionData.field;
        if (this.field.id > 0) {
            this.action = this.translate.instant('general.save');
        }
        this.isRequired = false;
        this.getFieldTypes();
        this.getModules();
        this.getProjectTypes();
        this.getContractTypes();
        this.configureFieldForm();
    };
    Object.defineProperty(AddFieldComponent.prototype, "fieldForm", {
        get: function () { return this.dataFieldForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddFieldComponent.prototype.configureFieldForm = function () {
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
            required: [this.field.required ? true : false, [
                    Validators.required,
                ]]
        });
    };
    AddFieldComponent.prototype.getFieldTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.FieldTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.fieldTypes = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddFieldComponent.prototype.getModules = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.Modules).subscribe(function (response) {
            if (response.code == 100) {
                _this.modules = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddFieldComponent.prototype.getModuleTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.ModuleTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.moduleTypes = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddFieldComponent.prototype.getProjectTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.ProjectTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectTypes = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
                if (_this.field.moduleId == EModules.Project) {
                    _this.moduleTypes = _this.projectTypes;
                }
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddFieldComponent.prototype.getContractTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.ContractTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.contractTypes = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
                if (_this.field.moduleId == EModules.Contract) {
                    _this.moduleTypes = _this.contractTypes;
                }
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    //#region Events
    AddFieldComponent.prototype.saveField = function () {
        this.modelField = this.dataFieldForm.value;
        var objModelField = Object.assign({}, this.modelField);
        //Update
        if (objModelField.id) {
            this._updateFieldApi(objModelField);
        }
        else {
            //Create
            delete objModelField["id"];
            this._createFieldApi(objModelField);
        }
    };
    AddFieldComponent.prototype._updateFieldApi = function (modelField) {
        var _this = this;
        //Registro Field
        this.ApiService.update(EEndpoints.Field, modelField)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('messages.itemUpdated'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddFieldComponent.prototype._createFieldApi = function (modelField) {
        var _this = this;
        //Registro Field
        this.ApiService.save(EEndpoints.Field, modelField)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('messages.itemSaved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddFieldComponent.prototype.changeRequired = function (event) {
        this.isRequired = event.checked;
    };
    AddFieldComponent.prototype.onItemSelect = function (item) {
        if (item == EModules.Project) {
            this.moduleTypes = this.projectTypes;
        }
        else if (item == EModules.Contract) {
            this.moduleTypes = this.contractTypes;
        }
        else {
            this.moduleTypes = [];
        }
    };
    AddFieldComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddFieldComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AddFieldComponent.prototype, "field", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AddFieldComponent.prototype, "formReady", void 0);
    AddFieldComponent = __decorate([
        Component({
            selector: 'app-add-field',
            templateUrl: './add-field.component.html',
            styleUrls: ['./add-field.component.css']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService,
            TranslateService, Object])
    ], AddFieldComponent);
    return AddFieldComponent;
}());
export { AddFieldComponent };
//# sourceMappingURL=add-field.component.js.map