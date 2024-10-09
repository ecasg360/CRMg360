import { Component, OnInit, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { IProjectEvent } from '@models/project-event';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ToasterService } from '@services/toaster.service';
import { ILocation } from '@models/location';
import { IAddress } from '@models/address';
import { Observable } from 'rxjs';
import { SelectOption } from '@models/select-option.models';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-project-event',
  templateUrl: './project-event.component.html',
  styleUrls: ['./project-event.component.css']
})
export class ProjectEventComponent implements OnInit {

  @Input() projectEvent: IProjectEvent = <IProjectEvent>{};
  @Output() formReady = new EventEmitter<FormGroup>();
  
  modelProjectEvent: IProjectEvent = <IProjectEvent>{};
  dataEventForm: FormGroup;
  isWorking: boolean = false;
  action: string = this.translate.instant('general.save');
  locations: SelectOption[] = [];

  addressModel: IAddress = <IAddress>{};
  locationFC = new FormControl();
  filteredOptions: Observable<SelectOption[]>;
  question = '';

  constructor(
    public dialogRef: MatDialogRef<ProjectEventComponent>,
    private translate: TranslateService,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
  ) { }

  //#region form
  get f() { return this.dataEventForm.controls; }

  ngOnInit() {
    this.projectEvent = this.actionData.projectEvent;
    console.log(this.projectEvent);
    this.getLocations();
    this.configureForm();
    if(this.projectEvent.id > 0){
      this.action = this.translate.instant('general.save');
    }
  }

  private configureForm(): void {
    this.dataEventForm = this.formBuilder.group({
        id: [this.projectEvent.id, []],
        projectId: [this.projectEvent.projectId, [ Validators.required]],
        eventDate: [this.projectEvent.eventDate, [ Validators.required]],
        guarantee: [this.projectEvent.guarantee, []],
        venue: [this.projectEvent.venue, []],
        locationId: [this.projectEvent.locationId, [ Validators.required]],
        deposit: [this.projectEvent.deposit, [ Validators.required]],
        depositDate: [this.projectEvent.depositDate, []],
        lastPayment: [this.projectEvent.lastPayment, []],
        lastPaymentDate: [this.projectEvent.lastPaymentDate, []],
    });
    this.formReady.emit(this.dataEventForm);
  }

  saveEvent() {
    this.modelProjectEvent = <IProjectEvent>this.dataEventForm.value;
    let objModelEvent = Object.assign({}, this.modelProjectEvent);

    //Update
    if (this.modelProjectEvent.id) {
      /*aqui el flujo es el siguiente:
      Elimino el budget detail (para evitar llenar mas los componentes de comprobaciones)
      creo uno nuevo basados en los posibles cambios, pero con un boolenano que me indicai si actualizo o agrego
      llamo a los componentes para 
      */
      this._updateEvent(this.modelProjectEvent);
    }
    else {
      console.log(objModelEvent);
    //Create
      delete objModelEvent["id"];
      this._createEvent(objModelEvent);
    }
  }

  private _createEvent(model: IProjectEvent) {
    this.isWorking = true;
    this.ApiService.save(EEndpoints.ProjectEvent, model).subscribe(
      (response: ResponseApi<IProjectEvent>) => {
        if (response.code == 100) {
          this.toasterService.showToaster(this.translate.instant('projectEvents.messages.addSuccess'));
          this.onNoClick(true);
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  private _updateEvent(model: IProjectEvent) {
    this.isWorking = true;
    this.ApiService.update(EEndpoints.ProjectEvent, model).subscribe(
      (response: ResponseApi<IProjectEvent>) => {
        if (response.code == 100) {
          this.toasterService.showToaster(this.translate.instant('projectEvents.messages.saved'));
          this.onNoClick(true);
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  getLocations(): void {
    this.ApiService.get(EEndpoints.Locations).subscribe(
        (response: ResponseApi<any>) => {
            if (response.code == 100) {
                this.locations = response.result.map((m: any) => ({ value: m.id, viewValue: m.address.neighborhood }));
                    this.filteredOptions = this.locationFC.valueChanges
                    .pipe(
                        startWith(''),
                        map(value => this._filterLocation(value))
                    );
            }
        }, (err) => this.responseError(err));
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
    if ($event.option.id == '0') {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
      console.log(newItem);
      let address = <IAddress>{
        neighborhood: newItem,
        personId: null,
        countryId: null,
        stateId: null,
        cityId: null,
      }
      this.saveAddress(address);
    } else {
      this.f.locationId.patchValue($event.option.id);
    }
  }

  saveAddress(address: IAddress): void {
    address.id = 0;
    address.addressTypeId = 5;
    this.ApiService.save(EEndpoints.AddressLocation, address)
        .subscribe(
        data => {
            if (data.code == 100) {
                setTimeout(() => this.locationFC.setValue(address.neighborhood));
                this.saveLocation(data.result);
            }
            this.isWorking = false;
        }, (err) => this.responseError(err)
        );
}

saveLocation(addressId: number): void {
    let location = <ILocation>{
        id: 0,
        addressId: addressId,
    }
    this.ApiService.save(EEndpoints.Location, location)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.f.locationId.patchValue(data.result);
            this.getLocations();
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

private _filterLocation(value: string): SelectOption[] {
    const filterValue = value ? value : '';
    let results = [];
    results = this.locations.filter(option => option.viewValue.toLowerCase().includes(filterValue));

    return (results.length == 0)
      ? [{
        value: 0,
        viewValue: `${this.question}${filterValue}"?`
      }]
      : results;
}

}
