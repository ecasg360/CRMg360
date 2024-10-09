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
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { AddGoalComponent } from './add-goal/add-goal.component';
import { EEndpoints } from '@enums/endpoints';
import { GoalAuditModalComponent } from '../goal-audit-modal/goal-audit-modal.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
var GoalsComponent = /** @class */ (function () {
    function GoalsComponent(toaster, apiService, translate, dialog, translationLoader) {
        this.toaster = toaster;
        this.apiService = apiService;
        this.translate = translate;
        this.dialog = dialog;
        this.translationLoader = translationLoader;
        this.marketing = {};
        this.perm = {};
        this.isWorking = false;
        this.marketingGoalsList = [];
    }
    GoalsComponent.prototype.ngOnInit = function () {
        this.translationLoader.loadTranslationsList(allLang);
    };
    GoalsComponent.prototype.ngOnChanges = function (changes) {
        if (changes.marketing.currentValue.id)
            this._getMarketingGoals();
    };
    GoalsComponent.prototype.showModal = function (item) {
        var _this = this;
        if (item === void 0) { item = {}; }
        if (!item.id) {
            item.marketingId = this.marketing.id;
        }
        var dialogRef = this.dialog.open(AddGoalComponent, {
            width: '700px',
            data: {
                model: item,
                marketingId: this.marketing.id,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (!result)
                return;
            _this._getMarketingGoals();
        });
    };
    GoalsComponent.prototype.showAuditModal = function () {
        var requiredGoals = this.marketingGoalsList.filter(function (f) { return f.socialNetworkName.toLowerCase().indexOf('facebook') >= 0 || f.socialNetworkName.toLowerCase().indexOf('instagram') >= 0; });
        if (requiredGoals.length != 2) {
            this.toaster.showTranslate('messages.mustSocial');
            return;
        }
        var dialogRef = this.dialog.open(GoalAuditModalComponent, {
            width: '900px',
            data: {
                marketing: this.marketing,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (!result)
                return;
        });
    };
    GoalsComponent.prototype.deleteGoal = function (goal) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: goal.goalName }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1) {
                    _this._deleteGoal(goal.id);
                }
            }
        });
    };
    GoalsComponent.prototype._responseError = function (error) {
        this.toaster.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    //#region API
    GoalsComponent.prototype._getMarketingGoals = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MarketingGoals, { marketingId: this.marketing.id }).subscribe(function (response) {
            if (response.code == 100)
                _this.marketingGoalsList = response.result;
            else
                _this.toaster.showTranslate('errors.errorGettingItems');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    GoalsComponent.prototype._deleteGoal = function (id) {
        var _this = this;
        this.apiService.delete(EEndpoints.MarketingGoal, { id: id }).subscribe(function (response) {
            _this._getMarketingGoals();
        }, function (err) { return _this._responseError(err); }, function () { console.log('finish'); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], GoalsComponent.prototype, "marketing", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], GoalsComponent.prototype, "perm", void 0);
    GoalsComponent = __decorate([
        Component({
            selector: 'app-goals',
            templateUrl: './goals.component.html',
            styleUrls: ['./goals.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            TranslateService,
            MatDialog,
            FuseTranslationLoaderService])
    ], GoalsComponent);
    return GoalsComponent;
}());
export { GoalsComponent };
//# sourceMappingURL=goals.component.js.map