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
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { EEndpoints } from '@enums/endpoints';
import { startWith, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
var AddGoalComponent = /** @class */ (function () {
    function AddGoalComponent(fb, dialogRef, translationLoaderService, apiService, toaster, translate, data) {
        var _a;
        this.fb = fb;
        this.dialogRef = dialogRef;
        this.translationLoaderService = translationLoaderService;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translate = translate;
        this.data = data;
        this.model = {};
        this.isWorking = false;
        this.socialNetworksList = [];
        this.goalsList = [];
        this.question = "";
        this.goalsFC = new FormControl();
        this.activeSocial = 0;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    AddGoalComponent.prototype.ngOnInit = function () {
        this.model = this.data.model;
        if (this.model.id) {
            this.activeSocial = this.model.socialNetworkTypeId;
            this.goalsFC.patchValue(this.model.goalName);
        }
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
        this._getGoals();
        this._getSocialNetworkTypes();
        this._initForm();
    };
    AddGoalComponent.prototype._initForm = function () {
        this.goalsForm = this.fb.group({
            id: [this.model.id, []],
            goalId: [this.model.goalId, [Validators.required]],
            marketingId: [this.model.marketingId, [Validators.required,]],
            socialNetworkTypeId: [this.model.socialNetworkTypeId, [Validators.required]],
            audited: [this.model.audited, []],
            goalQuantity: [this.model.goalQuantity, [Validators.required]],
            overcome: [true, [Validators.required]],
        });
    };
    Object.defineProperty(AddGoalComponent.prototype, "f", {
        get: function () { return this.goalsForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddGoalComponent.prototype.addGoal = function () {
        this.model = this.goalsForm.value;
        if (!this.model.audited)
            this.model.audited = false;
        if (this.model.id)
            this._updateMarketingGoal(this.model);
        else {
            delete this.model.id;
            this._createMarketingGoal(this.model);
        }
    };
    AddGoalComponent.prototype.addSocialNetwork = function (item) {
        this.activeSocial = item.id;
        this.f.socialNetworkTypeId.patchValue(item.id);
    };
    AddGoalComponent.prototype.onNoClick = function (data) {
        if (data === void 0) { data = undefined; }
        this.dialogRef.close(data);
    };
    AddGoalComponent.prototype.autocompleteOptionSelected = function ($event) {
        if ($event.option.id == '0') {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            if (this.activeSocial == 0) {
            }
            var goal = {
                name: newItem,
                active: true
            };
            this._saveGoal(goal);
        }
        else {
            this.f.goalId.patchValue($event.option.id);
        }
    };
    AddGoalComponent.prototype.enter = function (evt) {
        var _this = this;
        var found = this.goalsList.find(function (f) { return f.name == _this.goalsFC.value; });
        if (found)
            this.f.goalId.patchValue(found.id);
        else {
            var goal = {
                name: this.goalsFC.value,
                active: true
            };
            this._saveGoal(goal);
        }
    };
    AddGoalComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        var results = [];
        results = this.goalsList.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
        return (results.length == 0)
            ? [{
                    id: 0,
                    name: "" + this.question + value.trim() + "\"?"
                }]
            : results;
    };
    AddGoalComponent.prototype._responseError = function (error) {
        this.toaster.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    //#region API
    AddGoalComponent.prototype._getSocialNetworkTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.SocialNetworkTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.socialNetworksList = response.result; //.filter(f => f.statusRecordId == 1);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    AddGoalComponent.prototype._getGoals = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Goals).subscribe(function (response) {
            if (response.code == 100) {
                _this.goalsList = response.result;
                _this.filteredOptions = _this.goalsFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddGoalComponent.prototype._saveGoal = function (goal) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.Goal, goal).subscribe(function (response) {
            if (response.code == 100) {
                _this.goalsList.push(response.result);
                setTimeout(function () { return _this.goalsFC.setValue(response.result.name); });
                _this.f.goalId.patchValue(response.result.id);
            }
            else
                _this.toaster.showTranslate('errors.errorSavingItem');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddGoalComponent.prototype._createMarketingGoal = function (goal) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingGoal, goal).subscribe(function (response) {
            if (response.code == 100) {
                _this.model = response.result;
                _this.onNoClick(_this.model);
            }
            else
                _this.toaster.showTranslate('errors.errorSavingItem');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddGoalComponent.prototype._updateMarketingGoal = function (goal) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.MarketingGoal, goal).subscribe(function (response) {
            if (response.code == 100)
                _this.onNoClick(_this.model);
            else
                _this.toaster.showTranslate('errors.errorEditingItem');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddGoalComponent = __decorate([
        Component({
            selector: 'app-add-goal',
            templateUrl: './add-goal.component.html',
            styleUrls: ['./add-goal.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            MatDialogRef,
            FuseTranslationLoaderService,
            ApiService,
            ToasterService,
            TranslateService, Object])
    ], AddGoalComponent);
    return AddGoalComponent;
}());
export { AddGoalComponent };
//# sourceMappingURL=add-goal.component.js.map