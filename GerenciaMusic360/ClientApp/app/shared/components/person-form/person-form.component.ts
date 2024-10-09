import { Component, OnInit, Input, Inject, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { SelectOption } from '@models/select-option.models';
import { IPerson } from '@models/person';
import { isNullOrUndefined } from 'util';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';

@Component({
    selector: 'app-person-form',
    templateUrl: './person-form.component.html',
    styleUrls: ['./person-form.component.scss']
})

export class PersonFormComponent implements OnInit, OnChanges, OnDestroy {
    @Input() projectId: string;
    @Input() manageImage: boolean = true;
    @Input() person: IPerson;
    @Input() title: string;
    @Input('image') pictureURL: any;
    @Output() formReady = new EventEmitter<FormGroup>();
    @Output() outIsInternal = new EventEmitter<boolean>();
    personForm: FormGroup;
    genders: SelectOption[];
    @Input() isInternal: boolean = false;
    @Input() isContact: boolean = false;
    isComposer: boolean = false;
    isContractMember: boolean = false;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fb: FormBuilder,
        private service: ApiService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        public dialogRef: MatDialogRef<PersonFormComponent>,
    ) { }

    ngOnInit() {     
        this.isComposer = this.actionData.isComposer;
        this.isContractMember = this.actionData.isContractMember;

        if (!this.person) {
            this.person = <IPerson>{};
        }
        //this.person.isIntern = true;
        this._fuseTranslationLoaderService.loadTranslations(...allLang);

        this.genders = [
            { value: 'F', viewValue: 'general.female' },
            { value: 'M', viewValue: 'general.male' }
        ];

        this.initializeValidations();
        this.formReady.emit(this.personForm);
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    initializeValidations(): void {
        const birthDateString = (this.person.birthDateString)
            ? (new Date(this.person.birthDateString)).toISOString()
            : null;

        this.person.isInternal = (this.person.isInternal) ? true : false;

        this.personForm = this.fb.group({
            name: [this.person.name, [Validators.required]],
            lastName: [this.person.lastName, this.isContact ? [] : [Validators.required]],
            secondLastName: [this.person.secondLastName, []],
            birthDateString: [birthDateString, []],
            gender: [this.person.gender, this.isContact ? [] : [Validators.required] ],
            email: [this.person.email, []],
            officePhone: [this.person.officePhone],
            cellPhone: [this.person.cellPhone, []],
            pictureUrl: [this.person.pictureUrl, []],
            isInternal: [false, []],
        });

        this.isInternal = this.person.isInternal;
    }

    get f() { return this.personForm.controls; }

    selectImage($evt: any): void {
        this.personForm.controls['pictureUrl'].patchValue($evt);
    }

    ngOnDestroy(): void {
        this.formReady.complete();
    }

    sample(): void {
        this.isInternal = !this.isInternal;
        this.outIsInternal.emit(this.isInternal);
    }

    setComposer(): void {
        if (this.personForm.valid) {
            this.saveComposer();
        }
    }

    saveComposer(): void {
        this.service.save(EEndpoints.Composer, this.personForm.value)
        .subscribe(data => {
          if (data.code == 100) {            
            this.onNoClick(this.personForm.value);
          }           
        }, (err) => this.responseError(err)
        )        
    }

    setContractMember(): void {
        if (this.personForm.valid) {
            this.saveContractMember();
        }
    }

    saveContractMember(): void {
        this.service.save(EEndpoints.ContractMemberPerson, this.personForm.value)
        .subscribe(data => {
          if (data.code == 100) {            
            this.onNoClick(data.result);
          }           
        }, (err) => this.responseError(err)
        )        
    }

    onNoClick(status: IPerson = undefined): void {
        this.dialogRef.close(status);
    }

    private responseError(err: any) {        
        console.log('http error', err);
    }
}
