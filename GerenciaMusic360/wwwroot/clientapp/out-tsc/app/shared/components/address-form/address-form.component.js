var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { allLang } from '@i18n/allLang';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { startWith, map } from 'rxjs/operators';
var AddressFormComponent = /** @class */ (function () {
    function AddressFormComponent(translate, translationLoaderService, fb, apiService) {
        this.translate = translate;
        this.translationLoaderService = translationLoaderService;
        this.fb = fb;
        this.apiService = apiService;
        this.formReady = new EventEmitter();
        this.data = {};
        this.isArtist = false;
        this.countries = [];
        this.states = [];
        this.cities = [];
        this.addressTypes = [];
        this.countryFC = new FormControl();
        this.statesFC = new FormControl();
    }
    AddressFormComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.getCountriesApi();
    };
    AddressFormComponent.prototype.ngOnChanges = function (changes) {
        var address = changes.data;
        this.initializeValidations();
        this.getCountriesApi();
        this.getAddressTypeApi();
    };
    AddressFormComponent.prototype._filterCountry = function (value) {
        var filterValue = value ? value.toLowerCase() : '';
        return this.countries.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
    };
    AddressFormComponent.prototype._filterState = function (value) {
        var filterValue = value ? value.toLowerCase() : '';
        return this.states.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        ;
    };
    Object.defineProperty(AddressFormComponent.prototype, "f", {
        get: function () { return this.addressForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddressFormComponent.prototype.initializeValidations = function () {
        if (!this.data)
            this.data = {};
        this.addressForm = this.fb.group({
            id: [this.data.id, []],
            countryId: [this.data.countryId, [Validators.required]],
            stateId: [this.data.stateId, [Validators.required]],
            //cityId: [this.data.cityId, [Validators.required]],
            municipality: [this.data.municipality, []],
            neighborhood: [this.data.neighborhood, []],
            street: [this.data.street, []],
            exteriorNumber: [this.data.exteriorNumber, []],
            interiorNumber: [this.data.interiorNumber, []],
            postalCode: [this.data.postalCode, []],
            reference: [this.data.reference, []],
            addressTypeId: [this.data.addressTypeId, [Validators.required]],
            addressLine1: [this.data.addressLine1],
            addressLine2: [this.data.addressLine2],
            state: [this.data.state]
        });
        if (this.isArtist) {
            this.addressForm.controls.addressLine1.setValidators(Validators.required);
            this.addressForm.controls.state.setValidators(Validators.required);
        }
        this.formReady.emit(this.addressForm);
    };
    AddressFormComponent.prototype.autocompleteCountrySelected = function ($event) {
        if ($event.option.id) {
            this.f.countryId.patchValue($event.option.id);
            this.f.stateId.patchValue(null);
            this.statesFC.patchValue(null);
            this.getStatesApi(parseInt($event.option.id));
        }
    };
    AddressFormComponent.prototype.autocompleteStateSelected = function ($event) {
        if ($event.option.id) {
            this.f.stateId.patchValue($event.option.id);
        }
    };
    AddressFormComponent.prototype._responseError = function (err) {
        console.log('http error', err);
    };
    //#region API
    AddressFormComponent.prototype.getCountriesApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Countries).subscribe(function (data) {
            if (data.code == 100) {
                _this.countries = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                _this.filteredCountries = _this.countryFC.valueChanges.pipe(startWith(''), map(function (value) { return _this._filterCountry(value); }));
                _this.f.stateId.patchValue(null);
                if (_this.data.countryId) {
                    _this.f.countryId.patchValue(_this.data.countryId);
                    var found = _this.countries.find(function (f) { return f.value == _this.data.countryId; });
                    _this.countryFC.patchValue(found.viewValue);
                    _this.getStatesApi(_this.data.countryId, _this.data.stateId);
                }
            }
        }, function (err) { return _this._responseError(err); });
    };
    AddressFormComponent.prototype.getStatesApi = function (id, stateId) {
        var _this = this;
        if (stateId === void 0) { stateId = undefined; }
        this.apiService.get(EEndpoints.StatesByCountry, { countryId: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.states = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                //this.addressForm.value.cityId = undefined;
                var found = _this.countries.find(function (f) { return f.value == id; });
                if (found) {
                    _this.data.country = found.viewValue;
                }
                if (stateId !== undefined) {
                    _this.addressForm.controls['stateId'].patchValue(stateId);
                    var state = _this.states.find(function (f) { return f.value == stateId; });
                    _this.statesFC.patchValue(state.viewValue);
                    //if (this.data.cityId) {
                    //    this.getCitiesApi(stateId, this.data.cityId);
                    //}
                }
                else {
                    _this.cities = [];
                    _this.cities.slice();
                    _this.addressForm.controls['stateId'].patchValue(null);
                    //this.addressForm.controls['cityId'].patchValue(null);
                }
                _this.filteredStates = _this.statesFC.valueChanges.pipe(startWith(''), map(function (value) { return _this._filterState(value); }));
                if (_this.isArtist) {
                    _this.addressForm.controls.stateId.setValue(_this.states[0]);
                }
            }
        }, function (err) { return _this._responseError(err); });
    };
    AddressFormComponent.prototype.getAddressTypeApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.AddressTypes).subscribe(function (data) {
            if (data.code == 100) {
                _this.addressTypes = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                _this.f['addressTypeId'].patchValue(_this.data.addressTypeId);
                if (_this.isArtist) {
                    _this.addressForm.controls.addressTypeId.setValue(_this.addressTypes[0]);
                }
            }
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AddressFormComponent.prototype, "formReady", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AddressFormComponent.prototype, "data", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], AddressFormComponent.prototype, "isArtist", void 0);
    AddressFormComponent = __decorate([
        Component({
            selector: 'app-address-form',
            templateUrl: './address-form.component.html',
            styleUrls: ['./address-form.component.scss']
        }),
        __metadata("design:paramtypes", [TranslateService,
            FuseTranslationLoaderService,
            FormBuilder,
            ApiService])
    ], AddressFormComponent);
    return AddressFormComponent;
}());
export { AddressFormComponent };
//# sourceMappingURL=address-form.component.js.map