import { Component, OnInit, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { IPerson } from '@models/person';
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from "@services/api.service";
import { ResponseApi } from '@models/response-api';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IWorkCollaborator } from '@models/work-collaborator';
import { SelectOption } from '@models/select-option.models';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { IAssociation } from '@models/association';

@Component({
  selector: 'app-add-composer',
  templateUrl: './add-composer.component.html',
  styleUrls: ['./add-composer.component.css']
})
export class AddComposerComponent implements OnInit {

  isWorking:boolean = false;
    composers: SelectOption[] = [];
    associations: SelectOption[] = [];
  composerForm: FormGroup;
    workCollaborator: IWorkCollaborator = <IWorkCollaborator>{};
    subTitle: string;
  action: string = this.translate.instant('general.save');
    question = '';

    composerFC = new FormControl();
    associationFC = new FormControl();
    filteredComposerOptions: Observable<SelectOption[]>;
    filteredAssociationOptions: Observable<SelectOption[]>;


  constructor(
    public dialogRef: MatDialogRef<AddComposerComponent>,
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
      this.getComposers();
      this.getAssociations();
      this.question = this.translate.instant('messages.autoCompleteAddQuestion');
      
      this.workCollaborator = (this.actionData.workCollaborator) ? this.actionData.workCollaborator : {};
      this.subTitle = this.actionData.itemName;
    this.configureComposerForm();
  }

  private configureComposerForm(): void {

      this.composerForm = this.formBuilder.group({
      id: [this.workCollaborator.id | 0, []],
      workId: [this.workCollaborator.workId | 0, []],
      composerId: [this.workCollaborator.composerId | 0, [Validators.required]],
          associationId: [this.workCollaborator.associationId | 0],
      percentageRevenue: [this.workCollaborator.percentageRevenue | 0, [Validators.required]],
    });
  }
    private _filter(value: string): SelectOption[] {
        const filterValue = value ? value.toLowerCase() : '';

        let results = [];
        results = this.composers.filter(option => option.viewValue.toLowerCase().includes(filterValue));

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

    public optionComposerSelected($event: MatAutocompleteSelectedEvent) {
        if ($event.option.id == '0') {
            let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            const composer = {
                id: 0,
                name: newItem,
                lastName: '',
            };
            this.saveComposer(composer);
        } else {
            this.composerForm.controls['composerId'].patchValue($event.option.id);
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
            this.workCollaborator = <IWorkCollaborator>this.composerForm.value;
            this.workCollaborator.composer = <IPerson> {
                id: this.workCollaborator.composerId,
                name: this.composerFC.value
            };

            this.workCollaborator.association = <IAssociation> {
                id: this.workCollaborator.associationId,
                name: this.associationFC.value
            };
            this.onNoClick(this.workCollaborator);
        }
    }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

    onNoClick(workCollaborator: IWorkCollaborator = <IWorkCollaborator>{}): void {
        this.dialogRef.close(workCollaborator);
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

    getComposers(): void {
        this.isWorking = true;
        this.apiService.get(EEndpoints.ComposersProjectWork).subscribe(
            (response: ResponseApi<IPerson[]>) => {
                if (response.code == 100)
                    this.composers = response.result.map(m => {
                        return {
                            value: m.id,
                            viewValue: `${m.name} ${m.lastName} `,
                        }
                    });
                this.filteredComposerOptions = this.composerFC.valueChanges
                    .pipe(
                        startWith(''),
                        map(value => this._filter(value))
                    );
                this.isWorking = false;
            }, err => this.responseError(err)
        );
    }

    saveComposer(model: any) {
        this.isWorking = true;
        this.apiService.save(EEndpoints.Composer, model).subscribe(
            data => {
                if (data.code == 100) {
                    model.id = data.result;
                    this.composers.push({
                        value: model.id,
                        viewValue: model.name
                    });
                    this.composerForm.controls['composerId'].patchValue(model.id);
                    setTimeout(() => this.composerFC.setValue(model.name), 500);
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
}
