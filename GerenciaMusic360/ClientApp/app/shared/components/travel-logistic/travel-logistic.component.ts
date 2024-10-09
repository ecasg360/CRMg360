import { Component, OnInit, Input } from '@angular/core';
import { AddTravelFlightComponent } from "./add-travel-flight/add-travel-flight.component";
import { AddTravelHotelComponent } from "./add-travel-hotel/add-travel-hotel.component";
import { AddTravelTransportationComponent } from "./add-travel-transportation/add-travel-transportation.component";
import { AddTravelOtherComponent } from "./add-travel-other/add-travel-other.component";
import { MatDialog, MatRadioButton } from '@angular/material';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from '@models/response-api';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { IProjectTravelLogisticsFlight } from '@models/project-travel-logistics-flight';
import { IProjectTravelLogisticsHotel } from '@models/project-travel-logistics-hotel';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ETravelCategory } from '@enums/travel-category';
import { IProjectTravelLogisticsTransportation } from '@models/project-travel-logistics-transportation';
import { IProjectTravelLogisticsOther } from '@models/project-travel-logistics-other';
import { ComponentsComunicationService } from '@services/components-comunication.service';
import { IProjectTravelLogistics } from '@models/project-travel-logistics';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-travel-logistic',
  templateUrl: './travel-logistic.component.html',
  styleUrls: ['./travel-logistic.component.css']
})
export class TravelLogisticComponent implements OnInit {
  @Input() projectId: string;
  @Input() projectTypeId: number;
  @Input() perm: any = {};
  isWorking: boolean = false;

  ECategory: ETravelCategory = <ETravelCategory>{};

  private _unsubscribeAll: Subject<any>;

  flights: IProjectTravelLogisticsFlight[] = <IProjectTravelLogisticsFlight[]>{};
  hotels: IProjectTravelLogisticsHotel[] = <IProjectTravelLogisticsHotel[]>{};
  transportations: IProjectTravelLogisticsTransportation[] = <IProjectTravelLogisticsTransportation[]>{};
  others: IProjectTravelLogisticsOther[] = <IProjectTravelLogisticsOther[]>{};

  flightsList: IProjectTravelLogisticsFlight[] = <IProjectTravelLogisticsFlight[]>{};
  hotelsList: IProjectTravelLogisticsHotel[] = <IProjectTravelLogisticsHotel[]>{};
  transportationsList: IProjectTravelLogisticsTransportation[] = <IProjectTravelLogisticsTransportation[]>{};
  othersList: IProjectTravelLogisticsOther[] = <IProjectTravelLogisticsOther[]>{};

  projectTravelLogistics: IProjectTravelLogistics[] = [];

  //Filter
  filterInternal: boolean = false;
  filterArtist: boolean = false;
  filterAll: boolean = true;

  constructor(
    public dialog: MatDialog,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    private comunicationService: ComponentsComunicationService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.getTravelLogistics();
    this.getTravelLogisticsFlight();
    this.getTravelLogisticsHotel();
    this.getTravelLogisticsTransportation();
    this.getTravelLogisticsOther();
    console.log('this perm en travel logistics: ', this.perm);
  }

