var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiService } from '@services/api.service';
import { Component, Input } from '@angular/core';
import { EEndpoints } from '@enums/endpoints';
import { MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { AddTaskInfoComponent } from './add-task-info/add-task-info.component';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ECommentType } from '@enums/modules-types';
import { EModules } from '@enums/modules';
import { ProjectTaskCompleteComponent } from './../project-task-complete/project-task-complete.component';
import { ComponentsComunicationService } from '@services/components-comunication.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
var ProjectTaskComponent = /** @class */ (function () {
    function ProjectTaskComponent(toaster, apiService, dialog, translate, translationLoader, notification) {
        this.toaster = toaster;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.notification = notification;
        this.project = {};
        this.triggerSave = false;
        this.perm = {};
        this.projectTasks = [];
        this.isWorking = false;
        this.isEdit = false;
        this.isAllSelected = false;
        this.commentType = ECommentType;
        this.moduleType = EModules;
        this.unsubscribeAll = new Subject();
    }
    ProjectTaskComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.translationLoader.loadTranslationsList(allLang);
        this.notification.listenProjectChange().pipe(takeUntil(this.unsubscribeAll))
            .subscribe(function (project) {
            if (project) {
                _this.project = project;
            }
        });
    };
    ProjectTaskComponent.prototype.ngOnChanges = function (changes) {
        if (changes.project) {
            if (Object.keys(changes.project.currentValue).length > 0) {
                this.getProjectTaskByProject();
            }
        }
    };
    ProjectTaskComponent.prototype.ngOnDestroy = function () {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    };
    ProjectTaskComponent.prototype.trackByFn = function (index, item) {
        return (item.id) ? item.id : index;
    };
    ProjectTaskComponent.prototype.applyFilter = function (filterValue) {
    };
    ProjectTaskComponent.prototype.drop = function (event) {
        moveItemInArray(this.projectTasks, event.previousIndex, event.currentIndex);
        if (this.isEdit) {
            var params = this.projectTasks.map(function (m, index) {
                return {
                    id: m.id,
                    position: index + 1
                };
            });
            this._updatePositionTask(params);
        }
    };
    ProjectTaskComponent.prototype.masterToggle = function () {
        var _this = this;
        this.isAllSelected = !this.isAllSelected;
        this.projectTasks.forEach(function (row) { return row.checked = _this.isAllSelected; });
    };
    ProjectTaskComponent.prototype.ItemToggle = function ($event, row) {
        row.checked = $event.checked;
        this.verifyAllChecked();
    };
    ProjectTaskComponent.prototype.verifyAllChecked = function () {
        var found = this.projectTasks.find(function (f) { return !f.checked; });
        this.isAllSelected = (found) ? false : true;
    };
    ProjectTaskComponent.prototype.saveTask = function () {
        var params = [];
        var selected = this.projectTasks.filter(function (f) { return f.checked; });
        if (selected.length > 0) {
            for (var i = 0; i < selected.length; i++) {
                var element = selected[i];
                var task = this._formatTaskProjectParams(element);
                task.position = i + 1;
                params.push(task);
            }
        }
        this.saveProjectTaskApi(params);
    };
    ProjectTaskComponent.prototype.addData = function (action, row) {
        var _this = this;
        if (row === void 0) { row = {}; }
        this.isWorking = true;
        var modalAction = action == 'new' ? action : 'edit';
        if (action == 'new') {
            row = {
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
        var dialogRef = this.dialog.open(AddTaskInfoComponent, {
            width: '500px',
            data: {
                model: row,
                maxDate: this.project.endDate,
                minDate: this.project.initialDate,
                availableTasks: this.projectTasks.filter(function (f) { return f.completed == false; }),
                action: modalAction,
                projectType: this.project.projectTypeId,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                if (_this.isEdit) {
                    if (result.isNew) {
                        _this.getProjectTaskByProject();
                        var task_1 = _this._formatTaskProjectParams(result, false);
                        _this.apiService.get(EEndpoints.ProjectTasksByTemplateTaskDocumentDetailId, { templateTaskId: task_1.id }).subscribe(function (result) {
                            task_1.id = result.result.id;
                            _this.updateTaskApi(task_1);
                        });
                        //this.updateTaskApi(task);
                    }
                    else {
                        var task = _this._formatTaskProjectParams(result, false);
                        _this.updateTaskApi(task);
                    }
                }
            }
        });
        this.isWorking = false;
    };
    ProjectTaskComponent.prototype.getComments = function (task) {
        if (task === void 0) { task = {}; }
        task.comments = !task.comments;
    };
    ProjectTaskComponent.prototype._formatTaskProjectParams = function (task, deleteId) {
        if (deleteId === void 0) { deleteId = true; }
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
    };
    ProjectTaskComponent.prototype.markAsComplete = function (task) {
        var _this = this;
        this.isWorking = true;
        var dialogRef = this.dialog.open(ProjectTaskCompleteComponent, {
            width: '500px',
            data: {
                model: task,
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeAll)).subscribe(function (result) {
            if (result) {
                _this.getProjectTaskByProject();
                _this.notification.notifyTaskChange(true);
            }
        });
        this.isWorking = false;
    };
    ProjectTaskComponent.prototype.undoTask = function (task) {
        var params = {
            id: task.id,
            notes: '',
        };
        this.setUndoProjectTaskApi(params);
    };
    ProjectTaskComponent.prototype._responseError = function (err) {
        console.log(err);
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    ProjectTaskComponent.prototype.setUndoProjectTaskApi = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectTaskUndoComplete, params).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.getProjectTaskByProject();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectTaskComponent.prototype.getProjectTaskApi = function () {
        var _this = this;
        this.isWorking = true;
        var params = {
            projectId: this.project.id,
            projectTypeId: this.project.projectTypeId
        };
        this.apiService.get(EEndpoints.ProjectTasks, params).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectTasks = response.result.map(function (m) {
                    m.selectedUsers = Object.assign([], m.users);
                    return m;
                });
                _this.masterToggle();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectTaskComponent.prototype.getProjectTaskByProject = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectTasksByProject, { projectId: this.project.id }).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.isEdit = response.result.length > 0;
                if (_this.isEdit) {
                    _this.projectTasks = response.result.map(function (m) {
                        m.selectedUsers = Object.assign([], m.users);
                        m.comments = false;
                        return m;
                    }) /*.sort((a, b) => a.position - b.position)*/;
                    _this.isAllSelected = false;
                    _this.masterToggle();
                }
                else
                    _this.getProjectTaskApi();
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProjectTaskComponent.prototype.saveProjectTaskApi = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectTasks, params).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster('Tareas registradas exitosamente');
                _this.isEdit = true;
                _this.isAllSelected = false;
                _this.getProjectTaskByProject();
            }
            else
                _this.toaster.showToaster("Error guardando tareas");
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectTaskComponent.prototype.updateTaskApi = function (task) {
        var _this = this;
        this.apiService.update(EEndpoints.ProjectTask, task).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                var index = _this.projectTasks.findIndex(function (f) { return f.id == task.id; });
                task.checked = true;
                _this.projectTasks.splice(index, 1, task);
                _this.toaster.showTranslate('messages.itemUpdated');
            }
            else
                _this.toaster.showTranslate('errors.errorEditingItem');
        }, function (err) { return _this._responseError(err); });
    };
    ProjectTaskComponent.prototype._updatePositionTask = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectTasksPosition, params).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code != 100) {
                _this.getProjectTaskByProject();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectTaskComponent.prototype, "project", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ProjectTaskComponent.prototype, "triggerSave", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectTaskComponent.prototype, "perm", void 0);
    ProjectTaskComponent = __decorate([
        Component({
            selector: 'app-project-task',
            templateUrl: './project-task.component.html',
            styleUrls: ['./project-task.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService,
            ComponentsComunicationService])
    ], ProjectTaskComponent);
    return ProjectTaskComponent;
}());
export { ProjectTaskComponent };
//# sourceMappingURL=project-task.component.js.map