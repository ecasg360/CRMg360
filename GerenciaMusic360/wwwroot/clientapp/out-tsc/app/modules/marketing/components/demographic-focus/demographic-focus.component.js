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
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Validators, FormBuilder } from '@angular/forms';
var DemographicFocusComponent = /** @class */ (function () {
    function DemographicFocusComponent(apiService, toaster, translationLoaderService, dialog, fb) {
        var _a;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translationLoaderService = translationLoaderService;
        this.dialog = dialog;
        this.fb = fb;
        this.perm = {};
        this.isWorking = false;
        this.showError = false;
        this.list = [];
        this.basePieChart = {
            // pie options
            legend: true,
            legendTitle: "Legend",
            legendPosition: 'right',
            explodeSlices: false,
            labels: true,
            showLegend: true,
            doughnut: true,
            gradient: false,
            scheme: {
                domain: ['#4fc3f7', '#e57373', '#f06292', '#ba68c8', '#7986cb', '#9575cd',
                    '#4dd0e1', '#4db6ac', '#81c784', '#dce775', '#ffb74d', '#7d818c',
                    '#f44336', '#9c27b0', '#03a9f4', '#e91e63', '#666666']
            },
            data: [],
        };
        this.displayedColumns = ['name', 'percentage', 'action'];
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    DemographicFocusComponent.prototype.ngOnInit = function () {
        this.demographicForm = this.fb.group({
            id: [null, []],
            marketingId: [this.marketingId, []],
            name: ['', [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(255)
                ]],
            percentage: [0, [
                    Validators.required
                ]]
        });
    };
    DemographicFocusComponent.prototype.ngOnChanges = function (changes) {
        if (changes.marketingId.currentValue) {
            this._getMarketingDemographics(this.marketingId);
        }
    };
    Object.defineProperty(DemographicFocusComponent.prototype, "f", {
        get: function () { return this.demographicForm.controls; },
        enumerable: false,
        configurable: true
    });
    DemographicFocusComponent.prototype.setFocus = function () {
        this.isWorking = true;
        var model = this.demographicForm.value;
        if (model.id) {
            var index = this.list.findIndex(function (f) { return f.id == model.id; });
            if (index >= 0) {
                this.list.splice(index, 1, model);
            }
        }
        else
            this.list.push(model);
        this._saveMarketingDemographics(this._formatData());
    };
    DemographicFocusComponent.prototype.delete = function (id) {
        var index = this.list.findIndex(function (f) { return f.id == id; });
        if (index >= 0) {
            this.list.splice(index, 1);
            this._saveMarketingDemographics(this._formatData());
        }
    };
    DemographicFocusComponent.prototype.edit = function (item) {
        this.demographicForm.setValue({
            id: item.id,
            name: item.name,
            percentage: item.percentage,
            marketingId: item.marketingId,
        });
    };
    DemographicFocusComponent.prototype._formatData = function () {
        var _this = this;
        return this.list.map(function (m) {
            return {
                name: m.name,
                percentage: m.percentage,
                marketingId: _this.marketingId,
            };
        });
    };
    DemographicFocusComponent.prototype._responseError = function (err) {
        console.log(err);
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    DemographicFocusComponent.prototype._getMarketingDemographics = function (marketingId) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MarketingDemographics, { marketingId: marketingId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.basePieChart.data = response.result.map(function (m) {
                    return {
                        name: m.name,
                        value: m.percentage
                    };
                });
                _this.list = response.result;
                _this.dataSource = new MatTableDataSource(_this.list);
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    DemographicFocusComponent.prototype._saveMarketingDemographics = function (data) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingDemographics, data).subscribe(function (response) {
            if (response.code == 100) {
                _this._getMarketingDemographics(_this.marketingId);
                _this.demographicForm.reset();
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.isWorking = false;
            }
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], DemographicFocusComponent.prototype, "marketingId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], DemographicFocusComponent.prototype, "perm", void 0);
    DemographicFocusComponent = __decorate([
        Component({
            selector: 'app-demographic-focus',
            templateUrl: './demographic-focus.component.html',
            styleUrls: ['./demographic-focus.component.scss'],
            animations: fuseAnimations
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            MatDialog,
            FormBuilder])
    ], DemographicFocusComponent);
    return DemographicFocusComponent;
}());
export { DemographicFocusComponent };
//# sourceMappingURL=demographic-focus.component.js.map