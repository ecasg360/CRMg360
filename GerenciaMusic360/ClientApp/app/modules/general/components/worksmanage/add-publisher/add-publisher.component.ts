import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IAssociation } from '@models/association';
import { SelectOption } from '@models/select-option.models';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IWorkPublisher } from '@models/IWorkPublisher';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ResponseApi } from '@models/response-api';
import { EEndpoints } from '@enums/endpoints';
import { startWith, map } from 'rxjs/operators';
import { IPublisher } from '@models/Publisher';

@Component({
  selector: 'app-add-publisher',
  templateUrl: './add-publisher.component.html',
  styleUrls: ['./add-publisher.component.scss']
})
export class AddPublisherComponent implements OnInit {

    isWorking: boolean = false;
    publishers: SelectOption[] = [];
    associations: SelectOption[] = [];
    composerForm: FormGroup;
    workPublisher: IWorkPublisher = <IWorkPublisher>{};
    subTitle: string;
    action: string = this.translate.instant('general.save');
    question = '';

    publisherFC = new FormControl();
    associationFC = new FormControl();
    filteredPublisherOptions: Observable<SelectOption[]>;
    filteredAssociationOptions: Observable<SelectOption[]>;

    isNewItem = false;
    newcomposerInfo = null;


    constructor(
        public dialogRef: MatDialogRef<AddPublisherComponent>,
        private apiService: ApiService,
        private toasterService: ToasterService,
        private translate: TranslateService,
        private formBuilder: FormBuilder,
        private translationLoaderService: FuseTranslationLoaderService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    ) {
        this.translationLoaderService.loadTranslations(...allLang);
    }

    ngOnInit() {
        this.getPublishers();
        this.getAssociations();
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');

        this.workPublisher = (this.actionData.workPublisher) ? this.actionData.workPublisher : {};
        this.subTitle = this.actionData.itemName;
        this.configurePublisherForm();
    }

    private configurePublisherForm(): void {

        this.composerForm = this.formBuilder.group({
            id: [this.workPublisher.id | 0, []],
            workId: [this.workPublisher.workId | 0, []],
            publisherId: [this.workPublisher.publisherId | 0, [Validators.required]],
            associationId: [this.workPublisher.associationId | 0],
            percentageRevenue: [this.workPublisher.percentageRevenue | 0, [Validators.required]],
        });
    }
    private _filter(value: string): SelectOption[] {
        const filterValue = value ? value.toLowerCase() : '';

        let results = [];
        results = this.publishers.filter(option => option.viewValue.toLowerCase().includes(filterValue));

        return (results.length == 0)
            ? [{
                value: 0,
                viewValue: `${this.question}${value.trim()}"?`,
            }]
            : results;
    }

    _filterAssociation(value: string): SelectOption[] {
        const filterValue = value ? value.toLowerCase() : '';

        let results = [];
        results = this.associations.filter(option => option.viewValue.toLowerCase().includes(filterValue));

        return (results.length == 0)
            ? [{
                value: 0,
                viewValue: `${this.question}${value.trim()}"?`,
            }]
            : results;
    }

    public optionPublisherSelected($event: MatAutocompleteSelectedEvent) {
        if ($event.option.id == '0') {
            let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            const composer = {
                id: 0,
                name: newItem,
                lastName: '',
            };
            this.newcomposerInfo = {
                id: 0,
                name: newItem,
                lastName: ''
            };
            this.savePublisher(composer);
            this.isNewItem = true;
        } else {
            this.isNewItem = false;
            this.newcomposerInfo = null;
            this.composerForm.controls['publisherId'].patchValue($event.option.id);
        }
    }

    public associationOptionSelected($event: MatAutocompleteSelectedEvent) {
        if ($event.option.id == '0') {
            let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            const association = <IAssociation>{
                id: 0,
                name: newItem
            };
            this.saveAssociation(association);
        } else {
            this.composerForm.controls['associationId'].patchValue($event.option.id);
        }
    }

    public save() {
        if (this.composerForm.valid) {
            this.workPublisher = <IWorkPublisher>this.composerForm.value;
            this.workPublisher.publisher = <IPublisher>{
                id: this.workPublisher.publisherId,
                name: this.publisherFC.value
            };

            this.workPublisher.association = <IAssociation>{
                id: this.workPublisher.associationId,
                name: this.associationFC.value
            };

            console.log('isNewItem: ', this.isNewItem);
            console.log('this.composerForm.controls: ', this.composerForm.controls);
            if (this.isNewItem) {
                const composer = {
                    id: this.newcomposerInfo.id,
                    name: this.newcomposerInfo.name,
                    lastName: '',
                    associationId: this.composerForm.controls.associationId.value
                };
                this.updatePublisher(composer);
            }
            this.onNoClick(this.workPublisher);
        }
    }

    private responseError(error: any): void {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    }

    onNoClick(workPublisher: IWorkPublisher = <IWorkPublisher>{}): void {
        this.dialogRef.close(workPublisher);
    }
    //#region API
    getAssociations(): void {
        this.apiService.get(EEndpoints.Associations)
            .subscribe((response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.associations = response.result.map((s: any) => ({
                        value: s.id,
                        viewValue: s.name
                    }));

                    this.filteredAssociationOptions = this.associationFC.valueChanges
                        .pipe(
                            startWith(''),
                            map(value => this._filterAssociation(value))
                        );
                }
            }, (err) => this.responseError(err));
    }

    getPublishers(): void {
        this.isWorking = true;
        this.apiService.get(EEndpoints.publisher).subscribe(
            (response: ResponseApi<IPublisher[]>) => {
                if (response.code == 100)
                    this.publishers = response.result.map(m => {
                        return {
                            value: m.id,
                            viewValue: `${m.name}`,
                        }
                    });
                this.filteredPublisherOptions = this.publisherFC.valueChanges
                    .pipe(
                        startWith(''),
                        map(value => this._filter(value))
                    );
                this.isWorking = false;
            }, err => this.responseError(err)
        );
    }

    savePublisher(model: any) {
        this.isWorking = true;
        this.apiService.save(EEndpoints.publisher, model).subscribe(
            data => {
                if (data.code == 100) {
                    model = data.result;
                    this.publishers.push({
                        value: model.id,
                        viewValue: model.name
                    });
                    this.newcomposerInfo.id = model.id;
                    this.composerForm.controls['publisherId'].patchValue(model.id);
                    setTimeout(() => this.publisherFC.setValue(model.name), 500);
                } else {
                    this.toasterService.showTranslate('errors.errorSavingItem');
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        );
    }

    saveAssociation(model: IAssociation) {
        this.apiService.save(EEndpoints.Associations, model)
            .subscribe((response: ResponseApi<IAssociation>) => {
                if (response.code == 100) {
                    this.associations.push({
                        value: response.result.id,
                        viewValue: response.result.name
                    });
                    this.composerForm.controls['associationId'].patchValue(response.result.id);
                    setTimeout(() => this.associationFC.setValue(response.result.name), 500);
                }
            }, (err) => this.responseError(err));
    }
    //#endregion

    updatePublisher(model: any) {
        this.isWorking = true;
        this.apiService.update(EEndpoints.publisher, model).subscribe(
            data => {
                if (data.code == 100) {
                    console.log('data en updatePublisher: ', data);
                } else {
                    this.toasterService.showTranslate('errors.errorSavingItem');
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        );
    }

}
