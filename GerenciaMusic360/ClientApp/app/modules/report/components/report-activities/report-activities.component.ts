import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { Subject, Observable } from 'rxjs';
import { EEndpoints } from '@enums/endpoints';
import { IUser } from '@models/user';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { ResponseApi } from '@models/response-api';
import { allLang } from '@i18n/allLang';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SelectOption } from '@models/select-option.models';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { ActivitiesReport } from '@models/activity-report';

@Component({
  selector: 'app-report-activities',
  templateUrl: './report-activities.component.html',
  styleUrls: ['./report-activities.component.scss']
})

export class ReportActivitiesComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();

  isWorking: boolean = false;
  usersList: SelectOption[] = [];
  selectedUser: SelectOption[] = [];
  availableUsers: SelectOption[] = [];
  moduleType: SelectOption[] = [];
  activities: SelectOption[] = [];
  activityForm: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  filteredUsers: Observable<SelectOption[]>;

  @ViewChild('userInput', { static: false } as any) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false } as any) matAutocomplete: MatAutocomplete;

  constructor(
    private toaster: ToasterService,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
    private apiService: ApiService,
    private fb: FormBuilder,
  ) {
    this.translationLoader.loadTranslations(...allLang);
    this.moduleType = [
      { value: 1, viewValue: this.translate.instant('projects') },
      { value: 2, viewValue: this.translate.instant('marketing') },
      { value: 3, viewValue: this.translate.instant('works') },
    ];

    this.activities = [
      { value: 1, viewValue: this.translate.instant('all') },
      { value: 2, viewValue: this.translate.instant('last') },
      { value: 3, viewValue: this.translate.instant('pending') },
    ];

    this._getUsers();
  }

  ngOnInit() {
    this.activityForm = this.fb.group({
      type: [null, [Validators.required]],
      ActivityType: [null, [Validators.required]],
      users: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  get f() { return this.activityForm.controls; }

  remove(user: any): void {
    const index = this.selectedUser.findIndex(f => f.value == user.value);

    if (index >= 0) {
      this.selectedUser.splice(index, 1);
      this.availableUsers.push(user);
      this.availableUsers.slice();
      this.f.users.patchValue(this.selectedUser);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const id = parseInt(event.option.id);
    if (id == 0) {
      this.selectedUser = this.usersList;
      this.availableUsers = this.availableUsers.filter(f => f.value == 0);
    } else {
      const found = this.usersList.find(f => f.value == id);
      this.selectedUser.push(found);
      this.availableUsers = this.availableUsers.filter(f => f.value != id);
    }
    this.availableUsers.slice();
    this.f.users.patchValue(this.selectedUser);
    this.userCtrl.setValue('');
    this.userCtrl.patchValue('');
    this.userInput.nativeElement.value = '';
  }

  getReport() {
    const users = this.selectedUser.map(m => {
      return m.value
    })
    const params = {
      activityType: this.f.ActivityType.value,
      users: users.join(',')
    }
    if (this.f.type.value == 1)
      this._downloadReport(EEndpoints.ActivityReportProject, params,"activity_project_report");
    else if (this.f.type.value == 2) 
      this._downloadReport(EEndpoints.ActivityReportMarketing, params,"activity_marketing_report");

    this.resetForm();
  }

  resetForm() {
    this.activityForm.reset();
    this.availableUsers = this.usersList;
    this.availableUsers.unshift(
      <SelectOption>{
        value: 0,
        viewValue: this.translate.instant('all'),
      }
    );
    this.selectedUser = [];
  }

  private _responseError(error: any): void {
    this.toaster.showTranslate('general.errors.serverError');
    this.isWorking = false;
  }

  private _filter(value: string): SelectOption[] {
    const filterValue = value.toLowerCase();
    return this.availableUsers.filter(option => option.viewValue.toLowerCase().includes(filterValue));
  }

  //#region API
  private _getUsers(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Users)
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(
        (response: ResponseApi<IUser[]>) => {
          if (response.code == 100) {
            const users  = response.result.map((m:IUser)=> {
              return <SelectOption> {
                value: m.id,
                viewValue: `${m.name} ${m.lastName}`
              }
            });
            this.availableUsers = users;
            this.usersList = Object.assign([],users);
            this.availableUsers.unshift(
              <SelectOption>{
                value: 0,
                viewValue: this.translate.instant('all'),
              }
            );
            this.filteredUsers = this.userCtrl.valueChanges.pipe(
              startWith(''),
              map((user: string | null) => user ? this._filter(user) : this.availableUsers.slice()));
          } else
            this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }, err => this._responseError(err)
      );
  }

  private _downloadReport(endpoint: EEndpoints, params: any, reportName:string = "activity_report") {
    this.isWorking = true;
    this.apiService.download(endpoint, params).subscribe(
      fileData => {
        const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let link = document.createElement("a");
        if (link.download !== undefined) {
          let url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", reportName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }
  //#endregion

}
