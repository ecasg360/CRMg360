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
import { Component, Optional, Inject } from '@angular/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ePersonType } from '@enums/person-type';
import { startWith, map } from 'rxjs/operators';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ELabelCopyType } from '@enums/types';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddContactComponent } from '@shared/components/add-contact/add-contact.component';
var ProjectLabelCopyModalComponent = /** @class */ (function () {
    function ProjectLabelCopyModalComponent(apiService, toaster, translate, fb, dialog, actionData, dialogRef) {
        this.apiService = apiService;
        this.toaster = toaster;
        this.translate = translate;
        this.fb = fb;
        this.dialog = dialog;
        this.actionData = actionData;
        this.dialogRef = dialogRef;
        this.isWorking = false;
        this.enginnerList = [];
        this.recordingEngineerFC = new FormControl();
        this.question = "";
        this.labelCopyType = ELabelCopyType;
        this.producers = [];
    }
    ProjectLabelCopyModalComponent.prototype.ngOnInit = function () {
        console.log('input project: ', this.actionData.projectId);
        console.log('input producers: ', this.actionData.producers);
        this.projectId = this.actionData.projectId;
        this.producers = this.actionData.producers;
        this.configureForm();
        this._getEnginnerApi();
    };
    ProjectLabelCopyModalComponent.prototype.configureForm = function () {
        this.formLabelCopy = this.fb.group({
            personRecordingEngineerId: [null, [Validators.required]],
        });
    };
    ProjectLabelCopyModalComponent.prototype._getEnginnerApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectContactsByType, { personTypeId: ePersonType.IngenieroGrabacion }).subscribe(function (response) {
            if (response.code == 100) {
                _this.enginnerList = response.result.map(function (m) { return ({ value: m.id, viewValue: m.name + " " + m.lastName }); });
                _this.recordingEngineerFiltered = _this.recordingEngineerFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter(value, _this.enginnerList); }));
                //this._populateAutocompleteFC();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.serverError'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectLabelCopyModalComponent.prototype._filter = function (value, list) {
        var filterValue = value.toLowerCase();
        var result = list.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (result.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + value.trim() + "\"?"
                }]
            : result;
    };
    ProjectLabelCopyModalComponent.prototype._responseError = function (err) {
        console.log(err);
        this.isWorking = false;
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    };
    ProjectLabelCopyModalComponent.prototype.autocompleteOptionSelected = function ($event, type) {
        if ($event.option.id != '0') {
            this.f.personRecordingEngineerId.patchValue($event.option.id);
        }
        else {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            this._contactModal(newItem, ePersonType.IngenieroGrabacion, type);
        }
    };
    ProjectLabelCopyModalComponent.prototype._contactModal = function (value, contactType, type) {
        var _this = this;
        var model = {
            name: value
        };
        var dialogRef = this.dialog.open(AddContactComponent, {
            width: '1000px',
            data: {
                id: 0,
                model: model,
                projectId: this.projectId,
                personTypeId: contactType,
                showSelectType: false,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (type == ELabelCopyType.recordingEngineer) {
                if (result != undefined) {
                    _this.enginnerList.push({ value: result.id, viewValue: result.name + " " + result.lastName });
                    _this.f.personRecordingEngineerId.patchValue(result.id);
                    setTimeout(function () { return _this.recordingEngineerFC.setValue(result.name + " " + result.lastName); });
                }
                else
                    _this.recordingEngineerFC.patchValue('');
            }
        });
    };
    ProjectLabelCopyModalComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    ProjectLabelCopyModalComponent.prototype.selectContact = function () {
        this.dialogRef.close(this.formLabelCopy.controls.personRecordingEngineerId.value);
    };
    Object.defineProperty(ProjectLabelCopyModalComponent.prototype, "f", {
        get: function () { return this.formLabelCopy.controls; },
        enumerable: false,
        configurable: true
    });
    ProjectLabelCopyModalComponent = __decorate([
        Component({
            selector: 'app-project-label-copy-modal',
            templateUrl: './project-label-copy-modal.component.html',
            styleUrls: ['./project-label-copy-modal.component.scss']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            TranslateService,
            FormBuilder,
            MatDialog, Object, MatDialogRef])
    ], ProjectLabelCopyModalComponent);
    return ProjectLabelCopyModalComponent;
}());
export { ProjectLabelCopyModalComponent };
//# sourceMappingURL=project-label-copy-modal.component.js.map