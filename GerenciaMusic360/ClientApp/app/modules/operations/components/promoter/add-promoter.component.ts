import { Component, OnInit, Optional, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "@services/toaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CropImage } from '@models/crop-image.model';
import { CutImageComponent } from "@shared/components/cut-image/cut-image.component";
import { SelectOption } from "@models/select-option.models";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';

@Component({
    selector: 'app-add-promoter',
    templateUrl: './add-promoter.component.html'
})

export class AddPromoterComponent implements OnInit {
    addPromoterForm: FormGroup;
    id: number = 0;

    actionBtn: string = 'create';
    actionLabel: string = 'Agregar';
    croppedImage: any = '';
    cropImage: CropImage;
    visaTypes: SelectOption[] = [];
    personTypes: SelectOption[] = [];
    tripPreferences: SelectOption[] = [];
    countries: SelectOption[] = [];
    states: SelectOption[] = [];
    cities: SelectOption[] = [];

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<AddPromoterComponent>,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private spinner: NgxSpinnerService
    ) {
    }

    ngOnInit() {

        this.addPromoterForm = this.formBuilder.group({
            name: ['', [
                Validators.required
            ]],
            lastName: ['', [
                Validators.required
            ]],
            secondLastName: ['', []],
            birthDateString: ['', []],
            gender: ['', [
                Validators.required
            ]],
            email: ['', []],
            phoneOne: ['', []],
            phoneTwo: ['', []],
            phoneThree: ['', []],
            price: ['', [
                Validators.pattern("^[0-9]*$"),
            ]],
            personTypeId: ['', [
                Validators.required
            ]],
            passportNumber: ['', []],
            expiredPassportDateString: ['', []],
            expiredVisaDateString: ['', []],
            tripPreferenceId: ['', []],
            visaTypeId: ['', []],
            generalTaste: ['', []],
            biography: ['', []],
            countryId: ['', []],
            stateId: ['', []],
            cityId: ['', []],
            municipality: ['', []],
            neighborhood: ['', []],
            street: ['', []],
            exteriorNumber: ['', []],
            interiorNumber: ['', []],
            postalCode: ['', []],
            reference: ['', []]
        });

        this.getPromoterTypes();
        this.getVisaTypes();
        this.getTripPreferences();
        this.getCountries();

        this.actionBtn = this.actionData.action;
        if (this.actionBtn === 'update') {
            this.getPromoter(this.actionData.id); {
                this.actionLabel = 'Editar';
            }
        }
    }

    get f() { return this.addPromoterForm.controls; }

    openCutDialog(event: any): void {
        this.cropImage = { event: event, numberImage: 0, imageSRC: '' };
        const dialogRef = this.dialog.open(CutImageComponent, {
            width: '500px',
            data: this.cropImage
        });
        dialogRef.afterClosed().subscribe(result => {
            this.croppedImage = result.imageSRC;
        });
    }

    removeImage() {
        this.croppedImage = '';
    }

    fileChangeEvent(event: any): void {
        this.openCutDialog(event);
    }

    setPromoter() {
        if (!this.addPromoterForm.invalid) {
            this.spinner.show();
            this.addPromoterForm.value.pictureUrl = this.croppedImage;
            this.apiService.save(EEndpoints.Promoter, this.addPromoterForm.value).subscribe(data => {
                if (data.code == 100) {
                    this.onNoClick(true);
                    setTimeout(() => {
                        this.toasterService.showToaster('Se agregó el promotor correctamente.');
                    }, 300);
                } else {
                    this.spinner.hide();
                    setTimeout(() => {
                        this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, (err) => console.error('Failed! ' + err));
        }
    }

    updatePromoter(id) {
        if (!this.addPromoterForm.invalid) {
            this.spinner.show();
            this.addPromoterForm.value.pictureUrl = this.croppedImage;
            this.addPromoterForm.value.id = id;
            this.apiService.update(EEndpoints.Promoter, this.addPromoterForm.value).subscribe(data => {
                if (data.code == 100) {
                    this.onNoClick(true);
                    setTimeout(() => {
                        this.toasterService.showToaster('Se editó el promotor correctamente.');
                    }, 300);
                } else {
                    this.spinner.hide();
                    setTimeout(() => {
                        this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, (err) => console.error('Failed! ' + err));
        }
    }

    getPromoter(id) {
        this.apiService.get(EEndpoints.Promoter, { id: id }).subscribe(data => {
            if (data.code == 100) {
                Object.keys(this.addPromoterForm.controls).forEach(name => {
                    if (this.addPromoterForm.controls[name]) {
                        if (name === 'birthDateString')
                            this.addPromoterForm.controls[name].patchValue(new Date(data.result.birthDateString));
                        else if (name === 'expiredPassportDateString')
                            this.addPromoterForm.controls[name].patchValue(new Date(data.result.expiredPassportDateString));
                        else if (name === 'expiredVisaDateString')
                            this.addPromoterForm.controls[name].patchValue(new Date(data.result.expiredVisaDateString));
                        else
                            this.addPromoterForm.controls[name].patchValue(data.result[name]);
                    }
                });

                this.id = data.result.id;
                this.croppedImage = data.result.pictureUrl !== null ? 'data:image/jpg;base64,' + data.result.pictureUrl : '';
                if (data.result.countryId !== null)
                    this.getStates(data.result.countryId, data.result.stateId);
                if (data.result.stateId !== null)
                    this.getCities(data.result.stateId, data.result.cityId);

            } else {
                setTimeout(() => {
                    this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, (err) => console.error('Failed! ' + err));
    }

    onNoClick(status = undefined): void {
        this.dialogRef.close(status);
    }

    getPromoterTypes() {
        this.apiService.get(EEndpoints.PromoterTypes).subscribe(data => {
            if (data.code == 100) {
                this.personTypes = data.result.map(s => ({
                    value: s.id,
                    viewValue: s.name
                }));
            }
        }, (err) => console.error('Failed! ' + err));
    }

    getVisaTypes() {
        this.apiService.get(EEndpoints.VisaTypes).subscribe(
            data => {
                if (data.code == 100) {
                    this.visaTypes = data.result.map(s => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                }
            }, (err) => console.error('Failed! ' + err));
    }

    getTripPreferences() {
        this.apiService.get(EEndpoints.Trippreferences).subscribe(
            data => {
                if (data.code == 100) {
                    this.tripPreferences = data.result.map(s => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                }
            }, (err) => console.error('Failed! ' + err));
    }

    getCountries() {
        this.apiService.get(EEndpoints.Countries).subscribe(data => {
            if (data.code == 100) {
                this.countries = data.result.map(s => ({
                    value: s.id,
                    viewValue: s.name
                }));
                this.addPromoterForm.value.stateId = undefined;
                this.addPromoterForm.value.cityId = undefined;
            }
        }, (err) => console.error('Failed! ' + err));
    }

    getStates(id, stateId = undefined) {
        this.apiService.get(EEndpoints.StatesByCountry, { StatesByCountry: id }).subscribe(data => {
            if (data.code == 100) {
                this.states = data.result.map(s => ({
                    value: s.id,
                    viewValue: s.name
                }));
                this.addPromoterForm.value.cityId = undefined;

                if (stateId !== undefined)
                    this.addPromoterForm.controls['stateId'].patchValue(stateId);
            }
        }, (err) => console.error('Failed! ' + err));
    }

    getCities(id, cityId = undefined) {
        this.apiService.get(EEndpoints.CitiesByState, { stateId: id }).subscribe(data => {
            if (data.code == 100) {
                this.cities = data.result.map(s => ({
                    value: s.id,
                    viewValue: s.name
                }));

                if (cityId !== undefined)
                    this.addPromoterForm.controls['cityId'].patchValue(cityId);
            }
        }, (err) => console.error('Failed! ' + err));
    }

    genders: SelectOption[] = [
        { value: 'F', viewValue: 'Femenino' },
        { value: 'M', viewValue: 'Masculino' }
    ];
}