import { Component, OnInit, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { MatDialogRef, MatCheckboxChange, MAT_DIALOG_DATA, MatSelectChange, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ETravelCategory } from '@enums/travel-category';
import { ETravelLogisticsType } from '@enums/travel-logistics-type';
import { ETravelOtherType } from '@enums/travel-other-type';
import { IProjectTravelLogistics, TravelLogisticBudget } from '@models/project-travel-logistics';
import { IProjectTravelLogisticsOther } from '@models/project-travel-logistics-other';
import { ProjectBudget } from '@models/project-budget';
import { ProjectBudgetDetail } from '@models/project-budget-detail';
import { Observable } from 'rxjs';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ICategory } from '@models/category';
import { EModules } from '@enums/modules';
import { ResponseApi } from '@models/response-api';
import { startWith, map } from 'rxjs/operators';
import { ECategoriesModules } from '@enums/categories-modules';

@Component({
  selector: 'app-add-travel-other',
  templateUrl: './add-travel-other.component.html',
  styleUrls: ['./add-travel-other.component.css']
})
export class AddTravelOtherComponent implements OnInit {

  //
  @Input() projectId: number;
  @Input() projectTypeId: number;
  @Input() projectOther: IProjectTravelLogisticsOther = <IProjectTravelLogisticsOther>{};

  @Output() formReady = new EventEmitter<FormGroup>();

  //VARIABLES
  id: number = 0;
  dataOtherForm: FormGroup;
  isWorking: boolean = false;
  isInternal: boolean = false;

  projectBudgetList: ProjectBudget[] = [];
  filteredOptions: Observable<ICategory[]>;
  filteredBudgets: Observable<ICategory[]>;
  categories: ICategory[] = [];
  budgetList: ICategory[] = [];
  question = '';
  categoryFC = new FormControl();
  budgetFC = new FormControl();
  budgetAuFC = new FormControl();

  //ENUMERABLES
  travelCategory: ETravelCategory = ETravelCategory.Food;
  travelLogisticsType: ETravelLogisticsType = ETravelLogisticsType.Other;
  otherType: ETravelOtherType;

  //MODELOS PARA LA INSERCION Y ACTUALIZACION
  modelProjectTravelLogistics: IProjectTravelLogistics = <IProjectTravelLogistics>{};
  modelProjectTravelLogisticsOther: IProjectTravelLogisticsOther = <IProjectTravelLogisticsOther>{};

  action: string = this.translate.instant('general.save');

  constructor(
    public dialogRef: MatDialogRef<AddTravelOtherComponent>,
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
  ) { }

  ngOnInit() {
    this.translationLoader.loadTranslations(...allLang);
    this.projectId = this.actionData.projectId;
    this.projectTypeId = this.actionData.projectTypeId;
    this.projectOther = this.actionData.projectOther;
    if (this.projectOther.id > 0) {
      this.action = this.translate.instant('general.save');
    }
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    this._getProjectBudget();
    this.configureOtherForm();
  }

  //#region FORM

  private configureOtherForm(): void {
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
  }

  get f() { return this.dataOtherForm.controls; }

  //#endregion

  //#region EVENTS

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
    if ($event.option.id == '0') {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];

