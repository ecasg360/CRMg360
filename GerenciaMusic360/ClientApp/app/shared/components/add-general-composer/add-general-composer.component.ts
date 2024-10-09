import { Component, OnInit, Optional, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { SelectOption } from "ClientApp/app/shared/models/select-option.models";
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from "@models/response-api";
import { IComposerDetail } from "@models/composer-detail";
import { TranslateService } from "@ngx-translate/core";
import { FuseTranslationLoaderService } from "../../../../@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
import { CodegenComponentFactoryResolver } from "@angular/core/src/linker/component_factory_resolver";

@Component({
    selector: 'app-add-general-composer',
    templateUrl: './add-general-composer.component.html'
})

export class AddGeneralComposerComponent implements OnInit {
    addComposerForm: FormGroup;
    isWorking: boolean = false;
    title: string;
    model: any;
    croppedImage: any = '';
    cropImage: any;
    countries: SelectOption[] = [];
    states: SelectOption[] = [];
    cities: SelectOption[] = [];
    associations: SelectOption[] = [];
    editors: SelectOption[] = [];
    pictureURL: any;

    genders: SelectOption[] = [
        { value: 'F', viewValue: this.translate.instant('general.female') },
        { value: 'M', viewValue: this.translate.instant('general.male') }
    ];

    constructor(
        public dialogRef: MatDialogRef<AddGeneralComposerComponent>,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
    }

    ngOnInit() {        
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
    }

    private buildForm() {
        this.addComposerForm = this.formBuilder.group({
            id:[this.model.id],
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
            pictureUrl: ['',[]],
            IPI: ['', []],
            ComposerDetailId: [0]
        });
    }

    get f() { return this.addComposerForm.controls; }

    selectImage($evt: any): void {
        this.addComposerForm.controls['pictureUrl'].patchValue($evt);
    }

    save() {
        if (this.addComposerForm.valid) {
            this.model = this.addComposerForm.value;
            if (this.model.id) {
                this.updateComposer(this.model);
            } else {
                delete this.model.id;
                this.saveComposer(this.model);
            }
        } 
    }

    saveComposer(model: any) {
        this.isWorking = true;
        this.apiService.save(EEndpoints.Composer, model).subscribe(
            data => {
                if (data.code == 100) {
                    let composerDetail: IComposerDetail = <IComposerDetail>{
                        id: 0,
                        associationId: this.f.associationId.value,
                        editorId: this.f.editorId.value,
                        composerId: data.result,
                        ipi: this.f.IPI.value,
                    };
                    this.saveComposerDetail(composerDetail, data.result);
                } else {
                    this.toasterService.showTranslate('errors.errorSavingItem');
                    this.isWorking = false;
                }
            }, err => this.responseError(err)
        );
    }

    saveComposerDetail(model: any, composer: any) {
        this.apiService.save(EEndpoints.ComposerDetail, model).subscribe(data => {
            if (data.code == 100) {
                this.toasterService.showTranslate('messages.itemSaved');
                this.onNoClick(true);
            } else {
                this.toasterService.showTranslate('errors.errorSavingItem');
                this.onNoClick(false);
            }
            this.isWorking = false;
        }, (err) => console.error('Failed! ' + err));
    }

    updateComposer(model: any) {
        this.apiService.update(EEndpoints.Composer, model).subscribe(
            data => {
                console.log('Update composer data: ', data);
                    if (data.code == 100) {
                        let composerDetail: IComposerDetail = <IComposerDetail>{
                            id: this.f.ComposerDetailId.value,
                            associationId: this.f.associationId.value,
                            editorId: this.f.editorId.value,
                            composerId: this.f.id.value,
                            ipi: this.f.IPI.value,
                        };
                        console.log('composerDetail: ', composerDetail);
                        if (composerDetail.id !== 0) {
                            this.apiService.update(EEndpoints.ComposerDetail, composerDetail).subscribe(result => {
                                console.log('the result updateComposerDetail: ', result);
                            });
                        } else {
                            this.saveComposerDetail(composerDetail, data.result);
                        }
                        this.onNoClick(true);
                        setTimeout(() => {
                            this.toasterService.showToaster('Se editó el compositor correctamente.');
                        }, 300);
                    } else {
                        setTimeout(() => {
                            this.toasterService.showToaster(data.message);
                        }, 300);
                    }
                }, (err) => console.error('Failed! ' + err));
    }

    getComposer(id) {
        this.apiService.get(EEndpoints.Composer, { id: id }).subscribe(data => {
            console.log('getComposer data: ', data);
            if (data.code == 100) {
                this.apiService.get(
                    EEndpoints.ComposerDetailByComposerId,
                    { composerId: data.result.id }
                ).subscribe(
                    detail => {
                        console.log('The detail: ', detail);
                        Object.keys(this.addComposerForm.controls).forEach(name => {
                            console.log('details object keys: ', name);
                            if (this.addComposerForm.controls[name]) {
                                if (name === 'birthDateString') {
                                    this.addComposerForm.controls[name].patchValue(new Date(data.result.birthDateString));
                                } else {
                                    if (name === 'associationId' || name === 'editorId') {
                                        this.addComposerForm.controls[name].patchValue(detail.result ? detail.result[name] : '');
                                    } else {
                                        if (name === 'IPI') {
                                            this.addComposerForm.controls[name].patchValue(detail.result ? detail.result['ipi'] : '');
                                        } else {
                                            if (name === 'ComposerDetailId') {
                                                this.addComposerForm.controls[name].patchValue(detail.result ? detail.result['id'] : 0);
                                            } else {
                                                this.addComposerForm.controls[name].patchValue(data.result[name]);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                );

                //this.croppedImage = data.result.pictureUrl !== null ? 'data:image/jpg;base64,' + data.result.pictureUrl : '';
                //if (data.result.countryId !== null)
                //    this.getStates(data.result.countryId, data.result.stateId);
                //if (data.result.stateId !== null)
                //    this.getCities(data.result.stateId, data.result.cityId);

            } else {
                setTimeout(() => {
                    this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, err => this.responseError(err));
    }

    onNoClick(composer = undefined): void {
        this.dialogRef.close(composer);
    }

    getCountries() {
        this.apiService.get(EEndpoints.Countries).subscribe(data => {
            if (data.code == 100) {
                this.countries = data.result.map(s => ({
                    value: s.id,
                    viewValue: s.name
                }));
                this.addComposerForm.value.stateId = undefined;
                this.addComposerForm.value.cityId = undefined;
            }
        }, (err) => console.error('Failed! ' + err));
    }

    getStates(id, stateId = undefined) {
        this.apiService.get(EEndpoints.StatesByCountry, { countryId: id }).subscribe(data => {
            if (data.code == 100) {
                this.states = data.result.map(s => ({
                    value: s.id,
                    viewValue: s.name
                }));
                this.addComposerForm.value.cityId = undefined;

                if (stateId !== undefined)
                    this.addComposerForm.controls['stateId'].patchValue(stateId);
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
                    this.addComposerForm.controls['cityId'].patchValue(cityId);
            }
        }, (err) => console.error('Failed! ' + err));
    }

    getAssociations(): void {
        this.apiService.get(EEndpoints.Associations)
            .subscribe((response: ResponseApi<any>) => {
            if (response.code == 100) {
                this.associations = response.result.map((s: any) => ({
                value: s.id,
                viewValue: s.name
                }));
            }
            }, (err) => this.responseError(err));
    }

    getEditors(): void {
        this.apiService.get(EEndpoints.Editors)
            .subscribe((response: ResponseApi<any>) => {
            if (response.code == 100) {                
                this.editors = response.result.map((s: any) => ({
                value: s.id,
                viewValue: s.dba
                }));
            }
            }, (err) => this.responseError(err));
    }

    private responseError(error: any): void {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    }
}