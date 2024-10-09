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
var TabContactComponent = /** @class */ (function () {
    function TabContactComponent(formBuilder, toasterService, apiService, translate) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.translate = translate;
        this.dataContactFilter = new FormGroup({});
        this.listTypes = [];
        this.listGenders = [];
        this.contacts = [];
        this.isWorking = false;
        this.dataSource = new MatTableDataSource();
        this.isDataAvailable = false;
        this.displayedColumns = ['name', 'personType', 'officePhone', 'cellPhone', 'email', 'birthDate', 'gender'];
        this.optionDefault = {
            value: 0,
            viewValue: "-- All --",
        };
    }
    TabContactComponent.prototype.ngOnInit = function () {
        this.configureForm();
        this.getContacts();
        this.getTypes();
        this.getGenders();
    };
    Object.defineProperty(TabContactComponent.prototype, "f", {
        //#region form
        get: function () { return this.dataContactFilter.controls; },
        enumerable: false,
        configurable: true
    });
    TabContactComponent.prototype.configureForm = function () {
        this.dataContactFilter = this.formBuilder.group({
            name: [this.name, []],
            lastName: [this.lastName, []],
            secondLastName: [this.secondLastName, []],
            officePhone: [this.officePhone, []],
            cellPhone: [this.cellPhone, []],
            email: [this.email, []],
            typeId: [this.typeId, []],
            genderId: [this.genderId, []],
        });
    };
    TabContactComponent.prototype.getContacts = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectContacts).subscribe(function (response) {
            if (response.code == 100 && response.result.length) {
                console.log(response.result);
                _this.contacts = response.result;
                //let projectsOrderBudget = response.result.filter(f => f.statusRecordId < 3).sort((a, b) => (a.totalBudget > b.totalBudget) ? 1 : -1);
                //let projectsOrderSpent = response.result.filter(f => f.statusRecordId < 3).sort((a, b) => (a.spent > b.spent) ? 1 : -1);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TabContactComponent.prototype.getTypes = function () {
        var _this = this;
        this.isWorking = true;
        var params = { entityId: 9 };
        this.apiService.get(EEndpoints.PersonTypes, params).subscribe(function (response) {
            if (response.code == 100) {
                console.log(response.result);
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
    TabContactComponent.prototype.getGenders = function () {
        this.isWorking = true;
        this.listGenders = [];
        this.listGenders.push({
            value: 'M',
            viewValue: this.translate.instant('report.contact.male'),
        });
        this.listGenders.push({
            value: 'F',
            viewValue: this.translate.instant('report.contact.female'),
        });
        this.listGenders.push(this.optionDefault);
    };
    TabContactComponent.prototype.searchAll = function () {
        this.isWorking = true;
        this.dataSource.data = this.contacts;
        this.isWorking = false;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    TabContactComponent.prototype.searchByFilter = function () {
        this.isWorking = true;
        var name = this.f.name.value;
        var lastName = this.f.lastName.value;
        var secondLastName = this.f.secondLastName.value;
        var officePhone = this.f.officePhone.value;
        var cellPhone = this.f.cellPhone.value;
        var email = this.f.email.value;
        var typeId = this.f.typeId.value;
        var genderId = this.f.genderId.value;
        var contactsFilter = this.contacts;
        if (name != "" && name != null) {
            contactsFilter = contactsFilter.filter(function (f) { return f.name.toLowerCase() == name.toLowerCase(); });
        }
        if (lastName != "" && lastName != null) {
            contactsFilter = contactsFilter.filter(function (f) { return f.lastName.toLowerCase() == lastName.toLowerCase(); });
        }
        if (secondLastName != "" && secondLastName != null) {
            contactsFilter = contactsFilter.filter(function (f) { return f.secondLastName.toLowerCase() == secondLastName.toLowerCase(); });
        }
        if (officePhone != "" && officePhone != null) {
            contactsFilter = contactsFilter.filter(function (f) { return f.officePhone.toLowerCase() == officePhone.toLowerCase(); });
        }
        if (cellPhone != "" && cellPhone != null) {
            contactsFilter = contactsFilter.filter(function (f) { return f.cellPhone.toLowerCase() == cellPhone.toLowerCase(); });
        }
        if (email != "" && email != null) {
            contactsFilter = contactsFilter.filter(function (f) { return f.email.toLowerCase() == email.toLowerCase(); });
        }
        if (typeId > 0 && typeId != null) {
            contactsFilter = contactsFilter.filter(function (f) { return f.personTypeId == typeId; });
        }
        if (genderId != "" && genderId != null) {
            contactsFilter = contactsFilter.filter(function (f) { return f.gender.toLowerCase() == genderId.toLowerCase(); });
        }
        this.isDataAvailable = (contactsFilter.length > 0);
        this.dataSource = new MatTableDataSource(contactsFilter);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        this.isWorking = false;
    };
    TabContactComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    TabContactComponent.prototype._fillTable = function () {
        this.isDataAvailable = (this.contacts.length > 0);
        this.dataSource = new MatTableDataSource(this.contacts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    TabContactComponent.prototype.downloadReport = function (id, name) {
    };
    TabContactComponent.prototype.downloadReportContacts = function () {
        var _this = this;
        var contacts = this.dataSource.data;
        var idContactList = [];
        contacts.forEach(function (x) {
            idContactList.push(x.id);
        });
        if (contacts.length > 0) {
            this.isWorking = true;
            var idContactsJSON = JSON.stringify(idContactList);
            var result = idContactsJSON.substring(1, idContactsJSON.length - 1);
            console.log(result);
            var params = { idContactsJSON: idContactsJSON };
            this.apiService.download(EEndpoints.ReportContacts, params).subscribe(function (fileData) {
                var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "Report Contacts Template");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                _this.isWorking = false;
            }, function (err) { return _this.responseError(err); });
        }
        else {
            this.toasterService.showToaster(this.translate.instant('report.contact.messages.empty'));
            this.isWorking = false;
        }
    };
    TabContactComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        ViewChild(MatPaginator, { static: true }),
        __metadata("design:type", MatPaginator)
    ], TabContactComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], TabContactComponent.prototype, "sort", void 0);
    TabContactComponent = __decorate([
        Component({
            selector: 'app-tab-contact',
            templateUrl: './tab-contact.component.html',
            styleUrls: ['./tab-contact.component.css']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            ToasterService,
            ApiService,
            TranslateService])
    ], TabContactComponent);
    return TabContactComponent;
}());
export { TabContactComponent };
//# sourceMappingURL=tab-contact.component.js.map