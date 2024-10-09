import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ePersonType } from '@enums/person-type';
import { ResponseApi } from '@models/response-api';
import { IPersonProject } from '@models/person-project';
import { SelectOption } from '@models/select-option.models';
import { startWith, map } from 'rxjs/operators';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ELabelCopyType } from '@enums/types';
import { MatAutocompleteSelectedEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IPerson } from '@models/person';
import { AddContactComponent } from '@shared/components/add-contact/add-contact.component';
import { IProject } from '@models/project';

@Component({
  selector: 'app-project-label-copy-modal',
  templateUrl: './project-label-copy-modal.component.html',
  styleUrls: ['./project-label-copy-modal.component.scss']
})
export class ProjectLabelCopyModalComponent implements OnInit {

  isWorking: boolean = false;
  enginnerList: SelectOption[] = [];
  recordingEngineerFiltered: Observable<any[]>;
  recordingEngineerFC = new FormControl();
  formLabelCopy: FormGroup;
  question ="";
  labelCopyType = ELabelCopyType;
  projectId: number;
  producers = [];

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private translate: TranslateService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    public dialogRef: MatDialogRef<ProjectLabelCopyModalComponent>,
  ) { }

  ngOnInit() {
    console.log('input project: ', this.actionData.projectId);
    console.log('input producers: ', this.actionData.producers);
    this.projectId = this.actionData.projectId;
    this.producers = this.actionData.producers;
    this.configureForm();
    this._getEnginnerApi();
  }
  private configureForm(): void {
    this.formLabelCopy = this.fb.group({
      personRecordingEngineerId: [null, [Validators.required]],
    });
  }

  private _getEnginnerApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ProjectContactsByType, { personTypeId: ePersonType.IngenieroGrabacion }).subscribe(
      (response: ResponseApi<IPersonProject[]>) => {
        if (response.code == 100) {
          this.enginnerList = response.result.map(m => ({ value: m.id, viewValue: `${m.name} ${m.lastName}` }));
          this.recordingEngineerFiltered = this.recordingEngineerFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value, this.enginnerList))
            );
            //this._populateAutocompleteFC();
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _filter(value: string, list: SelectOption[]): SelectOption[] {
    const filterValue = value.toLowerCase();

    let result = list.filter(option => option.viewValue.toLowerCase().includes(filterValue));

    return (result.length == 0)
      ? [{
        value: 0,
        viewValue: `${this.question}${value.trim()}"?`
      }]
      : result;
  }

  private _responseError(err: HttpErrorResponse) {
    console.log(err);
    this.isWorking = false;
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
  }

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent, type: ELabelCopyType) {
    if ($event.option.id != '0') {
      this.f.personRecordingEngineerId.patchValue($event.option.id);
    } else {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
      this._contactModal(newItem, ePersonType.IngenieroGrabacion, type);
    }
  }

  private _contactModal(value: string, contactType: number,type: ELabelCopyType): void {
    const model = <IPerson>{
      name: value
    }
    const dialogRef = this.dialog.open(AddContactComponent, {
      width: '1000px',
      data: {
        id: 0,
        model: model,
        projectId: this.projectId,
        personTypeId: contactType,
        showSelectType: false,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (type == ELabelCopyType.recordingEngineer) {
        if (result != undefined) {
          this.enginnerList.push({ value: result.id, viewValue: `${result.name} ${result.lastName}` });
          this.f.personRecordingEngineerId.patchValue(result.id);
          setTimeout(() => this.recordingEngineerFC.setValue(`${result.name} ${result.lastName}`));
        } else
          this.recordingEngineerFC.patchValue('');
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectContact() {
    this.dialogRef.close(this.formLabelCopy.controls.personRecordingEngineerId.value);
  }

  get f() { return this.formLabelCopy.controls; }

}
