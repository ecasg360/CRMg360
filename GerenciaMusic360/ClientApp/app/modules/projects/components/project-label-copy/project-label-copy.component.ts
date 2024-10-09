import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IProject } from '@models/project';
import { allLang } from '@i18n/allLang';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ILabelCopy } from '@models/label-copy';
import { SelectOption } from '@models/select-option.models';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { HttpErrorResponse } from '@angular/common/http';
import { ETypeName } from '@enums/type-name';
import { IType } from '@models/type';
import { ePersonType } from '@enums/person-type';
import { IPersonProject } from '@models/person-project';
import { IConfigurationLabelCopy } from '@models/configuration-label-copy';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ELabelCopyType } from '@enums/types';
import { MatAutocompleteSelectedEvent, MatDialog, MatRadioButton } from '@angular/material';
import { AddTypeComponent } from '@shared/components/add-type/add-type.component';
import { AddContactComponent } from '@shared/components/add-contact/add-contact.component';
import { IPerson } from '@models/person';
import { IPersonType } from '@models/person-type';
import { isNullOrUndefined } from 'util';
import { ProjectLabelCopyModalComponent } from './project-label-copy-modal/project-label-copy-modal.component';

@Component({
  selector: 'app-project-label-copy',
  templateUrl: './project-label-copy.component.html',
  styleUrls: ['./project-label-copy.component.scss']
})

export class ProjectLabelCopyComponent implements OnInit, OnChanges {

  @Input() project: IProject = <IProject>{};
  @Input() perm: any = {};

  labelCopyType = ELabelCopyType;

  //forms controls
  producerExecutiveFC = new FormControl();
  studioFC = new FormControl();
  distributorFC = new FormControl();
  recordingEngineerFC = new FormControl({value: '', disabled: true});
  mixAndMasterFC = new FormControl();
  locationFC = new FormControl();

  //filtered lists
  producerExecutiveFiltered: Observable<any[]>;
  studioFiltered: Observable<any[]>;
  distributorFiltered: Observable<any[]>;
  recordingEngineerFiltered: Observable<any[]>;
  mixAndMasterFiltered: Observable<any[]>;

  formLabelCopy: FormGroup;
  labelCopy: ILabelCopy = <ILabelCopy>{};
  isWorking: boolean = false;
  productorsList: SelectOption[] = [];
  studiosList: SelectOption[] = [];
  distributorsList: SelectOption[] = [];
  enginnerList: SelectOption[] = [];
  mixMastersList: SelectOption[] = [];
  personTypeList: IPersonType[] = [];
  typeNames: any[] = [];
  personsRecordingEngineerIds = [];
  recordLabel: string;
  

  question ="";

  constructor(
    private toaster: ToasterService,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialog: MatDialog,
  ) {
    this._getTypeNames();
  }

  ngOnInit() {
    this.translationLoader.loadTranslations(...allLang);
    this.configureForm();
    this._getDistributorApi();
    this._getStudioApi();
    this._getProductorApi();
    this._getEnginnerApi();
    this._getMixMasterApi();
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    //this.recordLabel = 'LDV';
  }

  ngOnChanges(changes: SimpleChanges): void {
      const project = changes.project;
    if (project.currentValue.id)
      this._getLabelCopyByProjectApi();
  }

  //#region form

  get f() { return this.formLabelCopy.controls; }

  private configureForm(): void {
    this.formLabelCopy = this.fb.group({
      id: [this.labelCopy.id, []],
      projectId: [this.project.id, []],
      personProducerExecutiveId: [this.labelCopy.personProducerExecutiveId, [Validators.required]],
      personRecordingEngineerId: [this.labelCopy.personRecordingEngineerId, []],
      studioId: [this.labelCopy.distributorId, [Validators.required]],
      distributorId: [this.labelCopy.distributorId, [Validators.required]],
      personMixMasterId: [this.labelCopy.personMixMasterId, [Validators.required]],
      dateLastUpdate: [this.labelCopy.dateLastUpdate, []],
      location: [this.labelCopy.location, [Validators.required]],
      recordLabel: [
        this.labelCopy.recordLabel
          ? this.labelCopy.recordLabel
          : 'GM360',
        [Validators.required]
      ],
      producerList: [this.labelCopy.producerList, [Validators.required]]
    });
    if (this.labelCopy.producers) {
      const producers = this.labelCopy.producers.split(';');
      producers.forEach(producer => {
        this.addPersonProducer(parseInt(producer));
      });
    } else {
      if (this.labelCopy && this.labelCopy.personRecordingEngineerId) {
        this.addPersonProducer(this.labelCopy.personRecordingEngineerId);
      }
    }
    this.recordLabel = this.labelCopy.recordLabel
      ? this.labelCopy.recordLabel
      : 'GM360';
  }

