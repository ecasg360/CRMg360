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
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from "@services/api.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
var AddComposerComponent = /** @class */ (function () {
    function AddComposerComponent(dialogRef, apiService, toasterService, translate, formBuilder, translationLoaderService, actionData) {
        var _a;
        this.dialogRef = dialogRef;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.formBuilder = formBuilder;
        this.translationLoaderService = translationLoaderService;
        this.actionData = actionData;
        this.isWorking = false;
        this.composers = [];
        this.associations = [];
        this.workCollaborator = {};
        this.action = this.translate.instant('general.save');
        this.question = '';
        this.composerFC = new FormControl();
        this.associationFC = new FormControl();
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    AddComposerComponent.prototype.ngOnInit = function () {
        this.getComposers();
        this.getAssociations();
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
        this.workCollaborator = (this.actionData.workCollaborator) ? this.actionData.workCollaborator : {};
        this.subTitle = this.actionData.itemName;
        this.configureComposerForm();
    };
    AddComposerComponent.prototype.configureComposerForm = function () {
        this.composerForm = this.formBuilder.group({
            id: [this.workCollaborator.id | 0, []],
            workId: [this.workCollaborator.workId | 0, []],
            composerId: [this.workCollaborator.composerId | 0, [Validators.required]],
            associationId: [this.workCollaborator.associationId | 0],
            percentageRevenue: [this.workCollaborator.percentageRevenue | 0, [Validators.required]],
        });
    };
    AddComposerComponent.prototype._filter = function (value) {
        var filterValue = value ? value.toLowerCase() : '';
        var results = [];
        results = this.composers.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (results.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + value.trim() + "\"?",
                }]
            : results;
    };
    AddComposerComponent.prototype._filterAssociation = function (value) {
        var filterValue = value ? value.toLowerCase() : '';
        var results = [];
        results = this.associations.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (results.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + value.trim() + "\"?",
                }]
            : results;
    };
    AddComposerComponent.prototype.optionComposerSelected = function ($event) {
        if ($event.option.id == '0') {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            var composer = {
                id: 0,
                name: newItem,
                lastName: '',
            };
            this.saveComposer(composer);
        }
        else {
            this.composerForm.controls['composerId'].patchValue($event.option.id);
        }
    };
    AddComposerComponent.prototype.associationOptionSelected = function ($event) {
        if ($event.option.id == '0') {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            var association = {
                id: 0,
                name: newItem
            };
            this.saveAssociation(association);
        }
        else {
            this.composerForm.controls['associationId'].patchValue($event.option.id);
        }
    };
    AddComposerComponent.prototype.save = function () {
        if (this.composerForm.valid) {
            this.workCollaborator = this.composerForm.value;
            this.workCollaborator.composer = {
                id: this.workCollaborator.composerId,
                name: this.composerFC.value
            };
            this.workCollaborator.association = {
                id: this.workCollaborator.associationId,
                name: this.associationFC.value
            };
            this.onNoClick(this.workCollaborator);
        }
    };
    AddComposerComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddComposerComponent.prototype.onNoClick = function (workCollaborator) {
        if (workCollaborator === void 0) { workCollaborator = {}; }
        this.dialogRef.close(workCollaborator);
    };
    //#region API
    AddComposerComponent.prototype.getAssociations = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Associations)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.associations = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                _this.filteredAssociationOptions = _this.associationFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filterAssociation(value); }));
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddComposerComponent.prototype.getComposers = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ComposersProjectWork).subscribe(function (response) {
            if (response.code == 100)
                _this.composers = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name + " " + m.lastName + " ",
                    };
                });
            _this.filteredComposerOptions = _this.composerFC.valueChanges
                .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddComposerComponent.prototype.saveComposer = function (model) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.Composer, model).subscribe(function (data) {
            if (data.code == 100) {
                model.id = data.result;
                _this.composers.push({
                    value: model.id,
                    viewValue: model.name
                });
                _this.composerForm.controls['composerId'].patchValue(model.id);
                setTimeout(function () { return _this.composerFC.setValue(model.name); }, 500);
            }
            else {
                _this.toasterService.showTranslate('errors.errorSavingItem');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddComposerComponent.prototype.saveAssociation = function (model) {
        var _this = this;
        this.apiService.save(EEndpoints.Associations, model)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.associations.push({
                    value: response.result.id,
                    viewValue: response.result.name
                });
                _this.composerForm.controls['associationId'].patchValue(response.result.id);
                setTimeout(function () { return _this.associationFC.setValue(response.result.name); }, 500);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddComposerComponent = __decorate([
        Component({
            selector: 'app-add-composer',
            templateUrl: './add-composer.component.html',
            styleUrls: ['./add-composer.component.css']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ApiService,
            ToasterService,
            TranslateService,
            FormBuilder,
            FuseTranslationLoaderService, Object])
    ], AddComposerComponent);
    return AddComposerComponent;
}());
export { AddComposerComponent };
//# sourceMappingURL=add-composer.component.js.map