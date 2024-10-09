import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IPerson } from '@models/person';
import { IMember } from '@models/member';
import { SelectOption } from '@models/select-option.models';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ResponseApi } from '@models/response-api';
import { IAddress } from '@models/Address';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { Observable } from 'rxjs';
import { MainActivity } from '../../models/main-activity';
import { startWith, map } from 'rxjs/operators';


@Component({
    selector: 'app-member-form',
    templateUrl: './member-form.component.html',
    styleUrls: ['./member-form.component.scss'],
    providers: [{
        provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
    }]
})
export class MemberFormComponent implements OnInit {

    memberForm: FormGroup;
    action: string;
    titleAction: string;
    person: IPerson = <IPerson>{};
    member: IMember = <IMember>{};
    mainActivities: SelectOption[] = [];
    musicalInstruments: SelectOption[] = [];
    addressList: IAddress[] = [];
    id: number = 0;
    isWorking = true;
    pictureUrl: any;
    question = '';

    mainActivityFC = new FormControl();
    filteredOptions: Observable<SelectOption[]>;

    constructor(
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        public dialogRef: MatDialogRef<IMember>,
        private apiService: ApiService
    ) { }

    ngOnInit() {
        this.getMainActivitiesApi();
        this.getMusicalInstrumentsApi();
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.id = this.actionData.id;
        if (this.id == 0) {
            this.titleAction = this.translate.instant('general.saveMembers');
            this.action = this.translate.instant('general.save');
        } else {
            this.titleAction = this.translate.instant('general.saveMembers');
            this.action = this.translate.instant('general.save');
            this.member = (this.actionData.model) ? <IMember>this.actionData.model : <IMember>{};
            this.person = <IPerson>this.member;
            this.pictureUrl = this.member.pictureUrl;
            this.getMemberMusicalInstruments(this.member.id);
        }
        this.isWorking = false;
        this.initForm();
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    }

    initForm(): void {
        const startDateJoinedString = (this.member.startDateJoinedString)
            ? (new Date(this.member.startDateJoinedString)).toISOString() : null;

        const endDateJoinedString = (this.member.endDateJoinedString)
            ? (new Date(this.member.endDateJoinedString)).toISOString() : null;

        this.memberForm = this.formBuilder.group({
            mainActivityId: [this.member.mainActivityId, [
                Validators.required
            ]],
            startDateJoinedString: [startDateJoinedString, [
                Validators.required
            ]],
            endDateJoinedString: [endDateJoinedString, [
            ]],
            biography: [this.member.biography, []],
            musicalsInstruments: [this.member.musicalsInstruments]
        });
    }

    bindExternalForm(name: string, form: FormGroup) {
        this.memberForm.setControl(name, form);
    }

    get f() { return this.memberForm.controls; }

    getMainActivitiesApi(): void {
        this.apiService.get(EEndpoints.MainActivities).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.mainActivities = response.result.map((s: any) => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                }

                this.filteredOptions = this.mainActivityFC.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value))
                );
            }, err => this.responseError(err)
        )
    }

    getMusicalInstrumentsApi() {
        this.apiService.get(EEndpoints.MusicalInstruments).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.musicalInstruments = response.result.map((s: any) => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                }
            }, err => this.responseError(err)
        )
    }

    getMemberMusicalInstruments(personId: any) {
        this.apiService.get(EEndpoints.PersonMusicalInstruments, { personId: personId }).subscribe(
            (data: ResponseApi<any>) => {
                if (data.code == 100) {
                    this.member.musicalsInstruments = data.result.map((m: any) => (m.musicalInstrumentId));
                    this.memberForm.controls['musicalsInstruments'].patchValue(this.member.musicalsInstruments);
                }
            }, err => this.responseError(err)
        )
    }

    setMember(): void {
        if (!this.memberForm.invalid) {
            this.isWorking = true;
            const formValues = this.memberForm.value;
            this.member = <IMember>formValues.generalData;
            this.member.id = this.id;
            for (const key in formValues) {
                if (key != 'generalData') {
                    let value = formValues[key];
                    this.member[key] = value;
                }
            }
            this.member.addressList = this.addressList;
            console.log(this.member);
            this.dialogRef.close(this.member);
        }
    }

    onNoClick(status: IMember = undefined): void {
        this.dialogRef.close(status);
    }

    public autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
        console.log($event);
        if ($event.option.id == '0') {
            let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            let mainActivity = <MainActivity>{
                name: newItem,
                description: ''
            }
            this._saveMainActivity(mainActivity);
        } else {
            this.f.mainActivityId.patchValue($event.option.id);
        }
    }

    private _filter(value: string): SelectOption[] {
        const filterValue = value ? value.toLowerCase() : '';
        let results = [];
        results = this.mainActivities.filter(option => option.viewValue.toLowerCase().includes(filterValue));

        return (results.length == 0)
            ? [{
                value: 0,
                viewValue: `${this.question}${value.trim()}"?`
            }]
            : results;
    }

    //Imagen methods

    receiveAddressData($event: IAddress[]) {
        this.addressList = $event;
    }

    private responseError(err: any) {
        this.isWorking = false;
        console.log('http error', err);
    }


    private _saveMainActivity(model: MainActivity) {
        this.isWorking = true;
        this.apiService.save(EEndpoints.MainActivity, model).subscribe(
            (response: ResponseApi<MainActivity>) => {
                if (response.code == 100) {
                    this.mainActivities.push({
                        value: response.result.id,
                        viewValue: response.result.name
                    });
                    setTimeout(() => this.mainActivityFC.setValue(response.result.name));
                    this.f.mainActivityId.patchValue(response.result.id);
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        )
    }
}
