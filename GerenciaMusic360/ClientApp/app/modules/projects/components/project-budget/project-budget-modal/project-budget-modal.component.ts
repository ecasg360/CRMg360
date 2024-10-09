import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ProjectBudget } from '@models/project-budget';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ECategoriesModules } from '@enums/categories-modules';
import { ResponseApi } from '@models/response-api';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectOption } from '@models/select-option.models';
import { ICategory } from '@models/category';
import { Observable } from 'rxjs';
import { EModules } from '@enums/modules';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-project-budget-modal',
  templateUrl: './project-budget-modal.component.html',
  styleUrls: ['./project-budget-modal.component.scss']
})
export class ProjectBudgetModalComponent implements OnInit {

  projectBudgetForm: FormGroup;
  model: ProjectBudget = <ProjectBudget>{};
  isWorking: boolean = false;
  projectId: number;
  projectTypeId: number;
  budget: number;
  availableBudget: number;
  categories: SelectOption[] = [];
  filteredOptions: Observable<SelectOption[]>;
  question = '';
  categoryFC = new FormControl();

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ProjectBudgetModalComponent>,
    private translationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialog: MatDialog,
    private toaster: ToasterService,
  ) {
  }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.model = <ProjectBudget>this.data.model;
    this.projectId = this.data.projectId;
    this.projectTypeId = this.data.projectTypeId;
    this.budget = this.data.budget;
    this.availableBudget = this.data.availableBudget;

    this._getCategories();
    this.initForm();
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
  }

  initForm() {
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
        moduleId: EModules.ProjectBudget,
      }
      this._saveCategory(category);
    } else {
      this.f.categoryId.patchValue($event.option.id);
    }
  }

  onNoClick(budget: ProjectBudget = undefined): void {
    this.dialogRef.close(budget);
  }

  confirmSave(): void {
    this.isWorking = true;
    this.model = <ProjectBudget>this.projectBudgetForm.value;
    this.model.spent = (!this.model.spent) ? 0 : this.model.spent;
    this.model.projectId = this.projectId;
    this.model.categoryName = this.categories.find(f => f.value == this.model.categoryId).viewValue;
    this._setBudget(this.model);
  }

  private _setBudget(budget: ProjectBudget) {
    delete budget.categoryName;
    delete budget.projectBudgetDetail;
    delete budget.category;
    // delete budget.statusRecordId;
    if (budget.id && budget.id > 0)
      this._updateProjectBudget(budget);
    else
      this._createProjectBudget(budget);
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
    const params = { moduleId: ECategoriesModules.ProyectoPresupuesto, projectTypeId: this.projectTypeId };
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

  private _createProjectBudget(budget: ProjectBudget): void {
    delete budget.id;
    this.apiService.save(EEndpoints.ProjectBudget, budget).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.itemSaved'));
          this.onNoClick(this.model);
        } else {
          this.toaster.showToaster(this.translate.instant('errors.errorSavingItem'));
          this.onNoClick(undefined);
        }
      }, this._responseError
    )
  }

  private _updateProjectBudget(budget: ProjectBudget): void {
    this.apiService.update(EEndpoints.ProjectBudget, budget).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.itemUpdated'));
          this.onNoClick(this.model);
        } else {
          this.toaster.showToaster(this.translate.instant('errors.errorEditingItem'));
          this.onNoClick(undefined);
        }
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