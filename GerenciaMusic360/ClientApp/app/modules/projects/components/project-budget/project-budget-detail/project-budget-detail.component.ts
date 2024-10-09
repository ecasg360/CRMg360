import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ProjectBudgetDetail } from '@models/project-budget-detail';
import { ICategory } from '@models/category';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProjectBudget } from '@models/project-budget';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { allLang } from '@i18n/allLang';
import { HttpErrorResponse } from '@angular/common/http';
import { ECategoriesModules } from '@enums/categories-modules';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { Observable } from 'rxjs';
import { SelectOption } from '@models/select-option.models';
import { EModules } from '@enums/modules';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-project-budget-detail',
  templateUrl: './project-budget-detail.component.html',
  styleUrls: ['./project-budget-detail.component.scss']
})
export class ProjectBudgetDetailComponent implements OnInit {

  projectBudgetForm: FormGroup;
  budget: ProjectBudget = <ProjectBudget>{};
  projectTypeId: number;
  model: ProjectBudgetDetail = <ProjectBudgetDetail>{};
  isWorking: boolean = false;
  categories: SelectOption[] = [];
  filteredOptions: Observable<SelectOption[]>;
  question = '';
  categoryFC = new FormControl();

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ProjectBudgetDetailComponent>,
    private translationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private toaster: ToasterService,
  ) { }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.budget = <ProjectBudget>this.data.budget;
    this.model = <ProjectBudgetDetail>this.data.budgetDetail;
    this.projectTypeId = this.data.projectTypeId;
    this._getCategories();
    this.initForm();
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
  }

  initForm() {
    const dateString = (this.model.dateString)
      ? (new Date(this.model.dateString)).toISOString() : null;

    this.projectBudgetForm = this.fb.group({
      id: [this.model.id, []],
      spent: [this.model.spent, [Validators.required]],
      categoryId: [this.model.categoryId, [Validators.required]],
      dateString: [dateString, [Validators.required]],
      projectBudgetId: [this.budget.id, []],
      notes: [null, []],
    });
  }

  get f() { return this.projectBudgetForm.controls; }

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
      this.f.categoryId.patchValue($event.option.id);
    }
  }

  onNoClick(budget: ProjectBudgetDetail = undefined): void {
    this.dialogRef.close(budget);
  }

  confirmSave(): void {
    this.isWorking = true;
    this.model = <ProjectBudgetDetail>this.projectBudgetForm.value;
    this._saveProjectBudget(this.model);
  }

  private _saveProjectBudget(budget: ProjectBudgetDetail) {
    if (budget.id && budget.id > 0)
      this._updateProjectBudget(this.model);
    else
      this._createProjectBudget(this.model);
  }

  private _filter(value: string): SelectOption[] {
    const filterValue = value ? value.toLowerCase() : '';
    let results = [];
    results = this.categories.filter(option => option.viewValue.toLowerCase().includes(filterValue));

    return (results.length == 0)
      ? [{
        value: 0,
        viewValue: `${this.question}${value.trim()}"?`
      }]
      : results;
  }

  private _responseError(err: HttpErrorResponse) {
    this.isWorking = false;
    console.log(err);
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
  }

  //#region APIS
  private _getCategories(): void {
    this.isWorking = true;
    const params = { moduleId: ECategoriesModules.ProyectoPresupuestoDetalle, projectTypeId: this.projectTypeId };
    this.apiService.get(EEndpoints.CategoriesByModule, params).subscribe(
      (response: ResponseApi<ICategory[]>) => {
        if (response.code == 100) {
          this.categories = response.result.map((m: ICategory) => ({ value: m.id, viewValue: m.name }));
          this.filteredOptions = this.categoryFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        }
        else
          this.toaster.showToaster(this.translate.instant('errors.errorGettingCategories'));
        this.isWorking = false;
      }, this._responseError
    )
  }

  private _createProjectBudget(budget: ProjectBudgetDetail): void {
    this.isWorking = true;
    delete budget.id;
    this.apiService.save(EEndpoints.ProjectBudgetDetail, budget).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.itemSaved'));
          this.onNoClick(this.model);
        } else {
          this.toaster.showToaster(this.translate.instant('errors.errorSavingItem'));
          this.onNoClick(undefined);
        }
        this.isWorking = false;
      }, this._responseError
    )
  }

  private _updateProjectBudget(budget: ProjectBudgetDetail): void {
    this.isWorking = true;
    this.apiService.update(EEndpoints.ProjectBudgetDetail, budget).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.itemUpdated'));
          this.onNoClick(this.model);
        } else {
          this.toaster.showToaster(this.translate.instant('errors.errorUpdatingItem'));
          this.onNoClick(undefined);
        }
        this.isWorking = false;
      }, this._responseError
    )
  }

  private _saveCategory(model: ICategory, saveBudget: boolean = false) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.Category, model).subscribe(
      (response: ResponseApi<ICategory>) => {
        if (response.code == 100) {
          this.categories.push({
            value: response.result.id,
            viewValue: response.result.name
          });
          setTimeout(() => this.categoryFC.setValue(response.result.name));
          this.f.categoryId.patchValue(response.result.id);
        }
        this.isWorking = false;
      }, this._responseError
    )
  }
  //#endregion
}
