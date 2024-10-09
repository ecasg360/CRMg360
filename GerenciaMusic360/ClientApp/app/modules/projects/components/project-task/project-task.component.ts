import { ApiService } from '@services/api.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { EEndpoints } from '@enums/endpoints';
import { MatDialog, MatCheckboxChange } from '@angular/material';
import { ProjectTask } from '@models/project-task';
import { ResponseApi } from '@models/response-api';
import { ToasterService } from '@services/toaster.service';
import { AddTaskInfoComponent } from './add-task-info/add-task-info.component';
import { IProject } from '@models/project';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ECommentType } from '@enums/modules-types';
import { EModules } from '@enums/modules';
import { ProjectTaskCompleteComponent } from './../project-task-complete/project-task-complete.component';
import { ComponentsComunicationService } from '@services/components-comunication.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-project-task',
  templateUrl: './project-task.component.html',
  styleUrls: ['./project-task.component.scss']
})

export class ProjectTaskComponent implements OnInit, OnChanges, OnDestroy {

  @Input() project: IProject = <IProject>{};
  @Input() triggerSave: boolean = false;
  @Input() perm: any = {};

  projectTasks: ProjectTask[] = [];
  isWorking: boolean = false;
  isEdit: boolean = false;
  isAllSelected: boolean = false;
  commentType = ECommentType;
    moduleType = EModules;
    private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private translate: TranslateService,
      private translationLoader: FuseTranslationLoaderService,
    private notification: ComponentsComunicationService
  ) { }

  ngOnInit() {
      this.translationLoader.loadTranslationsList(allLang);
      this.notification.listenProjectChange().pipe(takeUntil(this.unsubscribeAll))
          .subscribe((project: IProject) => {
              if (project) {
                  this.project = project;
              }
          });
  }

    ngOnChanges(changes: SimpleChanges): void {
    if (changes.project) {
      if (Object.keys(changes.project.currentValue).length > 0) {
        this.getProjectTaskByProject();
      }
    }
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

  trackByFn(index, item) {
    return (item.id) ? item.id : index;
  }

  applyFilter(filterValue: string): void {
  }

  drop(event: CdkDragDrop<ProjectTask[]>) {
    moveItemInArray(this.projectTasks, event.previousIndex, event.currentIndex);
    if (this.isEdit) {
      const params = this.projectTasks.map((m: ProjectTask, index: number) => {
        return {
          id: m.id,
          position: index + 1
        }
      });
      this._updatePositionTask(params);
    }
  }

  masterToggle(): void {
    this.isAllSelected = !this.isAllSelected;
    this.projectTasks.forEach(row => row.checked = this.isAllSelected);
  }

  ItemToggle($event: MatCheckboxChange, row: ProjectTask): void {
    row.checked = $event.checked;
    this.verifyAllChecked();
  }

  verifyAllChecked(): void {
    const found = this.projectTasks.find(f => !f.checked);
    this.isAllSelected = (found) ? false : true;
  }

  saveTask(): void {
    const params = [];
    const selected = this.projectTasks.filter(f => f.checked);
    if (selected.length > 0) {
      for (let i = 0; i < selected.length; i++) {
        let element = selected[i];
        let task = this._formatTaskProjectParams(element);
        task.position = i + 1;
        params.push(task);
      }
    }
    this.saveProjectTaskApi(params);
  }

  addData(action: string, row: ProjectTask = <ProjectTask>{}): void {
    this.isWorking = true;
    const modalAction = action == 'new' ? action : 'edit';

    if (action == 'new') {
      row = <ProjectTask>{
        id: null,
        notes: null,
        position: this.projectTasks.length + 1,
        projectId: this.project.id,
        required: false,
        templateTaskDocumentDetailId: 0,
        templateTaskDocumentDetailName: null,
        templateTaskDocumentId: this.projectTasks[0].templateTaskDocumentId,
        templateTaskDocumentName: this.projectTasks[0].templateTaskDocumentName,
        users: [],
        selectedUsers: [],
        isNew: true,
        completed: false,
        estimatedDateVerficationString: null,
      };
    }

    const dialogRef = this.dialog.open(AddTaskInfoComponent, {
      width: '500px',
        data: {
        model: row,
        maxDate: this.project.endDate,
        minDate: this.project.initialDate,
        availableTasks: this.projectTasks.filter(f => f.completed == false),
        action: modalAction,
        projectType: this.project.projectTypeId,
      }
    });
    dialogRef.afterClosed().subscribe((result: ProjectTask) => {
      if (result) {
        if (this.isEdit) {
          if (result.isNew) {
            this.getProjectTaskByProject();
            let task = this._formatTaskProjectParams(result, false);
            this.apiService.get(
              EEndpoints.ProjectTasksByTemplateTaskDocumentDetailId,
              { templateTaskId: task.id }
            ).subscribe(result => {
              task.id = result.result.id;
              this.updateTaskApi(task);
            });
            //this.updateTaskApi(task);
          } else {
            let task = this._formatTaskProjectParams(result, false);
            this.updateTaskApi(task);
          }

        }
      }
    });
    this.isWorking = false;
  }

  getComments(task = <ProjectTask>{}): void {
    task.comments = !task.comments;
  }

  private _formatTaskProjectParams(task: any, deleteId: boolean = true): ProjectTask {
    task.projectId = this.project.id;
    task.users = task.selectedUsers;
    if (!task.estimatedDateVerficationString || task.estimatedDateVerficationString == undefined) {
      task.estimatedDateVerficationString = this.project.endDate;
    }
    if (deleteId)
      delete task.id;

    delete task.created;
    delete task.creator;
    delete task.estimatedDateVerfication;
    delete task.modified;
    delete task.modifier;
    delete task.selectedUsers;
    delete task.isNew;
    delete task.comments;
    delete task.checked;
    return task;
  }

  markAsComplete(task: ProjectTask) {
    this.isWorking = true;
    const dialogRef = this.dialog.open(ProjectTaskCompleteComponent, {
      width: '500px',
        data: {
        model: task,
      }
    });
      dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeAll)).subscribe((result: ProjectTask) => {
      if (result) {
          this.getProjectTaskByProject();
          this.notification.notifyTaskChange(true);
      }
    });
    this.isWorking = false;
  }

  undoTask(task: ProjectTask) {
    const params = {
      id: task.id,
      notes: '',
      }
      this.setUndoProjectTaskApi(params);
  }

  private _responseError(err: any) {
    console.log(err);
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API

  setUndoProjectTaskApi(params: any): void {
    this.isWorking = true;

      this.apiService.save(EEndpoints.ProjectTaskUndoComplete, params).pipe(takeUntil(this.unsubscribeAll)).subscribe(
      (response: ResponseApi<ProjectTask[]>) => {
        if (response.code == 100) {
            this.getProjectTaskByProject();
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  getProjectTaskApi(): void {
    this.isWorking = true;
    const params = {
      projectId: this.project.id,
      projectTypeId: this.project.projectTypeId
    };

      this.apiService.get(EEndpoints.ProjectTasks, params).pipe(takeUntil(this.unsubscribeAll)).subscribe(
      (response: ResponseApi<ProjectTask[]>) => {
        if (response.code == 100) {
          this.projectTasks = response.result.map((m: ProjectTask) => {
            m.selectedUsers = Object.assign([], m.users);
            return m;
          });
          this.masterToggle();
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  getProjectTaskByProject(): void {
    this.isWorking = true;
      this.apiService.get(EEndpoints.ProjectTasksByProject, { projectId: this.project.id }).pipe(takeUntil(this.unsubscribeAll)).subscribe(
      (response: ResponseApi<ProjectTask[]>) => {
        if (response.code == 100) {
          this.isEdit = response.result.length > 0;
          if (this.isEdit) {
            this.projectTasks = response.result.map((m: ProjectTask) => {
              m.selectedUsers = Object.assign([], m.users);
              m.comments = false;
              return m;
            })/*.sort((a, b) => a.position - b.position)*/;
            this.isAllSelected = false;
            this.masterToggle();
          }
          else
            this.getProjectTaskApi();
          this.isWorking = false;
        }
      }, err => this._responseError(err)
    );
  }

  saveProjectTaskApi(params: any) {
    this.isWorking = true;
      this.apiService.save(EEndpoints.ProjectTasks, params).pipe(takeUntil(this.unsubscribeAll)).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster('Tareas registradas exitosamente');
          this.isEdit = true;
          this.isAllSelected = false;
          this.getProjectTaskByProject();
        } else
          this.toaster.showToaster("Error guardando tareas");
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  updateTaskApi(task: ProjectTask) {
      this.apiService.update(EEndpoints.ProjectTask, task).pipe(takeUntil(this.unsubscribeAll)).subscribe(
      (response: ResponseApi<number>) => {
        if (response.code == 100) {
          const index = this.projectTasks.findIndex(f => f.id == task.id);
          task.checked = true;
          this.projectTasks.splice(index, 1, task);
          this.toaster.showTranslate('messages.itemUpdated');
        } else
          this.toaster.showTranslate('errors.errorEditingItem');
      }, err => this._responseError(err)
    );
  }

  private _updatePositionTask(params: any): void {
    this.isWorking = true;
      this.apiService.save(EEndpoints.ProjectTasksPosition, params).pipe(takeUntil(this.unsubscribeAll)).subscribe(
      (response: ResponseApi<number>) => {
        if (response.code != 100) {
          this.getProjectTaskByProject();
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }
  //#endregion
}
