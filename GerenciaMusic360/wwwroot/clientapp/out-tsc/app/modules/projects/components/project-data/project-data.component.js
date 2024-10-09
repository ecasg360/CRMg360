var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { MatTableDataSource, MatDialog, MatAutocomplete } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { EReportType } from '@enums/report-type';
import { ProjectEventComponent } from './project-event/project-event.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { EEntityProjectType, ProjectTypesString } from '@enums/project-type';
import { AddLocationComponent } from '../../../settings/components/location/add-location/add-location.component';
import { ComponentsComunicationService } from '@services/components-comunication.service';
var ProjectDataComponent = /** @class */ (function () {
    function ProjectDataComponent(toaster, translate, translationLoader, formBuilder, apiService, comunication, dialog) {
        this.toaster = toaster;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.comunication = comunication;
        this.dialog = dialog;
        this.project = {};
        this.showProjectType = true;
        this.showUploadImage = false;
        this.projectType = 0;
        this.menuModuleFilter = '';
        this.projectId = 0;
        this.formReady = new EventEmitter();
        this.sendProjectType = new EventEmitter();
        this.projectTypeList = [];
        this.currenciesList = [];
        this.dataProjectForm = new FormGroup({});
        this.disableDate = true;
        this.initDate = new Date(2000, 0, 1);
        this.endDate = new Date(2120, 0, 1);
        this.artistList = [];
        this.showUpcCode = false;
        this.reportTypeEnum = EReportType;
        this.projectEvents = [];
        this.displayedColumns = [/*'eventDate',*/ 'venue', 'location', 'guarantee', 'depositDate', 'lastPaymentDate', 'action'];
        this.locations = [];
        this.isWorking = false;
        this.addMultipleArtist = false;
        //chip autocomplete
        this.visible = true;
        this.selectable = true;
        this.removable = true;
        this.addOnBlur = true;
        this.userCtrl = new FormControl();
        this.separatorKeysCodes = [ENTER, COMMA];
        this.userList = [];
        this.selectableUserList = [];
        this.selectedUsersList = [];
        this.addressModel = {};
        this.locationFC = new FormControl();
        this.question = '';
        this.unsubscribeAll = new Subject();
    }
    ProjectDataComponent.prototype.ngOnInit = function () {
        var _a;
        var _this = this;
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        this.endDateLabel = this.translate.instant('general.endDate');
        if (this.projectType > 0) {
            this.project.projectTypeId = this.projectType;
            this.showProjectType = false;
        }
        this.configureForm();
        this.getProjectTypes();
        this._getArtistsApi();
        this.getCurrenciesApi();
        this.getLocations();
        if (this.projectId > 0) {
            this.getProjectEventsApi();
        }
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
        this.comunication.listenProjectChange().pipe(takeUntil(this.unsubscribeAll))
            .subscribe(function (project) {
            console.log(project);
            if (project) {
                _this.project = project;
                _this.configureForm();
            }
        });
    };
    ProjectDataComponent.prototype.ngOnDestroy = function () {
        this.formReady.complete();
        this.sendProjectType.complete();
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    };
    ProjectDataComponent.prototype.ngOnChanges = function (changes) {
        var project = changes.project;
        if (project && project.isFirstChange) {
            this.configureForm();
            // this.f.artistName.disable({ onlySelf: true });
        }
        if (changes.projectType) {
            this.project.projectTypeId = changes.projectType.currentValue;
        }
        if (changes.menuModuleFilter) {
            this._filterProjectsTypeByMenu();
        }
    };
    Object.defineProperty(ProjectDataComponent.prototype, "f", {
        //#region form
        get: function () { return this.dataProjectForm.controls; },
        enumerable: false,
        configurable: true
    });
    ProjectDataComponent.prototype.configureForm = function () {
        var _this = this;
        this.croppedImage = this.project.pictureUrl;
        var endDate = (this.project.endDate)
            ? (new Date(this.project.initialDate)).toISOString()
            : null;
        this.dataProjectForm = this.formBuilder.group({
            id: [this.project.id, []],
            name: [this.project.name, [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.minLength(3),
                ]],
            description: [this.project.description, [
                    Validators.maxLength(150),
                    Validators.minLength(3),
                ]],
            totalBudget: [this.project.totalBudget, [
                    Validators.maxLength(150),
                    Validators.minLength(3),
                ]],
            initialDate: [endDate, [
                    Validators.required,
                    Validators.maxLength(150),
                    Validators.minLength(3),
                ]],
            endDate: [endDate, [
                    Validators.required,
                    Validators.maxLength(150),
                    Validators.minLength(3),
                ]],
            projectTypeId: [this.project.projectTypeId, [
                    Validators.required
                ]],
            artistId: [this.project.artistId, [Validators.required]],
            artistName: [this.project.artistName, []],
            currencyId: [this.project.currencyId, [
                    Validators.required
                ]],
            pictureUrl: [this.croppedImage, []],
            upcCode: [this.project.upcCode, []],
            venue: [this.project.venue, []],
            locationId: [this.project.locationId, []],
            deposit: [this.project.deposit, []],
            depositDate: [this.project.depositDate, []],
            lastPayment: [this.project.lastPayment, []],
            lastPaymentDate: [this.project.lastPaymentDate, []],
            selectedArtist: [this.selectedUsersList, []],
        });
        this.artistFiltered = this.f.artistName.valueChanges.pipe(startWith(''), map(function (artist) { return artist ? _this._filterArtist(artist) : _this.artistList.slice(); }));
        this._formatLabels();
        if (this.project.projectTypeId) {
            this._manageUpcCode();
        }
        this.formReady.emit(this.dataProjectForm);
    };
    //#endregion
    //#region events
    ProjectDataComponent.prototype.selectProjectType = function (projectTypeId) {
        this.projectTypeId = projectTypeId;
        this.f['projectTypeId'].patchValue(projectTypeId);
        this.project.projectTypeId = projectTypeId;
        this._formatLabels();
        this.showProjectType = false;
        this._manageUpcCode();
    };
    ProjectDataComponent.prototype.dateChangeEvent = function (type, event) {
        this.f.initialDate.patchValue(event.value);
    };
    ProjectDataComponent.prototype.selectImage = function ($event) {
        this.croppedImage = $event;
        this.project.pictureUrl = this.croppedImage;
        this.f['pictureUrl'].patchValue(this.croppedImage);
    };
    ProjectDataComponent.prototype.automCompleteSelected = function ($event) {
        if ($event.option.id == '0') {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            var artist = {
                name: newItem,
                lastName: '',
            };
            this.saveArtistApi(artist);
        }
        else {
            this.f.artistId.patchValue($event.option.id);
        }
    };
    ProjectDataComponent.prototype.remove = function (userId) {
        var index = this.selectedUsersList.findIndex(function (fi) { return fi.id == userId; });
        if (index >= 0)
            this.selectedUsersList.splice(index, 1);
        if (this.selectedUsersList.length == 0) {
            this.f['selectedUsers'].patchValue(null);
            this.campainPlanForm.markAsDirty();
        }
        if (this.project.id) {
            this.deleteProjectArtist(userId);
        }
        var found = this.userList.find(function (f) { return f.id == userId; });
        if (found)
            this.selectableUserList.push(found);
    };
    ProjectDataComponent.prototype.selected = function (event) {
        var userId = parseInt(event.option.id);
        var found = this.selectableUserList.find(function (f) { return f.id == userId; });
        this._manageSelectedArtistBadget(found);
    };
    ProjectDataComponent.prototype.enter = function (evt) {
        var _this = this;
        var found = this.selectableUserList.find(function (f) { return f.name + " " + f.lastName == _this.userCtrl.value; });
        this._manageSelectedArtistBadget(found);
    };
    ProjectDataComponent.prototype._manageSelectedArtistBadget = function (found) {
        if (found) {
            this.selectedUsersList.push(found);
            this.f['selectedArtist'].patchValue(this.selectedUsersList);
            this.selectableUserList = this.selectableUserList.filter(function (f) { return f.id !== found.id; });
            this.selectableUserList.slice();
            if (this.project.id) {
                var params = [{
                        projectId: this.project.id,
                        guestArtistId: found.id
                    }];
                this.saveArtistProjectApi(params);
            }
        }
        this.userCtrl.setValue(null);
        this.usersInput.nativeElement.value = '';
    };
    //#endregion
    ProjectDataComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        return this.selectableUserList.filter(function (user) { return (user.name + " " + user.lastName).toLowerCase().indexOf(filterValue) === 0; });
    };
    ProjectDataComponent.prototype._filterArtist = function (value) {
        var filterValue = value ? value.toLowerCase() : '';
        var results = [];
        results = this.artistList.filter(function (artist) { return (artist.name + " " + artist.lastName).toLowerCase().includes(filterValue); });
        return (results.length == 0)
            ? [{
                    id: 0,
                    name: "" + this.question + value.trim() + "\"?",
                    lastName: ''
                }]
            : results;
    };
    ProjectDataComponent.prototype._manageUpcCode = function () {
        var _this = this;
        var found = this.projectTypeList.find(function (f) { return f.id === _this.project.projectTypeId; });
        if (found) {
            if (found.name == 'AlbumRelease' || found.name == 'SingleRelease'
                || found.name == 'VideoMusic' || found.name == 'VideoLyricMusic') {
                this.showUpcCode = true;
            }
        }
    };
    ProjectDataComponent.prototype._responseError = function (err) {
        console.log(err);
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    };
    ProjectDataComponent.prototype._formatLabels = function () {
        var _this = this;
        if (this.projectTypeList.length > 0) {
            var found = this.projectTypeList.find(function (f) { return f.id === _this.project.projectTypeId; });
            if (found) {
                this.projectTypeName = this.translate.instant(found.name);
                this.sendProjectType.emit(this.projectTypeName);
                if (found.name == 'Event' || found.name == 'ArtistSale') {
                    this.addMultipleArtist = true;
                    this.endDateLabel = this.translate.instant('general.eventDay');
                    if (found.name == 'ArtistSale') {
                        this.budgetLabel = this.translate.instant('projectEvents.guarantee');
                    }
                    else if (found.name == 'Event') {
                        this.budgetLabel = this.translate.instant('projectEvents.income');
                    }
                    this.filteredUsers = this.userCtrl.valueChanges.pipe(startWith(null), map(function (member) { return member ? _this._filter(member) : _this.selectableUserList.slice(); }));
                }
                else {
                    this.addMultipleArtist = false;
                    this.endDateLabel = this.translate.instant('general.releaseDate');
                    this.budgetLabel = this.translate.instant('general.totalBudget');
                }
            }
        }
    };
    ProjectDataComponent.prototype._filterProjectsTypeByMenu = function () {
        if (this.menuModuleFilter == 'label') {
            this.projectTypeList = this.projectTypeList.filter(function (f) { return f.name != 'ArtistSale' && f.name != 'Event'; });
        }
        else if (this.menuModuleFilter == 'event') {
            this.projectTypeList = this.projectTypeList.filter(function (f) { return f.name == 'Event'; });
        }
        else if (this.menuModuleFilter == 'agency') {
            this.projectTypeList = this.projectTypeList.filter(function (f) { return f.name == 'ArtistSale'; });
        }
    };
    ProjectDataComponent.prototype._filterLocation = function (value) {
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
    ProjectDataComponent.prototype.autocompleteOptionSelected = function ($event) {
        var _this = this;
        if ($event.option.id == '0') {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            console.log(newItem);
            var dialogRef = this.dialog.open(AddLocationComponent, {
                width: '800px',
                data: {
                    id: 0
                }
            });
            dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeAll)).subscribe(function (result) {
                console.log(result);
                if (result)
                    _this.getLocations(result);
            });
        }
        else {
            this.f.locationId.patchValue($event.option.id);
        }
    };
    ProjectDataComponent.prototype._fillTable = function () {
        this.dataSourceEvent = new MatTableDataSource(this.projectEvents);
        this.dataSourceEvent.paginator = this.paginator;
        this.dataSourceEvent.sort = this.sort;
    };
    ProjectDataComponent.prototype.getProjectTypes = function () {
        var _this = this;
        this.isWorking = true;
        var keys = Object.keys(EEntityProjectType).filter(function (key) { return !isNaN(Number(EEntityProjectType[key])); });
        if (keys.length > 0) {
            this.projectTypeList = [];
            keys.forEach(function (key) {
                var id = EEntityProjectType[key];
                _this.projectTypeList.push({
                    id: id,
                    name: key,
                    description: '',
                    statusRecordId: 1,
                    pictureUrl: "assets/images/projects/" + ProjectTypesString[id] + ".jpg",
                });
            });
            // ocultar momentaneamente
        }
        this._filterProjectsTypeByMenu();
        this._manageUpcCode();
        this._formatLabels();
    };
    //#region API
    ProjectDataComponent.prototype.getCurrenciesApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Currencies).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.currenciesList = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.code
                }); });
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProjectDataComponent.prototype._getArtistsApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Artists).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.artistList = response.result;
                _this.userList = response.result;
                _this.selectableUserList = response.result;
                _this._getProjectArtist();
            }
            else {
                _this.toaster.showToaster(response.message);
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProjectDataComponent.prototype.getProjectEventsApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.ProjectEventsByProject, { projectId: this.projectId })
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectEvents = response.result;
                _this._fillTable();
            }
            else {
                _this.toaster.showToaster(response.message);
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProjectDataComponent.prototype.getLocations = function (selectId) {
        var _this = this;
        if (selectId === void 0) { selectId = 0; }
        this.apiService.get(EEndpoints.Locations).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                _this.locations = response.result.map(function (m) { return ({
                    value: m.id,
                    viewValue: m.address.neighborhood + "  " + m.address.street + " " + (m.address.municipality ? m.address.municipality : '') + " " + (m.address.countryName ? m.address.countryName : '')
                }); });
                _this.filteredOptions = _this.locationFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filterLocation(value); }));
                if (_this.f.locationId.value)
                    selectId = _this.f.locationId.value;
                if (selectId > 0) {
                    var found = _this.locations.find(function (f) { return f.value == selectId; });
                    _this.locationFC.patchValue(found.viewValue);
                    _this.f.locationId.patchValue(found.value);
                }
            }
        }, function (err) { return _this.responseError(err); });
    };
    ProjectDataComponent.prototype._getProjectArtist = function () {
        var _this = this;
        this.apiService.get(EEndpoints.ProjectArtists, { projectId: this.projectId }).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100 && response.result.length > 0) {
                var projectArtist_1 = response.result;
                _this.selectableUserList = [];
                _this.selectedUsersList = [];
                _this.userList.forEach(function (value, index) {
                    var found = projectArtist_1.find(function (f) { return f.guestArtistId == value.id; });
                    if (found)
                        _this.selectedUsersList.push(value);
                    else
                        _this.selectableUserList.push(value);
                });
                if (_this.f['selectedUsers'])
                    _this.f['selectedUsers'].patchValue(_this.selectedUsersList);
                _this.selectableUserList.slice();
            }
        }, function (err) { return _this._responseError(err); });
    };
    ProjectDataComponent.prototype.showModalEventForm = function (model) {
        var _this = this;
        if (model === void 0) { model = {}; }
        model.projectId = this.projectId;
        var dialogRef = this.dialog.open(ProjectEventComponent, {
            width: '700px',
            data: {
                projectEvent: model
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeAll)).subscribe(function (result) {
            if (result) {
                console.log(result);
            }
            _this.getProjectEventsApi();
        });
    };
    ProjectDataComponent.prototype.confirmDelete = function (id) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: this.translate.instant('projectEvents.event') }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeAll)).subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteProjectEvent(id);
            }
        });
    };
    ProjectDataComponent.prototype.deleteProjectEvent = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = id;
        this.apiService.delete(EEndpoints.ProjectEvent, params)
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(function (data) {
            if (data.code == 100) {
                _this.getProjectEventsApi();
                _this.toaster.showToaster(_this.translate.instant('projectEvents.messages.deleteSuccess'));
            }
            else {
                _this.toaster.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    ProjectDataComponent.prototype.saveAddress = function (address) {
        var _this = this;
        address.id = 0;
        address.addressTypeId = 5;
        this.apiService.save(EEndpoints.AddressLocation, address)
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(function (data) {
            if (data.code == 100) {
                setTimeout(function () { return _this.locationFC.setValue(address.neighborhood); });
                _this.saveLocation(data.result);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectDataComponent.prototype.saveLocation = function (addressId) {
        var _this = this;
        var location = {
            id: 0,
            addressId: addressId,
        };
        this.apiService.save(EEndpoints.Location, location)
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(function (data) {
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
    ProjectDataComponent.prototype.deleteProjectArtist = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.ProjectArtistById, { id: id })
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(function (data) {
            if (data.code != 100)
                _this.toaster.showToaster(data.message);
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectDataComponent.prototype.saveArtistProjectApi = function (artists) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectArtists, artists).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectDataComponent.prototype.saveArtistApi = function (model) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.Artist, model).pipe(takeUntil(this.unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                model.id = response.result;
                _this.artistList.push(model);
                setTimeout(function () { return _this.f.artistName.setValue(model.name + " " + model.lastName); });
                _this.f.artistId.patchValue(response.result);
            }
            else {
                console.log(response.message);
                _this.toaster.showToaster(_this.translate.instant('messages.savedArtistFailed'));
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectDataComponent.prototype, "project", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ProjectDataComponent.prototype, "showProjectType", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ProjectDataComponent.prototype, "showUploadImage", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectDataComponent.prototype, "projectType", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ProjectDataComponent.prototype, "menuModuleFilter", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectDataComponent.prototype, "projectId", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ProjectDataComponent.prototype, "formReady", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ProjectDataComponent.prototype, "sendProjectType", void 0);
    __decorate([
        ViewChild('usersInput', { static: false }),
        __metadata("design:type", ElementRef)
    ], ProjectDataComponent.prototype, "usersInput", void 0);
    __decorate([
        ViewChild('autoArtists', { static: false }),
        __metadata("design:type", MatAutocomplete)
    ], ProjectDataComponent.prototype, "matAutocomplete", void 0);
    ProjectDataComponent = __decorate([
        Component({
            selector: 'app-project-data',
            templateUrl: './project-data.component.html',
            styleUrls: ['./project-data.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            TranslateService,
            FuseTranslationLoaderService,
            FormBuilder,
            ApiService,
            ComponentsComunicationService,
            MatDialog])
    ], ProjectDataComponent);
    return ProjectDataComponent;
}());
export { ProjectDataComponent };
//# sourceMappingURL=project-data.component.js.map