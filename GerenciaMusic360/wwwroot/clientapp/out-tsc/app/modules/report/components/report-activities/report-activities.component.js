var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { Subject } from 'rxjs';
import { EEndpoints } from '@enums/endpoints';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { allLang } from '@i18n/allLang';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatAutocomplete } from '@angular/material';
var ReportActivitiesComponent = /** @class */ (function () {
    function ReportActivitiesComponent(toaster, translate, translationLoader, apiService, fb) {
        var _a;
        this.toaster = toaster;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.apiService = apiService;
        this.fb = fb;
        this._unsubscribeAll = new Subject();
        this.isWorking = false;
        this.usersList = [];
        this.selectedUser = [];
        this.availableUsers = [];
        this.moduleType = [];
        this.activities = [];
        this.visible = true;
        this.selectable = true;
        this.removable = true;
        this.addOnBlur = true;
        this.separatorKeysCodes = [ENTER, COMMA];
        this.userCtrl = new FormControl();
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        this.moduleType = [
            { value: 1, viewValue: this.translate.instant('projects') },
            { value: 2, viewValue: this.translate.instant('marketing') },
            { value: 3, viewValue: this.translate.instant('works') },
        ];
        this.activities = [
            { value: 1, viewValue: this.translate.instant('all') },
            { value: 2, viewValue: this.translate.instant('last') },
            { value: 3, viewValue: this.translate.instant('pending') },
        ];
        this._getUsers();
    }
    ReportActivitiesComponent.prototype.ngOnInit = function () {
        this.activityForm = this.fb.group({
            type: [null, [Validators.required]],
            ActivityType: [null, [Validators.required]],
            users: [null, [Validators.required]],
        });
    };
    ReportActivitiesComponent.prototype.ngOnDestroy = function () {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    Object.defineProperty(ReportActivitiesComponent.prototype, "f", {
        get: function () { return this.activityForm.controls; },
        enumerable: false,
        configurable: true
    });
    ReportActivitiesComponent.prototype.remove = function (user) {
        var index = this.selectedUser.findIndex(function (f) { return f.value == user.value; });
        if (index >= 0) {
            this.selectedUser.splice(index, 1);
            this.availableUsers.push(user);
            this.availableUsers.slice();
            this.f.users.patchValue(this.selectedUser);
        }
    };
    ReportActivitiesComponent.prototype.selected = function (event) {
        var id = parseInt(event.option.id);
        if (id == 0) {
            this.selectedUser = this.usersList;
            this.availableUsers = this.availableUsers.filter(function (f) { return f.value == 0; });
        }
        else {
            var found = this.usersList.find(function (f) { return f.value == id; });
            this.selectedUser.push(found);
            this.availableUsers = this.availableUsers.filter(function (f) { return f.value != id; });
        }
        this.availableUsers.slice();
        this.f.users.patchValue(this.selectedUser);
        this.userCtrl.setValue('');
        this.userCtrl.patchValue('');
        this.userInput.nativeElement.value = '';
    };
    ReportActivitiesComponent.prototype.getReport = function () {
        var users = this.selectedUser.map(function (m) {
            return m.value;
        });
        var params = {
            activityType: this.f.ActivityType.value,
            users: users.join(',')
        };
        if (this.f.type.value == 1)
            this._downloadReport(EEndpoints.ActivityReportProject, params, "activity_project_report");
        else if (this.f.type.value == 2)
            this._downloadReport(EEndpoints.ActivityReportMarketing, params, "activity_marketing_report");
        this.resetForm();
    };
    ReportActivitiesComponent.prototype.resetForm = function () {
        this.activityForm.reset();
        this.availableUsers = this.usersList;
        this.availableUsers.unshift({
            value: 0,
            viewValue: this.translate.instant('all'),
        });
        this.selectedUser = [];
    };
    ReportActivitiesComponent.prototype._responseError = function (error) {
        this.toaster.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    ReportActivitiesComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        return this.availableUsers.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
    };
    //#region API
    ReportActivitiesComponent.prototype._getUsers = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Users)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                var users = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name + " " + m.lastName
                    };
                });
                _this.availableUsers = users;
                _this.usersList = Object.assign([], users);
                _this.availableUsers.unshift({
                    value: 0,
                    viewValue: _this.translate.instant('all'),
                });
                _this.filteredUsers = _this.userCtrl.valueChanges.pipe(startWith(''), map(function (user) { return user ? _this._filter(user) : _this.availableUsers.slice(); }));
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ReportActivitiesComponent.prototype._downloadReport = function (endpoint, params, reportName) {
        var _this = this;
        if (reportName === void 0) { reportName = "activity_report"; }
        this.isWorking = true;
        this.apiService.download(endpoint, params).subscribe(function (fileData) {
            var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", reportName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild('userInput', { static: false }),
        __metadata("design:type", ElementRef)
    ], ReportActivitiesComponent.prototype, "userInput", void 0);
    __decorate([
        ViewChild('auto', { static: false }),
        __metadata("design:type", MatAutocomplete)
    ], ReportActivitiesComponent.prototype, "matAutocomplete", void 0);
    ReportActivitiesComponent = __decorate([
        Component({
            selector: 'app-report-activities',
            templateUrl: './report-activities.component.html',
            styleUrls: ['./report-activities.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            TranslateService,
            FuseTranslationLoaderService,
            ApiService,
            FormBuilder])
    ], ReportActivitiesComponent);
    return ReportActivitiesComponent;
}());
export { ReportActivitiesComponent };
//# sourceMappingURL=report-activities.component.js.map