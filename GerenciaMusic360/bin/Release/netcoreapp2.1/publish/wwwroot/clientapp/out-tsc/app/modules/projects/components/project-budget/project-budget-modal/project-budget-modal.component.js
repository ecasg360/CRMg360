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
import { Component, Optional, Inject } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ECategoriesModules } from '@enums/categories-modules';
import { EModules } from '@enums/modules';
import { startWith, map } from 'rxjs/operators';
var ProjectBudgetModalComponent = /** @class */ (function () {
    function ProjectBudgetModalComponent(fb, translate, dialogRef, translationLoaderService, data, apiService, dialog, toaster) {
        this.fb = fb;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.translationLoaderService = translationLoaderService;
        this.data = data;
        this.apiService = apiService;
        this.dialog = dialog;
        this.toaster = toaster;
        this.model = {};
        this.isWorking = false;
        this.categories = [];
        this.question = '';
        this.categoryFC = new FormControl();
    }
    ProjectBudgetModalComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.model = this.data.model;
        this.projectId = this.data.projectId;
        this.projectTypeId = this.data.projectTypeId;
        this.budget = this.data.budget;
        this.availableBudget = this.data.availableBudget;
        this._getCategories();
        this.initForm();
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    };
    ProjectBudgetModalComponent.prototype.initForm = function () {
        this.projectBudgetForm = this.fb.group({
            id: [this.model.id, []],
            budget: [this.model.budget, [Validators.required]],
            categoryId: [this.model.categoryId, [Validators.required]],
            spent: [this.model.spent, []],
            notes: [this.model.notes, [
                    Validators.minLength(3),
                    Validators.maxLength(255)
                ]],
        });
    };
    Object.defineProperty(ProjectBudgetModalComponent.prototype, "f", {
        get: function () { return this.projectBudgetForm.controls; },
        enumerable: false,
        configurable: true
    });
    ProjectBudgetModalComponent.prototype.autocompleteOptionSelected = function ($event) {
        if ($event.option.id == '0') {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            var category = {
                name: newItem,
                description: '',
                key: '',
                projectTypeId: this.projectTypeId,
                moduleId: EModules.ProjectBudget,
            };
            this._saveCategory(category);
        }
        else {
            this.f.categoryId.patchValue($event.option.id);
        }
    };
    ProjectBudgetModalComponent.prototype.onNoClick = function (budget) {
        if (budget === void 0) { budget = undefined; }
        this.dialogRef.close(budget);
    };
    ProjectBudgetModalComponent.prototype.confirmSave = function () {
        var _this = this;
        this.isWorking = true;
        this.model = this.projectBudgetForm.value;
        this.model.spent = (!this.model.spent) ? 0 : this.model.spent;
        this.model.projectId = this.projectId;
        this.model.categoryName = this.categories.find(function (f) { return f.value == _this.model.categoryId; }).viewValue;
        this._setBudget(this.model);
    };
    ProjectBudgetModalComponent.prototype._setBudget = function (budget) {
        delete budget.categoryName;
        delete budget.projectBudgetDetail;
        delete budget.category;
        // delete budget.statusRecordId;
        if (budget.id && budget.id > 0)
            this._updateProjectBudget(budget);
        else
            this._createProjectBudget(budget);
    };
    ProjectBudgetModalComponent.prototype._filter = function (value) {
        var filterValue = value ? value.toLowerCase() : '';
        var results = [];
        results = this.categories.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (results.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + value.trim() + "\"?"
                }]
            : results;
    };
    ProjectBudgetModalComponent.prototype._responseError = function (err) {
        this.isWorking = false;
        console.log(err);
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    };
    //#region APIS
    ProjectBudgetModalComponent.prototype._getCategories = function () {
        var _this = this;
        this.isWorking = true;
        var params = { moduleId: ECategoriesModules.ProyectoPresupuesto, projectTypeId: this.projectTypeId };
        this.apiService.get(EEndpoints.CategoriesByModule, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.categories = response.result.map(function (m) { return ({ value: m.id, viewValue: m.name }); });
                _this.filteredOptions = _this.categoryFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorGettingCategories'));
            _this.isWorking = false;
        }, this._responseError);
    };
    ProjectBudgetModalComponent.prototype._createProjectBudget = function (budget) {
        var _this = this;
        delete budget.id;
        this.apiService.save(EEndpoints.ProjectBudget, budget).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemSaved'));
                _this.onNoClick(_this.model);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.errorSavingItem'));
                _this.onNoClick(undefined);
            }
        }, this._responseError);
    };
    ProjectBudgetModalComponent.prototype._updateProjectBudget = function (budget) {
        var _this = this;
        this.apiService.update(EEndpoints.ProjectBudget, budget).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemUpdated'));
                _this.onNoClick(_this.model);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.errorEditingItem'));
                _this.onNoClick(undefined);
            }
        }, this._responseError);
    };
    ProjectBudgetModalComponent.prototype._saveCategory = function (model, saveBudget) {
        var _this = this;
        if (saveBudget === void 0) { saveBudget = false; }
        this.isWorking = true;
        this.apiService.save(EEndpoints.Category, model).subscribe(function (response) {
            if (response.code == 100) {
                _this.categories.push({
                    value: response.result.id,
                    viewValue: response.result.name
                });
                setTimeout(function () { return _this.categoryFC.setValue(response.result.name); });
                _this.f.categoryId.patchValue(response.result.id);
            }
            _this.isWorking = false;
        }, this._responseError);
    };
    ProjectBudgetModalComponent = __decorate([
        Component({
            selector: 'app-project-budget-modal',
            templateUrl: './project-budget-modal.component.html',
            styleUrls: ['./project-budget-modal.component.scss']
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            TranslateService,
            MatDialogRef,
            FuseTranslationLoaderService, Object, ApiService,
            MatDialog,
            ToasterService])
    ], ProjectBudgetModalComponent);
    return ProjectBudgetModalComponent;
}());
export { ProjectBudgetModalComponent };
//# sourceMappingURL=project-budget-modal.component.js.map