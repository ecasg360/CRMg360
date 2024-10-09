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
var TabWorksComponent = /** @class */ (function () {
    function TabWorksComponent(formBuilder, toasterService, apiService, translate) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.translate = translate;
        this.dataWorkFilter = new FormGroup({});
        this.listGenresMusicals = [];
        this.works = [];
        this.isWorking = false;
        this.dataSource = new MatTableDataSource();
        this.isDataAvailable = false;
        this.displayedColumns = ['name', 'description', 'amountRevenue', 'rating', 'registerNum', 'registerDate', 'genreMusical', 'licenseNum', 'action'];
        this.optionDefault = {
            value: 0,
            viewValue: "-- All --",
        };
    }
    TabWorksComponent.prototype.ngOnInit = function () {
        this.configureForm();
        this.getWorks();
        this.getGenresMusicals();
    };
    Object.defineProperty(TabWorksComponent.prototype, "f", {
        //#region form
        get: function () { return this.dataWorkFilter.controls; },
        enumerable: false,
        configurable: true
    });
    TabWorksComponent.prototype.configureForm = function () {
        this.dataWorkFilter = this.formBuilder.group({
            name: [this.name, []],
            description: [this.description, []],
            genreMusicalId: [this.genreMusicalId, []],
            amountRevenue: [this.amountRevenue, []],
            rating: [this.rating, []],
            registeredWork: [this.registeredWork, []],
            registerNum: [this.registerNum, []],
            registerDate: [this.registerDate, []],
            certifiedWork: [this.certifiedWork, []],
            licenseNum: [this.licenseNum, []],
        });
    };
    TabWorksComponent.prototype.getWorks = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Works).subscribe(function (response) {
            if (response.code == 100 && response.result.length) {
                _this.works = response.result;
                console.log(_this.works);
                _this.works.forEach(function (x) {
                    var musicalGenre = _this.listGenresMusicals.filter(function (y) { return y.value == x.musicalGenreId; });
                    if (musicalGenre.length > 0) {
                        x.musicalGenre = musicalGenre[0].viewValue;
                    }
                });
                console.log(_this.works);
                //let projectsOrderBudget = response.result.filter(f => f.statusRecordId < 3).sort((a, b) => (a.totalBudget > b.totalBudget) ? 1 : -1);
                //let projectsOrderSpent = response.result.filter(f => f.statusRecordId < 3).sort((a, b) => (a.spent > b.spent) ? 1 : -1);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TabWorksComponent.prototype.getGenresMusicals = function () {
        var _this = this;
        this.isWorking = true;
        var params = { entityId: 9 };
        this.apiService.get(EEndpoints.MusicalGenres, params).subscribe(function (response) {
            if (response.code == 100) {
                console.log(response.result);
                _this.listGenresMusicals = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
                _this.listGenresMusicals.push(_this.optionDefault);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TabWorksComponent.prototype.searchAll = function () {
        this.isWorking = true;
        this.isDataAvailable = (this.works.length > 0);
        this.dataSource = new MatTableDataSource(this.works);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        this.isWorking = false;
    };
    TabWorksComponent.prototype.searchByFilter = function () {
        this.isWorking = true;
        var name = this.f.name.value;
        var description = this.f.description.value;
        var genreMusicalId = this.f.genreMusicalId.value;
        var amountRevenue = this.f.amountRevenue.value;
        var rating = this.f.rating.value;
        var registeredWork = this.f.registeredWork.value;
        var registerNum = this.f.registerNum.value;
        var registerDate = this.f.registerDate.value;
        var certifiedWork = this.f.certifiedWork.value;
        var licenseNum = this.f.licenseNum.value;
        console.log(genreMusicalId);
        var worksFilter = this.works;
        if (name != "" && name != null) {
            worksFilter = worksFilter.filter(function (f) { return f.name.toLowerCase() == name.toLowerCase(); });
        }
        if (description != "" && description != null) {
            worksFilter = worksFilter.filter(function (f) { return f.description.toLowerCase() == description.toLowerCase(); });
        }
        if (genreMusicalId > 0 && genreMusicalId != null) {
            worksFilter = worksFilter.filter(function (f) { return f.musicalGenreId == genreMusicalId; });
        }
        if (amountRevenue != "" && amountRevenue != null) {
            worksFilter = worksFilter.filter(function (f) { return f.amountRevenue == amountRevenue; });
        }
        if (rating != "" && rating != null) {
            worksFilter = worksFilter.filter(function (f) { return f.rating == rating; });
        }
        if (registerNum != "" && registerNum != null) {
            worksFilter = worksFilter.filter(function (f) { return f.registerNum == registerNum; });
        }
        if (registerDate != "" && registerDate != null) {
            worksFilter = worksFilter.filter(function (f) { return f.registerDate == registerDate; });
        }
        if (registeredWork != null) {
            worksFilter = worksFilter.filter(function (f) { return f.registeredWork == registeredWork; });
        }
        if (certifiedWork != null) {
            worksFilter = worksFilter.filter(function (f) { return f.certifiedWork == (certifiedWork); });
        }
        if (licenseNum != "" && licenseNum != null) {
            worksFilter = worksFilter.filter(function (f) { return f.licenseNum == licenseNum; });
        }
        this.isDataAvailable = (worksFilter.length > 0);
        this.dataSource = new MatTableDataSource(worksFilter);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        this.isWorking = false;
    };
    TabWorksComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    TabWorksComponent.prototype._fillTable = function () {
        this.isDataAvailable = (this.works.length > 0);
        this.dataSource = new MatTableDataSource(this.works);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    TabWorksComponent.prototype.downloadReport = function (workId) {
        var _this = this;
        if (workId != null && workId !== undefined && workId > 0) {
            this.isWorking = true;
            var params = { workId: workId };
            this.apiService.download(EEndpoints.ReportWork, params).subscribe(function (fileData) {
                var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "Report Work Template");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                _this.isWorking = false;
            }, function (err) { return _this.responseError(err); });
        }
        else {
            this.toasterService.showToaster(this.translate.instant('report.work.messages.empty'));
            this.isWorking = false;
        }
    };
    TabWorksComponent.prototype.downloadReportProjects = function () {
        var _this = this;
        var works = this.dataSource.data;
        var idWorkList = [];
        works.forEach(function (x) {
            idWorkList.push(x.id);
        });
        if (works.length > 0) {
            this.isWorking = true;
            var idWorksJSON = JSON.stringify(idWorkList);
            var result = idWorksJSON.substring(1, idWorksJSON.length - 1);
            console.log(result);
            var params = { idWorksJSON: idWorksJSON };
            this.apiService.download(EEndpoints.ReportWorks, params).subscribe(function (fileData) {
                var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "Report Works Template");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                _this.isWorking = false;
            }, function (err) { return _this.responseError(err); });
        }
        else {
            this.toasterService.showToaster(this.translate.instant('report.work.messages.empty'));
            this.isWorking = false;
        }
    };
    TabWorksComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        ViewChild(MatPaginator, { static: true }),
        __metadata("design:type", MatPaginator)
    ], TabWorksComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], TabWorksComponent.prototype, "sort", void 0);
    TabWorksComponent = __decorate([
        Component({
            selector: 'app-tab-works',
            templateUrl: './tab-works.component.html',
            styleUrls: ['./tab-works.component.css']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            ToasterService,
            ApiService,
            TranslateService])
    ], TabWorksComponent);
    return TabWorksComponent;
}());
export { TabWorksComponent };
//# sourceMappingURL=tab-works.component.js.map