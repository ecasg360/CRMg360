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
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ETravelCategory } from '@enums/travel-category';
import { ETravelLogisticsType } from '@enums/travel-logistics-type';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EModules } from '@enums/modules';
import { startWith, map } from 'rxjs/operators';
import { ECategoriesModules } from '@enums/categories-modules';
var AddTravelOtherComponent = /** @class */ (function () {
    function AddTravelOtherComponent(dialogRef, formBuilder, ApiService, toasterService, translate, translationLoader, actionData) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.actionData = actionData;
        this.projectOther = {};
        this.formReady = new EventEmitter();
        //VARIABLES
        this.id = 0;
        this.isWorking = false;
        this.isInternal = false;
        this.projectBudgetList = [];
        this.categories = [];
        this.budgetList = [];
        this.question = '';
        this.categoryFC = new FormControl();
        this.budgetFC = new FormControl();
        this.budgetAuFC = new FormControl();
        //ENUMERABLES
        this.travelCategory = ETravelCategory.Food;
        this.travelLogisticsType = ETravelLogisticsType.Other;
        //MODELOS PARA LA INSERCION Y ACTUALIZACION
        this.modelProjectTravelLogistics = {};
        this.modelProjectTravelLogisticsOther = {};
        this.action = this.translate.instant('general.save');
    }
    AddTravelOtherComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        this.projectId = this.actionData.projectId;
        this.projectTypeId = this.actionData.projectTypeId;
        this.projectOther = this.actionData.projectOther;
        if (this.projectOther.id > 0) {
            this.action = this.translate.instant('general.save');
        }
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
        this._getProjectBudget();
        this.configureOtherForm();
    };
    //#region FORM
    AddTravelOtherComponent.prototype.configureOtherForm = function () {
        this.dataOtherForm = this.formBuilder.group({
            id: [this.projectOther.id, []],
            projectTravelLogisticsId: [this.projectOther.projectTravelLogisticsId, []],
            otherTypeId: [this.projectOther.otherTypeId, [
                    Validators.required
                ]],
            name: [this.projectOther.name, [
                    Validators.maxLength(50),
                    Validators.minLength(1),
                ]],
            totalCost: [this.projectOther.totalCost, [
                    Validators.required,
                    Validators.maxLength(14),
                ]],
            isInternal: [
                this.projectOther.isInternal
                    ? this.projectOther.isInternal.toString()
                    : this.projectOther.isInternal === 0
                        ? this.projectOther.isInternal.toString()
                        : this.projectOther.isInternal,
                []
            ],
            projectBudgetDetailId: ['', []],
        });
        this.formReady.emit(this.dataOtherForm);
    };
    Object.defineProperty(AddTravelOtherComponent.prototype, "f", {
        get: function () { return this.dataOtherForm.controls; },
        enumerable: false,
        configurable: true
    });
    //#endregion
    //#region EVENTS
    AddTravelOtherComponent.prototype.autocompleteOptionSelected = function ($event) {
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
            this.f.projectBudgetDetailId.patchValue($event.option.id);
        }
    };
    /**
     * evento autocompletado de los projectBudget
     * @param $event Objeto del evento autocmplete para los budget
     */
    AddTravelOtherComponent.prototype.budgetAutocompleteOptionSelected = function ($event) {
        if ($event.option.id == '0') {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            var category = {
                name: newItem,
                description: '',
                key: '',
                projectTypeId: this.projectTypeId,
                moduleId: EModules.ProjectBudget,
            };
            this._saveCategory(category, true);
        }
        else {
            //si el budget existe verifico si lo agrego o genero el registro para proyecto
            var found = this.projectBudgetList.find(function (f) { return f.categoryId == parseInt($event.option.id); });
            if (found)
                this.budgetFC.patchValue(found.id);
            else
                this._setProjectBudget(parseInt($event.option.id));
        }
        this.categoryFC.enable({ onlySelf: true });
    };
    AddTravelOtherComponent.prototype._filter = function (filter, value) {
        var filterValue = value ? value.toLowerCase() : '';
        var results = [];
        results = filter == 'budget'
            ? this.budgetList.filter(function (option) { return option.name.toLowerCase().includes(filterValue); })
            : this.categories.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
        return (results.length == 0)
            ? [{
                    id: 0,
                    name: "" + this.question + value + "\"?"
                }]
            : results;
    };
    AddTravelOtherComponent.prototype.saveOther = function () {
        this.modelProjectTravelLogisticsOther = this.dataOtherForm.value;
        var objModelOther = Object.assign({}, this.modelProjectTravelLogisticsOther);
        this.modelProjectTravelLogistics = {};
        this.modelProjectTravelLogistics.id = objModelOther.projectTravelLogisticsId;
        this.modelProjectTravelLogistics.projectId = this.projectId;
        this.modelProjectTravelLogistics.categoryId = this.modelProjectTravelLogisticsOther.otherTypeId;
        this.modelProjectTravelLogistics.travelLogisticsTypeId = this.modelProjectTravelLogisticsOther.otherTypeId;
        this.modelProjectTravelLogistics.isInternal = objModelOther.isInternal;
        this.modelProjectTravelLogistics.totalCost = this.modelProjectTravelLogisticsOther.totalCost;
        delete objModelOther["isInternal"];
        delete objModelOther["projectBudgetDetailId"];
        var budget = {
            projectBudgetId: this.budgetFC.value,
            categoryId: this.f.projectBudgetDetailId.value,
            spent: this.modelProjectTravelLogisticsOther.totalCost,
            dateString: (new Date()).toDateString()
        };
        //Update
        if (this.modelProjectTravelLogistics.id && objModelOther.id) {
            if (budget && budget.projectBudgetId)
                this._deleteBudgetDetailApi(this.modelProjectTravelLogistics, objModelOther, budget);
            else
                this._updateProjectTravelLogisticsApi(this.modelProjectTravelLogistics, objModelOther);
        }
        else {
            //Create
            delete objModelOther["id"];
            delete this.modelProjectTravelLogistics["id"];
            if (budget && budget.projectBudgetId)
                this._createProjectBudget(this.modelProjectTravelLogistics, objModelOther, budget);
            else
                this._createProjectTravelLogisticsApi(this.modelProjectTravelLogistics, objModelOther);
        }
    };
    /**
     * prepara un objeto de tipo project budget para ser registrado como imte principal de presupuesto
     */
    AddTravelOtherComponent.prototype._setProjectBudget = function (categoryId) {
        var budget = {};
        budget.projectId = this.projectId;
        budget.categoryId = categoryId;
        budget.budget = 0;
        budget.spent = 0;
        budget.notes = '';
        this._createOnlyProjectBudget(budget);
    };
    AddTravelOtherComponent.prototype.changeInternal = function (event) {
        this.isInternal = event.checked;
    };
    AddTravelOtherComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddTravelOtherComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    //#endregion
    //#region API
    AddTravelOtherComponent.prototype._getProjectBudget = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.ProjectBudgets, { projectId: this.projectId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectBudgetList = response.result;
                _this._getCategories();
            }
            _this._getBudget();
        }, function (err) { return _this.responseError(err); });
    };
    AddTravelOtherComponent.prototype._getBudget = function () {
        var _this = this;
        this.isWorking = true;
        var params = { moduleId: ECategoriesModules.ProyectoPresupuesto, projectTypeId: this.projectTypeId };
        this.ApiService.get(EEndpoints.CategoriesByModule, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.budgetList = response.result;
                _this.filteredBudgets = _this.budgetAuFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter('budget', value); }));
                _this._getCategories();
            }
            else
                _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTravelOtherComponent.prototype._getCategories = function () {
        var _this = this;
        this.isWorking = true;
        var params = { moduleId: ECategoriesModules.ProyectoPresupuestoDetalle, projectTypeId: this.projectTypeId };
        this.ApiService.get(EEndpoints.CategoriesByModule, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.categories = response.result;
                _this.filteredOptions = _this.categoryFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter('category', value); }));
                _this.categoryFC.disable({ onlySelf: true });
                if (_this.actionData.projectBudgetDetailId) {
                    _this._getProjectBudgetDetail(_this.actionData.projectBudgetDetailId);
                }
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTravelOtherComponent.prototype._getProjectBudgetDetail = function (projectBudgetDetailId) {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.CategoryFather, { projectBudgetDetailId: projectBudgetDetailId })
            .subscribe(function (response) {
            if (response.code == 100) {
                var result_1 = response.result;
                _this.budgetFC.patchValue(result_1.fatherId);
                _this.f.projectBudgetDetailId.patchValue(result_1.id);
                setTimeout(function () { return _this.categoryFC.setValue(result_1.name); });
                var found_1 = _this.projectBudgetList.find(function (f) { return f.id == result_1.fatherId; });
                if (found_1) {
                    setTimeout(function () { return _this.budgetAuFC.patchValue(found_1.category.name); });
                }
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTravelOtherComponent.prototype._createOnlyProjectBudget = function (budget) {
        var _this = this;
        delete budget.id;
        this.ApiService.save(EEndpoints.ProjectBudget, budget).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectBudgetList.push(response.result);
                _this.budgetFC.patchValue(response.result.id);
            }
            else
                _this.toasterService.showToaster(_this.translate.instant('errors.errorSavingItem'));
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTravelOtherComponent.prototype._saveCategory = function (model, saveBudget) {
        var _this = this;
        if (saveBudget === void 0) { saveBudget = false; }
        this.isWorking = true;
        this.ApiService.save(EEndpoints.Category, model).subscribe(function (response) {
            if (response.code == 100) {
                _this.categories.push(response.result);
                if (saveBudget) {
                    _this._setProjectBudget(response.result.id);
                    _this.budgetAuFC.patchValue(response.result.name);
                }
                else {
                    setTimeout(function () { return _this.categoryFC.setValue(response.result.name); });
                    _this.f.projectBudgetDetailId.patchValue(response.result.id);
                }
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTravelOtherComponent.prototype._createProjectBudget = function (model, modelOther, budget, isNew) {
        var _this = this;
        if (isNew === void 0) { isNew = true; }
        this.isWorking = true;
        delete budget.id;
        this.ApiService.save(EEndpoints.ProjectBudgetDetail, budget).subscribe(function (response) {
            if (response.code == 100) {
                model.projectBudgetDetailId = response.result.id;
                if (isNew)
                    _this._createProjectTravelLogisticsApi(model, modelOther);
                else
                    _this._updateProjectTravelLogisticsApi(model, modelOther);
            }
            else {
                _this.isWorking = false;
                _this.toasterService.showToaster(_this.translate.instant('errors.errorSavingItem'));
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddTravelOtherComponent.prototype._createProjectTravelLogisticsApi = function (model, modelOther) {
        var _this = this;
        //Registro Project Travel
        this.isWorking = true;
        this.ApiService.save(EEndpoints.ProjectTravelLogistics, model).subscribe(function (data) {
            if (data.code == 100) {
                var projectTravelLogisticsId = data.result;
                if (projectTravelLogisticsId > 0) {
                    //Se quitan las columnas que no hacen falta para la insercion
                    delete modelOther["id"];
                    //Tomo el Id del Registro y Guardo el Vuelo
                    modelOther.projectTravelLogisticsId = projectTravelLogisticsId;
                    _this._createProjectTravelLogisticsOther(modelOther);
                }
            }
            else {
                _this.isWorking = false;
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTravelOtherComponent.prototype._createProjectTravelLogisticsOther = function (modelOther) {
        var _this = this;
        this.ApiService.save(EEndpoints.ProjectTravelLogisticsOther, modelOther).subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('travelLogistics.other.messages.saved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTravelOtherComponent.prototype._updateProjectTravelLogisticsApi = function (model, modelOther) {
        var _this = this;
        //Registro Project Travel
        this.ApiService.update(EEndpoints.ProjectTravelLogistics, model).subscribe(function (data) {
            if (data.code == 100) {
                //Tomo el Id del Registro y Guardo el Vuelo
                modelOther.projectTravelLogisticsId = model.id;
                _this._updateProjectTravelLogisticsOther(modelOther);
            }
            else {
                _this.toasterService.showToaster(data.message);
                _this.isWorking = false;
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddTravelOtherComponent.prototype._updateProjectTravelLogisticsOther = function (modelOther) {
        var _this = this;
        this.ApiService.update(EEndpoints.ProjectTravelLogisticsOther, modelOther).subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('travelLogistics.other.messages.saved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddTravelOtherComponent.prototype._deleteBudgetDetailApi = function (model, modelOther, budget) {
        var _this = this;
        this.isWorking = true;
        if (!this.actionData.projectBudgetDetailId) {
            this._createProjectBudget(model, modelOther, budget, false);
            return;
        }
        this.ApiService.delete(EEndpoints.ProjectBudgetDetail, { id: this.actionData.projectBudgetDetailId }).subscribe(function (response) {
            if (response.code == 100)
                _this._createProjectBudget(model, modelOther, budget, false);
            else
                _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AddTravelOtherComponent.prototype, "projectId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AddTravelOtherComponent.prototype, "projectTypeId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AddTravelOtherComponent.prototype, "projectOther", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AddTravelOtherComponent.prototype, "formReady", void 0);
    AddTravelOtherComponent = __decorate([
        Component({
            selector: 'app-add-travel-other',
            templateUrl: './add-travel-other.component.html',
            styleUrls: ['./add-travel-other.component.css']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService,
            TranslateService,
            FuseTranslationLoaderService, Object])
    ], AddTravelOtherComponent);
    return AddTravelOtherComponent;
}());
export { AddTravelOtherComponent };
//# sourceMappingURL=add-travel-other.component.js.map