import { Component, OnInit, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { MatDialogRef, MatCheckboxChange, MAT_DIALOG_DATA, MatSelectChange, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponseApi } from '@models/response-api';
import { ETravelCategory } from '@enums/travel-category';
import { ETravelLogisticsType } from '@enums/travel-logistics-type';
import { IProjectTravelLogistics, TravelLogisticBudget } from '@models/project-travel-logistics';
import { IProjectTravelLogisticsHotel } from '@models/project-travel-logistics-hotel';
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
  selector: 'app-add-travel-hotel',
  templateUrl: './add-travel-hotel.component.html',
  styleUrls: ['./add-travel-hotel.component.css']
})
export class AddTravelHotelComponent implements OnInit {

  //
  @Input() projectId: number;
  @Input() projectTypeId: number;
  @Input() projectHotel: IProjectTravelLogisticsHotel = <IProjectTravelLogisticsHotel>{};

  @Output() formReady = new EventEmitter<FormGroup>();

  //VARIABLES
  id: number = 0;
  dataHotelForm: FormGroup;
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
  travelCategory: ETravelCategory = ETravelCategory.Hotel;
  travelLogisticsType: ETravelLogisticsType = ETravelLogisticsType.Hotel;

  //MODELOS PARA LA INSERCION Y ACTUALIZACION
  modelProjectTravelLogistics: IProjectTravelLogistics = <IProjectTravelLogistics>{};
  modelProjectTravelLogisticsHotel: IProjectTravelLogisticsHotel = <IProjectTravelLogisticsHotel>{};

  action: string = this.translate.instant('general.save');

  constructor(
    public dialogRef: MatDialogRef<AddTravelHotelComponent>,
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

    this.isInternal = false;
    this.projectId = this.actionData.projectId;
    this.projectHotel = this.actionData.projectHotel;
    this.projectTypeId = this.actionData.projectTypeId;
    if(this.projectHotel.id > 0){
      this.action = this.translate.instant('general.save');
    }

    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    this.configureHotelForm();
    this._getProjectBudget();
  }

  //#region form

  private configureHotelForm(): void {

    this.dataHotelForm = this.formBuilder.group({
        id: [this.projectHotel.id, []],
        projectTravelLogisticsId: [this.projectHotel.projectTravelLogisticsId, []],
        name: [this.projectHotel.name, [
            Validators.required
        ]],
        roomNumber: [this.projectHotel.roomNumber, [
            Validators.maxLength(100),
            Validators.minLength(3),
        ]],
        reservationName: [this.projectHotel.reservationName, [
          Validators.maxLength(15),
          Validators.minLength(1),
        ]],
        totalCost: [this.projectHotel.totalCost, [
            Validators.required,
            Validators.maxLength(14),
        ]],
        isInternal: [
          this.projectHotel.isInternal
            ? this.projectHotel.isInternal.toString()
            : this.projectHotel.isInternal === 0
              ? this.projectHotel.isInternal.toString()
              : this.projectHotel.isInternal,
          []
        ],
        projectBudgetDetailId: ['', []],
    });

    this.formReady.emit(this.dataHotelForm);
  }

  get f() { return this.dataHotelForm.controls; }

  //#endregion

  //#region events

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

