var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { AddTravelFlightComponent } from "./add-travel-flight/add-travel-flight.component";
import { AddTravelHotelComponent } from "./add-travel-hotel/add-travel-hotel.component";
import { AddTravelTransportationComponent } from "./add-travel-transportation/add-travel-transportation.component";
import { AddTravelOtherComponent } from "./add-travel-other/add-travel-other.component";
import { MatDialog } from '@angular/material';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ComponentsComunicationService } from '@services/components-comunication.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
var TravelLogisticComponent = /** @class */ (function () {
    function TravelLogisticComponent(dialog, ApiService, toasterService, translate, comunicationService) {
        this.dialog = dialog;
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.comunicationService = comunicationService;
        this.perm = {};
        this.isWorking = false;
        this.ECategory = {};
        this.flights = {};
        this.hotels = {};
        this.transportations = {};
        this.others = {};
        this.flightsList = {};
        this.hotelsList = {};
        this.transportationsList = {};
        this.othersList = {};
        this.projectTravelLogistics = [];
        //Filter
        this.filterInternal = false;
        this.filterArtist = false;
        this.filterAll = true;
        this._unsubscribeAll = new Subject();
    }
    TravelLogisticComponent.prototype.ngOnInit = function () {
        this.getTravelLogistics();
        this.getTravelLogisticsFlight();
        this.getTravelLogisticsHotel();
        this.getTravelLogisticsTransportation();
        this.getTravelLogisticsOther();
        console.log('this perm en travel logistics: ', this.perm);
    };
    TravelLogisticComponent.prototype.getTravelLogistics = function () {
        var _this = this;
        //aca debo llamar a las categorias del pryecto
        this.isWorking = true;
        this.ApiService.get(EEndpoints.ProjectTravelLogistics, { projectId: this.projectId }).subscribe(function (response) {
            console.log('response: ', response);
            if (response.code == 100)
                _this.projectTravelLogistics = response.result;
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TravelLogisticComponent.prototype.getTravelLogisticsFlight = function () {
        var _this = this;
        //aca debo llamar a las categorias del proyecto
        this.isWorking = true;
        this.ApiService.get(EEndpoints.ProjectTravelLogisticsFlight, { projectId: this.projectId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.flights = response.result;
                _this.flightsList = response.result;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TravelLogisticComponent.prototype.getTravelLogisticsHotel = function () {
        var _this = this;
        //aca debo llamar a las categorias del pryecto
        this.isWorking = true;
        this.ApiService.get(EEndpoints.ProjectTravelLogisticsHotel, { projectId: this.projectId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.hotels = response.result;
                _this.hotelsList = response.result;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TravelLogisticComponent.prototype.getTravelLogisticsTransportation = function () {
        var _this = this;
        //aca debo llamar a las categorias del pryecto
        this.isWorking = true;
        this.ApiService.get(EEndpoints.ProjectTravelLogisticsTransportation, { projectId: this.projectId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.transportations = response.result;
                _this.transportationsList = response.result;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TravelLogisticComponent.prototype.getTravelLogisticsOther = function () {
        var _this = this;
        //aca debo llamar a las categorias del pryecto
        this.isWorking = true;
        this.ApiService.get(EEndpoints.ProjectTravelLogisticsOther, { projectId: this.projectId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.others = response.result;
                _this.othersList = response.result;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TravelLogisticComponent.prototype.showModalFlightForm = function (model) {
        var _this = this;
        if (model === void 0) { model = {}; }
        var budgetDetail = undefined;
        if (model) {
            var found = this.projectTravelLogistics.find(function (f) { return f.id == model.projectTravelLogisticsId; });
            if (found)
                budgetDetail = found.projectBudgetDetailId;
        }
        var dialogRef = this.dialog.open(AddTravelFlightComponent, {
            width: '700px',
            data: {
                projectId: this.projectId,
                projectTypeId: this.projectTypeId,
                projectFlight: model,
                projectBudgetDetailId: budgetDetail,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.comunicationService.sendTravelLogisticBudget(result);
            }
            _this.getTravelLogistics();
            _this.getTravelLogisticsFlight();
        });
    };
    TravelLogisticComponent.prototype.showModalHotelForm = function (model) {
        var _this = this;
        if (model === void 0) { model = {}; }
        var budgetDetail = undefined;
        if (model) {
            var found = this.projectTravelLogistics.find(function (f) { return f.id == model.projectTravelLogisticsId; });
            if (found)
                budgetDetail = found.projectBudgetDetailId;
        }
        var dialogRef = this.dialog.open(AddTravelHotelComponent, {
            width: '700px',
            data: {
                projectId: this.projectId,
                projectHotel: model,
                projectTypeId: this.projectTypeId,
                projectBudgetDetailId: budgetDetail,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.comunicationService.sendTravelLogisticBudget(result);
            }
            _this.getTravelLogistics();
            _this.getTravelLogisticsHotel();
        });
    };
    TravelLogisticComponent.prototype.showModalTransportationForm = function (model) {
        var _this = this;
        if (model === void 0) { model = {}; }
        var budgetDetail = undefined;
        if (model) {
            var found = this.projectTravelLogistics.find(function (f) { return f.id == model.projectTravelLogisticsId; });
            if (found)
                budgetDetail = found.projectBudgetDetailId;
        }
        var dialogRef = this.dialog.open(AddTravelTransportationComponent, {
            width: '700px',
            data: {
                projectId: this.projectId,
                projectTransportation: model,
                projectTypeId: this.projectTypeId,
                projectBudgetDetailId: budgetDetail,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.comunicationService.sendTravelLogisticBudget(result);
            }
            _this.getTravelLogistics();
            _this.getTravelLogisticsTransportation();
        });
    };
    TravelLogisticComponent.prototype.showModalOtherForm = function (model) {
        var _this = this;
        if (model === void 0) { model = {}; }
        var budgetDetail = undefined;
        if (model) {
            var found = this.projectTravelLogistics.find(function (f) { return f.id == model.projectTravelLogisticsId; });
            if (found)
                budgetDetail = found.projectBudgetDetailId;
        }
        var dialogRef = this.dialog.open(AddTravelOtherComponent, {
            width: '700px',
            data: {
                projectId: this.projectId,
                projectOther: model,
                projectTypeId: this.projectTypeId,
                projectBudgetDetailId: budgetDetail,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.comunicationService.sendTravelLogisticBudget(result);
            }
            _this.getTravelLogistics();
            _this.getTravelLogisticsOther();
        });
    };
    TravelLogisticComponent.prototype.confirmDelete = function (idProject, idCategory, category, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1) {
                    if (category == 'Flight')
                        _this.deleteProjectTravelLogisticsFlight(idProject, idCategory);
                    if (category == 'Hotel')
                        _this.deleteProjectTravelLogisticsHotel(idProject, idCategory);
                    if (category == 'Transportation')
                        _this.deleteProjectTravelLogisticsTransportation(idProject, idCategory);
                    if (category == 'Other')
                        _this.deleteProjectTravelLogisticsOther(idProject, idCategory);
                }
            }
        });
    };
    TravelLogisticComponent.prototype.deleteProjectTravelLogisticsFlight = function (modelProjectId, modelFlightId) {
        var _this = this;
        //delete Flight
        var params = [];
        params['id'] = modelFlightId;
        this.ApiService.delete(EEndpoints.ProjectTravelLogisticsFlight, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                //delete ProjectTravelLogistics
                var params_1 = [];
                params_1['id'] = modelProjectId;
                _this.ApiService.delete(EEndpoints.ProjectTravelLogistics, params_1)
                    .subscribe(function (data) {
                    if (data.code == 100) {
                        _this._deleteBudgetDetailApi(modelProjectId);
                        _this.getTravelLogistics();
                        _this.getTravelLogisticsFlight();
                        _this.toasterService.showToaster(_this.translate.instant('travelLogistics.flight.messages.deleteSuccess'));
                    }
                    else {
                        _this.toasterService.showToaster(data.message);
                    }
                    console.log('borrar');
                    _this.comunicationService.sendTravelLogisticBudget(true);
                    _this.isWorking = false;
                }, function (err) { return _this.responseError(err); });
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TravelLogisticComponent.prototype.deleteProjectTravelLogisticsHotel = function (modelProjectId, modelHotelId) {
        var _this = this;
        //delete Hotel
        var params = [];
        params['id'] = modelHotelId;
        this.ApiService.delete(EEndpoints.ProjectTravelLogisticsHotel, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                //delete ProjectTravelLogistics
                var params_2 = [];
                params_2['id'] = modelProjectId;
                _this.ApiService.delete(EEndpoints.ProjectTravelLogistics, params_2)
                    .subscribe(function (data) {
                    if (data.code == 100) {
                        _this._deleteBudgetDetailApi(modelProjectId);
                        _this.getTravelLogistics();
                        _this.getTravelLogisticsHotel();
                        _this.toasterService.showToaster(_this.translate.instant('travelLogistics.hotel.messages.deleteSuccess'));
                    }
                    else {
                        _this.toasterService.showToaster(data.message);
                    }
                    _this.comunicationService.sendTravelLogisticBudget(true);
                    _this.isWorking = false;
                }, function (err) { return _this.responseError(err); });
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TravelLogisticComponent.prototype.deleteProjectTravelLogisticsTransportation = function (modelProjectId, modelTransportationId) {
        var _this = this;
        //delete Transportation
        var params = [];
        params['id'] = modelTransportationId;
        this.ApiService.delete(EEndpoints.ProjectTravelLogisticsTransportation, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                //delete ProjectTravelLogistics
                var params_3 = [];
                params_3['id'] = modelProjectId;
                _this.ApiService.delete(EEndpoints.ProjectTravelLogistics, params_3)
                    .subscribe(function (data) {
                    if (data.code == 100) {
                        _this._deleteBudgetDetailApi(modelProjectId);
                        _this.getTravelLogistics();
                        _this.getTravelLogisticsTransportation();
                        _this.toasterService.showToaster(_this.translate.instant('travelLogistics.transportation.messages.deleteSuccess'));
                    }
                    else {
                        _this.toasterService.showToaster(data.message);
                    }
                    _this.comunicationService.sendTravelLogisticBudget(true);
                    _this.isWorking = false;
                }, function (err) { return _this.responseError(err); });
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TravelLogisticComponent.prototype.deleteProjectTravelLogisticsOther = function (modelProjectId, modelOtherId) {
        var _this = this;
        //delete Transportation
        var params = [];
        params['id'] = modelOtherId;
        this.ApiService.delete(EEndpoints.ProjectTravelLogisticsOther, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                //delete ProjectTravelLogistics
                var params_4 = [];
                params_4['id'] = modelProjectId;
                _this.ApiService.delete(EEndpoints.ProjectTravelLogistics, params_4)
                    .subscribe(function (data) {
                    if (data.code == 100) {
                        _this._deleteBudgetDetailApi(modelProjectId);
                        _this.getTravelLogistics();
                        _this.getTravelLogisticsOther();
                        _this.toasterService.showToaster(_this.translate.instant('travelLogistics.other.messages.deleteSuccess'));
                    }
                    else {
                        _this.toasterService.showToaster(data.message);
                    }
                    _this.comunicationService.sendTravelLogisticBudget(true);
                    _this.isWorking = false;
                }, function (err) { return _this.responseError(err); });
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TravelLogisticComponent.prototype._deleteBudgetDetailApi = function (travelLogisticId) {
        var _this = this;
        this.isWorking = true;
        var found = this.projectTravelLogistics.find(function (f) { return f.id == travelLogisticId; });
        if (found) {
            this.ApiService.delete(EEndpoints.ProjectBudgetDetail, { id: found.projectBudgetDetailId }).subscribe(function (response) {
                if (response.code != 100)
                    _this.toasterService.showTranslate('errors.errorDeletingBudgetAssociate');
                _this.isWorking = false;
            }, function (err) { return _this.responseError(err); });
        }
    };
    TravelLogisticComponent.prototype.changeFilter = function (radioButton) {
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
            this.flights = this.flightsList.filter(function (flight) { return flight.isInternal == 1; });
            this.hotels = this.hotelsList.filter(function (hotel) { return hotel.isInternal == 1; });
            this.transportations = this.transportationsList.filter(function (transportation) { return transportation.isInternal == 1; });
            this.others = this.othersList.filter(function (other) { return other.isInternal == 1; });
        }
        if (id == "artist") {
            this.flights = this.flightsList.filter(function (flight) { return flight.isInternal == 0; });
            this.hotels = this.hotelsList.filter(function (hotel) { return hotel.isInternal == 0; });
            this.transportations = this.transportationsList.filter(function (transportation) { return transportation.isInternal == 0; });
            this.others = this.othersList.filter(function (other) { return other.isInternal == 0; });
        }
        if (id == "moe") {
            this.flights = this.flightsList.filter(function (flight) { return flight.isInternal == 2; });
            this.hotels = this.hotelsList.filter(function (hotel) { return hotel.isInternal == 2; });
            this.transportations = this.transportationsList.filter(function (transportation) { return transportation.isInternal == 2; });
            this.others = this.othersList.filter(function (other) { return other.isInternal == 2; });
        }
    };
    TravelLogisticComponent.prototype.downloadFile = function () {
        var _this = this;
        this.isWorking = true;
        var projectId = this.projectId;
        this.ApiService.download(EEndpoints.ProjectTravelLogisticsDownload, { projectId: projectId })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (fileData) {
            var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "LogisticTravel");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TravelLogisticComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], TravelLogisticComponent.prototype, "projectId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], TravelLogisticComponent.prototype, "projectTypeId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], TravelLogisticComponent.prototype, "perm", void 0);
    TravelLogisticComponent = __decorate([
        Component({
            selector: 'app-travel-logistic',
            templateUrl: './travel-logistic.component.html',
            styleUrls: ['./travel-logistic.component.css']
        }),
        __metadata("design:paramtypes", [MatDialog,
            ApiService,
            ToasterService,
            TranslateService,
            ComponentsComunicationService])
    ], TravelLogisticComponent);
    return TravelLogisticComponent;
}());
export { TravelLogisticComponent };
//# sourceMappingURL=travel-logistic.component.js.map