  getTravelLogistics(): void {
    //aca debo llamar a las categorias del pryecto
    this.isWorking = true;
    this.ApiService.get(EEndpoints.ProjectTravelLogistics, { projectId: this.projectId }).subscribe(
      (response: ResponseApi<IProjectTravelLogistics[]>) => {
        console.log('response: ', response);
        if (response.code == 100)
          this.projectTravelLogistics = response.result;
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  getTravelLogisticsFlight(): void {
    //aca debo llamar a las categorias del proyecto
    this.isWorking = true;
    this.ApiService.get(EEndpoints.ProjectTravelLogisticsFlight, { projectId: this.projectId }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.flights = <IProjectTravelLogisticsFlight[]>response.result;
          this.flightsList = <IProjectTravelLogisticsFlight[]>response.result;
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  getTravelLogisticsHotel(): void {
    //aca debo llamar a las categorias del pryecto
    this.isWorking = true;
    this.ApiService.get(EEndpoints.ProjectTravelLogisticsHotel, { projectId: this.projectId }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.hotels = <IProjectTravelLogisticsHotel[]>response.result;
          this.hotelsList = <IProjectTravelLogisticsHotel[]>response.result;
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  getTravelLogisticsTransportation(): void {
    //aca debo llamar a las categorias del pryecto
    this.isWorking = true;
    this.ApiService.get(EEndpoints.ProjectTravelLogisticsTransportation, { projectId: this.projectId }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.transportations = <IProjectTravelLogisticsTransportation[]>response.result;
          this.transportationsList = <IProjectTravelLogisticsTransportation[]>response.result;
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  getTravelLogisticsOther(): void {
    //aca debo llamar a las categorias del pryecto
    this.isWorking = true;
    this.ApiService.get(EEndpoints.ProjectTravelLogisticsOther, { projectId: this.projectId }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.others = <IProjectTravelLogisticsOther[]>response.result;
          this.othersList = <IProjectTravelLogisticsOther[]>response.result;
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  showModalFlightForm(model: IProjectTravelLogisticsFlight = <IProjectTravelLogisticsFlight>{}): void {
    let budgetDetail = undefined;
    if (model) {
      const found = this.projectTravelLogistics.find(f => f.id == model.projectTravelLogisticsId);
      if (found)
        budgetDetail = found.projectBudgetDetailId;
    }
    const dialogRef = this.dialog.open(AddTravelFlightComponent, {
      width: '700px',
      data: {
        projectId: this.projectId,
        projectTypeId: this.projectTypeId,
        projectFlight: model,
        projectBudgetDetailId: budgetDetail,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.comunicationService.sendTravelLogisticBudget(result);
      }
      this.getTravelLogistics();
      this.getTravelLogisticsFlight();
    });
  }

  showModalHotelForm(model: IProjectTravelLogisticsHotel = <IProjectTravelLogisticsHotel>{}): void {
    let budgetDetail = undefined;
    if (model) {
      const found = this.projectTravelLogistics.find(f => f.id == model.projectTravelLogisticsId);
      if (found)
        budgetDetail = found.projectBudgetDetailId;
    }
    const dialogRef = this.dialog.open(AddTravelHotelComponent, {
      width: '700px',
      data: {
        projectId: this.projectId,
        projectHotel: model,
        projectTypeId: this.projectTypeId,
        projectBudgetDetailId: budgetDetail,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.comunicationService.sendTravelLogisticBudget(result);
      }
      this.getTravelLogistics();
      this.getTravelLogisticsHotel();
    });
  }

  showModalTransportationForm(model: IProjectTravelLogisticsTransportation = <IProjectTravelLogisticsTransportation>{}): void {
    let budgetDetail = undefined;
    if (model) {
      const found = this.projectTravelLogistics.find(f => f.id == model.projectTravelLogisticsId);
      if (found)
        budgetDetail = found.projectBudgetDetailId;
    }
    const dialogRef = this.dialog.open(AddTravelTransportationComponent, {
      width: '700px',
      data: {
        projectId: this.projectId,
        projectTransportation: model,
        projectTypeId: this.projectTypeId,
        projectBudgetDetailId: budgetDetail,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.comunicationService.sendTravelLogisticBudget(result);
      }
      this.getTravelLogistics();
      this.getTravelLogisticsTransportation();
    });
  }

  showModalOtherForm(model: IProjectTravelLogisticsOther = <IProjectTravelLogisticsOther>{}): void {
    let budgetDetail = undefined;
    if (model) {
      const found = this.projectTravelLogistics.find(f => f.id == model.projectTravelLogisticsId);
      if (found)
        budgetDetail = found.projectBudgetDetailId;
    }
    const dialogRef = this.dialog.open(AddTravelOtherComponent, {
      width: '700px',
      data: {
        projectId: this.projectId,
        projectOther: model,
        projectTypeId: this.projectTypeId,
        projectBudgetDetailId: budgetDetail,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.comunicationService.sendTravelLogisticBudget(result);
      }
      this.getTravelLogistics();
      this.getTravelLogisticsOther();
    });
  }

  confirmDelete(idProject: number, idCategory: number, category: string, name: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm) {
          if (category == 'Flight')
            this.deleteProjectTravelLogisticsFlight(idProject, idCategory);

          if (category == 'Hotel')
            this.deleteProjectTravelLogisticsHotel(idProject, idCategory);

          if (category == 'Transportation')
            this.deleteProjectTravelLogisticsTransportation(idProject, idCategory);

          if (category == 'Other')
            this.deleteProjectTravelLogisticsOther(idProject, idCategory);
        }
      }
    });
  }

  deleteProjectTravelLogisticsFlight(modelProjectId: number, modelFlightId: number): void {
    //delete Flight
    const params = [];
    params['id'] = modelFlightId;
    this.ApiService.delete(EEndpoints.ProjectTravelLogisticsFlight, params)
      .subscribe(
        data => {
          if (data.code == 100) {
            //delete ProjectTravelLogistics
            const params = [];
            params['id'] = modelProjectId;
            this.ApiService.delete(EEndpoints.ProjectTravelLogistics, params)
              .subscribe(
                data => {
                  if (data.code == 100) {
                    this._deleteBudgetDetailApi(modelProjectId);
                    this.getTravelLogistics();
                    this.getTravelLogisticsFlight();
                    this.toasterService.showToaster(this.translate.instant('travelLogistics.flight.messages.deleteSuccess'));
                  } else {
                    this.toasterService.showToaster(data.message);
                  }
                  console.log('borrar');
                  this.comunicationService.sendTravelLogisticBudget(true);
                  this.isWorking = false;
                }, (err) => this.responseError(err)
              );
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  deleteProjectTravelLogisticsHotel(modelProjectId: number, modelHotelId: number): void {
    //delete Hotel
    const params = [];
    params['id'] = modelHotelId;
    this.ApiService.delete(EEndpoints.ProjectTravelLogisticsHotel, params)
      .subscribe(
        data => {
          if (data.code == 100) {
            //delete ProjectTravelLogistics
            const params = [];
            params['id'] = modelProjectId;
            this.ApiService.delete(EEndpoints.ProjectTravelLogistics, params)
              .subscribe(
                data => {
                  if (data.code == 100) {
                    this._deleteBudgetDetailApi(modelProjectId);
                    this.getTravelLogistics();
                    this.getTravelLogisticsHotel();
                    this.toasterService.showToaster(this.translate.instant('travelLogistics.hotel.messages.deleteSuccess'));
                  } else {
                    this.toasterService.showToaster(data.message);
                  }
                  this.comunicationService.sendTravelLogisticBudget(true);
                  this.isWorking = false;
                }, (err) => this.responseError(err)
              );
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  deleteProjectTravelLogisticsTransportation(modelProjectId: number, modelTransportationId: number): void {
    //delete Transportation
    const params = [];
    params['id'] = modelTransportationId;
    this.ApiService.delete(EEndpoints.ProjectTravelLogisticsTransportation, params)
      .subscribe(
        data => {
          if (data.code == 100) {
            //delete ProjectTravelLogistics
            const params = [];
            params['id'] = modelProjectId;
            this.ApiService.delete(EEndpoints.ProjectTravelLogistics, params)
              .subscribe(
                data => {
                  if (data.code == 100) {
                    this._deleteBudgetDetailApi(modelProjectId);
                    this.getTravelLogistics();
                    this.getTravelLogisticsTransportation();
                    this.toasterService.showToaster(this.translate.instant('travelLogistics.transportation.messages.deleteSuccess'));
                  } else {
                    this.toasterService.showToaster(data.message);
                  }
                  this.comunicationService.sendTravelLogisticBudget(true);
                  this.isWorking = false;
                }, (err) => this.responseError(err)
              );
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  deleteProjectTravelLogisticsOther(modelProjectId: number, modelOtherId: number): void {
    //delete Transportation
    const params = [];
    params['id'] = modelOtherId;
    this.ApiService.delete(EEndpoints.ProjectTravelLogisticsOther, params)
      .subscribe(
        data => {
          if (data.code == 100) {
            //delete ProjectTravelLogistics
            const params = [];
            params['id'] = modelProjectId;
            this.ApiService.delete(EEndpoints.ProjectTravelLogistics, params)
              .subscribe(
                data => {
                  if (data.code == 100) {
                    this._deleteBudgetDetailApi(modelProjectId);
                    this.getTravelLogistics();
                    this.getTravelLogisticsOther();
                    this.toasterService.showToaster(this.translate.instant('travelLogistics.other.messages.deleteSuccess'));
                  } else {
                    this.toasterService.showToaster(data.message);
                  }
                  this.comunicationService.sendTravelLogisticBudget(true);
                  this.isWorking = false;
                }, (err) => this.responseError(err)
              );
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  private _deleteBudgetDetailApi(travelLogisticId: number) {
    this.isWorking = true;
    const found = this.projectTravelLogistics.find(f => f.id == travelLogisticId);
    if (found) {
      this.ApiService.delete(EEndpoints.ProjectBudgetDetail, { id: found.projectBudgetDetailId }).subscribe(
        (response: ResponseApi<boolean>) => {
          if (response.code != 100)
            this.toasterService.showTranslate('errors.errorDeletingBudgetAssociate');
          this.isWorking = false;
        }, err => this.responseError(err)
      )
    }
  }

  changeFilter(radioButton: MatRadioButton) {
    var id = radioButton.id;
    console.log('radioButton: ', radioButton);
    console.log('this.flightsList: ', this.flightsList);
    console.log('this.hotelsList: ', this.hotelsList);
    console.log('this.transportationsList: ', this.transportationsList);
    console.log('this.othersList: ', this.othersList);

    if (id == "all") {
      this.flights = this.flightsList;
      this.hotels = this.hotelsList;
      this.transportations = this.transportationsList;
      this.others = this.othersList;
    }

    if (id == "internal") {
      this.flights = this.flightsList.filter(flight => flight.isInternal == 1);
      this.hotels = this.hotelsList.filter(hotel => hotel.isInternal == 1);
      this.transportations = this.transportationsList.filter(transportation => transportation.isInternal == 1);
      this.others = this.othersList.filter(other => other.isInternal == 1);
    }

    if (id == "artist") {
      this.flights = this.flightsList.filter(flight => flight.isInternal == 0);
      this.hotels = this.hotelsList.filter(hotel => hotel.isInternal == 0);
      this.transportations = this.transportationsList.filter(transportation => transportation.isInternal == 0);
      this.others = this.othersList.filter(other => other.isInternal == 0);
    }

    if (id == "moe") {
      this.flights = this.flightsList.filter(flight => flight.isInternal == 2);
      this.hotels = this.hotelsList.filter(hotel => hotel.isInternal == 2);
      this.transportations = this.transportationsList.filter(transportation => transportation.isInternal == 2);
      this.others = this.othersList.filter(other => other.isInternal == 2);
    }
  }

  downloadFile() {
    this.isWorking = true;
    let projectId = this.projectId;
    this.ApiService.download(EEndpoints.ProjectTravelLogisticsDownload, { projectId: projectId })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        fileData => {
          const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let link = document.createElement("a");
          if (link.download !== undefined) {
            let url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "LogisticTravel");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          this.isWorking = false;
        }, err => this.responseError(err));
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
