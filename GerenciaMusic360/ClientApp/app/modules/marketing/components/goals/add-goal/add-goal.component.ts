import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { SocialNetworkType } from '@models/socialNetworkType';
import { IGoals, IMarketingGoals } from '@models/goals';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss']
})
export class AddGoalComponent implements OnInit {

  goalsForm: FormGroup;
  model: IMarketingGoals = <IMarketingGoals>{};
  isWorking: boolean = false;
  socialNetworksList: SocialNetworkType[] = [];

  filteredOptions: Observable<IGoals[]>;
  goalsList: IGoals[] = [];
  question = "";
  goalsFC = new FormControl();
  activeSocial: number = 0;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddGoalComponent>,
    private translationLoaderService: FuseTranslationLoaderService,
    private apiService: ApiService,
    private toaster: ToasterService,
    private translate: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.translationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.model = <IMarketingGoals>this.data.model;

    if (this.model.id) {
      this.activeSocial = this.model.socialNetworkTypeId;
      this.goalsFC.patchValue(this.model.goalName);
    }
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    this._getGoals();
    this._getSocialNetworkTypes();
    this._initForm();
  }

  private _initForm() {
    this.goalsForm = this.fb.group({
      id: [this.model.id, []],
      goalId: [this.model.goalId, [Validators.required]],
      marketingId: [this.model.marketingId, [Validators.required,]],
      socialNetworkTypeId: [this.model.socialNetworkTypeId, [Validators.required]],
      audited: [this.model.audited, []],
      goalQuantity: [this.model.goalQuantity, [Validators.required]],
      overcome: [true, [Validators.required]],
    });
  }

  get f() { return this.goalsForm.controls; }

  addGoal() {
    this.model = <IMarketingGoals>this.goalsForm.value;
    if (!this.model.audited)
      this.model.audited = false;

    if (this.model.id)
      this._updateMarketingGoal(this.model);
    else {
      delete this.model.id;
      this._createMarketingGoal(this.model);
    }
  }

  addSocialNetwork(item: SocialNetworkType) {
    this.activeSocial = item.id;
    this.f.socialNetworkTypeId.patchValue(item.id);
  }

  onNoClick(data: IMarketingGoals = undefined): void {
    this.dialogRef.close(data);
  }

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
    if ($event.option.id == '0') {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
      if (this.activeSocial == 0) {

      }
      let goal = <IGoals>{
        name: newItem,
        active: true
      }
      this._saveGoal(goal);
    } else {
      this.f.goalId.patchValue($event.option.id);
    }
  }

  enter(evt: any) {
    const found = this.goalsList.find(f => f.name == this.goalsFC.value);
    if (found)
      this.f.goalId.patchValue(found.id);
    else {
      let goal = <IGoals>{
        name: this.goalsFC.value,
        active: true
      }
      this._saveGoal(goal);
    }
  }

  private _filter(value: string): IGoals[] {
    const filterValue = value.toLowerCase();
    let results = [];
    results = this.goalsList.filter(option => option.name.toLowerCase().includes(filterValue));
    return (results.length == 0)
      ? [{
        id: 0,
        name: `${this.question}${value.trim()}"?`
      }]
      : results;
  }

  private _responseError(error: any): void {
    this.toaster.showTranslate('general.errors.serverError');
    this.isWorking = false;
  }

  //#region API
  private _getSocialNetworkTypes(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.SocialNetworkTypes).subscribe(
      (response: ResponseApi<SocialNetworkType[]>) => {
        if (response.code == 100) {
          this.socialNetworksList = response.result;//.filter(f => f.statusRecordId == 1);
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }
      }, err => this._responseError(err)
    );
  }

  private _getGoals() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Goals).subscribe(
      (response: ResponseApi<IGoals[]>) => {
        if (response.code == 100) {
          this.goalsList = response.result;
          this.filteredOptions = this.goalsFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _saveGoal(goal: IGoals) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.Goal, goal).subscribe(
      (response: ResponseApi<IGoals>) => {
        if (response.code == 100) {
          this.goalsList.push(response.result);
          setTimeout(() => this.goalsFC.setValue(response.result.name));
          this.f.goalId.patchValue(response.result.id);
        } else
          this.toaster.showTranslate('errors.errorSavingItem');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _createMarketingGoal(goal: IMarketingGoals) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingGoal, goal).subscribe(
      (response: ResponseApi<IMarketingGoals>) => {
        if (response.code == 100) {
          this.model = response.result;
          this.onNoClick(this.model);
        } else
          this.toaster.showTranslate('errors.errorSavingItem');
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _updateMarketingGoal(goal: IMarketingGoals) {
    this.isWorking = true;
    this.apiService.update(EEndpoints.MarketingGoal, goal).subscribe(
      (response: ResponseApi<IMarketingGoals>) => {
        if (response.code == 100)
          this.onNoClick(this.model);
        else
          this.toaster.showTranslate('errors.errorEditingItem');
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }
  //#endregion
}
