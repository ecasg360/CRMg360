import { Component, OnInit, Optional, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IMarketingPlan, IMarketingPlanAutorizes } from '@models/marketing-plan';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IUser, IMarketingUser } from '@models/user';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-modal-plan',
  templateUrl: './modal-plan.component.html',
  styleUrls: ['./modal-plan.component.scss']
})
export class ModalPlanComponent implements OnInit {

  campainPlanForm: FormGroup;
  model: IMarketingPlan = <IMarketingPlan>{};
  action: string;
  isWorking: boolean = false;
  initDate: Date = new Date(2000, 0, 1);
  endDate: Date = new Date(2120, 0, 1);
  
  //chip autocomplete
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  userCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userList: IMarketingUser[] = [];
  selectableUserList: IMarketingUser[] = [];
  selectedUsersList: IMarketingUser[] = [];
  filteredUsers: Observable<IMarketingUser[]>;

  // Se coloca as any ya que esta funcion esta deprecada en angular 8 y algunas versiones de angular 7
  // https://next.angular.io/guide/static-query-migration
  // https://github.com/angular/angular/issues/30654
  @ViewChild('usersInput', { static: false } as any) usersInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false } as any) matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalPlanComponent>,
    private translationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    public dialog: MatDialog,
    private apiService: ApiService,
    private toaster: ToasterService,
  ) {
  }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.model = <IMarketingPlan>this.data.model;
    this.initDate = (this.initDate) ? new Date(this.data.minDate) : this.initDate;
    this.endDate = (this.data.maxDate) ? new Date(this.data.maxDate) : this.endDate;
    this.action = this.data.action;
    this._getUsersApi();
    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((member: string | null) => member ? this._filter(member) : this.selectableUserList.slice()));
    this.initForm();
  }

  initForm() {
    const date = (this.model.estimatedDateVerificationString) ?
      (new Date(this.model.estimatedDateVerificationString)).toISOString() : null;

    this.campainPlanForm = this.fb.group({
      id: [this.model.id, []],
      marketingId: [this.model.marketingId, []],
      position: [this.model.position, []],
      name: [this.model.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)]],
      notes: [this.model.notes, [
        Validators.minLength(3),
        Validators.maxLength(255)
      ]],
      required: [this.model.required, [Validators.required]],
      estimatedDateVerificationString: [date, [Validators.required]],
      taskDocumentDetailId: [this.model.taskDocumentDetailId,[]],
      selectedUsers:[null,[Validators.required]],
    });
  }

  get f() { return this.campainPlanForm.controls; }

  remove(userId: number): void {
    const index = this.selectedUsersList.findIndex(fi => fi.id == userId);
    if (index >= 0)
      this.selectedUsersList.splice(index, 1);

    if (this.selectedUsersList.length == 0) {
      this.f['selectedUsers'].patchValue(null);
      this.campainPlanForm.markAsDirty();
    }

    const found = this.userList.find(f => f.id == userId);
    if (found)
      this.selectableUserList.push(found);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const userId = parseInt(event.option.id);
    const found = this.selectableUserList.find(f => f.id == userId);

    if (found) {
      this.selectedUsersList.push(found);
      this.f['selectedUsers'].patchValue(this.selectedUsersList);
      this.selectableUserList = this.selectableUserList.filter(f => f.id !== found.id);      
      this.selectableUserList.slice();
    }
    this.userCtrl.patchValue('');
    this.usersInput.nativeElement.value = '';
  }

  setTaskData() {
    this.isWorking = true;
    this.model = <IMarketingPlan>this.campainPlanForm.value;
    if (!this.model.notes)
      this.model.notes = '';
    this.confirmSave(this.model);
  }

  onNoClick(task: IMarketingPlan = undefined): void {
    this.dialogRef.close(task);
  }

  confirmSave(task: IMarketingPlan): void {
    this.isWorking = true;
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        text: this.translate.instant('messages.saveQuestion', { field: task.name }),
        action: this.translate.instant('general.save'),
        icon: 'save'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this.onNoClick(task);
      } else
        this.isWorking = false;
    });
  }

  private _filter(value: string): IMarketingUser[] {
    const filterValue = value.toLowerCase();
    return this.selectableUserList.filter(user => user.fullName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _responseError(err: HttpErrorResponse) {
    console.log(err);
    this.isWorking = false;
  }

  //#region API
  private _getUsersApi(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Users).subscribe(
      (response: ResponseApi<IUser[]>) => {
        if (response.code == 100) {
          const users = response.result.map(m => {
            let user = <IMarketingUser>m;
            user.fullName = `${m.name} ${m.lastName}`;
            return user;
          });
          this.userList = users;
          this.selectableUserList = users;
          this._getMarketingPlanUsers(this.model.id);
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _getMarketingPlanUsers(marketingPlanId: number) {
    this.apiService.get(EEndpoints.MarketingPlanAutorizes, {marketingPlanId : marketingPlanId}).subscribe(
      (response:ResponseApi<IMarketingPlanAutorizes[]>) => {
        if (response.code == 100 && response.result.length > 0) {
          const users = response.result;
          this.selectableUserList = [];
          this.selectedUsersList = [];
          this.userList.forEach((value:IMarketingUser, index: number) => {
            const found = users.find( f => f.userVerificationId == value.id);
            if (found)
              this.selectedUsersList.push(value);
            else
              this.selectableUserList.push(value);
          });
          this.f['selectedUsers'].patchValue(this.selectedUsersList);
          this.selectableUserList.slice();
        }
      }, err => this._responseError(err)
    )
  }
  //#endregion
}
