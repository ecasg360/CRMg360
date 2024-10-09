var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@enums/endpoints';
import { ToasterService } from '@services/toaster.service';
import { startWith, map } from 'rxjs/operators';
var ProjectEventComponent = /** @class */ (function () {
    function ProjectEventComponent(dialogRef, translate, ApiService, toasterService, formBuilder, actionData) {
        this.dialogRef = dialogRef;
        this.translate = translate;
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.formBuilder = formBuilder;
        this.actionData = actionData;
        this.projectEvent = {};
        this.formReady = new EventEmitter();
        this.modelProjectEvent = {};
        this.isWorking = false;
        this.action = this.translate.instant('general.save');
        this.locations = [];
        this.addressModel = {};
        this.locationFC = new FormControl();
        this.question = '';
    }
    Object.defineProperty(ProjectEventComponent.prototype, "f", {
        //#region form
        get: function () { return this.dataEventForm.controls; },
        enumerable: false,
        configurable: true
    });
    ProjectEventComponent.prototype.ngOnInit = function () {
        this.projectEvent = this.actionData.projectEvent;
        console.log(this.projectEvent);
        this.getLocations();
        this.configureForm();
        if (this.projectEvent.id > 0) {
            this.action = this.translate.instant('general.save');
        }
    };
    ProjectEventComponent.prototype.configureForm = function () {
        this.dataEventForm = this.formBuilder.group({
            id: [this.projectEvent.id, []],
            projectId: [this.projectEvent.projectId, [Validators.required]],
            eventDate: [this.projectEvent.eventDate, [Validators.required]],
            guarantee: [this.projectEvent.guarantee, []],
            venue: [this.projectEvent.venue, []],
            locationId: [this.projectEvent.locationId, [Validators.required]],
            deposit: [this.projectEvent.deposit, [Validators.required]],
            depositDate: [this.projectEvent.depositDate, []],
            lastPayment: [this.projectEvent.lastPayment, []],
            lastPaymentDate: [this.projectEvent.lastPaymentDate, []],
        });
        this.formReady.emit(this.dataEventForm);
    };
    ProjectEventComponent.prototype.saveEvent = function () {
        this.modelProjectEvent = this.dataEventForm.value;
        var objModelEvent = Object.assign({}, this.modelProjectEvent);
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
    };
    ProjectEventComponent.prototype._createEvent = function (model) {
        var _this = this;
        this.isWorking = true;
        this.ApiService.save(EEndpoints.ProjectEvent, model).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('projectEvents.messages.addSuccess'));
                _this.onNoClick(true);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectEventComponent.prototype._updateEvent = function (model) {
        var _this = this;
        this.isWorking = true;
        this.ApiService.update(EEndpoints.ProjectEvent, model).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('projectEvents.messages.saved'));
                _this.onNoClick(true);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectEventComponent.prototype.getLocations = function () {
        var _this = this;
        this.ApiService.get(EEndpoints.Locations).subscribe(function (response) {
            if (response.code == 100) {
                _this.locations = response.result.map(function (m) { return ({ value: m.id, viewValue: m.address.neighborhood }); });
                _this.filteredOptions = _this.locationFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filterLocation(value); }));
            }
        }, function (err) { return _this.responseError(err); });
    };
    ProjectEventComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    ProjectEventComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    ProjectEventComponent.prototype.autocompleteOptionSelected = function ($event) {
        if ($event.option.id == '0') {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            console.log(newItem);
            var address = {
                neighborhood: newItem,
                personId: null,
                countryId: null,
                stateId: null,
                cityId: null,
            };
            this.saveAddress(address);
        }
        else {
            this.f.locationId.patchValue($event.option.id);
        }
    };
    ProjectEventComponent.prototype.saveAddress = function (address) {
        var _this = this;
        address.id = 0;
        address.addressTypeId = 5;
        this.ApiService.save(EEndpoints.AddressLocation, address)
            .subscribe(function (data) {
            if (data.code == 100) {
                setTimeout(function () { return _this.locationFC.setValue(address.neighborhood); });
                _this.saveLocation(data.result);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectEventComponent.prototype.saveLocation = function (addressId) {
        var _this = this;
        var location = {
            id: 0,
            addressId: addressId,
        };
        this.ApiService.save(EEndpoints.Location, location)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.f.locationId.patchValue(data.result);
                _this.getLocations();
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectEventComponent.prototype._filterLocation = function (value) {
        var filterValue = value ? value : '';
        var results = [];
        results = this.locations.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (results.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + filterValue + "\"?"
                }]
            : results;
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectEventComponent.prototype, "projectEvent", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ProjectEventComponent.prototype, "formReady", void 0);
    ProjectEventComponent = __decorate([
        Component({
            selector: 'app-project-event',
            templateUrl: './project-event.component.html',
            styleUrls: ['./project-event.component.css']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            TranslateService,
            ApiService,
            ToasterService,
            FormBuilder, Object])
    ], ProjectEventComponent);
    return ProjectEventComponent;
}());
export { ProjectEventComponent };
//# sourceMappingURL=project-event.component.js.map