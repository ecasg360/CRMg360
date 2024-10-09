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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { allLang } from '@i18n/allLang';
import { ECategoriesModules } from '@enums/categories-modules';
import { EEndpoints } from '@enums/endpoints';
import { EModules } from '@enums/modules';
import { startWith, map } from 'rxjs/operators';
var ProjectBudgetDetailComponent = /** @class */ (function () {
    function ProjectBudgetDetailComponent(fb, translate, dialogRef, translationLoaderService, data, apiService, toaster) {
        this.fb = fb;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.translationLoaderService = translationLoaderService;
        this.data = data;
        this.apiService = apiService;
        this.toaster = toaster;
        this.budget = {};
        this.model = {};
        this.isWorking = false;
        this.categories = [];
        this.question = '';
        this.categoryFC = new FormControl();
    }
    ProjectBudgetDetailComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.budget = this.data.budget;
        this.model = this.data.budgetDetail;
        this.projectTypeId = this.data.projectTypeId;
        this._getCategories();
        this.initForm();
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    };
    ProjectBudgetDetailComponent.prototype.initForm = function () {
        var dateString = (this.model.dateString)
            ? (new Date(this.model.dateString)).toISOString() : null;
        this.projectBudgetForm = this.fb.group({
            id: [this.model.id, []],
            spent: [this.model.spent, [Validators.required]],
            categoryId: [this.model.categoryId, [Validators.required]],
            dateString: [dateString, [Validators.required]],
            projectBudgetId: [this.budget.id, []],
            notes: [null, []],
        });
    };
    Object.defineProperty(ProjectBudgetDetailComponent.prototype, "f", {
        get: function () { return this.projectBudgetForm.controls; },
        enumerable: false,
        configurable: true
    });
    ProjectBudgetDetailComponent.prototype.autocompleteOptionSelected = function ($event) {
        if ($event.option.id == '0') {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            var category = {
                name: newItem,
                description: '',
                key: '',
                projectTypeId: this.projectTypeId,
                moduleId: EModules.ProyectoBudgetDetail,
            };
            this._saveCategory(category);
        }
        else {
            this.f.categoryId.patchValue($event.option.id);
        }
    };
    ProjectBudgetDetailComponent.prototype.onNoClick = function (budget) {
        if (budget === void 0) { budget = undefined; }
        this.dialogRef.close(budget);
    };
    ProjectBudgetDetailComponent.prototype.confirmSave = function () {
        this.isWorking = true;
        this.model = this.projectBudgetForm.value;
        this._saveProjectBudget(this.model);
    };
    ProjectBudgetDetailComponent.prototype._saveProjectBudget = function (budget) {
        if (budget.id && budget.id > 0)
            this._updateProjectBudget(this.model);
        else
            this._createProjectBudget(this.model);
    };
    ProjectBudgetDetailComponent.prototype._filter = function (value) {
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
    ProjectBudgetDetailComponent.prototype._responseError = function (err) {
        this.isWorking = false;
        console.log(err);
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    };
    //#region APIS
    ProjectBudgetDetailComponent.prototype._getCategories = function () {
        var _this = this;
        this.isWorking = true;
        var params = { moduleId: ECategoriesModules.ProyectoPresupuestoDetalle, projectTypeId: this.projectTypeId };
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
    ProjectBudgetDetailComponent.prototype._createProjectBudget = function (budget) {
        var _this = this;
        this.isWorking = true;
        delete budget.id;
        this.apiService.save(EEndpoints.ProjectBudgetDetail, budget).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemSaved'));
                _this.onNoClick(_this.model);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.errorSavingItem'));
                _this.onNoClick(undefined);
            }
            _this.isWorking = false;
        }, this._responseError);
    };
    ProjectBudgetDetailComponent.prototype._updateProjectBudget = function (budget) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.ProjectBudgetDetail, budget).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemUpdated'));
                _this.onNoClick(_this.model);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.errorUpdatingItem'));
                _this.onNoClick(undefined);
            }
            _this.isWorking = false;
        }, this._responseError);
    };
    ProjectBudgetDetailComponent.prototype._saveCategory = function (model, saveBudget) {
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
    ProjectBudgetDetailComponent = __decorate([
        Component({
            selector: 'app-project-budget-detail',
            templateUrl: './project-budget-detail.component.html',
            styleUrls: ['./project-budget-detail.component.scss']
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            TranslateService,
            MatDialogRef,
            FuseTranslationLoaderService, Object, ApiService,
            ToasterService])
    ], ProjectBudgetDetailComponent);
    return ProjectBudgetDetailComponent;
}());
export { ProjectBudgetDetailComponent };
//# sourceMappingURL=project-budget-detail.component.js.map