var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ProjectBudgetModalComponent } from './project-budget-modal/project-budget-modal.component';
import { EEndpoints } from '@enums/endpoints';
import { ProjectBudgetDetailComponent } from './project-budget-detail/project-budget-detail.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { Subject } from 'rxjs';
import { ComponentsComunicationService } from '@services/components-comunication.service';
import { takeUntil } from 'rxjs/operators';
var ProjectBudgetComponent = /** @class */ (function () {
    function ProjectBudgetComponent(toaster, apiService, dialog, translate, translationLoader, comunicationService) {
        this.toaster = toaster;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.comunicationService = comunicationService;
        this.project = {};
        this.perm = {};
        this.isWorking = false;
        this.isEdit = false;
        this.availableBudget = 0;
        this.projectBudgetList = [];
        this.totalSpent = 0.0;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    ProjectBudgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.translationLoader.loadTranslationsList(allLang);
        this.comunicationService.getTravelLogisticBudget()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (response) {
            console.log(response);
            _this._getProjectBudget();
        });
    };
    ProjectBudgetComponent.prototype.ngOnChanges = function (changes) {
        if (changes.project) {
            if (Object.keys(changes.project.currentValue).length > 0) {
                this._getProjectBudget();
            }
        }
    };
    ProjectBudgetComponent.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    ProjectBudgetComponent.prototype.showModalBudget = function (budget) {
        var _this = this;
        if (budget === void 0) { budget = {}; }
        this.isWorking = true;
        var dialogRef = this.dialog.open(ProjectBudgetModalComponent, {
            width: '500px',
            data: {
                model: budget,
                projectId: this.project.id,
                projectTypeId: this.project.projectTypeId,
                budget: this.project.totalBudget,
                availableBudget: this.project.totalBudget,
                spent: 0,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result)
                _this._getProjectBudget();
        });
        this.isWorking = false;
    };
    ProjectBudgetComponent.prototype.showModalDetail = function (budget, detail) {
        var _this = this;
        if (detail === void 0) { detail = {}; }
        this.isWorking = true;
        var dialogRef = this.dialog.open(ProjectBudgetDetailComponent, {
            width: '500px',
            data: {
                budget: budget,
                budgetDetail: detail,
                projectTypeId: this.project.projectTypeId,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this._getProjectBudget();
            }
        });
        this.isWorking = false;
    };
    ProjectBudgetComponent.prototype.deleteBudget = function (budget) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: budget.category.name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this._deleteBudgetApi(budget.id);
            }
        });
    };
    ProjectBudgetComponent.prototype.deleteBudgetDetail = function (detail) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: detail.category.name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_2 = result.confirm;
                if (confirm_2)
                    _this._deleteBudgetDetailApi(detail.id);
            }
        });
    };
    ProjectBudgetComponent.prototype.downloadFile = function () {
        var _this = this;
        this.isWorking = true;
        var projectId = this.project.id;
        this.apiService.download(EEndpoints.ProjectBudgetDownload, { projectId: projectId })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (fileData) {
            var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "ProjectBudget Proyecto");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectBudgetComponent.prototype._responseError = function (err) {
        this.isWorking = false;
        console.log(err);
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    };
    //#region API
    ProjectBudgetComponent.prototype._getProjectBudget = function () {
        var _this = this;
        this.isWorking = true;
        this.totalSpent = 0.0;
        this.apiService.get(EEndpoints.ProjectBudgets, { projectId: this.project.id })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.projectBudgetList = response.result.map(function (m) {
                    m['saldo'] = m.budget - m.spent;
                    return m;
                });
                if (response.result.length == 0) {
                    _this._getConfigurationBudget();
                }
                _this.projectBudgetList.forEach(function (element) {
                    _this.totalSpent += element.spent;
                });
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorGettingBudgets'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectBudgetComponent.prototype._deleteBudgetApi = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.ProjectBudget, { id: id })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.projectBudgetList = _this.projectBudgetList.filter(function (f) { return f.id != id; });
                _this._getProjectBudget();
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.errorDeletingItem'));
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectBudgetComponent.prototype._deleteBudgetDetailApi = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.ProjectBudgetDetail, { id: id })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (response) {
            if (response.code == 100)
                _this._getProjectBudget();
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorDeletingItem'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectBudgetComponent.prototype._getConfigurationBudget = function () {
        var _this = this;
        this.apiService.get(EEndpoints.ConfigurationPBudgetCategory, { projectTypeId: this.project.projectTypeId })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (response) {
            console.log(response);
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectBudgetComponent.prototype, "project", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectBudgetComponent.prototype, "perm", void 0);
    ProjectBudgetComponent = __decorate([
        Component({
            selector: 'app-project-budget',
            templateUrl: './project-budget.component.html',
            styleUrls: ['./project-budget.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService,
            ComponentsComunicationService])
    ], ProjectBudgetComponent);
    return ProjectBudgetComponent;
}());
export { ProjectBudgetComponent };
//# sourceMappingURL=project-budget.component.js.map