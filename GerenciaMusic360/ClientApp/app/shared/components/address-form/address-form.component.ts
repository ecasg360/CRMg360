
import { allLang } from '@i18n/allLang';
import {Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from '@models/select-option.models';
import { ResponseApi } from '@models/response-api';
import { ResponseSelect } from '@models/select-response';
import { IAddress } from '@models/address';
import { Observable } from 'rxjs';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { State } from '@models/states';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
    selector: 'app-address-form',
    templateUrl: './address-form.component.html',
    styleUrls: ['./address-form.component.scss']
})

export class AddressFormComponent implements OnInit, OnChanges {

    @Output() formReady = new EventEmitter<FormGroup>();
    @Input() data: IAddress = <IAddress>{};
    @Input() isArtist: boolean = false;

    countries: SelectOption[] = [];
    states: SelectOption[] = [];
    cities: SelectOption[] = [];
    addressTypes: SelectOption[] = [];
    addressForm: FormGroup;
    countryFC = new FormControl();
    statesFC = new FormControl();
    filteredCountries: Observable<SelectOption[]>;
    filteredStates: Observable<SelectOption[]>;    

    constructor(
        private translate: TranslateService,
        private translationLoaderService: FuseTranslationLoaderService,
        private fb: FormBuilder,
        private apiService: ApiService,
    ) { }

    ngOnInit() {
        this.translationLoaderService.loadTranslations(...allLang);
        this.getCountriesApi();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const address = changes.data;
        this.initializeValidations();
        this.getCountriesApi();
        this.getAddressTypeApi();
    }

    private _filterCountry(value: string): SelectOption[] {
        const filterValue = value ? value.toLowerCase() : '';
        return this.countries.filter(option => option.viewValue.toLowerCase().includes(filterValue));
    }

    private _filterState(value: string): SelectOption[] {
        const filterValue = value ? value.toLowerCase() : '';
        return this.states.filter(option => option.viewValue.toLowerCase().includes(filterValue));;
    }

    get f() { return this.addressForm.controls; }

    initializeValidations(): void {
        if (!this.data)
            this.data = <IAddress>{};

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
    }

    autocompleteCountrySelected($event: MatAutocompleteSelectedEvent) {
        if ($event.option.id) {
            this.f.countryId.patchValue($event.option.id);
            this.f.stateId.patchValue(null);
            this.statesFC.patchValue(null);
            this.getStatesApi(parseInt($event.option.id));
        }
    }

    autocompleteStateSelected($event: MatAutocompleteSelectedEvent) {
        if ($event.option.id) {
            this.f.stateId.patchValue($event.option.id);
        }
    }

    private _responseError(err: any) {
        console.log('http error', err);
    }

    //#region API
    getCountriesApi() {
        this.apiService.get(EEndpoints.Countries).subscribe(
            (data: ResponseApi<any>) => {
                if (data.code == 100) {
                    this.countries = data.result.map((s: ResponseSelect) => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                    this.filteredCountries = this.countryFC.valueChanges.pipe(
                        startWith(''),
                        map(value => this._filterCountry(value))
                    );
                    this.f.stateId.patchValue(null);
                    if (this.data.countryId) {
                        this.f.countryId.patchValue(this.data.countryId);
                        const found = this.countries.find(f => f.value == this.data.countryId);
                        this.countryFC.patchValue(found.viewValue);
                        this.getStatesApi(this.data.countryId, this.data.stateId);
                    }
                }
            }, (err) => this._responseError(err)
        );
    }

    getStatesApi(id: number, stateId: number = undefined) {
        this.apiService.get(EEndpoints.StatesByCountry, { countryId: id }).subscribe(
            (response: ResponseApi<State[]>) => {
                if (response.code == 100) {
                    this.states = response.result.map((s: State) => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                    //this.addressForm.value.cityId = undefined;
                    const found = this.countries.find(f => f.value == id);
                    if (found) {
                        this.data.country = found.viewValue;
                    }

                    if (stateId !== undefined) {
                        this.addressForm.controls['stateId'].patchValue(stateId);
                        const state = this.states.find(f => f.value == stateId);
                        this.statesFC.patchValue(state.viewValue);
                        //if (this.data.cityId) {
                        //    this.getCitiesApi(stateId, this.data.cityId);
                        //}
                    } else {
                        this.cities = [];
                        this.cities.slice();
                        this.addressForm.controls['stateId'].patchValue(null);
                        //this.addressForm.controls['cityId'].patchValue(null);
                    }

                    this.filteredStates = this.statesFC.valueChanges.pipe(
                        startWith(''),
                        map(value => this._filterState(value))
                    );

                    if (this.isArtist) {
                        this.addressForm.controls.stateId.setValue(this.states[0]);
                    }
                }
            }, (err) => this._responseError(err)
        );
    }

    getAddressTypeApi() {
        this.apiService.get(EEndpoints.AddressTypes).subscribe(
            (data: ResponseApi<any>) => {
                if (data.code == 100) {
                    this.addressTypes = data.result.map((s: any) => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                    this.f['addressTypeId'].patchValue(this.data.addressTypeId);
                    if (this.isArtist) {
                        this.addressForm.controls.addressTypeId.setValue(this.addressTypes[0]);
                    }
                }
            }, (err) => this._responseError(err)
        );
    }
    //#endregion
}