  //#endregion

  saveLabel() {
    this.labelCopy = <ILabelCopy>this.formLabelCopy.value;
    if (!this.labelCopy.projectId) {
        this.labelCopy.projectId = this.project.id;
    }
    let labelCopy = Object.assign({}, this.labelCopy);
    if (this.labelCopy.id)
      this._updateLabelCopy(labelCopy);
    else
      this._createLabelCopy(labelCopy);
  }

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent, type: ELabelCopyType) {
    if ($event.option.id != '0') {
      this._setFormValue($event.option.id, type);
    } else {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
      this._modalManage(type, newItem);
    }
  }

  enter(type: ELabelCopyType) {
    let value = '';
    if (type == ELabelCopyType.studio) {
      value = this.studioFC.value;
    } else if (type == ELabelCopyType.distributor) {
      value = this.distributorFC.value;
    } else if (type == ELabelCopyType.recordingEngineer) {
      value = this.recordingEngineerFC.value;
    } else if (type == ELabelCopyType.mixAndMaster) {
      value = this.mixAndMasterFC.value;
    } else if (type == ELabelCopyType.productor) {
      value = this.producerExecutiveFC.value;
    } else if (type == ELabelCopyType.location) {
      value = this.locationFC.value;
    }
    this._modalManage(type, value);
  }

  private _populateLabelCopy(configuration: IConfigurationLabelCopy) {
    this.labelCopy = <ILabelCopy>{
      id: null,
      projectId: this.project.id,
      personProducerExecutiveId: configuration.personProducerExecutiveDefaultId,
      personRecordingEngineerId: configuration.personRecordingEngineerDefaultId,
      studioId: configuration.studioDefaultId,
      distributorId: configuration.distributorDefaultId,
      personMixMasterId: configuration.personMixMasterDefaultId,
      dateLastUpdate: null,
    }
    this.configureForm();
  }

  private _populateAutocompleteFC() {
    if (!isNullOrUndefined(this.labelCopy)) {
      if (this.studiosList.length > 0 && !this.studioFC.value) {
        const found = this.studiosList.find(f => f.value == this.labelCopy.studioId);
        if (found)
          this.studioFC.patchValue(found.viewValue);
      }

      if(this.productorsList.length > 0 && !this.producerExecutiveFC.value) {
        const found = this.productorsList.find(f => f.value == this.labelCopy.personProducerExecutiveId);
        if (found)
          this.producerExecutiveFC.patchValue(found.viewValue);
      }

      if (this.enginnerList.length > 0  && !this.recordingEngineerFC.value ) {
        const found = this.enginnerList.find(f => f.value == this.labelCopy.personRecordingEngineerId);
        if (found)
          this.recordingEngineerFC.patchValue(found.viewValue);
      }

      if (this.distributorsList.length > 0  && !this.distributorFC.value ) {
        const found = this.distributorsList.find(f => f.value == this.labelCopy.distributorId);
        if (found)
          this.distributorFC.patchValue(found.viewValue);
      }

      if (this.mixMastersList.length > 0  && !this.mixAndMasterFC.value ) {
        const found = this.mixMastersList.find(f => f.value == this.labelCopy.personMixMasterId);
        if (found)
          this.mixAndMasterFC.patchValue(found.viewValue);
      }
    }
  }

  private _responseError(err: HttpErrorResponse) {
    console.log(err);
    this.isWorking = false;
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
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

  private _setFormValue(id: any, type: ELabelCopyType) {
    if (type == ELabelCopyType.productor) {
      this.f.personProducerExecutiveId.patchValue(id);
    } else if (type == ELabelCopyType.studio) {
      this.f.studioId.patchValue(id);
    } else if (type == ELabelCopyType.distributor) {
      this.f.distributorId.patchValue(id);
    } else if (type == ELabelCopyType.recordingEngineer) {
      this.f.personRecordingEngineerId.patchValue(id);
    } else if (type == ELabelCopyType.mixAndMaster) {
      this.f.personMixMasterId.patchValue(id);
    }
  }

  //#region modal section
  private _modalManage(type: ELabelCopyType, value: string) {
    if (type == ELabelCopyType.studio) {
      let model = this.typeNames.find(f => f.name == 'Studio');
      this._typeModal(model, value, type);
    } else if (type == ELabelCopyType.distributor) {
      let model = this.typeNames.find(f => f.name == 'Distributor');
      this._typeModal(model, value, type);
    } else if (type == ELabelCopyType.recordingEngineer) {
      this._contactModal(value, ePersonType.IngenieroGrabacion, type);
    } else if (type == ELabelCopyType.mixAndMaster) {
      this._contactModal(value, ePersonType.MixMaster, type);
    } else if (type == ELabelCopyType.productor) {
      this._contactModal(value, ePersonType.ProductorEjecutivo, type);
    }
  }

  private _typeModal(model: any, value: string, type: ELabelCopyType) {
    if (!model)
      return;

    const dialogRef = this.dialog.open(AddTypeComponent, {
      width: '500px',
      data: {
        id: 0,
        name: value,
        typeId: model.id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (type == ELabelCopyType.studio) {
        if (result != undefined) {
          this.studiosList.push({
            value: result.id,
            viewValue: result.name,
          });
          this.f.studioId.patchValue(result.id);
          setTimeout(() => this.studioFC.setValue(result.name));
        } else
          this.studioFC.patchValue('');
      } else {
        if (result != undefined) {
          this.distributorsList.push({
            value: result.id,
            viewValue: result.name,
          });
          this.f.distributorId.patchValue(result.id);
          setTimeout(() => this.distributorFC.setValue(result.name));
        } else
          this.distributorFC.patchValue('');
      }
    });
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
        projectId: this.project.id,
        personTypeId: contactType,
        showSelectType: false,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (type == ELabelCopyType.recordingEngineer) {
        if (result != undefined) {
          this.enginnerList.push({ value: result.id, viewValue: `${result.name} ${result.lastName}` });
          this.personsRecordingEngineerIds.push(
            { value: result.id, viewValue: `${result.name} ${result.lastName}` }
          );
          this.f.personRecordingEngineerId.patchValue(result.id);
          setTimeout(() => this.recordingEngineerFC.setValue(`${result.name} ${result.lastName}`));
        } else
          this.recordingEngineerFC.patchValue('');

      } else if (type == ELabelCopyType.mixAndMaster) {
        if (result != undefined) {
          this.mixMastersList.push({ value: result.id, viewValue: `${result.name} ${result.lastName}` });
          this.f.personMixMasterId.patchValue(result.id);
          setTimeout(() => this.mixAndMasterFC.setValue(`${result.name} ${result.lastName}`));
        } else
          this.mixAndMasterFC.patchValue('');
      } else if (type == ELabelCopyType.productor) {
        if (result != undefined) {
          this.productorsList.push({ value: result.id, viewValue: `${result.name} ${result.lastName}` });
          this.f.personProducerExecutiveId.patchValue(result.id);
          setTimeout(() => this.producerExecutiveFC.setValue(`${result.name} ${result.lastName}`));
        } else
          this.producerExecutiveFC.patchValue('');
      }
    });
  }
  //#endregion

  //#region API

  private _getLabelCopyByProjectApi() {
    if (!this.project.id)
      return;
    this.isWorking = true;
    this.apiService.get(EEndpoints.LabelCopyByProject, { projectId: this.project.id }).subscribe(
      (response: ResponseApi<ILabelCopy>) => {
        if (response.code == 100) {
          if (response.result){
            this.labelCopy = response.result;
            this.configureForm();
            this._populateAutocompleteFC();
          }//else
          //  this._getConfigurationLabelApi();
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _getDistributorApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Types, { typeId: ETypeName.Distributor }).subscribe(
      (response: ResponseApi<IType[]>) => {
        if (response.code == 100) {
          this.distributorsList = response.result.map(m => ({ value: m.id, viewValue: m.name }));
          this.distributorFiltered = this.distributorFC.valueChanges
            .pipe(
              startWith(''),
              map(distributor => this._filter(distributor, this.distributorsList))
            );
            this._populateAutocompleteFC();
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _getStudioApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Types, { typeId: ETypeName.Studio }).subscribe(
      (response: ResponseApi<IType[]>) => {
        if (response.code == 100) {
          this.studiosList = response.result.map(m => ({ value: m.id, viewValue: m.name }));
          this.studioFiltered = this.studioFC.valueChanges
            .pipe(
              startWith(''),
              map(studio => this._filter(studio, this.studiosList))
            );
            this._populateAutocompleteFC();
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _getProductorApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ProjectContactsByType, { personTypeId: ePersonType.ProductorEjecutivo }).subscribe(
      (response: ResponseApi<IPersonProject[]>) => {
        if (response.code == 100) {
          this.productorsList = response.result.map(m => ({ value: m.id, viewValue: `${m.name} ${m.lastName}` }));
          this.producerExecutiveFiltered = this.producerExecutiveFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value, this.productorsList))
            );
            this._populateAutocompleteFC();
        } else
          this.toaster.showTranslate('general.errors.serverError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private async _getEnginnerApi() {
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
            this._populateAutocompleteFC();
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _getMixMasterApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ProjectContactsByType, { personTypeId: ePersonType.MixMaster }).subscribe(
      (response: ResponseApi<IPersonProject[]>) => {
        if (response.code == 100) {
          this.mixMastersList = response.result.map(m => ({ value: m.id, viewValue: `${m.name} ${m.lastName}` }));
          this.mixAndMasterFiltered = this.mixAndMasterFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value, this.mixMastersList))
            );
            this._populateAutocompleteFC();
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _getConfigurationLabelApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.LabelCopyConfiguration, { projectId: this.project.id }).subscribe(
      (response: ResponseApi<IConfigurationLabelCopy>) => {
        if (response.code == 100) {
          if (response.result) {
            this._populateLabelCopy(response.result);
            this._populateAutocompleteFC();
          }
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _createLabelCopy(labelCopy: ILabelCopy) {
    this.isWorking = true;
    delete labelCopy.id;
    delete labelCopy.dateLastUpdate;

    this.apiService.save(EEndpoints.LabelCopy, labelCopy).subscribe(
      (response: ResponseApi<ILabelCopy>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.itemSaved'));
          this.labelCopy = response.result;
          this.f.id.patchValue(this.labelCopy.id);
          this.f.dateLastUpdate.patchValue(this.labelCopy.dateLastUpdate);
        } else
          this.toaster.showToaster(this.translate.instant('errors.errorSavingItem'));
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _updateLabelCopy(labelCopy: ILabelCopy) {
    this.isWorking = true;
    delete labelCopy.dateLastUpdate;
    this.apiService.update(EEndpoints.LabelCopy, labelCopy).subscribe(
      (response: ResponseApi<ILabelCopy>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.itemUpdated'));
        } else
          this.toaster.showToaster(this.translate.instant('errors.errorEditingItem'));
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _getTypeNames(): void {
    this.isWorking = false;
    this.apiService.get(EEndpoints.TypeNames)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.typeNames = response.result;
        }
        this.isWorking = false;
      }, err => this._responseError(err)
      );
  }

  changeFilter(radioButton: MatRadioButton) {
    var id = radioButton.id;
    this.formLabelCopy.controls.recordLabel.setValue(id);
  }

  showModalAddProducer(): void {
    this.isWorking = true;
    const dialogRef = this.dialog.open(ProjectLabelCopyModalComponent, {
      width: '500px',
      data: {
        producers: this.labelCopy.personRecordingEngineerId,
        projectId: this.project.id,
      }
    });
    dialogRef.afterClosed().subscribe(async (result: number) => {
      if (result) {
        await this._getEnginnerApi();
        this.addPersonProducer(result);
      }
    });
    this.isWorking = false;
  }

  addPersonProducer(personId) {
    console.log('addPersonProducer personId: ', personId);
    console.log('addPersonProducer this.enginnerList: ', this.enginnerList);
    let exists = false;
    const persons = this.enginnerList;
    this.personsRecordingEngineerIds.forEach(person => {
      if (parseInt(person.value) === personId || person.value === personId) {
        exists = true;
      }
    });
    if (this.formLabelCopy.controls.personRecordingEngineerId.value === null) {
      this.formLabelCopy.controls.personRecordingEngineerId.setValue(
        personId
      );
    }
    console.log('addPersonProducer exists: ', exists);
    if (!exists) {
      persons.forEach(element => {
        let item: any = element;
        if (parseInt(item.value) === personId || item.value === personId) {
          this.personsRecordingEngineerIds.push(item);
          let personsArray: Array<number> = [];
          this.personsRecordingEngineerIds.forEach(element => {
            personsArray.push(element.value);
          });
          this.formLabelCopy.controls.producerList.setValue(personsArray);
        }
      });
    }
  }

  deleteProducer(producer) {
    let persons: Array<number> = [];
    let theIndex = 0;
    this.personsRecordingEngineerIds.forEach( (person, index) => {
      if (producer.value !== person.value) {
        persons.push(person.value);
      } else {
        theIndex = index;
      }
    });
    this.personsRecordingEngineerIds.splice(theIndex, 1);
    this.formLabelCopy.controls.producerList.setValue(persons);
  }
  //#endregion
}
