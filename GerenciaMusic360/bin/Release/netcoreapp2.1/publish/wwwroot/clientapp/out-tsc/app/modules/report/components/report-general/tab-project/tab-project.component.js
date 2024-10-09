var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { EEndpoints } from '@enums/endpoints';
var TabProjectComponent = /** @class */ (function () {
    function TabProjectComponent(formBuilder, toasterService, apiService, translate) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.translate = translate;
        this.dataProjectFilter = new FormGroup({});
        this.listStatus = [];
        this.listArtists = [];
        this.listTypes = [];
        this.projects = [];
        this.isWorking = false;
        this.dataSource = new MatTableDataSource();
        this.isDataAvailable = false;
        this.isValidSlider = false;
        this.displayedColumns = ['name', 'projectTypeName', 'artist', 'startDate', 'endDate', 'totalBudget', 'spent', 'status']; //'action'
        this.optionDefault = {
            value: 0,
            viewValue: "-- All --",
        };
    }
    TabProjectComponent.prototype.ngOnInit = function () {
        this.configureForm();
        this.getProjects();
        this.getStatus();
        this.getArtists();
        this.getProjectTypes();
    };
    Object.defineProperty(TabProjectComponent.prototype, "f", {
        //#region form
        get: function () { return this.dataProjectFilter.controls; },
        enumerable: false,
        configurable: true
    });
    TabProjectComponent.prototype.configureForm = function () {
        this.dataProjectFilter = this.formBuilder.group({
            statusId: [this.statusId, []],
            artistId: [this.artistId, []],
            typeId: [this.typeId, []],
            date: [this.date, []],
            expireDate: [this.expireDate, []],
        });
    };
    TabProjectComponent.prototype.getProjects = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Projects).subscribe(function (response) {
            if (response.code == 100 && response.result.length) {
                _this.projects = response.result;
                var projectsOrderBudget = response.result.filter(function (f) { return f.statusRecordId < 3; }).sort(function (a, b) { return (a.totalBudget > b.totalBudget) ? 1 : -1; });
                _this.minBudget = projectsOrderBudget[0].totalBudget;
                _this.maxBudget = projectsOrderBudget[projectsOrderBudget.length - 1].totalBudget;
                var projectsOrderSpent = response.result.filter(function (f) { return f.statusRecordId < 3; }).sort(function (a, b) { return (a.spent > b.spent) ? 1 : -1; });
                _this.minSpent = projectsOrderSpent[0].spent;
                _this.maxSpent = projectsOrderSpent[projectsOrderSpent.length - 1].spent;
                _this.minBudgetFilter = _this.minBudget;
                _this.maxBudgetFilter = _this.maxBudget;
                _this.minSpentFilter = _this.minSpent;
                _this.maxSpentFilter = _this.maxSpent;
                _this.optionsBudget = {
                    floor: 0,
                    ceil: _this.maxBudget
                };
                _this.optionsSpent = {
                    floor: 0,
                    ceil: _this.maxSpent
                };
                _this.isValidSlider = true;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TabProjectComponent.prototype.getProjectTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.listTypes = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
                _this.listTypes.push(_this.optionDefault);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TabProjectComponent.prototype.getArtists = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Artists).subscribe(function (response) {
            if (response.code == 100) {
                _this.listArtists = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
                _this.listArtists.push(_this.optionDefault);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TabProjectComponent.prototype.getStatus = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.StatusProjects).subscribe(function (response) {
            if (response.code == 100) {
                _this.listStatus = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
                _this.listStatus.push(_this.optionDefault);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TabProjectComponent.prototype.searchAll = function () {
        this.isWorking = true;
        this.dataSource.data = this.projects;
        this.isWorking = false;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    TabProjectComponent.prototype.searchByFilter = function () {
        this.isWorking = true;
        var statusId = this.f.statusId.value;
        var artistId = this.f.artistId.value;
        var typeId = this.f.typeId.value;
        var date = this.f.date.value;
        var expireDate = this.f.expireDate.value;
        var minBudget = this.minBudgetFilter;
        var maxBudget = this.maxBudgetFilter;
        var minSpent = this.minSpentFilter;
        var maxSpent = this.maxSpentFilter;
        var projectsFilter = this.projects;
        var parseDate = new Date(date);
        var parseEndDate = new Date(expireDate);
        var initialDate = parseDate.getFullYear().toString() + '-' + (parseDate.getMonth() < 10 ? '0' + (parseDate.getMonth() + 1).toString() : (parseDate.getMonth() + 1).toString()) + '-' + parseDate.getDate().toString();
        var endDate = parseEndDate.getFullYear().toString() + '-' + (parseEndDate.getMonth() < 10 ? '0' + (parseEndDate.getMonth() + 1).toString() : (parseEndDate.getMonth() + 1).toString()) + '-' + parseEndDate.getDate().toString();
        if (statusId > 0 && statusId != null) {
            projectsFilter = projectsFilter.filter(function (f) { return f.statusProjectId == statusId; });
        }
        if (artistId > 0 && artistId != null) {
            projectsFilter = projectsFilter.filter(function (f) { return f.artistId == artistId; });
        }
        if (typeId > 0 && typeId != null) {
            projectsFilter = projectsFilter.filter(function (f) { return f.projectTypeId == typeId; });
        }
        if (date != "" && date != null) {
            projectsFilter = projectsFilter.filter(function (f) { return f.initialDate.split('T')[0] == initialDate; });
        }
        if (expireDate != "" && expireDate != null) {
            projectsFilter = projectsFilter.filter(function (f) { return f.endDate.split('T')[0] == endDate; });
        }
        if (minBudget != null && maxBudget != null) {
            projectsFilter = projectsFilter.filter(function (f) { return f.totalBudget >= minBudget && f.totalBudget <= maxBudget; });
        }
        if (minSpent != null && maxSpent != null) {
            projectsFilter = projectsFilter.filter(function (f) { return f.spent >= minSpent && f.spent <= maxSpent; });
        }
        this.isDataAvailable = (projectsFilter.length > 0);
        this.dataSource = new MatTableDataSource(projectsFilter);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        this.isWorking = false;
    };
    TabProjectComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    TabProjectComponent.prototype.changeRangeBudget = function () {
        this.minBudgetFilter = this.minBudget;
        this.maxBudgetFilter = this.maxBudget;
    };
    TabProjectComponent.prototype.changeRangeSpent = function () {
        this.minSpentFilter = this.minSpent;
        this.maxSpentFilter = this.maxSpent;
    };
    TabProjectComponent.prototype._fillTable = function () {
        this.isDataAvailable = (this.projects.length > 0);
        this.dataSource = new MatTableDataSource(this.projects);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    TabProjectComponent.prototype.downloadReport = function (id, name) {
    };
    TabProjectComponent.prototype.downloadReportProjects = function () {
        var _this = this;
        var projects = this.dataSource.data;
        var idProjectList = [];
        projects.forEach(function (x) {
            idProjectList.push(x.id);
        });
        if (projects.length > 0) {
            this.isWorking = true;
            var idProjectsJSON = JSON.stringify(idProjectList);
            var result = idProjectsJSON.substring(1, idProjectsJSON.length - 1);
            var params = { idProjectsJSON: idProjectsJSON };
            this.apiService.download(EEndpoints.ReportProjects, params).subscribe(function (fileData) {
                var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "Report Projects Template");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                _this.isWorking = false;
            }, function (err) { return _this.responseError(err); });
        }
        else {
            this.toasterService.showToaster(this.translate.instant('report.general.messages.empty'));
            this.isWorking = false;
        }
    };
    TabProjectComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        ViewChild(MatPaginator, { static: true }),
        __metadata("design:type", MatPaginator)
    ], TabProjectComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], TabProjectComponent.prototype, "sort", void 0);
    TabProjectComponent = __decorate([
        Component({
            selector: 'app-tab-project',
            templateUrl: './tab-project.component.html',
            styleUrls: ['./tab-project.component.css']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            ToasterService,
            ApiService,
            TranslateService])
    ], TabProjectComponent);
    return TabProjectComponent;
}());
export { TabProjectComponent };
//# sourceMappingURL=tab-project.component.js.map