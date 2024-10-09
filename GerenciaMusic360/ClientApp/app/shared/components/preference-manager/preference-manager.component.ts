import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { IPersonPreference } from '@shared/models/personPreference';
import { IPreference } from '@shared/models/preference';
import { AddRPersonPreferenceComponent } from './add-person-preferences/add-person-preference.component';
import { IPersonPreferenceEnt } from '@shared/models/personPreferenceEnt';

@Component({
    selector: 'app-preference-manager',
    templateUrl: './preference-manager.component.html',
    styleUrls: ['./preference-manager.component.scss']
})
export class PreferenceManagerComponent implements OnInit, OnChanges {
    @Output() emitPersonPreferencekData = new EventEmitter<IPersonPreference[]>();
    @Input() personId: number;
    typeId: number = 0;
    displayedColumns: string[] = ['id', 'name', 'subPreference', 'add'];
    dataSource: MatTableDataSource<any>;
    isWorking: boolean = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    innerWidth: any;
   
    isDataAvailable: boolean = true;
    personPreferences: IPersonPreference[] = [];
    // preferencesTypes: IPreference[] = [];
    // preferencesSubTypes: SelectOption[] = [];

    constructor(
        public dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private translate: TranslateService,
        private service: ApiService,
        private toasterService: ToasterService,
    ) {
    }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.innerWidth = window.innerWidth;
        this.getPersonPreferences();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const personId = changes.personId;
        if (personId.currentValue > 0) {
            this.triggerAddressesQueue();
            this.getPersonPreferences();
        }
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    triggerAddressesQueue() {
        if (this.personPreferences.length > 0) {
            const dataToSave: any[] =[];
            this.personPreferences.forEach((x) => {
                x.preferences.forEach((p) => {
                    p.personId = this.personId;
                });
                dataToSave.push(x.preferences);
            })
            this.savePersonPreference(dataToSave);
        } else {
            this.getPersonPreferences();
        }
    }
    
    getPersonPreferences() {
        this.dataSource = undefined;
        const params = [];
        params['personId'] = this.personId;
        this.service.get(EEndpoints.PersonPreferences, params)
        .subscribe((response) => {
            if (response.code == 100) {
                this.personPreferences = response.result;
                this.dataSource = new MatTableDataSource(this.personPreferences);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
              }
              this.isWorking = false;
        }, (err) => this.responseError(err));
    }

    savePersonPreference(personPreference: IPersonPreferenceEnt[]) {
        this.service.save(EEndpoints.PersonPreferences, personPreference)
        .subscribe((response) => {
            if (response.code == 100) {
                this.toasterService.showToaster(this.translate.instant('messages.preferenceSaved'));
            }
            this.getPersonPreferences();
        }, (err) => this.responseError(err));
    }

    addPersonPreference(row: any): void {
        const dialogRef = this.dialog.open(AddRPersonPreferenceComponent, {
            width: '500px',
            data: {
                data: row,
                personId: this.personId
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                if (this.personId === 0) {
                    row.preferences = result;
                } else {
                    this.manageAddressEvent(result);
                }
            }
        });
    }

    updatePersonSocialNetwork(personPreference: IPersonPreferenceEnt[]) {
        this.service.update(EEndpoints.PersonPreference, personPreference)
        .subscribe((response) => {
            if (response.code == 100) {
                //this.toasterService.showToaster(this.translate.instant('messages.artistSaved'));
            }
        }, (err) => this.responseError(err));
    }

    manageAddressEvent(personPreference: IPersonPreferenceEnt[]) {
        this.savePersonPreference(personPreference);
    }

    confirmDelete(row: any): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
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
                    const params = [];
                    params['personId'] = this.personId;
                    params['id'] = row.id;
                    this.service.delete(EEndpoints.PersonPreference, params).subscribe((response) => {
                        this.toasterService.showToaster(this.translate.instant('messages.preferenceSaved'));
                        this.getPersonPreferences();
                    }, (err) => this.responseError(err));
                }
            }
        });
    }

    private responseError(err: any) {
        this.isWorking = false;
        console.log('http error', err);
    }
    //#endregion
}
