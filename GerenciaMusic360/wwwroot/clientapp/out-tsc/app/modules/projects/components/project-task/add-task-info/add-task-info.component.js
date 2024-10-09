var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Optional, Inject, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatDialog } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ToasterService } from '@services/toaster.service';
var AddTaskInfoComponent = /** @class */ (function () {
    function AddTaskInfoComponent(fb, translate, dialogRef, translationLoaderService, data, apiService, dialog, toaster) {
        this.fb = fb;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.translationLoaderService = translationLoaderService;
        this.data = data;
        this.apiService = apiService;
        this.dialog = dialog;
        this.toaster = toaster;
        this.model = {};
        this.visible = true;
        this.selectable = true;
        this.removable = true;
        this.addOnBlur = true;
        this.isWorking = false;
        this.separatorKeysCodes = [ENTER, COMMA];
        this.memberCtrl = new FormControl();
        this.projectType = 0;
        this.initDate = new Date(2000, 0, 1);
        this.endDate = new Date(2120, 0, 1);
        this.availableTasks = [];
        this.availableProjects = [];
    }
    AddTaskInfoComponent.prototype.ngOnInit = function () {
        var _a;
        var _this = this;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.model = this.data.model;
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
            this.model.selectedUsers = this.model.selectedUsers.filter(function (f) { return f.userProfileName; });
            // this.removable = false;
            // this.addOnBlur = false;
        }
        this._getUsersApi();
        this.filteredMembers = this.memberCtrl.valueChanges.pipe(startWith(null), map(function (member) { return member ? _this._filter(member) : _this.model.users.slice(); }));
        this.initForm();
        this.isWorking = false;
    };
    AddTaskInfoComponent.prototype.initForm = function () {
        var date = (this.model.estimatedDateVerficationString) ?
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
    };
    Object.defineProperty(AddTaskInfoComponent.prototype, "f", {
        get: function () { return this.addProjectTaskForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddTaskInfoComponent.prototype.remove = function (userId) {
        var index = this.model.selectedUsers.findIndex(function (io) { return io.userProfileId == userId; });
        if (index >= 0) {
            this.model.selectedUsers.splice(index, 1);
        }
        if (this.model.selectedUsers.length == 0) {
            this.f['selectedUsers'].patchValue(null);
            this.addProjectTaskForm.markAsDirty();
        }
    };
    AddTaskInfoComponent.prototype.selected = function (event) {
        var userId = parseInt(event.option.id);
        var found = this.model.selectedUsers.find(function (f) { return f.userProfileId == userId; });
        console.log(found);
        if (!found) {
            var optionSelected = this.model.users.find(function (f) { return f.userProfileId == userId; });
            this.model.selectedUsers.push(optionSelected);
            this.f['selectedUsers'].patchValue(this.model.selectedUsers);
        }
        this.membersInput.nativeElement.value = '';
    };
    AddTaskInfoComponent.prototype.setTaskData = function () {
        this.isWorking = true;
        this.model.notes = this.f['notes'].value;
        this.model.estimatedDateVerficationString = this.f['estimatedDateVerficationString'].value;
        this.model.templateTaskDocumentDetailName = this.f['taskName'].value;
        if (this.action == 'new') {
            this.model.users = this.f['selectedUsers'].value;
            var templateTaskDoc = {
                name: this.model.templateTaskDocumentDetailName,
                templateTaskDocumentId: this.model.templateTaskDocumentId,
                required: false,
                position: this._getPosition(),
                estimatedDateVerficationString: this.model.estimatedDateVerficationString,
                usersAuthorize: this.model.selectedUsers.map(function (m) { return m.id; }),
                isPermanent: this.f['isPermanent'].value,
                entityId: this.projectType,
                projectId: this.model.projectId
            };
            this.confirmSave(templateTaskDoc);
        }
        else
            this.onNoClick(this.model);
    };
    AddTaskInfoComponent.prototype.onNoClick = function (task) {
        if (task === void 0) { task = undefined; }
        this.dialogRef.close(task);
    };
    AddTaskInfoComponent.prototype.confirmSave = function (task) {
        var _this = this;
        this.isWorking = true;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '500px',
            data: {
                text: this.translate.instant('messages.saveQuestion', { field: task.name }),
                action: this.translate.instant('general.save'),
                icon: 'save'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this._saveTaskApi(task);
                else
                    _this.isWorking = false;
            }
            else
                _this.isWorking = false;
        });
    };
    AddTaskInfoComponent.prototype._responseError = function (err) {
        console.log(err);
        this.isWorking = false;
    };
    AddTaskInfoComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        return this.model.users.filter(function (user) { return user.userProfileName.toLowerCase().indexOf(filterValue) === 0; });
    };
    AddTaskInfoComponent.prototype._getPosition = function () {
        var formPosition = parseInt(this.f['afterTo'].value);
        var position = this.model.position;
        return (formPosition)
            ? ++formPosition
            : position;
    };
    //#region API
    AddTaskInfoComponent.prototype._saveTaskApi = function (task) {
        var _this = this;
        this.isWorking = true;
        delete task.id;
        this.apiService.save(EEndpoints.TemplateTaskDocumentDetail, task).subscribe(function (response) {
            if (response.code == 100) {
                var result = response.result;
                _this.model.templateTaskDocumentDetailId = result.templateTaskDocumentId;
                _this.model.templateTaskDocumentDetailName = result.name;
                _this.model.templateTaskDocumentDetailId = result.id;
                _this.model.projectId = result.projectId;
                _this.model.position = result.position;
                _this.model.required = result.required;
                _this.model.isNew = true;
                _this.model.id = result.id;
                _this.onNoClick(_this.model);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
                _this.onNoClick(undefined);
            }
        }, function (err) { return _this._responseError(err); });
    };
    AddTaskInfoComponent.prototype._getUsersApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Users).subscribe(function (response) {
            if (response.code == 100) {
                _this.model.users = response.result.map(function (m) {
                    return {
                        active: true,
                        configurationTaskId: 0,
                        id: m.id,
                        userProfileAuthorized: true,
                        departmentId: m.departmentId,
                        userProfileId: m.id,
                        userProfileName: m.name + " " + m.lastName,
                        checked: true
                    };
                });
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddTaskInfoComponent.prototype._getProjectForAssign = function () {
        var _this = this;
        this.apiService.get(EEndpoints.ProjectsForAssign).subscribe(function (response) {
            console.log(response);
            if (response.code == 100)
                _this.availableProjects = response.result;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild('membersInput', { static: false }),
        __metadata("design:type", ElementRef)
    ], AddTaskInfoComponent.prototype, "membersInput", void 0);
    __decorate([
        ViewChild('auto', { static: false }),
        __metadata("design:type", MatAutocomplete)
    ], AddTaskInfoComponent.prototype, "matAutocomplete", void 0);
    AddTaskInfoComponent = __decorate([
        Component({
            selector: 'app-add-task-info',
            templateUrl: './add-task-info.component.html',
            styleUrls: ['./add-task-info.component.scss']
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            TranslateService,
            MatDialogRef,
            FuseTranslationLoaderService, Object, ApiService,
            MatDialog,
            ToasterService])
    ], AddTaskInfoComponent);
    return AddTaskInfoComponent;
}());
export { AddTaskInfoComponent };
//# sourceMappingURL=add-task-info.component.js.map