  saveHotel() {
    this.modelProjectTravelLogisticsHotel = <IProjectTravelLogisticsHotel>this.dataHotelForm.value;
    let objModelHotel = Object.assign({}, this.modelProjectTravelLogisticsHotel);

    this.modelProjectTravelLogistics = <IProjectTravelLogistics>{};
    this.modelProjectTravelLogistics.id = objModelHotel.projectTravelLogisticsId;
    this.modelProjectTravelLogistics.projectId = this.projectId;
    this.modelProjectTravelLogistics.categoryId = ETravelCategory.Hotel;
    this.modelProjectTravelLogistics.travelLogisticsTypeId = ETravelLogisticsType.Hotel;
    this.modelProjectTravelLogistics.isInternal = objModelHotel.isInternal;
    this.modelProjectTravelLogistics.totalCost = this.modelProjectTravelLogisticsHotel.totalCost;

    delete objModelHotel["isInternal"];
    delete objModelHotel['projectBudgetDetailId'];

    let budget = <ProjectBudgetDetail> {
      projectBudgetId: this.budgetFC.value,
      categoryId: this.f.projectBudgetDetailId.value,
      spent: this.modelProjectTravelLogisticsHotel.totalCost,
      dateString: (new Date()).toDateString()
    };

    //Update
    if (this.modelProjectTravelLogistics.id && objModelHotel.id){
        if (budget && budget.projectBudgetId)
        this._deleteBudgetDetailApi(this.modelProjectTravelLogistics, objModelHotel, budget);
      else
        this._updateProjectTravelLogisticsApi(this.modelProjectTravelLogistics, objModelHotel);
    }else{
    //Create
      delete objModelHotel["id"];
      delete this.modelProjectTravelLogistics["id"];
        if (budget && budget.projectBudgetId)
        this._createProjectBudget(this.modelProjectTravelLogistics, objModelHotel, budget);
      else
        this._createProjectTravelLogisticsApi(this.modelProjectTravelLogistics, objModelHotel);
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

  //#endregion

  //#region api

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

  private _createProjectBudget(model: IProjectTravelLogistics, modelHotel: IProjectTravelLogisticsHotel, budget: ProjectBudgetDetail, isNew:boolean = true): void {
    this.isWorking = true;
    delete budget.id;
    this.ApiService.save(EEndpoints.ProjectBudgetDetail, budget).subscribe(
      (response: ResponseApi<ProjectBudgetDetail>) => {
        if (response.code == 100) {
          model.projectBudgetDetailId = response.result.id;
          if (isNew)
            this._createProjectTravelLogisticsApi(model, modelHotel);
          else
            this._updateProjectTravelLogisticsApi(model, modelHotel);
        } else {
          this.toasterService.showToaster(this.translate.instant('errors.errorSavingItem'));
          this.isWorking = false;
        }
      }, err => this.responseError(err)
    )
  }

  private _createProjectTravelLogisticsApi(model: IProjectTravelLogistics, modelHotel: IProjectTravelLogisticsHotel): void {
    //Registro Project Travel
    this.ApiService.save(EEndpoints.ProjectTravelLogistics, model).subscribe(
        data => {
          if (data.code == 100) {
            var projectTravelLogisticsId = data.result;
            if(projectTravelLogisticsId > 0){
              //Se quitan las columnas que no hacen falta para la insercion
              delete modelHotel["id"];
              //Tomo el Id del Registro y Guardo el Vuelo
              modelHotel.projectTravelLogisticsId = projectTravelLogisticsId;
              this._createProjectTravelLogisticsHotel(modelHotel);
            }
          } else {
            this.toasterService.showToaster(data.message);
            this.isWorking = false;
          }
        }, (err) => this.responseError(err)
      );
  }

  private _createProjectTravelLogisticsHotel(modelHotel: IProjectTravelLogisticsHotel) {
    this.ApiService.save(EEndpoints.ProjectTravelLogisticsHotel, modelHotel).subscribe(
      data => {
        if (data.code == 100) {
          this.onNoClick(true);
          this.toasterService.showToaster(this.translate.instant('travelLogistics.hotel.messages.saved'));
        } else
          this.toasterService.showToaster(data.message);
        this.isWorking = false;
      }, (err) => this.responseError(err)
    );
  }

  private _updateProjectTravelLogisticsApi(model: IProjectTravelLogistics, modelHotel: IProjectTravelLogisticsHotel): void {
    //Registro Project Travel
    this.ApiService.update(EEndpoints.ProjectTravelLogistics, model).subscribe(
        data => {
          if (data.code == 100) {
            //Tomo el Id del Registro y Guardo el Vuelo
            modelHotel.projectTravelLogisticsId = model.id;
            this._updateProjectTravelLogisticsHotel(modelHotel);
          } else {
            this.toasterService.showToaster(data.message);
            this.isWorking = false;
          }
        }, (err) => this.responseError(err)
      );
  }

  private _updateProjectTravelLogisticsHotel(modelHotel: IProjectTravelLogisticsHotel): void {
    this.ApiService.update(EEndpoints.ProjectTravelLogisticsHotel, modelHotel).subscribe(
      data => {
        if (data.code == 100) {
          this.onNoClick(true);
          this.toasterService.showToaster(this.translate.instant('travelLogistics.hotel.messages.saved'));
        } else {
          this.toasterService.showToaster(data.message);
          this.isWorking = false;
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
    );
  }

  private _deleteBudgetDetailApi(model: IProjectTravelLogistics, modelHotel: IProjectTravelLogisticsHotel, budget: ProjectBudgetDetail) {
      this.isWorking = true;
      if (!this.actionData.projectBudgetDetailId) {
          this._createProjectBudget(model, modelHotel, budget, false);
          return;
      }   
    this.ApiService.delete(EEndpoints.ProjectBudgetDetail, { id: this.actionData.projectBudgetDetailId }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100)
          this._createProjectBudget(model, modelHotel, budget, false);
      }, err => this.responseError(err)
    )
  }

  //#endregion
}
