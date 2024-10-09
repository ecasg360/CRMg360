import { ICategory } from '@models/category';
import { Component, OnInit, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { MatDatepickerInputEvent, MatDialogRef, MatCheckboxChange, MAT_DIALOG_DATA, MatSelectChange, MatAutocompleteSelectedEvent } from '@angular/material';
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
import { IProjectTravelLogisticsFlight } from '@models/project-travel-logistics-flight';
import { Observable } from 'rxjs';
import { ProjectBudgetDetail } from '@models/project-budget-detail';
import { startWith, map } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EModules } from '@enums/modules';
import { ECategoriesModules } from '@enums/categories-modules';
import { ProjectBudget } from '@models/project-budget';

@Component({
  selector: 'app-add-travel-flight',
  templateUrl: './add-travel-flight.component.html',
  styleUrls: ['./add-travel-flight.component.css']
})
export class AddTravelFlightComponent implements OnInit {

  //#region inputs outputs
  @Input() projectId: number;
  @Input() projectTypeId: number;
  @Input() projectFlight: IProjectTravelLogisticsFlight = <IProjectTravelLogisticsFlight>{};
  @Output() formReady = new EventEmitter<FormGroup>();
  //#endregion

  //#region VARIABLES
  id: number = 0;
  dataFlightForm: FormGroup;
  departureDate: Date;
  arrivalDate: Date;
  isWorking: boolean = false;
  isInternal: number = 0;

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
  travelCategory: ETravelCategory = ETravelCategory.Flight;
  travelLogisticsType: ETravelLogisticsType = ETravelLogisticsType.Flight;

  //MODELOS PARA LA INSERCION Y ACTUALIZACION
  modelProjectTravelLogistics: IProjectTravelLogistics = <IProjectTravelLogistics>{};
  modelProjectTravelLogisticsFlight: IProjectTravelLogisticsFlight = <IProjectTravelLogisticsFlight>{};

  airlines: SelectOption[] = [];
  action: string = this.translate.instant('general.save');

  //#endregion

  //#region lifecycle component

  constructor(
    public dialogRef: MatDialogRef<AddTravelFlightComponent>,
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
  ) {
    this.translationLoader.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.isInternal = 0;
    this.getAirlines();
    this.projectId = this.actionData.projectId;
    this.projectTypeId = this.actionData.projectTypeId;
    this.projectFlight = this.actionData.projectFlight;
    if (this.projectFlight.id > 0) {
      this.action = this.translate.instant('general.save');
    }
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');

    this.configureFlightForm();
    this._getProjectBudget();
    // Lo pasamos para _getProjectBudget debido a que necesitamos los project budget cargados previamente
    //this._getBudget();
  }

  //#endregion

  //#region form
  get flightForm() { return this.dataFlightForm.controls; }

  private configureFlightForm(): void {

    this.departureDate = new Date(this.projectFlight.departureDate);
    this.arrivalDate = new Date(this.projectFlight.arrivalDate);

    console.log('configureFlightForm this.projectFlight: ', this.projectFlight);
    this.dataFlightForm = this.formBuilder.group({
      id: [this.projectFlight.id, []],
      projectTravelLogisticsId: [this.projectFlight.projectTravelLogisticsId, []],
      airLineId: [this.projectFlight.airLineId, [
        Validators.required
      ]],
      passengerName: [this.projectFlight.passengerName, [
        Validators.maxLength(100),
        Validators.minLength(3),
      ]],
      flightNumber: [this.projectFlight.flightNumber, [
        Validators.maxLength(15),
        Validators.minLength(1),
      ]],
      passengerSeat: [this.projectFlight.passengerSeat, [
        Validators.maxLength(10),
        Validators.minLength(1),
      ]],
      departureDate: [this.projectFlight.departureDate, []],
      departureCity: [this.projectFlight.departureCity, [
        Validators.maxLength(50),
        Validators.minLength(2),
      ]],
      arrivalDate: [this.projectFlight.arrivalDate, []],
      arrivalCity: [this.projectFlight.arrivalCity, [
        Validators.maxLength(50),
        Validators.minLength(2),
      ]],
      totalCost: [this.projectFlight.totalCost, [
        Validators.required,
        Validators.maxLength(14),
      ]],
      isInternal: [
        this.projectFlight.isInternal
          ? this.projectFlight.isInternal.toString()
          : this.projectFlight.isInternal === 0
            ? this.projectFlight.isInternal.toString()
            : this.projectFlight.isInternal,
        []
      ],
      projectBudgetDetailId: ['', []],
    });
    console.log('the this.dataFlightForm: ', this.dataFlightForm);
    this.formReady.emit(this.dataFlightForm);
  }

