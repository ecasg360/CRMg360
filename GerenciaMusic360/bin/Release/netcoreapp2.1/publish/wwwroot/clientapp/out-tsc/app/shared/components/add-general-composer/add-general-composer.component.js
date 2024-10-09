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
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from "@ngx-translate/core";
import { FuseTranslationLoaderService } from "../../../../@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
var AddGeneralComposerComponent = /** @class */ (function () {
    function AddGeneralComposerComponent(dialogRef, formBuilder, apiService, toasterService, actionData, translate, _fuseTranslationLoaderService) {
        var _a;
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.isWorking = false;
        this.croppedImage = '';
        this.countries = [];
        this.states = [];
        this.cities = [];
        this.associations = [];
        this.editors = [];
        this.genders = [
            { value: 'F', viewValue: this.translate.instant('general.female') },
            { value: 'M', viewValue: this.translate.instant('general.male') }
        ];
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    }
    AddGeneralComposerComponent.prototype.ngOnInit = function () {
        this.model = this.actionData.model ? this.actionData.model : {};
        console.log(this.model);
        this.buildForm();
        //this.getCountries();
        this.getAssociations();
        this.getEditors();
        if (this.model.id) {
            this.getComposer(this.model.id);
        }
        this.title = this.translate.instant(this.model.id ? 'general.updateComposer' : 'general.saveComposer');
    };
    AddGeneralComposerComponent.prototype.buildForm = function () {
        this.addComposerForm = this.formBuilder.group({
            id: [this.model.id],
            name: [this.model.name, [
                    Validators.required
                ]],
            lastName: [this.model.lastName, [
                    Validators.required
                ]],
            secondLastName: ['', []],
            birthDateString: ['', []],
            gender: ['', []],
            email: ['', []],
            officePhone: ['', []],
            cellPhone: ['', []],
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
            reference: ['', []],
            associationId: ['', [
                    Validators.required
                ]],
            editorId: ['', [
                    Validators.required
                ]],
            pictureUrl: ['', []],
            IPI: ['', []],
            ComposerDetailId: [0]
        });
    };
    Object.defineProperty(AddGeneralComposerComponent.prototype, "f", {
        get: function () { return this.addComposerForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddGeneralComposerComponent.prototype.selectImage = function ($evt) {
        this.addComposerForm.controls['pictureUrl'].patchValue($evt);
    };
    AddGeneralComposerComponent.prototype.save = function () {
        if (this.addComposerForm.valid) {
            this.model = this.addComposerForm.value;
            if (this.model.id) {
                this.updateComposer(this.model);
            }
            else {
                delete this.model.id;
                this.saveComposer(this.model);
            }
        }
    };
    AddGeneralComposerComponent.prototype.saveComposer = function (model) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.Composer, model).subscribe(function (data) {
            if (data.code == 100) {
                var composerDetail = {
                    id: 0,
                    associationId: _this.f.associationId.value,
                    editorId: _this.f.editorId.value,
                    composerId: data.result,
                    ipi: _this.f.IPI.value,
                };
                _this.saveComposerDetail(composerDetail, data.result);
            }
            else {
                _this.toasterService.showTranslate('errors.errorSavingItem');
                _this.isWorking = false;
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddGeneralComposerComponent.prototype.saveComposerDetail = function (model, composer) {
        var _this = this;
        this.apiService.save(EEndpoints.ComposerDetail, model).subscribe(function (data) {
            if (data.code == 100) {
                _this.toasterService.showTranslate('messages.itemSaved');
                _this.onNoClick(true);
            }
            else {
                _this.toasterService.showTranslate('errors.errorSavingItem');
                _this.onNoClick(false);
            }
            _this.isWorking = false;
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddGeneralComposerComponent.prototype.updateComposer = function (model) {
        var _this = this;
        this.apiService.update(EEndpoints.Composer, model).subscribe(function (data) {
            console.log('Update composer data: ', data);
            if (data.code == 100) {
                var composerDetail = {
                    id: _this.f.ComposerDetailId.value,
                    associationId: _this.f.associationId.value,
                    editorId: _this.f.editorId.value,
                    composerId: _this.f.id.value,
                    ipi: _this.f.IPI.value,
                };
                console.log('composerDetail: ', composerDetail);
                if (composerDetail.id !== 0) {
                    _this.apiService.update(EEndpoints.ComposerDetail, composerDetail).subscribe(function (result) {
                        console.log('the result updateComposerDetail: ', result);
                    });
                }
                else {
                    _this.saveComposerDetail(composerDetail, data.result);
                }
                _this.onNoClick(true);
                setTimeout(function () {
                    _this.toasterService.showToaster('Se editó el compositor correctamente.');
                }, 300);
            }
            else {
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddGeneralComposerComponent.prototype.getComposer = function (id) {
        var _this = this;
        this.apiService.get(EEndpoints.Composer, { id: id }).subscribe(function (data) {
            console.log('getComposer data: ', data);
            if (data.code == 100) {
                _this.apiService.get(EEndpoints.ComposerDetailByComposerId, { composerId: data.result.id }).subscribe(function (detail) {
                    console.log('The detail: ', detail);
                    Object.keys(_this.addComposerForm.controls).forEach(function (name) {
                        console.log('details object keys: ', name);
                        if (_this.addComposerForm.controls[name]) {
                            if (name === 'birthDateString') {
                                _this.addComposerForm.controls[name].patchValue(new Date(data.result.birthDateString));
                            }
                            else {
                                if (name === 'associationId' || name === 'editorId') {
                                    _this.addComposerForm.controls[name].patchValue(detail.result ? detail.result[name] : '');
                                }
                                else {
                                    if (name === 'IPI') {
                                        _this.addComposerForm.controls[name].patchValue(detail.result ? detail.result['ipi'] : '');
                                    }
                                    else {
                                        if (name === 'ComposerDetailId') {
                                            _this.addComposerForm.controls[name].patchValue(detail.result ? detail.result['id'] : 0);
                                        }
                                        else {
                                            _this.addComposerForm.controls[name].patchValue(data.result[name]);
                                        }
                                    }
                                }
                            }
                        }
                    });
                });
                //this.croppedImage = data.result.pictureUrl !== null ? 'data:image/jpg;base64,' + data.result.pictureUrl : '';
                //if (data.result.countryId !== null)
                //    this.getStates(data.result.countryId, data.result.stateId);
                //if (data.result.stateId !== null)
                //    this.getCities(data.result.stateId, data.result.cityId);
            }
            else {
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddGeneralComposerComponent.prototype.onNoClick = function (composer) {
        if (composer === void 0) { composer = undefined; }
        this.dialogRef.close(composer);
    };
    AddGeneralComposerComponent.prototype.getCountries = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Countries).subscribe(function (data) {
            if (data.code == 100) {
                _this.countries = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                _this.addComposerForm.value.stateId = undefined;
                _this.addComposerForm.value.cityId = undefined;
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddGeneralComposerComponent.prototype.getStates = function (id, stateId) {
        var _this = this;
        if (stateId === void 0) { stateId = undefined; }
        this.apiService.get(EEndpoints.StatesByCountry, { countryId: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.states = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                _this.addComposerForm.value.cityId = undefined;
                if (stateId !== undefined)
                    _this.addComposerForm.controls['stateId'].patchValue(stateId);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddGeneralComposerComponent.prototype.getCities = function (id, cityId) {
        var _this = this;
        if (cityId === void 0) { cityId = undefined; }
        this.apiService.get(EEndpoints.CitiesByState, { stateId: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.cities = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                if (cityId !== undefined)
                    _this.addComposerForm.controls['cityId'].patchValue(cityId);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddGeneralComposerComponent.prototype.getAssociations = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Associations)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.associations = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddGeneralComposerComponent.prototype.getEditors = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Editors)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.editors = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.dba
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddGeneralComposerComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddGeneralComposerComponent = __decorate([
        Component({
            selector: 'app-add-general-composer',
            templateUrl: './add-general-composer.component.html'
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddGeneralComposerComponent);
    return AddGeneralComposerComponent;
}());
export { AddGeneralComposerComponent };
//# sourceMappingURL=add-general-composer.component.js.map