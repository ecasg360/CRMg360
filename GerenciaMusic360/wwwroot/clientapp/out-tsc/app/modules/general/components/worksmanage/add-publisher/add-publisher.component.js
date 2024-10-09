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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { startWith, map } from 'rxjs/operators';
var AddPublisherComponent = /** @class */ (function () {
    function AddPublisherComponent(dialogRef, apiService, toasterService, translate, formBuilder, translationLoaderService, actionData) {
        var _a;
        this.dialogRef = dialogRef;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.formBuilder = formBuilder;
        this.translationLoaderService = translationLoaderService;
        this.actionData = actionData;
        this.isWorking = false;
        this.publishers = [];
        this.associations = [];
        this.workPublisher = {};
        this.action = this.translate.instant('general.save');
        this.question = '';
        this.publisherFC = new FormControl();
        this.associationFC = new FormControl();
        this.isNewItem = false;
        this.newcomposerInfo = null;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    AddPublisherComponent.prototype.ngOnInit = function () {
        this.getPublishers();
        this.getAssociations();
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
        this.workPublisher = (this.actionData.workPublisher) ? this.actionData.workPublisher : {};
        this.subTitle = this.actionData.itemName;
        this.configurePublisherForm();
    };
    AddPublisherComponent.prototype.configurePublisherForm = function () {
        this.composerForm = this.formBuilder.group({
            id: [this.workPublisher.id | 0, []],
            workId: [this.workPublisher.workId | 0, []],
            publisherId: [this.workPublisher.publisherId | 0, [Validators.required]],
            associationId: [this.workPublisher.associationId | 0],
            percentageRevenue: [this.workPublisher.percentageRevenue | 0, [Validators.required]],
        });
    };
    AddPublisherComponent.prototype._filter = function (value) {
        var filterValue = value ? value.toLowerCase() : '';
        var results = [];
        results = this.publishers.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (results.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + value.trim() + "\"?",
                }]
            : results;
    };
    AddPublisherComponent.prototype._filterAssociation = function (value) {
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
    AddPublisherComponent.prototype.optionPublisherSelected = function ($event) {
        if ($event.option.id == '0') {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            var composer = {
                id: 0,
                name: newItem,
                lastName: '',
            };
            this.newcomposerInfo = {
                id: 0,
                name: newItem,
                lastName: ''
            };
            this.savePublisher(composer);
            this.isNewItem = true;
        }
        else {
            this.isNewItem = false;
            this.newcomposerInfo = null;
            this.composerForm.controls['publisherId'].patchValue($event.option.id);
        }
    };
    AddPublisherComponent.prototype.associationOptionSelected = function ($event) {
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
    AddPublisherComponent.prototype.save = function () {
        if (this.composerForm.valid) {
            this.workPublisher = this.composerForm.value;
            this.workPublisher.publisher = {
                id: this.workPublisher.publisherId,
                name: this.publisherFC.value
            };
            this.workPublisher.association = {
                id: this.workPublisher.associationId,
                name: this.associationFC.value
            };
            console.log('isNewItem: ', this.isNewItem);
            console.log('this.composerForm.controls: ', this.composerForm.controls);
            if (this.isNewItem) {
                var composer = {
                    id: this.newcomposerInfo.id,
                    name: this.newcomposerInfo.name,
                    lastName: '',
                    associationId: this.composerForm.controls.associationId.value
                };
                this.updatePublisher(composer);
            }
            this.onNoClick(this.workPublisher);
        }
    };
    AddPublisherComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddPublisherComponent.prototype.onNoClick = function (workPublisher) {
        if (workPublisher === void 0) { workPublisher = {}; }
        this.dialogRef.close(workPublisher);
    };
    //#region API
    AddPublisherComponent.prototype.getAssociations = function () {
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
    AddPublisherComponent.prototype.getPublishers = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.publisher).subscribe(function (response) {
            if (response.code == 100)
                _this.publishers = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: "" + m.name,
                    };
                });
            _this.filteredPublisherOptions = _this.publisherFC.valueChanges
                .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddPublisherComponent.prototype.savePublisher = function (model) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.publisher, model).subscribe(function (data) {
            if (data.code == 100) {
                model = data.result;
                _this.publishers.push({
                    value: model.id,
                    viewValue: model.name
                });
                _this.newcomposerInfo.id = model.id;
                _this.composerForm.controls['publisherId'].patchValue(model.id);
                setTimeout(function () { return _this.publisherFC.setValue(model.name); }, 500);
            }
            else {
                _this.toasterService.showTranslate('errors.errorSavingItem');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddPublisherComponent.prototype.saveAssociation = function (model) {
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
    //#endregion
    AddPublisherComponent.prototype.updatePublisher = function (model) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.publisher, model).subscribe(function (data) {
            if (data.code == 100) {
                console.log('data en updatePublisher: ', data);
            }
            else {
                _this.toasterService.showTranslate('errors.errorSavingItem');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddPublisherComponent = __decorate([
        Component({
            selector: 'app-add-publisher',
            templateUrl: './add-publisher.component.html',
            styleUrls: ['./add-publisher.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ApiService,
            ToasterService,
            TranslateService,
            FormBuilder,
            FuseTranslationLoaderService, Object])
    ], AddPublisherComponent);
    return AddPublisherComponent;
}());
export { AddPublisherComponent };
//# sourceMappingURL=add-publisher.component.js.map