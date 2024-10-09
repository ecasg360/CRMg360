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
import { Component, Inject } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { FormBuilder, Validators } from '@angular/forms';
import { EEndpoints } from '@enums/endpoints';
var AddEditorComponent = /** @class */ (function () {
    function AddEditorComponent(translationLoaderService, translate, apiService, toaster, fb, dialogRef, data) {
        this.translationLoaderService = translationLoaderService;
        this.translate = translate;
        this.apiService = apiService;
        this.toaster = toaster;
        this.fb = fb;
        this.dialogRef = dialogRef;
        this.data = data;
        this.isWorking = false;
        this.showName = false;
        this.showDba = false;
        this.companiesList = [];
        this.associationsList = [];
    }
    AddEditorComponent.prototype.ngOnInit = function () {
        var _a;
        this.model = this.data.model;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.action = this.model.id
            ? this.translate.instant('general.save')
            : this.translate.instant('general.new');
        this._getAssociationsApi();
        this._getCompaniesApi();
        this.initForm();
    };
    Object.defineProperty(AddEditorComponent.prototype, "f", {
        //#region form
        get: function () { return this.editorForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddEditorComponent.prototype.initForm = function () {
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
            }
            else {
                this.showName = true;
                this.showDba = false;
                this._manageFormFieldValidation('dba', 'name');
            }
        }
    };
    //#endregion
    //#region Events
    AddEditorComponent.prototype.saveEditor = function () {
        this.model = this.editorForm.value;
        this.model.name = (this.model.name) ? this.model.name : '';
        this.model.dba = (this.model.dba) ? this.model.dba : '';
        if (this.model.id)
            this._updateEditorApi(this.model);
        else
            this._createEditorApi(this.model);
    };
    AddEditorComponent.prototype.checkboxChange = function ($event) {
        if ($event.checked) {
            this.showName = false;
            this.showDba = true;
            this._manageFormFieldValidation('name', 'dba');
        }
        else {
            this.showName = true;
            this.showDba = false;
            this._manageFormFieldValidation('dba', 'name');
        }
    };
    AddEditorComponent.prototype.onNoClick = function (data) {
        if (data === void 0) { data = undefined; }
        this.dialogRef.close(data);
    };
    AddEditorComponent.prototype._manageFormFieldValidation = function (fieldToDisable, fieldToEnable) {
        this.f[fieldToDisable].clearValidators();
        this.f[fieldToDisable].updateValueAndValidity();
        this.f[fieldToDisable].patchValue(null);
        this.f[fieldToEnable].setValidators([Validators.required]);
        this.f[fieldToEnable].updateValueAndValidity();
    };
    //#endregion
    AddEditorComponent.prototype._responseError = function (err) {
        console.log(err);
        this.isWorking = false;
    };
    //#region API
    AddEditorComponent.prototype._getCompaniesApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.LocalCompanies).subscribe(function (response) {
            if (response.code == 100)
                _this.companiesList = response.result.map(function (m) { return ({ value: m.id, viewValue: m.name }); });
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorGettingItems'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddEditorComponent.prototype._getAssociationsApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Associations).subscribe(function (response) {
            if (response.code == 100)
                _this.associationsList = response.result.map(function (m) { return ({ value: m.id, viewValue: m.name }); });
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorGettingItems'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddEditorComponent.prototype._createEditorApi = function (editor) {
        var _this = this;
        this.isWorking = true;
        delete editor.id;
        this.apiService.save(EEndpoints.Editor, editor).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemSaved'));
                _this.onNoClick(editor);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.errorSavingItem'));
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddEditorComponent.prototype._updateEditorApi = function (editor) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.Editor, editor).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemUpdated'));
                _this.onNoClick(editor);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.errorEditingItem'));
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddEditorComponent = __decorate([
        Component({
            selector: 'app-add-editor',
            templateUrl: './add-editor.component.html',
            styleUrls: ['./add-editor.component.scss']
        }),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FuseTranslationLoaderService,
            TranslateService,
            ApiService,
            ToasterService,
            FormBuilder,
            MatDialogRef, Object])
    ], AddEditorComponent);
    return AddEditorComponent;
}());
export { AddEditorComponent };
//# sourceMappingURL=add-editor.component.js.map