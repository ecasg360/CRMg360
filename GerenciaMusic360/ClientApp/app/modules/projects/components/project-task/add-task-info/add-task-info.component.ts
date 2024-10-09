import { Component, OnInit, Optional, Inject, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ProjectTask } from '@models/project-task';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { UserTask } from '@models/user-task';
import { map, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IUser } from '@models/user';
import { TemplateTaskDocumentDetail } from '@models/template-task-document-detail';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ToasterService } from '@services/toaster.service';
import { IProject } from '@models/project';

@Component({
  selector: 'app-add-task-info',
  templateUrl: './add-task-info.component.html',
  styleUrls: ['./add-task-info.component.scss']
})

export class AddTaskInfoComponent implements OnInit {

  addProjectTaskForm: FormGroup;
  model: ProjectTask = <ProjectTask>{};
  action: string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isWorking: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  memberCtrl = new FormControl();
  filteredMembers: Observable<UserTask[]>;
  projectType: number = 0;
  initDate: Date = new Date(2000, 0, 1);
  endDate: Date = new Date(2120, 0, 1);
  availableTasks: ProjectTask[] = [];
  availableProjects: IProject[] = [];

  // Se coloca as any ya que esta funcion esta deprecada en angular 8 y algunas versiones de angular 7
  // https://next.angular.io/guide/static-query-migration
  // https://github.com/angular/angular/issues/30654
  @ViewChild('membersInput', { static: false } as any) membersInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false } as any) matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<AddTaskInfoComponent>,
    private translationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialog: MatDialog,
    private toaster: ToasterService,
  ) {
  }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.model = <ProjectTask>this.data.model;
    console.log('this.model: ', this.model);
    this.initDate = new Date(this.data.minDate);
    this.endDate = new Date(this.data.maxDate);
    this.action = this.data.action;
    this.projectType = this.data.projectType;
    this.availableTasks = this.data.availableTasks;

    this._getProjectForAssign();

    if (this.action != "new") {
      if (!this.model.selectedUsers) {
        this.model.selectedUsers = Object.assign([], this.model.users);
      }
      this.model.selectedUsers = this.model.selectedUsers.filter(f => f.userProfileName);
      // this.removable = false;
      // this.addOnBlur = false;
    }
    this._getUsersApi();

    this.filteredMembers = this.memberCtrl.valueChanges.pipe(
      startWith(null),
      map((member: string | null) => member ? this._filter(member) : this.model.users.slice()));

    this.initForm();
    this.isWorking = false;
  }

  initForm() {
    const date = (this.model.estimatedDateVerficationString) ?
      (new Date(this.model.estimatedDateVerficationString)).toISOString() : null;

    this.addProjectTaskForm = this.fb.group({
      notes: [this.model.notes, [
        Validators.minLength(3),
        Validators.maxLength(255)
      ]],
      estimatedDateVerficationString: [date, [Validators.required]],
      taskName: [this.model.templateTaskDocumentDetailName, [Validators.required, Validators.minLength(3),
      Validators.maxLength(255)]],
    });

    this.addProjectTaskForm.addControl('selectedUsers', this.fb.control(this.model.selectedUsers, Validators.required));

    if (this.action == 'new') {
      this.addProjectTaskForm.addControl('afterTo', this.fb.control(null));
      this.addProjectTaskForm.addControl('isPermanent', this.fb.control(null, Validators.required));
    }
  }

  get f() { return this.addProjectTaskForm.controls; }

  remove(userId: number): void {
    const index = this.model.selectedUsers.findIndex(io => io.userProfileId == userId);
    if (index >= 0) {
      this.model.selectedUsers.splice(index, 1);
    }
    if (this.model.selectedUsers.length == 0) {
      this.f['selectedUsers'].patchValue(null);
      this.addProjectTaskForm.markAsDirty();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const userId = parseInt(event.option.id);
    const found = this.model.selectedUsers.find(f => f.userProfileId == userId);
console.log(found);
    if (!found) {
      const optionSelected = this.model.users.find(f => f.userProfileId == userId);
      this.model.selectedUsers.push(optionSelected);
      this.f['selectedUsers'].patchValue(this.model.selectedUsers);
    }
    this.membersInput.nativeElement.value = '';
  }

  setTaskData() {
    this.isWorking = true;
    this.model.notes = this.f['notes'].value;
    this.model.estimatedDateVerficationString = this.f['estimatedDateVerficationString'].value;
    this.model.templateTaskDocumentDetailName = this.f['taskName'].value;
    if (this.action == 'new') {
      this.model.users = this.f['selectedUsers'].value;
      const templateTaskDoc = <TemplateTaskDocumentDetail>{
        name: this.model.templateTaskDocumentDetailName,
        templateTaskDocumentId: this.model.templateTaskDocumentId,
        required: false,
        position: this._getPosition(),
        estimatedDateVerficationString: this.model.estimatedDateVerficationString,
        usersAuthorize: this.model.selectedUsers.map((m: UserTask) => { return m.id }),
        isPermanent: this.f['isPermanent'].value,
        entityId: this.projectType,
        projectId: this.model.projectId
      };
      this.confirmSave(templateTaskDoc);
    } else
      this.onNoClick(this.model);
  }

  onNoClick(task: ProjectTask = undefined): void {
    this.dialogRef.close(task);
  }

  confirmSave(task: TemplateTaskDocumentDetail): void {
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
          this._saveTaskApi(task);
        else
          this.isWorking = false;
      } else
        this.isWorking = false;

    });
  }

  private _responseError(err: HttpErrorResponse) {
    console.log(err);
    this.isWorking = false;
  }

  private _filter(value: string): UserTask[] {
    const filterValue = value.toLowerCase();
    return this.model.users.filter(user => user.userProfileName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _getPosition(): number {
    let formPosition = parseInt(this.f['afterTo'].value);
    let position = this.model.position;

    return (formPosition)
      ? ++formPosition
      : position;
  }

  //#region API
  private _saveTaskApi(task: TemplateTaskDocumentDetail): void {
    this.isWorking = true;
    delete task.id;
    this.apiService.save(EEndpoints.TemplateTaskDocumentDetail, task).subscribe(
      (response: ResponseApi<TemplateTaskDocumentDetail>) => {
        if (response.code == 100) {
          const result = response.result;
          this.model.templateTaskDocumentDetailId = result.templateTaskDocumentId;
          this.model.templateTaskDocumentDetailName = result.name;
          this.model.templateTaskDocumentDetailId = result.id;
          this.model.projectId = result.projectId;
          this.model.position = result.position;
          this.model.required = result.required;
          this.model.isNew = true;
          this.model.id = result.id;
          this.onNoClick(this.model);
        }
        else {
          this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
          this.onNoClick(undefined);
        }
      }, err => this._responseError(err)
    );
  }

  private _getUsersApi(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Users).subscribe(
      (response: ResponseApi<IUser[]>) => {
        if (response.code == 100) {
          this.model.users = response.result.map((m: IUser) => {
            return <UserTask>{
              active: true,
              configurationTaskId: 0,
              id: m.id,
              userProfileAuthorized: true,
              departmentId: m.departmentId,
              userProfileId: m.id,
              userProfileName: `${m.name} ${m.lastName}`,
              checked: true
            }
          });
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _getProjectForAssign(): void {
    this.apiService.get(EEndpoints.ProjectsForAssign).subscribe(
      (response: ResponseApi<IProject[]>) => {
        console.log(response);
        if (response.code == 100)
          this.availableProjects = response.result;
      }, err => this._responseError(err)
    )
  }
  //#endregion
}
