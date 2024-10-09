var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
var ContractFormComponent = /** @class */ (function () {
    function ContractFormComponent(apiService, toaster, fb, translate, translationLoaderService) {
        var _a;
        this.apiService = apiService;
        this.toaster = toaster;
        this.fb = fb;
        this.translate = translate;
        this.translationLoaderService = translationLoaderService;
        this.contract = {};
        this.formReady = new EventEmitter();
        this.formWorking = new EventEmitter();
        this.times = [];
        this.currencies = [];
        this.projects = [];
        this.projectsTask = [];
        this.showHasAmountOptions = false;
        this.projectFC = new FormControl();
        this.projectTaskFC = new FormControl();
        this.initDate = new Date(2000, 0, 1);
        this.endDate = new Date(2220, 0, 1);
        this._unsubscribeAll = new Subject();
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.contractForm = this.fb.group({});
        this._getProjects();
    }
    Object.defineProperty(ContractFormComponent.prototype, "isWorking", {
        get: function () {
            return this._isWorking;
        },
        set: function (v) {
            this._isWorking = v;
            this._manageFormStates();
        },
        enumerable: false,
        configurable: true
    });
    ContractFormComponent.prototype.ngOnInit = function () {
        this.configureForm();
    };
    ContractFormComponent.prototype.ngOnChanges = function (changes) {
    };
    ContractFormComponent.prototype.ngOnDestroy = function () {
        this.formReady.complete();
        this.formWorking.complete();
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    ContractFormComponent.prototype.configureForm = function () {
        var startDate = (this.contract.startDate)
            ? (new Date(this.contract.startDate)).toISOString()
            : null;
        var endDate = (this.contract.endDate)
            ? (new Date(this.contract.endDate)).toISOString()
            : null;
        this.contract.hasAmount = !this.contract.hasAmount ? false : true;
        this.initDateLabel = this.translate.instant('general.initialDate');
        this.endDateLabel = this.translate.instant('general.endDate');
        this.contractForm = this.fb.group({
            id: [this.contract.id, []],
            startDate: [startDate, [Validators.required]],
            endDate: [endDate, [Validators.required]],
            name: [this.contract.name, [Validators.required]],
            description: [this.contract.description, []],
            timeId: [this.contract.timeId, [Validators.required]],
            currencyId: [this.contract.currencyId, []],
            localCompanyId: [this.contract.localCompanyId, []],
            localCompanyName: [this.contract.localCompany ? this.contract.localCompany.name : null, []],
            contractStatusId: [this.contract.contractStatusId, []],
            hasAmount: [this.contract.hasAmount, []],
            amount: [this.contract.amount, []],
            contractTypeId: [this.contract.contractTypeId, []],
            fileId: [this.contract.fileId, []],
            projectTaskId: [this.contract.projectTaskId, []],
            projectId: [this.contract.projectId, []],
        });
        this.showHasAmountOptions = this.contract.hasAmount;
        this._manageAmountFields(this.contract.hasAmount);
        this._manageDateLabel();
        this.formReady.emit(this.contractForm);
    };
    Object.defineProperty(ContractFormComponent.prototype, "f", {
        get: function () { return this.contractForm.controls; },
        enumerable: false,
        configurable: true
    });
    ContractFormComponent.prototype.checkedHasAmount = function ($event) {
        this.showHasAmountOptions = $event.checked;
        this._manageAmountFields($event.checked);
    };
    ContractFormComponent.prototype.dateChangeEvent = function (type, event) {
        if (type == 'start') {
            if (event.value) {
                this.initDate = new Date(event.value);
                this.f['endDate'].enable();
            }
            else {
                this.f['endDate'].disable();
            }
        }
        else {
            if (event.value) {
                this.endDate = new Date(event.value);
            }
        }
    };
    ContractFormComponent.prototype.auSelected = function ($event) {
        this.f.projectId.patchValue($event.option.id);
        this._getProjectTasks(parseInt($event.option.id));
        this.f.projectTaskId.patchValue(null);
        this.projectTaskFC.setValue(null);
    };
    ContractFormComponent.prototype.auSelectedTask = function ($event) {
        this.f.projectTaskId.patchValue($event.option.id);
    };
    ContractFormComponent.prototype.auClosed = function (type) {
        if (type == 'project' && !this.projectFC.value) {
            this.f.projectId.patchValue(null);
            this.f.projectTaskId.patchValue(null);
            this.projectTaskFC.setValue(null);
        }
        if (type == 'task' && !this.projectTaskFC.value)
            this.f.projectTaskId.patchValue(null);
    };
    ContractFormComponent.prototype._manageFormStates = function () {
        if (this.isWorking)
            this.contractForm.disable();
        else
            this.contractForm.enable();
        this.formWorking.emit(this.isWorking);
    };
    ContractFormComponent.prototype._manageAmountFields = function (isActive) {
        if (isActive) {
            this.f.amount.setValidators([Validators.required]);
            this.f.currencyId.setValidators([Validators.required]);
            this.f.timeId.setValidators([Validators.required]);
        }
        else {
            this.f.amount.clearValidators();
            this.f.currencyId.clearValidators();
            this.f.timeId.clearValidators();
        }
        this.contractForm.updateValueAndValidity();
    };
    ContractFormComponent.prototype._filter = function (value, type) {
        if (type === void 0) { type = "project"; }
        var filterValue = value == null ? value : '';
        if (type == "project") {
            return this.projects.length > 0
                ? this.projects.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue.toLowerCase()); })
                : [];
        }
        else {
            return (this.projectsTask.length > 0)
                ? this.projectsTask.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue.toLowerCase()); })
                : [];
        }
    };
    ContractFormComponent.prototype._manageDateLabel = function () {
        var _this = this;
        this.f.contractTypeId.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(function (value) {
            if (value == 3) {
                _this.initDateLabel = _this.translate.instant('general.date');
                _this.endDateLabel = _this.translate.instant('general.contractSigningDate');
            }
            else {
                _this.initDateLabel = _this.translate.instant('general.initialDate');
                _this.endDateLabel = _this.translate.instant('general.endDate');
            }
        });
    };
    ContractFormComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    };
    //#region API
    ContractFormComponent.prototype._getCurrency = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Currencies)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.currencies = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.description
                }); });
                _this._getTime();
            }
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ContractFormComponent.prototype._getTime = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.TimesByModule, { moduleId: 2 }).pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.times = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ContractFormComponent.prototype._getProjects = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectsActive).pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.projects = response.result.map(function (m) { return ({
                    value: m.id,
                    viewValue: m.name
                }); });
                _this.isWorking = false;
                _this._getCurrency();
                _this.filteredOptions = _this.projectFC.valueChanges.pipe(startWith(''), map(function (value) { return _this._filter(value); }));
                if (_this.projects.length > 0 && _this.contract.projectId) {
                    var found_1 = _this.projects.find(function (f) { return f.value == _this.contract.projectId; });
                    if (found_1) {
                        setTimeout(function () { _this.projectFC.setValue(found_1.viewValue); });
                        _this._getProjectTasks(_this.contract.projectId);
                    }
                }
            }
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ContractFormComponent.prototype._getProjectTasks = function (projectId) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectTasksActive, { projectId: projectId }).pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectsTask = response.result.map(function (m) { return ({
                    value: m.id,
                    viewValue: m.templateTaskDocumentDetailName
                }); });
                _this.filteredOptionsTask = _this.projectTaskFC.valueChanges.pipe(startWith(''), map(function (value) { return _this._filter(value, "task"); }));
                if (_this.projectsTask.length > 0 && _this.contract.projectTaskId) {
                    var found_2 = _this.projectsTask.find(function (f) { return f.value == _this.contract.projectTaskId; });
                    if (found_2) {
                        setTimeout(function () { _this.projectTaskFC.setValue(found_2.viewValue); });
                    }
                }
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ContractFormComponent.prototype, "contract", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ContractFormComponent.prototype, "formReady", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ContractFormComponent.prototype, "formWorking", void 0);
    ContractFormComponent = __decorate([
        Component({
            selector: 'app-contract-form',
            templateUrl: './contract-form.component.html',
            styleUrls: ['./contract-form.component.scss']
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FormBuilder,
            TranslateService,
            FuseTranslationLoaderService])
    ], ContractFormComponent);
    return ContractFormComponent;
}());
export { ContractFormComponent };
//# sourceMappingURL=contract-form.component.js.map