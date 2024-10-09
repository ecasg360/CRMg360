var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { EStartCenterType } from '@enums/start-center-type';
import { EProjectStatusName, EMarketingStatus, EContractStatus } from '@enums/status';
import { Router } from '@angular/router';
import { AccountService } from '@services/account.service';
var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(apiService, toaster, translate, translationLoader, accountService, router) {
        var _this = this;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.accountService = accountService;
        this.router = router;
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.retry = 0;
        this.baseBarChart = {
            // bar options
            showXAxis: true,
            showYAxis: true,
            gradient: false,
            showLegend: false,
            showXAxisLabel: false,
            showYAxisLabel: false,
            showDataLabel: false,
            roundEdges: false,
            colorScheme: {
                domain: ['#4fc3f7', '#e57373', '#f06292', '#ba68c8', '#7986cb', '#9575cd', '#4dd0e1', '#4db6ac', '#81c784', '#dce775', '#ffb74d', '#7d818c']
            },
            onSelect: function (ev, module) {
                var monthNumber = _this.getMonthNumber(ev.name);
                _this.router.navigate(["/" + module + "/list/" + monthNumber + "/" + 2019]);
            },
            realValue: null,
            data: []
        };
        this.baseBarChartProjects = {
            // bar options
            showXAxis: true,
            showYAxis: true,
            gradient: false,
            showLegend: false,
            showXAxisLabel: false,
            showYAxisLabel: false,
            showDataLabel: false,
            roundEdges: false,
            colorScheme: {
                domain: ['#4fc3f7', '#e57373', '#f06292', '#ba68c8', '#7986cb', '#9575cd', '#4dd0e1', '#4db6ac', '#81c784', '#dce775', '#ffb74d', '#7d818c']
            },
            onSelect: function (ev, module) {
                var monthNumber = _this.getMonthNumber(ev.name);
                _this.router.navigate(["/" + module + "/list/" + monthNumber + "/" + 2019]);
            },
            realValue: null,
            data: []
        };
        this.basePieChart = {
            // pie options
            legend: false,
            explodeSlices: false,
            labels: true,
            doughnut: true,
            gradient: false,
            scheme: {
                domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63']
            },
            realValue: null,
            data: [],
            onSelect: function (ev, module) {
                _this.router.navigate(["/" + module + "/list/" + ev.name.toLowerCase().replace(/ /g, '')]);
            },
        };
        this.projectBar = Object.assign({}, this.baseBarChartProjects);
        this.marketingBar = Object.assign({}, this.baseBarChart);
        this.contractBar = Object.assign({}, this.baseBarChart);
        this.projectPie = Object.assign({}, this.basePieChart);
        this.marketingPie = Object.assign({}, this.basePieChart);
        this.contractPie = Object.assign({}, this.basePieChart);
        this.projectList = [];
        this.contractList = [];
        this.marketingList = [];
        this.projectTypeList = [];
        this.currentUser = this.accountService.getLocalUserProfile();
        this.getConfigurationImageUser();
        this.projectPie.scheme = {
            domain: [EProjectStatusName.started, EProjectStatusName.waiting,
                EProjectStatusName.inProgress, EProjectStatusName.completed, EProjectStatusName.canceled]
        };
        this.marketingPie.scheme = {
            domain: [EMarketingStatus.active, EMarketingStatus.inactive,
                EMarketingStatus.Cancelled, EMarketingStatus.finalized]
        };
        this.contractPie.scheme = {
            domain: [EContractStatus.Created, EContractStatus.Send,
                EContractStatus.ReceivedbyGM360, EContractStatus.SignedbyGM360, EContractStatus.Cancelled]
        };
        this._getProjectsTypeApi();
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        var currentYear = (new Date()).getFullYear();
        this._getLast({ type: EStartCenterType.project });
        this._getLast({ type: EStartCenterType.marketing });
        this._getLast({ type: EStartCenterType.contract });
        this._getBarData({ type: EStartCenterType.project, year: currentYear });
        this._getBarData({ type: EStartCenterType.marketing, year: currentYear });
        this._getBarData({ type: EStartCenterType.contract, year: currentYear });
        this._getPieData({ type: EStartCenterType.project, year: currentYear });
        this._getPieData({ type: EStartCenterType.marketing, year: currentYear });
        this._getPieData({ type: EStartCenterType.contract, year: currentYear });
    };
    DashboardComponent.prototype._responseError = function (err) {
        console.log(err);
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    };
    DashboardComponent.prototype._formatLists = function (type, data) {
        var _this = this;
        if (type == EStartCenterType.project)
            this.projectList = data.map(function (m) {
                m.statusColor = m.status.replace(/ /g, '');
                var found = _this.projectTypeList.find(function (f) { return f.name == m.type.replace(/ /g, ''); });
                if (found) {
                    m.endDateLabel = _this.translate.instant((found.name == 'Event' || found.name == 'Artist Sale')
                        ? 'general.eventDay'
                        : 'general.releaseDate');
                }
                return m;
            });
        else if (type == EStartCenterType.marketing)
            this.marketingList = data.map(function (m) {
                m.statusColor = m.status.replace(/ /g, '');
                return m;
            });
        else
            this.contractList = data.map(function (m) {
                m.statusColor = m.status.replace(/ /g, '');
                return m;
            });
    };
    //#region API
    DashboardComponent.prototype._getProjectsTypeApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.ProjectTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectTypeList = response.result.map(function (m) {
                    m.name = m.name.replace(/ /g, '');
                    return m;
                });
            }
            else {
                _this.toaster.showToaster(response.message);
            }
        }, function (err) { return _this._responseError(err); });
    };
    DashboardComponent.prototype._getBarData = function (params) {
        var _this = this;
        this.apiService.get(EEndpoints.StartCenterOne, params).subscribe(function (response) {
            if (response.code == 100) {
                var data = response.result.map(function (m) {
                    return {
                        name: _this.translate.instant("general.month_" + m.order),
                        value: m.number,
                    };
                });
                if (params.type == EStartCenterType.project) {
                    _this.projectBar.data = data;
                }
                else if (params.type == EStartCenterType.marketing) {
                    _this.marketingBar.data = data;
                }
                else {
                    _this.contractBar.data = data;
                }
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
        }, function (err) { return _this._responseError(err); });
    };
    DashboardComponent.prototype._getPieData = function (params) {
        var _this = this;
        this.apiService.get(EEndpoints.StartCenterTwo, params).subscribe(function (response) {
            if (response.code == 100) {
                var data = response.result.map(function (m) {
                    return {
                        name: _this.translate.instant("general." + m.status.replace(/ /g, '')),
                        value: m.number
                    };
                });
                if (params.type == EStartCenterType.project)
                    _this.projectPie.data = data;
                else if (params.type == EStartCenterType.marketing)
                    _this.marketingPie.data = data;
                else
                    _this.contractPie.data = data;
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
        }, function (err) { return _this._responseError(err); });
    };
    DashboardComponent.prototype._getLast = function (params) {
        var _this = this;
        this.apiService.get(EEndpoints.StartCenterThree, params).subscribe(function (response) {
            if (response.code == 100)
                _this._formatLists(params.type, response.result);
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
        }, function (err) { return _this._responseError(err); });
    };
    DashboardComponent.prototype.getMonthNumber = function (month) {
        var index = this.months.indexOf(month);
        if (index == 0) {
            index = this.meses.indexOf(month);
        }
        return index;
    };
    DashboardComponent.prototype.getConfigurationImageUser = function () {
        var _this = this;
        var params = { userId: this.currentUser.id };
        this.apiService.get(EEndpoints.ConfigurationImagesByUser, params).subscribe(function (response) {
            if (response.code == 100 && response.result && response.result.pictureUrl) {
                _this.accountService.setDefaultImage(response.result.pictureUrl);
            }
            else {
                _this.accountService.clearDefaultImage();
            }
        }, function (err) { return _this._responseError(err); });
    };
    DashboardComponent = __decorate([
        Component({
            selector: 'app-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.scss'],
            animations: fuseAnimations
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            TranslateService,
            FuseTranslationLoaderService,
            AccountService,
            Router])
    ], DashboardComponent);
    return DashboardComponent;
}());
export { DashboardComponent };
//# sourceMappingURL=dashboard.component.js.map