      let category = <ICategory>{
        name: newItem,
        description: '',
        key: '',
        projectTypeId: this.projectTypeId,
        moduleId: EModules.ProyectoBudgetDetail,
      }
      this._saveCategory(category);
    } else {
      this.f.projectBudgetDetailId.patchValue($event.option.id);
    }
  }

  /**
   * evento autocompletado de los projectBudget
   * @param $event Objeto del evento autocmplete para los budget
   */
  budgetAutocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
    if ($event.option.id == '0') {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
      let category = <ICategory>{
        name: newItem,
        description: '',
        key: '',
        projectTypeId: this.projectTypeId,
        moduleId: EModules.ProjectBudget,
      }
      this._saveCategory(category, true);
    } else {
      //si el budget existe verifico si lo agrego o genero el registro para proyecto
      const found = this.projectBudgetList.find(f => f.categoryId == parseInt($event.option.id));
      if (found)
        this.budgetFC.patchValue(found.id);
      else
        this._setProjectBudget(parseInt($event.option.id));
    }
    this.categoryFC.enable({ onlySelf: true });
  }

  private _filter(filter: string, value: string): ICategory[] {
    const filterValue = value ? value.toLowerCase() : '';
    let results = [];
    results = filter == 'budget'
      ? this.budgetList.filter(option => option.name.toLowerCase().includes(filterValue))
      : this.categories.filter(option => option.name.toLowerCase().includes(filterValue));

    return (results.length == 0)
      ? [{
        id: 0,
        name: `${this.question}${value}"?`
      }]
      : results;
  }

  saveOther() {
    this.modelProjectTravelLogisticsOther = <IProjectTravelLogisticsOther>this.dataOtherForm.value;
    let objModelOther = Object.assign({}, this.modelProjectTravelLogisticsOther);

    this.modelProjectTravelLogistics = <IProjectTravelLogistics>{};
    this.modelProjectTravelLogistics.id = objModelOther.projectTravelLogisticsId;
    this.modelProjectTravelLogistics.projectId = this.projectId;
    this.modelProjectTravelLogistics.categoryId = this.modelProjectTravelLogisticsOther.otherTypeId;
    this.modelProjectTravelLogistics.travelLogisticsTypeId = this.modelProjectTravelLogisticsOther.otherTypeId;
    this.modelProjectTravelLogistics.isInternal = objModelOther.isInternal;
    this.modelProjectTravelLogistics.totalCost = this.modelProjectTravelLogisticsOther.totalCost;

    delete objModelOther["isInternal"];
    delete objModelOther["projectBudgetDetailId"];

    let budget = <ProjectBudgetDetail>{
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
    } else {
      //Create
      delete objModelOther["id"];
      delete this.modelProjectTravelLogistics["id"];
        if (budget && budget.projectBudgetId)
        this._createProjectBudget(this.modelProjectTravelLogistics, objModelOther, budget);
      else
        this._createProjectTravelLogisticsApi(this.modelProjectTravelLogistics, objModelOther);
    }
  }

  /**
   * prepara un objeto de tipo project budget para ser registrado como imte principal de presupuesto
   */
  private _setProjectBudget(categoryId: number) {
    const budget = <ProjectBudget>{};
    budget.projectId = this.projectId;
    budget.categoryId = categoryId;
    budget.budget = 0;
    budget.spent = 0;
    budget.notes = '';
    this._createOnlyProjectBudget(budget);
  }

  changeInternal(event: MatCheckboxChange) {
    this.isInternal = event.checked;
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

  //#endregion

  //#region API

  private _getProjectBudget(): void {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.ProjectBudgets, { projectId: this.projectId }).subscribe(
      (response: ResponseApi<ProjectBudget[]>) => {
        if (response.code == 100) {
          this.projectBudgetList = response.result;
          this._getCategories();
        }
        this._getBudget();
      }, err => this.responseError(err)
    )
  }

  private _getBudget(): void {
    this.isWorking = true;
    const params = { moduleId: ECategoriesModules.ProyectoPresupuesto, projectTypeId: this.projectTypeId };
    this.ApiService.get(EEndpoints.CategoriesByModule, params).subscribe(
      (response: ResponseApi<ICategory[]>) => {
        if (response.code == 100) {
          this.budgetList = response.result;
          this.filteredBudgets = this.budgetAuFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter('budget', value))
            );
          this._getCategories();
        } else
          this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  private _getCategories(): void {
    this.isWorking = true;
    const params = { moduleId: ECategoriesModules.ProyectoPresupuestoDetalle, projectTypeId: this.projectTypeId };
    this.ApiService.get(EEndpoints.CategoriesByModule, params).subscribe(
      (response: ResponseApi<ICategory[]>) => {
        if (response.code == 100) {
          this.categories = response.result;
          this.filteredOptions = this.categoryFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter('category', value))
            );
          this.categoryFC.disable({ onlySelf: true });
          if (this.actionData.projectBudgetDetailId) {
            this._getProjectBudgetDetail(this.actionData.projectBudgetDetailId);
          }
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  private _getProjectBudgetDetail(projectBudgetDetailId: number) {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.CategoryFather, { projectBudgetDetailId: projectBudgetDetailId })
      .subscribe((response: ResponseApi<TravelLogisticBudget>) => {
        if (response.code == 100) {
          const result = response.result;
          this.budgetFC.patchValue(result.fatherId);
          this.f.projectBudgetDetailId.patchValue(result.id);
          setTimeout(() => this.categoryFC.setValue(result.name));
          const found = this.projectBudgetList.find(f => f.id == result.fatherId);
          if (found) {
            setTimeout(() => this.budgetAuFC.patchValue(found.category.name));
          }
        }
        this.isWorking = false;
      }, err => this.responseError(err))
  }

  private _createOnlyProjectBudget(budget: ProjectBudget): void {
    delete budget.id;
    this.ApiService.save(EEndpoints.ProjectBudget, budget).subscribe(
      (response: ResponseApi<ProjectBudget>) => {
        if (response.code == 100) {
          this.projectBudgetList.push(response.result);
          this.budgetFC.patchValue(response.result.id);
        } else
          this.toasterService.showToaster(this.translate.instant('errors.errorSavingItem'));
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  private _saveCategory(model: ICategory, saveBudget: boolean = false) {
    this.isWorking = true;
    this.ApiService.save(EEndpoints.Category, model).subscribe(
      (response: ResponseApi<ICategory>) => {
        if (response.code == 100) {
          this.categories.push(response.result);
          if (saveBudget) {
            this._setProjectBudget(response.result.id);
            this.budgetAuFC.patchValue(response.result.name);
          } else {
            setTimeout(() => this.categoryFC.setValue(response.result.name));
            this.f.projectBudgetDetailId.patchValue(response.result.id);
          }
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  private _createProjectBudget(model: IProjectTravelLogistics, modelOther: IProjectTravelLogisticsOther, budget: ProjectBudgetDetail, isNew: boolean = true): void {
    this.isWorking = true;
    delete budget.id;
    this.ApiService.save(EEndpoints.ProjectBudgetDetail, budget).subscribe(
      (response: ResponseApi<ProjectBudgetDetail>) => {
        if (response.code == 100) {
          model.projectBudgetDetailId = response.result.id;
          if (isNew)
            this._createProjectTravelLogisticsApi(model, modelOther);
          else
            this._updateProjectTravelLogisticsApi(model, modelOther);
        } else {
          this.isWorking = false;
          this.toasterService.showToaster(this.translate.instant('errors.errorSavingItem'));
        }
      }, err => this.responseError(err)
    )
  }

  private _createProjectTravelLogisticsApi(model: IProjectTravelLogistics, modelOther: IProjectTravelLogisticsOther): void {
    //Registro Project Travel
    this.isWorking = true;
    this.ApiService.save(EEndpoints.ProjectTravelLogistics, model).subscribe(
      data => {
        if (data.code == 100) {
          var projectTravelLogisticsId = data.result;

          if (projectTravelLogisticsId > 0) {
            //Se quitan las columnas que no hacen falta para la insercion
            delete modelOther["id"];
            //Tomo el Id del Registro y Guardo el Vuelo
            modelOther.projectTravelLogisticsId = projectTravelLogisticsId;
            this._createProjectTravelLogisticsOther(modelOther);
          }

        } else {
          this.isWorking = false;
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
    );
  }

  private _createProjectTravelLogisticsOther(modelOther: IProjectTravelLogisticsOther): void {

    this.ApiService.save(EEndpoints.ProjectTravelLogisticsOther, modelOther).subscribe(
      data => {
        if (data.code == 100) {
          this.onNoClick(true);
          this.toasterService.showToaster(this.translate.instant('travelLogistics.other.messages.saved'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
    );
  }

  private _updateProjectTravelLogisticsApi(model: IProjectTravelLogistics, modelOther: IProjectTravelLogisticsOther): void {
    //Registro Project Travel
    this.ApiService.update(EEndpoints.ProjectTravelLogistics, model).subscribe(
      data => {
        if (data.code == 100) {
          //Tomo el Id del Registro y Guardo el Vuelo
          modelOther.projectTravelLogisticsId = model.id;
          this._updateProjectTravelLogisticsOther(modelOther);
        } else {
          this.toasterService.showToaster(data.message);
          this.isWorking = false;
        }
      }, (err) => this.responseError(err)
    );
  }

  private _updateProjectTravelLogisticsOther(modelOther: IProjectTravelLogisticsOther) {
    this.ApiService.update(EEndpoints.ProjectTravelLogisticsOther, modelOther).subscribe(
      data => {
        if (data.code == 100) {
          this.onNoClick(true);
          this.toasterService.showToaster(this.translate.instant('travelLogistics.other.messages.saved'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
    );
  }

  private _deleteBudgetDetailApi(model: IProjectTravelLogistics, modelOther: IProjectTravelLogisticsOther, budget: ProjectBudgetDetail) {
      this.isWorking = true;
      if (!this.actionData.projectBudgetDetailId) {
          this._createProjectBudget(model, modelOther, budget, false);
          return;
      }   
    this.ApiService.delete(EEndpoints.ProjectBudgetDetail, { id: this.actionData.projectBudgetDetailId }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100)
          this._createProjectBudget(model, modelOther, budget, false);
        else
          this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  //#endregion
}
