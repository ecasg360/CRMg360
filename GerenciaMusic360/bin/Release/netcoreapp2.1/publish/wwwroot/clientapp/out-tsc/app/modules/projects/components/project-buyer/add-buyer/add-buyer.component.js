var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Optional, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { FormBuilder, Validators } from "@angular/forms";
import { startWith, map } from "rxjs/operators";
import { AddCompanyComponent } from "@shared/components/add-company/add-company.component";
import { AddArtistComponent } from "@modules/artist/components/artist/add-artist.component";
import { entity } from "@enums/entity";
var AddBuyerComponent = /** @class */ (function () {
    function AddBuyerComponent(dialogRef, formBuilder, service, dialog, toasterService, actionData, translate, _fuseTranslationLoaderService) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.service = service;
        this.dialog = dialog;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.projectId = 0;
        this.id = 0;
        this.isWorking = true;
        this.buyerTypes = [];
        this.persons = [];
        this.companies = [];
    }
    Object.defineProperty(AddBuyerComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddBuyerComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.id = this.actionData.id;
        this.projectId = this.actionData.projectId;
        this.configureForm();
        this.getBuyerTypes();
        this.getCompanies();
        this.getPersons();
        if (this.id == 0) {
            this.isWorking = false;
            this.titleAction = this.translate.instant('settings.projectBuyers.saveTitle');
            this.action = this.translate.instant('general.save');
        }
        else {
            this.titleAction = this.translate.instant('settings.projectBuyers.editTitle');
            this.action = this.translate.instant('general.save');
            //this.getCurrency();
        }
    };
    AddBuyerComponent.prototype.getBuyerTypes = function () {
        var _this = this;
        this.service.get(EEndpoints.BuyerTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.buyerTypes = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddBuyerComponent.prototype.getCompanies = function () {
        var _this = this;
        this.service.get(EEndpoints.Companies).subscribe(function (response) {
            if (response.code == 100) {
                _this.companies = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.businessName
                }); });
                _this.companyFiltered = _this.f.businessName.valueChanges.pipe(startWith(''), map(function (state) { return state ? _this._filterCompanies(state) : _this.companies.slice(); }));
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddBuyerComponent.prototype.getPersons = function () {
        var _this = this;
        this.service.get(EEndpoints.Buyers)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.persons = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name + ' ' + s.lastName
                }); });
                _this.personFiltered = _this.f.personName.valueChanges.pipe(startWith(''), map(function (state) { return state ? _this._filterPersons(state) : _this.persons.slice(); }));
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddBuyerComponent.prototype._filterPersons = function (value) {
        var filterValue = value.toLowerCase();
        return this.persons.filter(function (person) { return person.viewValue.toLowerCase().indexOf(filterValue) === 0; });
    };
    AddBuyerComponent.prototype._filterCompanies = function (value) {
        var filterValue = value.toLowerCase();
        return this.companies.filter(function (company) { return company.viewValue.toLowerCase().indexOf(filterValue) === 0; });
    };
    AddBuyerComponent.prototype.displayFn = function (value) {
        return value ? value.viewValue : value;
    };
    AddBuyerComponent.prototype.onSelectionChanged = function (e) {
        this.f.companyId.setValue(e.option.value.value);
    };
    AddBuyerComponent.prototype.configureForm = function () {
        this.form = this.formBuilder.group({
            buyerTypeId: ['', [
                    Validators.required
                ]],
            personId: [],
            personName: [''],
            projectId: [this.projectId],
            companyId: [],
            businessName: [''],
            representativeLegalName: ['']
        });
    };
    AddBuyerComponent.prototype.populateForm = function (data) {
        var _this = this;
        Object.keys(this.form.controls).forEach(function (name) {
            if (_this.form.controls[name]) {
                _this.form.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
    };
    AddBuyerComponent.prototype.set = function () {
        if (this.form.valid) {
            this.isWorking = true;
            if (this.id == 0) {
                this.save();
            }
            else {
                this.update();
            }
        }
    };
    AddBuyerComponent.prototype.save = function () {
        var _this = this;
        var model = this.form.value;
        model.id = 0;
        var find = this.persons.find(function (x) { return x.viewValue === _this.f.representativeLegalName.value; });
        if (find) {
            model.personId = find.value;
        }
        this.service.save(EEndpoints.ProjectBuyer, model)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('settings.projectbuyer.messages.saved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddBuyerComponent.prototype.update = function () {
        var _this = this;
        this.form.value.id = this.id;
        this.service.update(EEndpoints.ProjectBuyers, this.form.value)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('settings.projectbuyer.messages.saved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddBuyerComponent.prototype.showModalCompany = function () {
        var _this = this;
        var dialogRef = this.dialog.open(AddCompanyComponent, {
            width: '1000px',
            data: {
                id: 0,
                model: {}
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getCompanies();
        });
    };
    AddBuyerComponent.prototype.showModalPerson = function () {
        var _this = this;
        var dialogRef = this.dialog.open(AddArtistComponent, {
            width: '1024px',
            data: {
                id: 0,
                entityType: entity.Buyer,
                isBuyer: true,
                title: this.translate.instant('general.buyers')
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getCompanies();
        });
    };
    AddBuyerComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddBuyerComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddBuyerComponent = __decorate([
        Component({
            selector: 'app-add-buyer',
            templateUrl: './add-buyer.component.html'
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            MatDialog,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddBuyerComponent);
    return AddBuyerComponent;
}());
export { AddBuyerComponent };
//# sourceMappingURL=add-buyer.component.js.map