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
import { Component, Inject } from '@angular/core';
import { ApiService } from '@services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { EProjectStatusName } from '@enums/status';
var EventTaskComponent = /** @class */ (function () {
    function EventTaskComponent(apiService, dialogRef, data, fb, toaster, translate, translationLoader) {
        this.apiService = apiService;
        this.dialogRef = dialogRef;
        this.data = data;
        this.fb = fb;
        this.toaster = toaster;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.canBeSave = false;
        this.projectTask = {};
        this.isWorking = false;
    }
    EventTaskComponent.prototype.ngOnInit = function () {
        this.translationLoader.loadTranslationsList(allLang);
        this.event = this.data.event;
        this.initForm();
        this._getProjectTask(this.event.meta.projectTaskId);
    };
    EventTaskComponent.prototype.initForm = function () {
        this.eventTaskForm = this.fb.group({
            notes: [this.projectTask.notes, [
                    Validators.minLength(3),
                    Validators.maxLength(255)
                ]],
            completed: [false, []],
        });
    };
    Object.defineProperty(EventTaskComponent.prototype, "f", {
        get: function () { return this.eventTaskForm.controls; },
        enumerable: false,
        configurable: true
    });
    EventTaskComponent.prototype.CheckboxChange = function ($event) {
        this.canBeSave = $event.checked;
    };
    EventTaskComponent.prototype.completedTask = function () {
        var formValues = this.eventTaskForm.value;
        if (formValues.completed) {
            this._completedTask({ id: this.projectTask.id, notes: formValues.notes });
        }
        else {
            this._addNotesApi({ id: this.projectTask.id, notes: formValues.notes });
        }
    };
    EventTaskComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    EventTaskComponent.prototype._responseError = function (err) {
        console.log(err);
        this.isWorking = false;
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    };
    //#region API
    EventTaskComponent.prototype._getProjectTask = function (projectTaskId) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectTask, { id: projectTaskId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectTask = response.result;
                _this.f.notes.patchValue(_this.projectTask.notes);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.errorGettingProjectTask'));
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    EventTaskComponent.prototype._completedTask = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectTaskComplete, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.event.color = {
                    primary: EProjectStatusName.completed,
                    secondary: EProjectStatusName.completed
                };
                _this.onNoClick(_this.event);
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorSavingItem'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    EventTaskComponent.prototype._addNotesApi = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectTaskCommentary, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.event.meta.notes = params.notes;
                _this.onNoClick(_this.event);
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorSavingItem'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    EventTaskComponent = __decorate([
        Component({
            selector: 'app-event-task',
            templateUrl: './event-task.component.html',
            styleUrls: ['./event-task.component.scss']
        }),
        __param(2, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            MatDialogRef, Object, FormBuilder,
            ToasterService,
            TranslateService,
            FuseTranslationLoaderService])
    ], EventTaskComponent);
    return EventTaskComponent;
}());
export { EventTaskComponent };
//# sourceMappingURL=event-task.component.js.map