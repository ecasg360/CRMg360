import { Component, OnInit, Optional, Inject } from '@angular/core';
import { SelectOption } from '@models/select-option.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonDocument } from '@models/person-document';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { ResponseApi } from '@models/response-api';
import { ResponseSelect } from '@models/select-response';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';

@Component({
    selector: 'app-person-document-form',
    templateUrl: './person-document-form.component.html',
    styleUrls: ['./person-document-form.component.scss']
})
export class PersonDocumentFormComponent implements OnInit {

    titleAction: string;
    action: string;

    documentTypes: SelectOption[] = [];
    countries: SelectOption[] = [];
    personDocumentForm: FormGroup;

    id: number = 0;
    croppedImage: any = "";
    isWorking: boolean = true;
    data: PersonDocument;

    constructor(
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fb: FormBuilder,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        public dialogRef: MatDialogRef<PersonDocument>,
        private apiService: ApiService
    ) { }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.id = this.actionData.id;

        if (this.id == 0) {
            this.data = <PersonDocument>{};
            this.titleAction = this.translate.instant('general.save');
            this.action = this.translate.instant('general.save');
        } else {
            this.titleAction = this.translate.instant('general.save');
            this.action = this.translate.instant('general.save');
            this.data = (this.actionData.model) ? this.actionData.model : <PersonDocument>{};
        }
        this.isWorking = false;

        if (this.actionData.documentTypes) {
            this.documentTypes = this.actionData.documentTypes;
        } else {
            this.getDocumentsTypesApi();
        }

        if (this.actionData.countries) {
            this.countries = this.actionData.countries;
        } else {
            this.getCountriesApi();
        }

        this.initializeValidations();
    }

    get f() { return this.personDocumentForm.controls; }

    /**
     * Establece las validaciones del formulario asociado a los datos basicos del proyecto
     *
     * @memberof ProjectDataComponent
     */
    initializeValidations(): void {
        const expiredDate = (this.data.expiredDate) ? (new Date(this.data.expiredDate)).toISOString() : '';
        const emisionDate = (this.data.emisionDate) ? (new Date(this.data.emisionDate)).toISOString() : '';
        this.personDocumentForm = this.fb.group({
            countryId: [this.data.countryId, [Validators.required]],
            personDocumentTypeId: [this.data.personDocumentTypeId, [Validators.required]],
            expiredDateString: [expiredDate, [Validators.required]],
            emisionDateString: [emisionDate, [Validators.required]],
            number: [this.data.number, [Validators.required]],
            legalName: [this.data.legalName, [Validators.required]]
        });

    }

    getCountriesApi() {
        this.apiService.get(EEndpoints.Countries).subscribe(
            (data: ResponseApi<any>) => {
                if (data.code == 100) {
                    this.countries = data.result.map((s: ResponseSelect) => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                }
            }, (err) => console.error('Countries Failed! ', err));
    }

    getDocumentsTypesApi() {
        this.apiService.get(EEndpoints.PersonDocumentTypes).subscribe(
            (data: ResponseApi<any>) => {
                if (data.code == 100) {
                    this.documentTypes = data.result.map((s: ResponseSelect) => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                }
            }, (err) => console.error('document type Failed! ', err));
    }

    setDocument(): void {
        if (!this.personDocumentForm.invalid) {
            this.isWorking = true;
            this.data = <PersonDocument>this.personDocumentForm.value;
            this.data.id = this.id;
            this.data.expiredDate = this.data.expiredDateString;
            this.data.emisionDate = this.data.emisionDateString;
            this.data.legalName = this.data.legalName;
            const country = this.countries.find(f => f.value == this.data.countryId);
            const documentType = this.documentTypes.find(f => f.value == this.data.personDocumentTypeId);
            if (country) this.data.country = country.viewValue;
            if (documentType) this.data.documentType = documentType.viewValue;
            this.dialogRef.close(this.data);
        }
    }

    onNoClick(status = false): void {
        this.dialogRef.close(undefined);
    }
}
