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
import { ECommentType } from '@enums/modules-types';
import { EModules } from '@enums/modules';
import { MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { EEndpoints } from '@enums/endpoints';
import { ModalPlanComponent } from './modal-plan/modal-plan.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MarketingPlanCompleteComponent } from '../marketing-plan-complete/marketing-plan-complete.component';
var CampainPlanComponent = /** @class */ (function () {
    function CampainPlanComponent(toaster, apiService, dialog, translationLoader) {
        this.toaster = toaster;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translationLoader = translationLoader;
        this.marketing = {};
        this.perm = {};
        this.marketingPlans = [];
        this.isWorking = false;
        this.isAllSelected = false;
        this.commentType = ECommentType;
        this.moduleType = EModules;
        this.unsubscribeAll = new Subject();
    }
    CampainPlanComponent.prototype.ngOnInit = function () {
        this.translationLoader.loadTranslationsList(allLang);
    };
    CampainPlanComponent.prototype.ngOnChanges = function (changes) {
        if (changes.marketing) {
            if (Object.keys(changes.marketing.currentValue).length > 0) {
                this._getMarketingPlanApi();
            }
        }
    };
    CampainPlanComponent.prototype.ngOnDestroy = function () {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    };
    CampainPlanComponent.prototype.trackByFn = function (index, item) {
        return (item.id) ? item.id : index;
    };
    CampainPlanComponent.prototype.drop = function (event) {
        moveItemInArray(this.marketingPlans, event.previousIndex, event.currentIndex);
        var params = this.marketingPlans.map(function (m, index) {
            return {
                id: m.id,
                TaskDocumentDetailId: m.taskDocumentDetailId,
                position: index + 1
            };
        });
        this._updatePositionPlan(params);
    };
    CampainPlanComponent.prototype.addData = function (action, row) {
        var _this = this;
        if (row === void 0) { row = {}; }
        this.isWorking = true;
        if (action == 'new') {
            row = {
                id: null,
                marketingId: this.marketing.id,
                taskDocumentDetailId: 0,
                position: this.marketingPlans.length + 1,
                notes: null,
                estimatedDateVerification: null,
                required: false,
                status: true,
                name: null,
                complete: false,
                estimatedDateVerificationString: null,
            };
        }
        var dialogRef = this.dialog.open(ModalPlanComponent, {
            width: '500px',
            data: {
                model: row,
                maxDate: (this.marketing.endDateString) ? this.marketing.endDateString : new Date(2120, 0, 1),
                minDate: this.marketing.startDateString,
                action: action,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.isWorking = false;
            if (!result)
                return;
            if (result.id) {
                result = _this._formatTaskProjectParams(result, false);
                _this._updateMarketingPlanApi(result);
            }
            else {
                result = _this._formatTaskProjectParams(result);
                _this._saveMarketingPlanApi(result);
            }
        });
    };
    CampainPlanComponent.prototype.getComments = function (task) {
        task.comments = !task.comments;
    };
    CampainPlanComponent.prototype._formatTaskProjectParams = function (task, deleteId) {
        if (deleteId === void 0) { deleteId = true; }
        if (deleteId)
            delete task.id;
        delete task.created;
        delete task.creator;
        delete task.estimatedDateVerfication;
        delete task.modified;
        delete task.modifier;
        delete task.isNew;
        delete task.comments;
        delete task.checked;
        return task;
    };
    CampainPlanComponent.prototype._formatUserAuthorizers = function (marketingPlanIdId, users) {
        if (users.length > 0)
            return users.map(function (m) {
                return {
                    marketingPlanId: marketingPlanIdId,
                    userVerificationId: m.id,
                    notes: null,
                };
            });
        return null;
    };
    CampainPlanComponent.prototype._responseError = function (err) {
        console.log(err);
        this.toaster.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    CampainPlanComponent.prototype.undoTask = function (task) {
        var params = {
            id: task.id,
            notes: '',
        };
        this.setUndoProjectTaskApi(params);
    };
    //#region API
    CampainPlanComponent.prototype.markAsComplete = function (task) {
        var _this = this;
        this.isWorking = true;
        var dialogRef = this.dialog.open(MarketingPlanCompleteComponent, {
            width: '500px',
            data: {
                model: task,
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeAll)).subscribe(function (result) {
            if (result) {
                _this._getMarketingPlanApi();
            }
        });
        this.isWorking = false;
    };
    CampainPlanComponent.prototype.setUndoProjectTaskApi = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingPlanUndoComplete, params).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this._getMarketingPlanApi();
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    CampainPlanComponent.prototype._getMarketingPlanApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MarketingPlans, { marketingId: this.marketing.id }).subscribe(function (response) {
            if (response.code == 100)
                _this.marketingPlans = response.result;
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    CampainPlanComponent.prototype._saveMarketingPlanApi = function (plan) {
        var _this = this;
        this.isWorking = true;
        var selectedUsers = plan['selectedUsers'];
        delete plan['selectedUsers'];
        this.apiService.save(EEndpoints.MarketingPlan, plan).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showTranslate('messages.itemSaved');
                if (selectedUsers)
                    _this._deleteMarketingPlanUsers(response.result.id, _this._formatUserAuthorizers(response.result.id, selectedUsers));
                _this._getMarketingPlanApi();
            }
            else {
                _this.isWorking = false;
                _this.toaster.showTranslate("errors.errorSavingItem");
            }
        }, function (err) { return _this._responseError(err); });
    };
    CampainPlanComponent.prototype._updateMarketingPlanApi = function (plan) {
        var _this = this;
        var selectedUsers = plan['selectedUsers'];
        delete plan['selectedUsers'];
        this.apiService.update(EEndpoints.MarketingPlan, plan).subscribe(function (response) {
            if (response.code == 100) {
                var index = _this.marketingPlans.findIndex(function (f) { return f.id == plan.id; });
                _this.marketingPlans.splice(index, 1, plan);
                if (selectedUsers)
                    _this._deleteMarketingPlanUsers(plan.id, _this._formatUserAuthorizers(plan.id, selectedUsers));
                else
                    _this.isWorking = false;
            }
            else {
                _this.isWorking = false;
                _this.toaster.showTranslate("errors.errorEditingItem");
            }
        }, function (err) { return _this._responseError(err); });
    };
    CampainPlanComponent.prototype._updatePositionPlan = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingPlanPosition, params).subscribe(function (response) {
            if (response.code != 100) {
                _this._getMarketingPlanApi();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    CampainPlanComponent.prototype._deleteMarketingPlanUsers = function (marketingPlanId, users) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MarketingPlanAutorizes, { marketingPlanId: marketingPlanId }).subscribe(function (response) {
            if (response.code == 100)
                _this._saveMarketingPlanUsers(users);
            else {
                _this.toaster.showTranslate('errors.errorSavingUsers');
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    CampainPlanComponent.prototype._saveMarketingPlanUsers = function (users) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingPlanAutorizes, users).subscribe(function (response) {
            if (response.code != 100)
                _this.toaster.showTranslate('errors.errorSavingUsers');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], CampainPlanComponent.prototype, "marketing", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], CampainPlanComponent.prototype, "perm", void 0);
    CampainPlanComponent = __decorate([
        Component({
            selector: 'app-campain-plan',
            templateUrl: './campain-plan.component.html',
            styleUrls: ['./campain-plan.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            FuseTranslationLoaderService])
    ], CampainPlanComponent);
    return CampainPlanComponent;
}());
export { CampainPlanComponent };
//# sourceMappingURL=campain-plan.component.js.map