  //#endregion

  //#region Events

  dateChangeEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (type == 'init') {
      if (event.value) {
        this.departureDate = new Date(event.value);
        this.flightForm['departureDate'].enable();
      } else {
        this.flightForm['arrivalDate'].disable();
      }
    } else {
      if (event.value) {
        this.arrivalDate = new Date(event.value);
      }
    }
  }

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
      this.flightForm.projectBudgetDetailId.patchValue($event.option.id);
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

  saveFlight() {
    this.modelProjectTravelLogisticsFlight = <IProjectTravelLogisticsFlight>this.dataFlightForm.value;
      let objModelFlight = Object.assign({}, this.modelProjectTravelLogisticsFlight);

      this.modelProjectTravelLogistics = <IProjectTravelLogistics>{};
      this.modelProjectTravelLogistics.flightNumber = this.modelProjectTravelLogisticsFlight.flightNumber;
    this.modelProjectTravelLogistics.id = objModelFlight.projectTravelLogisticsId;
    this.modelProjectTravelLogistics.projectId = this.projectId;
    this.modelProjectTravelLogistics.categoryId = ETravelCategory.Flight;
    this.modelProjectTravelLogistics.travelLogisticsTypeId = ETravelLogisticsType.Flight;
    this.modelProjectTravelLogistics.isInternal = objModelFlight.isInternal;
    this.modelProjectTravelLogistics.totalCost = this.modelProjectTravelLogisticsFlight.totalCost;

    delete objModelFlight['isInternal'];
    delete objModelFlight['projectBudgetDetailId'];

    let budget = <ProjectBudgetDetail>{
      projectBudgetId: this.budgetFC.value,
      categoryId: this.flightForm.projectBudgetDetailId.value,
      spent: this.flightForm.totalCost.value,
      dateString: (new Date()).toDateString()
    };

    //Update
    if (this.modelProjectTravelLogistics.id && objModelFlight.id) {
      /*aqui el flujo es el siguiente:
      Elimino el budget detail (para evitar llenar mas los componentes de comprobaciones)
      creo uno nuevo basados en los posibles cambios, pero con un boolenano que me indicai si actualizo o agrego
      llamo a los componentes para
      */
        if (budget && budget.projectBudgetId)
        this._deleteBudgetDetailApi(this.modelProjectTravelLogistics, objModelFlight, budget);
      else
        this._updateProjectTravelLogisticsApi(this.modelProjectTravelLogistics, objModelFlight);
    }
    else {
      //Create
      delete objModelFlight["id"];
      delete this.modelProjectTravelLogistics["id"];
        if (budget && budget.projectBudgetId)
        this._createProjectBudget(this.modelProjectTravelLogistics, objModelFlight, budget);
      else
        this._createProjectTravelLogisticsApi(this.modelProjectTravelLogistics, objModelFlight);
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
    //this.isInternal = event.checked;
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

  getAirlines() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.Airlines).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.airlines = response.result.map(m => {
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
          this.flightForm.projectBudgetDetailId.patchValue(result.id);
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
            this.flightForm.projectBudgetDetailId.patchValue(response.result.id);
          }
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  private _createProjectBudget(model: IProjectTravelLogistics, modelFlight: IProjectTravelLogisticsFlight, budget: ProjectBudgetDetail, isNew: boolean = true): void {
    this.isWorking = true;
    delete budget.id;
    this.ApiService.save(EEndpoints.ProjectBudgetDetail, budget).subscribe(
      (response: ResponseApi<ProjectBudgetDetail>) => {
        if (response.code == 100) {
          model.projectBudgetDetailId = response.result.id;
          if (isNew)
            this._createProjectTravelLogisticsApi(model, modelFlight);
          else
            this._updateProjectTravelLogisticsApi(model, modelFlight);
        } else {
          this.isWorking = false;
          this.toasterService.showToaster(this.translate.instant('errors.errorSavingItem'));
        }
      }, err => this.responseError(err)
    )
  }

  private _createProjectTravelLogisticsApi(model: IProjectTravelLogistics, modelFlight: IProjectTravelLogisticsFlight): void {
    //Registro Project Travel
    this.ApiService.save(EEndpoints.ProjectTravelLogistics, model)
      .subscribe(
        data => {
          if (data.code == 100) {
            var projectTravelLogisticsId = data.result;
            if (projectTravelLogisticsId > 0) {
              //Tomo el Id del Registro y Guardo el Vuelo
              delete modelFlight["id"];
              modelFlight.projectTravelLogisticsId = projectTravelLogisticsId;
              this._createProjectTravelLogisticsFlight(modelFlight);
            }
          } else {
            this.toasterService.showToaster(data.message);
            this.isWorking = false;
          }
        }, (err) => this.responseError(err)
      );
  }

  private _createProjectTravelLogisticsFlight(modelFlight: IProjectTravelLogisticsFlight): void {
    this.isWorking = true;
    this.ApiService.save(EEndpoints.ProjectTravelLogisticsFlight, modelFlight).subscribe(
      data => {
        if (data.code == 100) {
          this.toasterService.showToaster(this.translate.instant('travelLogistics.flight.messages.saved'));
          this.onNoClick(true);
        } else
          this.toasterService.showToaster(data.message);
        this.isWorking = false;
      }, (err) => this.responseError(err)
    );
  }

  private _updateProjectTravelLogisticsApi(model: IProjectTravelLogistics, modelFlight: IProjectTravelLogisticsFlight): void {
    //Registro Project Travel
    this.ApiService.update(EEndpoints.ProjectTravelLogistics, model).subscribe(
      data => {
        if (data.code == 100) {
          //Tomo el Id del Registro y Guardo el Vuelo
          modelFlight.projectTravelLogisticsId = model.id;
          this._updateProjectTravelLogisticsFlight(modelFlight);
        } else {
          this.toasterService.showToaster(data.message);
          this.isWorking = false;
        }
      }, (err) => this.responseError(err)
    );
  }

  private _updateProjectTravelLogisticsFlight(modelFlight: IProjectTravelLogisticsFlight) {
    this.ApiService.update(EEndpoints.ProjectTravelLogisticsFlight, modelFlight)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick(true);
            this.toasterService.showToaster(this.translate.instant('travelLogistics.flight.messages.saved'));
          } else {
            this.toasterService.showToaster(data.message);
            this.isWorking = false;
          }
        }, (err) => this.responseError(err)
      );
  }

  private _deleteBudgetDetailApi(model: IProjectTravelLogistics, modelFlight: IProjectTravelLogisticsFlight, budget: ProjectBudgetDetail) {
      this.isWorking = true;
      if (!this.actionData.projectBudgetDetailId) {
          this._createProjectBudget(model, modelFlight, budget, false);
          return;
      }          

    this.ApiService.delete(EEndpoints.ProjectBudgetDetail, { id: this.actionData.projectBudgetDetailId }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100)
          this._createProjectBudget(model, modelFlight, budget, false);
        else
          this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  //#endregion
}
