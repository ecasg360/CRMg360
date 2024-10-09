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
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { startWith, map } from 'rxjs/operators';
var MemberFormComponent = /** @class */ (function () {
    function MemberFormComponent(formBuilder, translate, _fuseTranslationLoaderService, actionData, dialogRef, apiService) {
        this.formBuilder = formBuilder;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.actionData = actionData;
        this.dialogRef = dialogRef;
        this.apiService = apiService;
        this.person = {};
        this.member = {};
        this.mainActivities = [];
        this.musicalInstruments = [];
        this.addressList = [];
        this.id = 0;
        this.isWorking = true;
        this.question = '';
        this.mainActivityFC = new FormControl();
    }
    MemberFormComponent.prototype.ngOnInit = function () {
        var _a;
        this.getMainActivitiesApi();
        this.getMusicalInstrumentsApi();
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = this.actionData.id;
        if (this.id == 0) {
            this.titleAction = this.translate.instant('general.saveMembers');
            this.action = this.translate.instant('general.save');
        }
        else {
            this.titleAction = this.translate.instant('general.saveMembers');
            this.action = this.translate.instant('general.save');
            this.member = (this.actionData.model) ? this.actionData.model : {};
            this.person = this.member;
            this.pictureUrl = this.member.pictureUrl;
            this.getMemberMusicalInstruments(this.member.id);
        }
        this.isWorking = false;
        this.initForm();
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    };
    MemberFormComponent.prototype.initForm = function () {
        var startDateJoinedString = (this.member.startDateJoinedString)
            ? (new Date(this.member.startDateJoinedString)).toISOString() : null;
        var endDateJoinedString = (this.member.endDateJoinedString)
            ? (new Date(this.member.endDateJoinedString)).toISOString() : null;
        this.memberForm = this.formBuilder.group({
            mainActivityId: [this.member.mainActivityId, [
                    Validators.required
                ]],
            startDateJoinedString: [startDateJoinedString, [
                    Validators.required
                ]],
            endDateJoinedString: [endDateJoinedString, []],
            biography: [this.member.biography, []],
            musicalsInstruments: [this.member.musicalsInstruments]
        });
    };
    MemberFormComponent.prototype.bindExternalForm = function (name, form) {
        this.memberForm.setControl(name, form);
    };
    Object.defineProperty(MemberFormComponent.prototype, "f", {
        get: function () { return this.memberForm.controls; },
        enumerable: false,
        configurable: true
    });
    MemberFormComponent.prototype.getMainActivitiesApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.MainActivities).subscribe(function (response) {
            if (response.code == 100) {
                _this.mainActivities = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
            _this.filteredOptions = _this.mainActivityFC.valueChanges.pipe(startWith(''), map(function (value) { return _this._filter(value); }));
        }, function (err) { return _this.responseError(err); });
    };
    MemberFormComponent.prototype.getMusicalInstrumentsApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.MusicalInstruments).subscribe(function (response) {
            if (response.code == 100) {
                _this.musicalInstruments = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    MemberFormComponent.prototype.getMemberMusicalInstruments = function (personId) {
        var _this = this;
        this.apiService.get(EEndpoints.PersonMusicalInstruments, { personId: personId }).subscribe(function (data) {
            if (data.code == 100) {
                _this.member.musicalsInstruments = data.result.map(function (m) { return (m.musicalInstrumentId); });
                _this.memberForm.controls['musicalsInstruments'].patchValue(_this.member.musicalsInstruments);
            }
        }, function (err) { return _this.responseError(err); });
    };
    MemberFormComponent.prototype.setMember = function () {
        if (!this.memberForm.invalid) {
            this.isWorking = true;
            var formValues = this.memberForm.value;
            this.member = formValues.generalData;
            this.member.id = this.id;
            for (var key in formValues) {
                if (key != 'generalData') {
                    var value = formValues[key];
                    this.member[key] = value;
                }
            }
            this.member.addressList = this.addressList;
            console.log(this.member);
            this.dialogRef.close(this.member);
        }
    };
    MemberFormComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    MemberFormComponent.prototype.autocompleteOptionSelected = function ($event) {
        console.log($event);
        if ($event.option.id == '0') {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            var mainActivity = {
                name: newItem,
                description: ''
            };
            this._saveMainActivity(mainActivity);
        }
        else {
            this.f.mainActivityId.patchValue($event.option.id);
        }
    };
    MemberFormComponent.prototype._filter = function (value) {
        var filterValue = value ? value.toLowerCase() : '';
        var results = [];
        results = this.mainActivities.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (results.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + value.trim() + "\"?"
                }]
            : results;
    };
    //Imagen methods
    MemberFormComponent.prototype.receiveAddressData = function ($event) {
        this.addressList = $event;
    };
    MemberFormComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log('http error', err);
    };
    MemberFormComponent.prototype._saveMainActivity = function (model) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MainActivity, model).subscribe(function (response) {
            if (response.code == 100) {
                _this.mainActivities.push({
                    value: response.result.id,
                    viewValue: response.result.name
                });
                setTimeout(function () { return _this.mainActivityFC.setValue(response.result.name); });
                _this.f.mainActivityId.patchValue(response.result.id);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    MemberFormComponent = __decorate([
        Component({
            selector: 'app-member-form',
            templateUrl: './member-form.component.html',
            styleUrls: ['./member-form.component.scss'],
            providers: [{
                    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
                }]
        }),
        __param(3, Optional()),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            TranslateService,
            FuseTranslationLoaderService, Object, MatDialogRef,
            ApiService])
    ], MemberFormComponent);
    return MemberFormComponent;
}());
export { MemberFormComponent };
//# sourceMappingURL=member-form.component.js.map