import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IProject } from '@models/project';
import { IContact } from '@models/contact';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { IPerson } from '@models/person';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { SelectOption } from '@models/select-option.models';

@Component({
    selector: 'project-contact-form',
    templateUrl: './project-contact-form.component.html',
})

export class ProjectContactFormComponent implements OnInit {
    contactForm: FormGroup;
    action: string;
    project: IProject = <IProject>{};
    contact: IContact = <IContact>{};
    person: IPerson = <IPerson>{};
    projectId: number;
    id: number = 0;
    isWorking = true;
    pictureUrl: any;
    contactTypes: SelectOption[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        public dialogRef: MatDialogRef<IContact>,
        private service: ApiService
    ) { }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.id = this.actionData.id;
        this.projectId = this.actionData.projectId;
        if (this.id == 0) {
            this.action = this.translate.instant('general.save');
        } else {
            this.action = this.translate.instant('general.save');
            this.contact = (this.actionData.model) ? <IContact>this.actionData.model : <IContact>{};
            this.person = <IPerson>this.contact;
            this.pictureUrl = this.contact.pictureUrl;
        }
        this.isWorking = false;
        this.initForm();
    }

    initForm(): void {
        this.contactForm = this.formBuilder.group({
            typeId: [this.contact.typeId, [
                Validators.required
            ]]
        });
        this.getContactTypes();
    }

    bindExternalForm(name: string, form: FormGroup) {
        this.contactForm.setControl(name, form);
    }

    get f() { return this.contactForm.controls; }

    setContact(): void {
        if (!this.contactForm.invalid) {
            this.isWorking = true;
            const formValues = this.contactForm.value;
            this.contact = <IContact>formValues.generalData;
            this.contact.id = this.id;
            for (const key in formValues) {
                if (key != 'generalData') {
                    let value = formValues[key];
                    this.contact[key] = value;
                }
            }
            this.dialogRef.close(this.contact);
        }
    }

    private getContactTypes() {
        const params = [];
        params['typeId'] = 5;
        this.service.get(EEndpoints.Types, params).subscribe((response: ResponseApi<any>) => {
            if (response.code == 100) {
                this.contactTypes = response.result.map((s: any) => ({
                    value: s.id,
                    viewValue: s.name
                }));
            }
        }, (err) => this.responseError(err));
    }

    onNoClick(status: IContact = undefined): void {
        this.dialogRef.close(status);
    }

    //Imagen methods

    private responseError(err: any) {
        this.isWorking = false;
        console.log('http error', err);
    }
}
