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
import { Optional, Inject, Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { startWith, map } from "rxjs/operators";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
var AddCompanyComponent = /** @class */ (function () {
    function AddCompanyComponent(apiService, dialogRef, fb, toaster, actionData, translate, translationLoaderService) {
        this.apiService = apiService;
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.toaster = toaster;
        this.actionData = actionData;
        this.translate = translate;
        this.translationLoaderService = translationLoaderService;
        this.model = {};
        this.isWorking = false;
        this.persons = [];
        this.address = {};
    }
    AddCompanyComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.model = this.actionData.model;
        this.configureForm();
        this.getPersonsApi();
        if (!this.model.id) {
            this.action = this.translate.instant('general.save');
        }
        else {
            this.action = this.translate.instant('general.save');
            this.getAddressApi(this.model.addressId);
        }
    };
    Object.defineProperty(AddCompanyComponent.prototype, "f", {
        get: function () { return this.CompanyForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddCompanyComponent.prototype.configureForm = function () {
        this.CompanyForm = this.fb.group({
            id: [this.model.id, []],
            businessName: [this.model.businessName, [Validators.required]],
            legalName: [this.model.legalName],
            businessShortName: [this.model.businessShortName, [Validators.required]],
            taxId: [this.model.taxId],
            representativeLegalId: [this.model.representativeLegalId],
            representativeLegalName: ['', [Validators.required]],
            addressId: [this.model.addressId]
        });
    };
    AddCompanyComponent.prototype.bindExternalForm = function (name, form) {
        this.CompanyForm.setControl(name, form);
    };
    AddCompanyComponent.prototype.legalRepSelected = function ($event) {
        this.f['representativeLegalId'].patchValue($event.option.id);
    };
    AddCompanyComponent.prototype.saveCompany = function () {
        var address = this.CompanyForm.value.address;
        var company = this.CompanyForm.value;
        if (this.model.id)
            this.updateAddressApi(address, company);
        else
            this.createAddressApi(address, company);
    };
    AddCompanyComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddCompanyComponent.prototype._filterPersons = function (value) {
        var filterValue = value.toLowerCase();
        return this.persons.filter(function (person) { return person.viewValue.toLowerCase().indexOf(filterValue) === 0; });
    };
    AddCompanyComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        console.error(error);
        this.isWorking = false;
    };
    //#region API
    AddCompanyComponent.prototype.getAddressApi = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = { id: id };
        this.apiService.get(EEndpoints.AddressById, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.address = response.result;
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorGettingAddress'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddCompanyComponent.prototype.getPersonsApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Artists).subscribe(function (response) {
            if (response.code == 100) {
                _this.persons = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name + ' ' + s.lastName
                }); });
                _this.personFiltered = _this.f.representativeLegalName.valueChanges.pipe(startWith(''), map(function (state) { return state ? _this._filterPersons(state) : _this.persons.slice(); }));
                if (_this.model.id) {
                    var found = _this.persons.find(function (f) { return f.value == _this.model.representativeLegalId; });
                    _this.f['representativeLegalName'].patchValue(found.viewValue);
                }
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddCompanyComponent.prototype.createAddressApi = function (address, company) {
        var _this = this;
        this.isWorking = true;
        delete address.id;
        this.apiService.save(EEndpoints.Address, address).subscribe(function (response) {
            if (response.code == 100) {
                company.addressId = response.result.id;
                _this.createCompanyApi(company);
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorGettingItem'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddCompanyComponent.prototype.updateAddressApi = function (address, company) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.Address, address).subscribe(function (response) {
            if (response.code == 100)
                _this.updateCompanyApi(company);
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorGettingItem'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddCompanyComponent.prototype.createCompanyApi = function (company) {
        var _this = this;
        this.isWorking = true;
        delete company.id;
        delete company['address'];
        this.apiService.save(EEndpoints.Company, company).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemSaved'));
                _this.onNoClick(_this.model);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.errorSavingItem'));
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddCompanyComponent.prototype.updateCompanyApi = function (company) {
        var _this = this;
        this.isWorking = true;
        delete company['address'];
        this.apiService.update(EEndpoints.Company, company).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemUpdated'));
                _this.onNoClick(_this.model);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.errorUpdatingItem'));
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddCompanyComponent = __decorate([
        Component({
            selector: 'app-add-company',
            templateUrl: './add-company.component.html'
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            MatDialogRef,
            FormBuilder,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddCompanyComponent);
    return AddCompanyComponent;
}());
export { AddCompanyComponent };
//# sourceMappingURL=add-company.component.js.map