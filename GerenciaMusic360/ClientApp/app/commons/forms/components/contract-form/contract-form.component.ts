import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SelectOption } from '@models/select-option.models';
import { MatDatepickerInputEvent, MatCheckboxChange, MatAutocompleteSelectedEvent } from '@angular/material';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { IContract } from '@models/contract';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ResponseSelect } from '@models/select-response';
import { IProject } from '@models/project';
import { Observable, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})

export class ContractFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() contract: IContract = <IContract>{};
  @Output() formReady = new EventEmitter<FormGroup>();
  @Output() formWorking = new EventEmitter<boolean>();

  private _isWorking: boolean;
  contractForm: FormGroup;
  times: SelectOption[] = [];
  currencies: SelectOption[] = [];
  projects: SelectOption[] = [];
  projectsTask: SelectOption[] = [];
  showHasAmountOptions: boolean = false;

  projectFC = new FormControl();
  filteredOptions: Observable<SelectOption[]>;

  projectTaskFC = new FormControl();
  filteredOptionsTask: Observable<SelectOption[]>;

  initDate: Date = new Date(2000, 0, 1);
  endDate: Date = new Date(2220, 0, 1);

  initDateLabel: string;
  endDateLabel: string;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translationLoaderService: FuseTranslationLoaderService,

  ) {
    this.translationLoaderService.loadTranslations(...allLang);
    this.contractForm = this.fb.group({});
    this._getProjects();
  }

  public get isWorking(): boolean {
    return this._isWorking;
  }
  public set isWorking(v: boolean) {
    this._isWorking = v;
    this._manageFormStates();
  }

  ngOnInit() {
    this.configureForm();
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {

  }

  ngOnDestroy(): void {
    this.formReady.complete();
    this.formWorking.complete();
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  configureForm(): void {
    const startDate = (this.contract.startDate)
      ? (new Date(this.contract.startDate)).toISOString()
      : null;

    const endDate = (this.contract.endDate)
      ? (new Date(this.contract.endDate)).toISOString()
      : null;

    this.contract.hasAmount = !this.contract.hasAmount ? false : true;

    this.initDateLabel = this.translate.instant('general.initialDate');
    this.endDateLabel = this.translate.instant('general.endDate');

    this.contractForm = this.fb.group({
      id: [this.contract.id, []],
      startDate: [startDate, [Validators.required]],
      endDate: [endDate, [Validators.required]],
      name: [this.contract.name, [Validators.required]],
      description: [this.contract.description, []],
      timeId: [this.contract.timeId, [Validators.required]],
      currencyId: [this.contract.currencyId, []],
      localCompanyId: [this.contract.localCompanyId, []],
      localCompanyName: [this.contract.localCompany ? this.contract.localCompany.name : null, []],
      contractStatusId: [this.contract.contractStatusId, []],
      hasAmount: [this.contract.hasAmount, []],
      amount: [this.contract.amount, []],
      contractTypeId: [this.contract.contractTypeId, []],
      fileId: [this.contract.fileId, []],
      projectTaskId: [this.contract.projectTaskId, []],
      projectId: [this.contract.projectId, []],
    });
    this.showHasAmountOptions = this.contract.hasAmount;
    this._manageAmountFields(this.contract.hasAmount);
    this._manageDateLabel();

    this.formReady.emit(this.contractForm);
  }

  get f() { return this.contractForm.controls; }

  checkedHasAmount($event: MatCheckboxChange): void {
    this.showHasAmountOptions = $event.checked;
    this._manageAmountFields($event.checked);
  }

  dateChangeEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (type == 'start') {
      if (event.value) {
        this.initDate = new Date(event.value);
        this.f['endDate'].enable();
      } else {
        this.f['endDate'].disable();
      }
    } else {
      if (event.value) {
        this.endDate = new Date(event.value);
      }
    }
  }

  auSelected($event: MatAutocompleteSelectedEvent) {
    this.f.projectId.patchValue($event.option.id);
    this._getProjectTasks(parseInt($event.option.id));
    this.f.projectTaskId.patchValue(null);
    this.projectTaskFC.setValue(null);
  }

  auSelectedTask($event: MatAutocompleteSelectedEvent) {
    this.f.projectTaskId.patchValue($event.option.id);
  }

  auClosed(type: string) {
    if (type == 'project' && !this.projectFC.value) {
      this.f.projectId.patchValue(null);
      this.f.projectTaskId.patchValue(null);
      this.projectTaskFC.setValue(null);
    }

    if (type == 'task' && !this.projectTaskFC.value)
      this.f.projectTaskId.patchValue(null);
  }

  private _manageFormStates(): void {
    if (this.isWorking)
      this.contractForm.disable();
    else
      this.contractForm.enable();
    this.formWorking.emit(this.isWorking);
  }

  private _manageAmountFields(isActive: boolean): void {
    if (isActive) {
      this.f.amount.setValidators([Validators.required]);
      this.f.currencyId.setValidators([Validators.required]);
      this.f.timeId.setValidators([Validators.required]);
    } else {
      this.f.amount.clearValidators();
      this.f.currencyId.clearValidators();
      this.f.timeId.clearValidators();
    }
    this.contractForm.updateValueAndValidity();
  }

  private _filter(value: string, type: string = "project"): SelectOption[] {
    const filterValue = value == null ? value : '';

    if (type == "project") {
      return this.projects.length > 0
        ? this.projects.filter(option => option.viewValue.toLowerCase().includes(filterValue.toLowerCase()))
        : [];
    } else {
      return (this.projectsTask.length > 0)
        ? this.projectsTask.filter(option => option.viewValue.toLowerCase().includes(filterValue.toLowerCase()))
        : [];
    }
  }

  private _manageDateLabel() {
    this.f.contractTypeId.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(value => {
      if (value == 3) {
        this.initDateLabel = this.translate.instant('general.date');
        this.endDateLabel = this.translate.instant('general.contractSigningDate');
      } else {
        this.initDateLabel = this.translate.instant('general.initialDate');
        this.endDateLabel = this.translate.instant('general.endDate');
      }
    });
  }

  private _responseError(error: any): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
  }

  //#region API

  private _getCurrency(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Currencies)
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(
        (response: ResponseApi<any>) => {
          if (response.code == 100) {
            this.currencies = response.result.map(s => ({
              value: s.id,
              viewValue: s.description
            }));
            this._getTime();
          } else
            this.isWorking = false;
        }, err => this._responseError(err)
      );
  }

  private _getTime(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.TimesByModule, { moduleId: 2 }).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.times = response.result.map((s: ResponseSelect) => ({
            value: s.id,
            viewValue: s.name
          }));
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _getProjects() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ProjectsActive).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (response: ResponseApi<IProject[]>) => {
        if (response.code == 100) {
          this.projects = response.result.map((m: IProject) => ({
            value: m.id,
            viewValue: m.name
          })
          );
          this.isWorking = false;
          this._getCurrency();
          this.filteredOptions = this.projectFC.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
          );

          if (this.projects.length > 0 && this.contract.projectId) {
            const found = this.projects.find(f => f.value == this.contract.projectId);
            if (found) {
              setTimeout(() => { this.projectFC.setValue(found.viewValue); });
              this._getProjectTasks(this.contract.projectId);
            }
          }
        } else
          this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _getProjectTasks(projectId: number) {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ProjectTasksActive, { projectId: projectId }).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (response: ResponseApi<any[]>) => {
        if (response.code == 100) {
          this.projectsTask = response.result.map(m => ({
            value: m.id,
            viewValue: m.templateTaskDocumentDetailName
          })
          );
          this.filteredOptionsTask = this.projectTaskFC.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value, "task"))
          );

          if (this.projectsTask.length > 0 && this.contract.projectTaskId) {
            const found = this.projectsTask.find(f => f.value == this.contract.projectTaskId);
            if (found) {
              setTimeout(() => { this.projectTaskFC.setValue(found.viewValue); });
            }
          }
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }
  //#endregion
}
