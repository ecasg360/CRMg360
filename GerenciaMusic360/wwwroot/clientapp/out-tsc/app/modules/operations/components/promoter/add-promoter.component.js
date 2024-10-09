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
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "@services/toaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CutImageComponent } from "@shared/components/cut-image/cut-image.component";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var AddPromoterComponent = /** @class */ (function () {
    function AddPromoterComponent(dialog, dialogRef, formBuilder, apiService, toasterService, actionData, spinner) {
        this.dialog = dialog;
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.spinner = spinner;
        this.id = 0;
        this.actionBtn = 'create';
        this.actionLabel = 'Agregar';
        this.croppedImage = '';
        this.visaTypes = [];
        this.personTypes = [];
        this.tripPreferences = [];
        this.countries = [];
        this.states = [];
        this.cities = [];
        this.genders = [
            { value: 'F', viewValue: 'Femenino' },
            { value: 'M', viewValue: 'Masculino' }
        ];
    }
    AddPromoterComponent.prototype.ngOnInit = function () {
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
            this.getPromoter(this.actionData.id);
            {
                this.actionLabel = 'Editar';
            }
        }
    };
    Object.defineProperty(AddPromoterComponent.prototype, "f", {
        get: function () { return this.addPromoterForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddPromoterComponent.prototype.openCutDialog = function (event) {
        var _this = this;
        this.cropImage = { event: event, numberImage: 0, imageSRC: '' };
        var dialogRef = this.dialog.open(CutImageComponent, {
            width: '500px',
            data: this.cropImage
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.croppedImage = result.imageSRC;
        });
    };
    AddPromoterComponent.prototype.removeImage = function () {
        this.croppedImage = '';
    };
    AddPromoterComponent.prototype.fileChangeEvent = function (event) {
        this.openCutDialog(event);
    };
    AddPromoterComponent.prototype.setPromoter = function () {
        var _this = this;
        if (!this.addPromoterForm.invalid) {
            this.spinner.show();
            this.addPromoterForm.value.pictureUrl = this.croppedImage;
            this.apiService.save(EEndpoints.Promoter, this.addPromoterForm.value).subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick(true);
                    setTimeout(function () {
                        _this.toasterService.showToaster('Se agregó el promotor correctamente.');
                    }, 300);
                }
                else {
                    _this.spinner.hide();
                    setTimeout(function () {
                        _this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, function (err) { return console.error('Failed! ' + err); });
        }
    };
    AddPromoterComponent.prototype.updatePromoter = function (id) {
        var _this = this;
        if (!this.addPromoterForm.invalid) {
            this.spinner.show();
            this.addPromoterForm.value.pictureUrl = this.croppedImage;
            this.addPromoterForm.value.id = id;
            this.apiService.update(EEndpoints.Promoter, this.addPromoterForm.value).subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick(true);
                    setTimeout(function () {
                        _this.toasterService.showToaster('Se editó el promotor correctamente.');
                    }, 300);
                }
                else {
                    _this.spinner.hide();
                    setTimeout(function () {
                        _this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, function (err) { return console.error('Failed! ' + err); });
        }
    };
    AddPromoterComponent.prototype.getPromoter = function (id) {
        var _this = this;
        this.apiService.get(EEndpoints.Promoter, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                Object.keys(_this.addPromoterForm.controls).forEach(function (name) {
                    if (_this.addPromoterForm.controls[name]) {
                        if (name === 'birthDateString')
                            _this.addPromoterForm.controls[name].patchValue(new Date(data.result.birthDateString));
                        else if (name === 'expiredPassportDateString')
                            _this.addPromoterForm.controls[name].patchValue(new Date(data.result.expiredPassportDateString));
                        else if (name === 'expiredVisaDateString')
                            _this.addPromoterForm.controls[name].patchValue(new Date(data.result.expiredVisaDateString));
                        else
                            _this.addPromoterForm.controls[name].patchValue(data.result[name]);
                    }
                });
                _this.id = data.result.id;
                _this.croppedImage = data.result.pictureUrl !== null ? 'data:image/jpg;base64,' + data.result.pictureUrl : '';
                if (data.result.countryId !== null)
                    _this.getStates(data.result.countryId, data.result.stateId);
                if (data.result.stateId !== null)
                    _this.getCities(data.result.stateId, data.result.cityId);
            }
            else {
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddPromoterComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddPromoterComponent.prototype.getPromoterTypes = function () {
        var _this = this;
        this.apiService.get(EEndpoints.PromoterTypes).subscribe(function (data) {
            if (data.code == 100) {
                _this.personTypes = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddPromoterComponent.prototype.getVisaTypes = function () {
        var _this = this;
        this.apiService.get(EEndpoints.VisaTypes).subscribe(function (data) {
            if (data.code == 100) {
                _this.visaTypes = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddPromoterComponent.prototype.getTripPreferences = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Trippreferences).subscribe(function (data) {
            if (data.code == 100) {
                _this.tripPreferences = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddPromoterComponent.prototype.getCountries = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Countries).subscribe(function (data) {
            if (data.code == 100) {
                _this.countries = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                _this.addPromoterForm.value.stateId = undefined;
                _this.addPromoterForm.value.cityId = undefined;
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddPromoterComponent.prototype.getStates = function (id, stateId) {
        var _this = this;
        if (stateId === void 0) { stateId = undefined; }
        this.apiService.get(EEndpoints.StatesByCountry, { StatesByCountry: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.states = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                _this.addPromoterForm.value.cityId = undefined;
                if (stateId !== undefined)
                    _this.addPromoterForm.controls['stateId'].patchValue(stateId);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddPromoterComponent.prototype.getCities = function (id, cityId) {
        var _this = this;
        if (cityId === void 0) { cityId = undefined; }
        this.apiService.get(EEndpoints.CitiesByState, { stateId: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.cities = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                if (cityId !== undefined)
                    _this.addPromoterForm.controls['cityId'].patchValue(cityId);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddPromoterComponent = __decorate([
        Component({
            selector: 'app-add-promoter',
            templateUrl: './add-promoter.component.html'
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialog,
            MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, NgxSpinnerService])
    ], AddPromoterComponent);
    return AddPromoterComponent;
}());
export { AddPromoterComponent };
//# sourceMappingURL=add-promoter.component.js.map