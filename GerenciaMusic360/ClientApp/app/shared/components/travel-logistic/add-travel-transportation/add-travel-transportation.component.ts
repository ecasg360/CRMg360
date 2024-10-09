import { Component, OnInit, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { MatDialogRef, MatCheckboxChange, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from '@models/select-option.models';
import { ResponseApi } from '@models/response-api';
import { ETravelCategory } from '@enums/travel-category';
import { ETravelLogisticsType } from '@enums/travel-logistics-type';
import { IProjectTravelLogistics, TravelLogisticBudget } from '@models/project-travel-logistics';
import { IProjectTravelLogisticsTransportation } from '@models/project-travel-logistics-transportation';
import { ProjectBudget } from '@models/project-budget';
import { ProjectBudgetDetail } from '@models/project-budget-detail';
import { Observable } from 'rxjs';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ICategory } from '@models/category';
import { EModules } from '@enums/modules';
import { startWith, map } from 'rxjs/operators';
import { ECategoriesModules } from '@enums/categories-modules';

@Component({
  selector: 'app-add-travel-transportation',
  templateUrl: './add-travel-transportation.component.html',
  styleUrls: ['./add-travel-transportation.component.css']
})
export class AddTravelTransportationComponent implements OnInit {

  //
  @Input() projectId: number;
  @Input() projectTypeId: number;
  @Input() projectTransportation: IProjectTravelLogisticsTransportation = <IProjectTravelLogisticsTransportation>{};

  @Output() formReady = new EventEmitter<FormGroup>();

  //VARIABLES
  id: number = 0;
  dataTransportationForm: FormGroup;
  isWorking: boolean = false;
  isInternal: boolean = false;
  ownVehicle: boolean = false;

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
  travelCategory: ETravelCategory = ETravelCategory.Transportation;
  travelLogisticsType: ETravelLogisticsType = ETravelLogisticsType.Transportation;

  //MODELOS PARA LA INSERCION Y ACTUALIZACION
  modelProjectTravelLogistics: IProjectTravelLogistics = <IProjectTravelLogistics>{};
  modelProjectTravelLogisticsTransportation: IProjectTravelLogisticsTransportation = <IProjectTravelLogisticsTransportation>{};

  autoBrands: SelectOption[] = [];
  action: string = this.translate.instant('general.save');

  constructor(
    public dialogRef: MatDialogRef<AddTravelTransportationComponent>,
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
  ) { }


  ngOnInit() {
    this.translationLoader.loadTranslations(...allLang);
    this.getAutoBrands();
    this.projectId = this.actionData.projectId;
    this.projectTypeId = this.actionData.projectTypeId;
    this.projectTransportation = this.actionData.projectTransportation;
    if(this.projectTransportation.id > 0){
      this.action = this.translate.instant('general.save');
    }
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');

    this.configureTransportationForm();
    this._getProjectBudget();
  }

  //#region FORM

  private configureTransportationForm(): void {
    this.dataTransportationForm = this.formBuilder.group({
        id: [this.projectTransportation.id, []],
        projectTravelLogisticsId: [this.projectTransportation.projectTravelLogisticsId, []],
        ownVehicle: [this.projectTransportation.ownVehicle? true : false, []],
        autoBrandId: [this.projectTransportation.autoBrandId, [Validators.required]],
        vehicleName: [this.projectTransportation.vehicleName, [
          Validators.maxLength(50),
          Validators.minLength(1),
        ]],
        agency: [this.projectTransportation.agency, [
          Validators.maxLength(50),
          Validators.minLength(1),
        ]],
        totalCost: [this.projectTransportation.totalCost, [
            Validators.required,
            Validators.maxLength(14),
        ]],
        isInternal: [
          this.projectTransportation.isInternal
            ? this.projectTransportation.isInternal.toString()
            : this.projectTransportation.isInternal === 0
              ? this.projectTransportation.isInternal.toString()
              : this.projectTransportation.isInternal,
          []
        ],
        projectBudgetDetailId: ['', []],
    });

    this.formReady.emit(this.dataTransportationForm);
  }

  get f() { return this.dataTransportationForm.controls; }

  //#endregion

  //#region EVENTS

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
    if ($event.option.id == '0') {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];

      let category = <ICategory> {
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

  //#endregion

  //#region Events

  saveTransportation() {
    this.modelProjectTravelLogisticsTransportation = <IProjectTravelLogisticsTransportation>this.dataTransportationForm.value;
    let objModelTransportation = Object.assign({}, this.modelProjectTravelLogisticsTransportation);

    this.modelProjectTravelLogistics = <IProjectTravelLogistics>{};
    this.modelProjectTravelLogistics.id = objModelTransportation.projectTravelLogisticsId;
    this.modelProjectTravelLogistics.projectId = this.projectId;
    this.modelProjectTravelLogistics.categoryId = ETravelCategory.Transportation;
    this.modelProjectTravelLogistics.travelLogisticsTypeId = ETravelLogisticsType.Transportation;
    this.modelProjectTravelLogistics.isInternal = objModelTransportation.isInternal;
    this.modelProjectTravelLogistics.totalCost = this.modelProjectTravelLogisticsTransportation.totalCost;

    delete objModelTransportation["isInternal"];
    delete objModelTransportation["projectBudgetDetailId"];

    let budget = <ProjectBudgetDetail> {
      projectBudgetId: this.budgetFC.value,
      categoryId: this.f.projectBudgetDetailId.value,
      spent: this.modelProjectTravelLogisticsTransportation.totalCost,
      dateString: (new Date()).toDateString()
    };

    //Update
    if (this.modelProjectTravelLogistics.id && objModelTransportation.id) {
        if (budget && budget.projectBudgetId)
        this._deleteBudgetDetailApi(this.modelProjectTravelLogistics, objModelTransportation, budget);
      else
        this._updateProjectTravelLogisticsApi(this.modelProjectTravelLogistics, objModelTransportation);

    }else{
    //Create
      delete objModelTransportation["id"];
      delete this.modelProjectTravelLogistics["id"];
        if (budget && budget.projectBudgetId)
        this._createProjectBudget(this.modelProjectTravelLogistics, objModelTransportation, budget);
      else
        this._createProjectTravelLogisticsApi(this.modelProjectTravelLogistics, objModelTransportation);
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

  changeOwnVehicle(event: MatCheckboxChange) {
    this.ownVehicle = event.checked;
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

  //#region API

  getAutoBrands() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.AutoBrands).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.autoBrands = response.result.map(m => {
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

  private _getProjectBudget(): void {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.ProjectBudgets, { projectId: this.projectId }).subscribe(
      (response: ResponseApi<ProjectBudget[]>) => {
        if (response.code == 100) {
          this.projectBudgetList = response.result;
          this._getCategories();
        }
        this._getBudget()

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
    this.ApiService.get(EEndpoints.CategoryFather, {projectBudgetDetailId : projectBudgetDetailId})
    .subscribe((response: ResponseApi<TravelLogisticBudget>) => {
      if(response.code == 100) {
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
    this.ApiService.save(EEndpoints.Category,model).subscribe(
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

  private _createProjectBudget(model: IProjectTravelLogistics, modelTransportation: IProjectTravelLogisticsTransportation, budget: ProjectBudgetDetail, isNew:boolean = true): void {
    this.isWorking = true;
    delete budget.id;
    this.ApiService.save(EEndpoints.ProjectBudgetDetail, budget).subscribe(
      (response: ResponseApi<ProjectBudgetDetail>) => {
        if (response.code == 100) {
          model.projectBudgetDetailId = response.result.id;
          if (isNew)
            this._createProjectTravelLogisticsApi(model, modelTransportation);
          else
            this._updateProjectTravelLogisticsApi(model, modelTransportation);
        } else {
          this.isWorking = false;
          this.toasterService.showToaster(this.translate.instant('errors.errorSavingItem'));
        }
      }, err => this.responseError(err)
    )
  }


  private _createProjectTravelLogisticsApi(model: IProjectTravelLogistics, modelTransportation: IProjectTravelLogisticsTransportation): void {
    //Registro Project Travel
    this.isWorking = true;
    this.ApiService.save(EEndpoints.ProjectTravelLogistics, model).subscribe(
        data => {
          if (data.code == 100) {
            var projectTravelLogisticsId = data.result;

            if(projectTravelLogisticsId > 0){
              //Se quitan las columnas que no hacen falta para la insercion
              delete modelTransportation["id"];
              //Tomo el Id del Registro y Guardo el Vuelo
              modelTransportation.projectTravelLogisticsId = projectTravelLogisticsId;
              this._createProjectTravelLogisticsTransportation(modelTransportation);
            }
          } else {
            this.toasterService.showToaster(data.message);
            this.isWorking = false;
          }
        }, (err) => this.responseError(err)
      );
  }

  private _createProjectTravelLogisticsTransportation(modelTransportation: IProjectTravelLogisticsTransportation) {
    this.isWorking = true;
    this.ApiService.save(EEndpoints.ProjectTravelLogisticsTransportation, modelTransportation).subscribe(
      data => {
        if (data.code == 100) {
          this.onNoClick(true);
          this.toasterService.showToaster(this.translate.instant('travelLogistics.transportation.messages.saved'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
    );
  }

  private _updateProjectTravelLogisticsApi(model: IProjectTravelLogistics, modelTransportation: IProjectTravelLogisticsTransportation): void {
    //Registro Project Travel
    this.isWorking = true;
    this.ApiService.update(EEndpoints.ProjectTravelLogistics, model).subscribe(
        data => {
          if (data.code == 100) {
            //Tomo el Id del Registro y Guardo el Vuelo
            modelTransportation.projectTravelLogisticsId = model.id;
            this._updateProjectTravelLogisticsTransportation(modelTransportation);
          } else {
            this.toasterService.showToaster(data.message);
            this.isWorking = false;
          }
        }, (err) => this.responseError(err)
      );
  }

  private _updateProjectTravelLogisticsTransportation(modelTransportation: IProjectTravelLogisticsTransportation):void {
    this.isWorking = true;
    this.ApiService.update(EEndpoints.ProjectTravelLogisticsTransportation, modelTransportation).subscribe(
      data => {
        if (data.code == 100) {
          this.onNoClick(true);
          this.toasterService.showToaster(this.translate.instant('travelLogistics.transportation.messages.saved'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
    );
  }

  private _deleteBudgetDetailApi(model: IProjectTravelLogistics, modelTransportation: IProjectTravelLogisticsTransportation, budget: ProjectBudgetDetail) {
      this.isWorking = true;
      if (!this.actionData.projectBudgetDetailId) {
          this._createProjectBudget(model, modelTransportation, budget, false);
          return;
      }
    this.ApiService.delete(EEndpoints.ProjectBudgetDetail, { id: this.actionData.projectBudgetDetailId }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100)
          this._createProjectBudget(model, modelTransportation, budget, false);
        else
          this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  //#endregion
}
