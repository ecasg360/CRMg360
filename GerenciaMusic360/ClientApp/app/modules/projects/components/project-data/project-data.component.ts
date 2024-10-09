import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IProjectType } from '@models/project-type';
import { IProject } from '@models/project';
import { MatDatepickerInputEvent, MatAutocompleteSelectedEvent, MatTableDataSource, MatDialog, MatAutocomplete } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ICurrency } from '@models/currency';
import { IArtist, IProjectArtist } from '@models/artist';
import { Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { SelectOption } from '@models/select-option.models';
import { EReportType } from '@enums/report-type';
import { IProjectEvent } from '@models/project-event';
import { ILocation } from '@models/location';
import { ProjectEventComponent } from './project-event/project-event.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { IAddress } from '@models/address';
import { EEntityProjectType, ProjectTypesString } from '@enums/project-type';
import { AddLocationComponent } from '../../../settings/components/location/add-location/add-location.component';
import { ComponentsComunicationService } from '@services/components-comunication.service';

@Component({
    selector: 'app-project-data',
    templateUrl: './project-data.component.html',
    styleUrls: ['./project-data.component.scss']
})
export class ProjectDataComponent implements OnInit, OnDestroy, OnChanges {
    [x: string]: any;

    @Input() project: IProject = <IProject>{};
    @Input() showProjectType: boolean = true;
    @Input() showUploadImage: boolean = false;
    @Input() projectType: number = 0;
    @Input() menuModuleFilter: string = '';
    @Input() projectId: number = 0;

    @Output() formReady = new EventEmitter<FormGroup>();
    @Output() sendProjectType = new EventEmitter<string>();

    projectTypeList: IProjectType[] = [];
    currenciesList: SelectOption[] = [];
    dataProjectForm: FormGroup = new FormGroup({});
    disableDate: boolean = true;
    initDate: Date = new Date(2000, 0, 1);
    endDate: Date = new Date(2120, 0, 1);
    croppedImage: any;
    artistList: IArtist[] = [];
    artistFiltered: Observable<IArtist[]>;
    endDateLabel: string;
    projectTypeName: string;
    showUpcCode: boolean = false;
    budgetLabel: string;
    reportTypeEnum = EReportType;
    projectEvents: IProjectEvent[] = [];
    dataSourceEvent: MatTableDataSource<IProjectEvent>;
    displayedColumns: string[] = [/*'eventDate',*/ 'venue', 'location', 'guarantee', 'depositDate', 'lastPaymentDate', 'action'];
    projectTypeId: number;
    locations: SelectOption[] = [];
    isWorking: boolean = false;
    addMultipleArtist: boolean = false;


    //chip autocomplete
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    userCtrl = new FormControl();
    separatorKeysCodes: number[] = [ENTER, COMMA];
    userList: IArtist[] = [];
    selectableUserList: IArtist[] = [];
    selectedUsersList: IArtist[] = [];
    filteredUsers: Observable<IArtist[]>;

    addressModel: IAddress = <IAddress>{};
    locationFC = new FormControl();
    filteredOptions: Observable<SelectOption[]>;
    question = '';
    private unsubscribeAll: Subject<any> = new Subject();

    // Se coloca as any ya que esta funcion esta deprecada en angular 8 y algunas versiones de angular 7
    // https://next.angular.io/guide/static-query-migration
    // https://github.com/angular/angular/issues/30654
    @ViewChild('usersInput', { static: false } as any) usersInput: ElementRef<HTMLInputElement>;
    @ViewChild('autoArtists', { static: false } as any) matAutocomplete: MatAutocomplete;

    constructor(
        private toaster: ToasterService,
        private translate: TranslateService,
        private translationLoader: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private comunication: ComponentsComunicationService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.translationLoader.loadTranslations(...allLang);
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
            .subscribe((project: IProject) => {
                console.log(project);
                if (project) {
                    this.project = project;
                    this.configureForm();
                }
            });

    }

    ngOnDestroy(): void {
        this.formReady.complete();
        this.sendProjectType.complete();
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const project = changes.project;
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
    }

    //#region form
    get f() { return this.dataProjectForm.controls; }

    private configureForm(): void {
        this.croppedImage = this.project.pictureUrl;
        const endDate = (this.project.endDate)
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
            pictureUrl: [this.croppedImage, [
            ]],
            upcCode: [this.project.upcCode, []],
            venue: [this.project.venue, []],
            locationId: [this.project.locationId, []],
            deposit: [this.project.deposit, []],
            depositDate: [this.project.depositDate, []],
            lastPayment: [this.project.lastPayment, []],
            lastPaymentDate: [this.project.lastPaymentDate, []],
            selectedArtist: [this.selectedUsersList, []],
        });

        this.artistFiltered = this.f.artistName.valueChanges.pipe(
            startWith(''),
            map(artist => artist ? this._filterArtist(artist) : this.artistList.slice())
        );
        this._formatLabels();
        if (this.project.projectTypeId) {
            this._manageUpcCode();
        }
        this.formReady.emit(this.dataProjectForm);
    }

    //#endregion

    //#region events
    selectProjectType(projectTypeId: number) {
        this.projectTypeId = projectTypeId;
        this.f['projectTypeId'].patchValue(projectTypeId);
        this.project.projectTypeId = projectTypeId;
        this._formatLabels();
        this.showProjectType = false;
        this._manageUpcCode();
    }

    dateChangeEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        this.f.initialDate.patchValue(event.value);
    }

    selectImage($event: any): void {
        this.croppedImage = $event;
        this.project.pictureUrl = this.croppedImage;
        this.f['pictureUrl'].patchValue(this.croppedImage);
    }

    automCompleteSelected($event: MatAutocompleteSelectedEvent) {
        if ($event.option.id == '0') {
            let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            let artist = <IArtist>{
                name: newItem,
                lastName: '',
            }
            this.saveArtistApi(artist);
        } else {
            this.f.artistId.patchValue($event.option.id);
        }
    }

    remove(userId: number): void {
        const index = this.selectedUsersList.findIndex(fi => fi.id == userId);
        if (index >= 0)
            this.selectedUsersList.splice(index, 1);

        if (this.selectedUsersList.length == 0) {
            this.f['selectedUsers'].patchValue(null);
            this.campainPlanForm.markAsDirty();
        }

        if (this.project.id) {
            this.deleteProjectArtist(userId);
        }

        const found = this.userList.find(f => f.id == userId);
        if (found)
            this.selectableUserList.push(found);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        const userId = parseInt(event.option.id);
        const found = this.selectableUserList.find(f => f.id == userId);
        this._manageSelectedArtistBadget(found);
    }

    enter(evt: any) {
        const found = this.selectableUserList.find(f => `${f.name} ${f.lastName}` == this.userCtrl.value);
        this._manageSelectedArtistBadget(found);
    }

    private _manageSelectedArtistBadget(found: IArtist) {
        if (found) {
            this.selectedUsersList.push(found);
            this.f['selectedArtist'].patchValue(this.selectedUsersList);
            this.selectableUserList = this.selectableUserList.filter(f => f.id !== found.id);
            this.selectableUserList.slice();
            if (this.project.id) {
                const params = [<IProjectArtist>{
                    projectId: this.project.id,
                    guestArtistId: found.id
                }];
                this.saveArtistProjectApi(params);
            }
        }
        this.userCtrl.setValue(null);
        this.usersInput.nativeElement.value = '';
    }

    //#endregion

    private _filter(value: string): IArtist[] {
        const filterValue = value.toLowerCase();
        return this.selectableUserList.filter(user => `${user.name} ${user.lastName}`.toLowerCase().indexOf(filterValue) === 0);
    }

    private _filterArtist(value: any): IArtist[] {
        const filterValue = value ? value.toLowerCase() : '';
        let results = [];
        results = this.artistList.filter((artist: IArtist) => `${artist.name} ${artist.lastName}`.toLowerCase().includes(filterValue));

        return (results.length == 0)
            ? [{
                id: 0,
                name: `${this.question}${value.trim()}"?`,
                lastName: ''
            }]
            : results;
    }

    private _manageUpcCode() {
        const found = this.projectTypeList.find(f => f.id === this.project.projectTypeId);
        if (found) {
            if (found.name == 'AlbumRelease' || found.name == 'SingleRelease'
                || found.name == 'VideoMusic' || found.name == 'VideoLyricMusic') {
                this.showUpcCode = true;
            }
        }
    }

    private _responseError(err: HttpErrorResponse): void {
        console.log(err)
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    }

    private _formatLabels() {
        if (this.projectTypeList.length > 0) {
            const found = this.projectTypeList.find(f => f.id === this.project.projectTypeId);
            if (found) {
                this.projectTypeName = this.translate.instant(found.name);
                this.sendProjectType.emit(this.projectTypeName);
                if (found.name == 'Event' || found.name == 'ArtistSale') {
                    this.addMultipleArtist = true;
                    this.endDateLabel = this.translate.instant('general.eventDay');
                    if (found.name == 'ArtistSale') {
                        this.budgetLabel = this.translate.instant('projectEvents.guarantee');
                    } else if (found.name == 'Event') {
                        this.budgetLabel = this.translate.instant('projectEvents.income');
                    }
                    this.filteredUsers = this.userCtrl.valueChanges.pipe(
                        startWith(null),
                        map((member: string | null) => member ? this._filter(member) : this.selectableUserList.slice()));
                } else {
                    this.addMultipleArtist = false;
                    this.endDateLabel = this.translate.instant('general.releaseDate');
                    this.budgetLabel = this.translate.instant('general.totalBudget');
                }
            }
        }
    }

    private _filterProjectsTypeByMenu() {
        if (this.menuModuleFilter == 'label') {
            this.projectTypeList = this.projectTypeList.filter(f => f.name != 'ArtistSale' && f.name != 'Event');
        } else if (this.menuModuleFilter == 'event') {
            this.projectTypeList = this.projectTypeList.filter(f => f.name == 'Event');
        } else if (this.menuModuleFilter == 'agency') {
            this.projectTypeList = this.projectTypeList.filter(f => f.name == 'ArtistSale');
        }
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

    autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
        if ($event.option.id == '0') {
            let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            console.log(newItem);
            const dialogRef = this.dialog.open(AddLocationComponent, {
                width: '800px',
                data: {
                    id: 0
                }
            });
            dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeAll)).subscribe(result => {
                console.log(result);
                if (result)
                    this.getLocations(result);
            });
        } else {
            this.f.locationId.patchValue($event.option.id);
        }
    }

    private _fillTable(): void {
        this.dataSourceEvent = new MatTableDataSource(this.projectEvents);
        this.dataSourceEvent.paginator = this.paginator;
        this.dataSourceEvent.sort = this.sort;
    }

    getProjectTypes() {
        this.isWorking = true;
        const keys = Object.keys(EEntityProjectType).filter(key => !isNaN(Number(EEntityProjectType[key])));
        if (keys.length > 0) {
            this.projectTypeList = [];
            keys.forEach((key: string) => {
                const id = EEntityProjectType[key];
                this.projectTypeList.push(<IProjectType>{
                    id: id,
                    name: key,
                    description: '',
                    statusRecordId: 1,
                    pictureUrl: `assets/images/projects/${ProjectTypesString[id]}.jpg`,
                });
            });

            // ocultar momentaneamente

        }
        this._filterProjectsTypeByMenu();
        this._manageUpcCode();
        this._formatLabels();
    }

    //#region API

    getCurrenciesApi(): void {
        this.apiService.get(EEndpoints.Currencies).pipe(takeUntil(this.unsubscribeAll)).subscribe(
            (response: ResponseApi<ICurrency[]>) => {
                if (response.code == 100) {
                    this.currenciesList = response.result.map((s: any) => ({
                        value: s.id,
                        viewValue: s.code
                    }));
                }
            }, (err) => this._responseError(err));
    }

    private _getArtistsApi() {
        this.apiService.get(EEndpoints.Artists).pipe(takeUntil(this.unsubscribeAll)).subscribe(
            (response: ResponseApi<IArtist[]>) => {
                if (response.code == 100) {
                    this.artistList = response.result;
                    this.userList = response.result;
                    this.selectableUserList = response.result;
                    this._getProjectArtist();
                } else {
                    this.toaster.showToaster(response.message);
                }
            }, err => this._responseError(err)
        );
    }

    getProjectEventsApi(): void {
        this.apiService.get(EEndpoints.ProjectEventsByProject, { projectId: this.projectId })
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(
            (response: ResponseApi<IProjectEvent[]>) => {
                if (response.code == 100) {
                    this.projectEvents = response.result;
                    this._fillTable();
                } else {
                    this.toaster.showToaster(response.message);
                }
            }, (err) => this._responseError(err)
        );
    }

    getLocations(selectId: number = 0): void {
        this.apiService.get(EEndpoints.Locations).pipe(takeUntil(this.unsubscribeAll)).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.locations = response.result.map((m: any) => (
                        {
                            value: m.id,
                            viewValue: `${m.address.neighborhood}  ${m.address.street} ${m.address.municipality ? m.address.municipality : ''} ${m.address.countryName ? m.address.countryName: ''}` 
                        })
                    );
                    this.filteredOptions = this.locationFC.valueChanges
                        .pipe(
                            startWith(''),
                            map(value => this._filterLocation(value)
                        )
                    );
                    if (this.f.locationId.value)
                        selectId = this.f.locationId.value;

                    if (selectId > 0) {
                        const found = this.locations.find(f => f.value == selectId);
                        this.locationFC.patchValue(found.viewValue);
                        this.f.locationId.patchValue(found.value);
                    }
                }
            }, (err) => this.responseError(err)
        );
    }

    private _getProjectArtist() {
        this.apiService.get(EEndpoints.ProjectArtists, { projectId: this.projectId }).pipe(takeUntil(this.unsubscribeAll)).subscribe(
            (response: ResponseApi<IProjectArtist[]>) => {
                if (response.code == 100 && response.result.length > 0) {
                    const projectArtist = response.result;
                    this.selectableUserList = [];
                    this.selectedUsersList = [];
                    this.userList.forEach((value: IArtist, index: number) => {
                        const found = projectArtist.find(f => f.guestArtistId == value.id);
                        if (found)
                            this.selectedUsersList.push(value);
                        else
                            this.selectableUserList.push(value);
                    });
                    if (this.f['selectedUsers'])
                        this.f['selectedUsers'].patchValue(this.selectedUsersList);
                    this.selectableUserList.slice();
                }
            }, err => this._responseError(err)
        )
    }

    showModalEventForm(model: IProjectEvent = <IProjectEvent>{}): void {
        model.projectId = this.projectId;
        const dialogRef = this.dialog.open(ProjectEventComponent, {
            width: '700px',
            data: {
                projectEvent: model
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeAll)).subscribe(result => {
            if (result) {
                console.log(result);
            }
            this.getProjectEventsApi();
        });
    }

    confirmDelete(id: number): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: this.translate.instant('projectEvents.event') }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });

        dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeAll)).subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm)
                    this.deleteProjectEvent(id);
            }
        });
    }

    deleteProjectEvent(id: number) {
        this.isWorking = true;
        const params = [];
        params['id'] = id;
        this.apiService.delete(EEndpoints.ProjectEvent, params)
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(data => {
                if (data.code == 100) {
                    this.getProjectEventsApi();
                    this.toaster.showToaster(this.translate.instant('projectEvents.messages.deleteSuccess'));
                } else {
                    this.toaster.showToaster(data.message);
                }
                this.isWorking = false;
            }, (err) => {
                this.responseError(err);
            });
    }

    saveAddress(address: IAddress): void {
        address.id = 0;
        address.addressTypeId = 5;
        this.apiService.save(EEndpoints.AddressLocation, address)
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(
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
        this.apiService.save(EEndpoints.Location, location)
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(
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

    deleteProjectArtist(id: number): void {
        this.isWorking = true;
        this.apiService.delete(EEndpoints.ProjectArtistById, { id })
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(data => {
                if (data.code != 100)
                    this.toaster.showToaster(data.message);
                this.isWorking = false;
            }, (err) => this.responseError(err));
    }

    saveArtistProjectApi(artists: IProjectArtist[]): void {
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectArtists, artists).pipe(takeUntil(this.unsubscribeAll)).subscribe(
            (response: ResponseApi<any>) => {
                this.isWorking = false;
            }, err => this._responseError(err)
        );
    }


    saveArtistApi(model: IArtist): void {
        this.isWorking = true;
        this.apiService.save(EEndpoints.Artist, model).pipe(takeUntil(this.unsubscribeAll)).subscribe(
            (response: ResponseApi<number>) => {
                if (response.code == 100) {
                    model.id = response.result;
                    this.artistList.push(model);
                    setTimeout(() => this.f.artistName.setValue(`${model.name} ${model.lastName}`));
                    this.f.artistId.patchValue(response.result);
                } else {
                    console.log(response.message);
                    this.toaster.showToaster(this.translate.instant('messages.savedArtistFailed'));
                }
                this.isWorking = false;
            }, (err) => this._responseError(err)
        );
    }
    //#endregion
}
