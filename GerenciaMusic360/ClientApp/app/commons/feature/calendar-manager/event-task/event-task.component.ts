import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '@services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { CalendarEvent } from 'angular-calendar';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ProjectTask } from '@models/project-task';
import { HttpErrorResponse } from '@angular/common/http';
import { EProjectStatusName } from '@enums/status';


@Component({
  selector: 'app-event-task',
  templateUrl: './event-task.component.html',
  styleUrls: ['./event-task.component.scss']
})
export class EventTaskComponent implements OnInit {

  event: CalendarEvent;
  eventTaskForm: FormGroup;
  canBeSave: boolean = false;
  projectTask: ProjectTask = <ProjectTask>{};
  isWorking: boolean = false;

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<EventTaskComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private toaster: ToasterService,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this.translationLoader.loadTranslationsList(allLang);
    this.event = this.data.event;
    this.initForm();
    this._getProjectTask(this.event.meta.projectTaskId);
  }

  initForm(): void {
    this.eventTaskForm = this.fb.group({
      notes: [this.projectTask.notes, [
        Validators.minLength(3),
        Validators.maxLength(255)
      ]],
      completed: [false, []],
    });
  }

  get f() { return this.eventTaskForm.controls; }

  CheckboxChange($event: MatCheckboxChange) {
    this.canBeSave = $event.checked;
  }

  completedTask(): void {
    let formValues = this.eventTaskForm.value;
    if (formValues.completed) {
      this._completedTask({ id: this.projectTask.id, notes: formValues.notes });
    } else {
      this._addNotesApi({ id: this.projectTask.id, notes: formValues.notes });
    }
  }

  onNoClick(status: CalendarEvent = undefined): void {
    this.dialogRef.close(status);
  }

  private _responseError(err: HttpErrorResponse) {
    console.log(err);
    this.isWorking = false;
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
  }

  //#region API
  private _getProjectTask(projectTaskId: number): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ProjectTask, { id: projectTaskId }).subscribe(
      (response: ResponseApi<ProjectTask>) => {
        if (response.code == 100) {
          this.projectTask = response.result;
          this.f.notes.patchValue(this.projectTask.notes);
        } else {
          this.toaster.showToaster(this.translate.instant('errors.errorGettingProjectTask'));
          this.onNoClick();
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _completedTask(params: any): void {
    this.isWorking = true;
    this.apiService.save(EEndpoints.ProjectTaskComplete, params).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this.event.color = {
            primary: EProjectStatusName.completed,
            secondary: EProjectStatusName.completed
          };
          this.onNoClick(this.event);
        } else
          this.toaster.showToaster(this.translate.instant('errors.errorSavingItem'));

        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _addNotesApi(params: any) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.ProjectTaskCommentary, params).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this.event.meta.notes = params.notes;
          this.onNoClick(this.event);
        } else
          this.toaster.showToaster(this.translate.instant('errors.errorSavingItem'));

        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }
  //#endregion

}
