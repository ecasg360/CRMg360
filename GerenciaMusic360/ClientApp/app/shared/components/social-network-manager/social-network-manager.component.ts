import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { ResponseApi } from '@models/response-api';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { IPersonSocialNetwork } from '@models/person-social-network';
import { AddPersonSocialNetworkComponent } from './add-social-network/add-person-social-network.component';

@Component({
    selector: 'app-social-network-manager',
    templateUrl: './social-network-manager.component.html',
    styleUrls: ['./social-network-manager.component.scss']
})
export class SocialNetworkManagerComponent implements OnInit {
    @Output() emitSocialNetWorkData = new EventEmitter<IPersonSocialNetwork[]>();

    private _personId: number;
    @Input()
    set personId(v: number) {
        this._personId = v;
        if (this._personId > 0) {
            this.triggerAddressesQueue();
        }
    }

    get personId(): number {
        return this._personId;
    }

    //'socialNetwork.name'
    displayedColumns: string[] = ['id', 'link', 'status', 'edit'];
    dataSource: MatTableDataSource<any>;
    isWorking: boolean = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    innerWidth: any;

    isDataAvailable: boolean = true;
    personSocialNetwork: IPersonSocialNetwork[] = [];
    //socialNetworkTypes: MainActivity[] = [];
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
        this.getPersonSocialNetwork();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    triggerAddressesQueue() {
        if (this.personSocialNetwork.length > 0) {
            const found = this.personSocialNetwork.filter(f => f.id < 0);
            if (found.length > 0) {
                //this.savePersonSocialNetwork();
            }
        } else {
            this.getPersonSocialNetwork();
        }
    }

    savePersonSocialNetwork(socialNetwork: IPersonSocialNetwork) {
        this.service.save(EEndpoints.SocialNetwork, socialNetwork)
            .subscribe((response) => {
                if (response.code == 100) {
                    this.toasterService.showToaster(this.translate.instant('messages.artistSaved'));
                }
                this.getPersonSocialNetwork();
            }, (err) => this.responseError(err));
    }

    getPersonSocialNetwork() {
        this.isWorking = false;
        this.dataSource = undefined;
        const params = [];
        params['personId'] = this.personId;
        this.service.get(EEndpoints.SocialNetworks, params)
            .subscribe((response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.personSocialNetwork = response.result
                    this.dataSource = new MatTableDataSource(this.personSocialNetwork);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
            }, (err) => this.responseError(err));
    }

    addSocialNetwork(row): void {
        const dialogRef = this.dialog.open(AddPersonSocialNetworkComponent, {
            width: '500px',
            data: {
                data: row,
                personId: this.personId
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                if (result.personId == 0) {
                    result.personId = (new Date()).getMilliseconds() * -1;
                }
                this.manageAddressEvent(result);
            }
        });
    }

    updatePersonSocialNetwork(socialNetwork: IPersonSocialNetwork) {
        // const model: IPersonPreference[] = [];
        // const form = this.addPersonsocialNetworkForm.value;

        // form.subTypeId.forEach((x) => {
        //     const newPrs: IPersonPreference = { id: 0, personId: this.id, preferenceId: x }
        //     model.push(newPrs);
        // });

        this.service.update(EEndpoints.SocialNetwork, socialNetwork)
            .subscribe((response) => {
                if (response.code == 100) {
                    this.toasterService.showToaster(this.translate.instant('messages.itemSaved'));
                    this.getPersonSocialNetwork();
                }
            }, (err) => this.responseError(err));
    }

    updateStatus(id: number, status: number): void {
        let statusId = status == 1 ? 2 : 1;
        this.isWorking = true;

        this.service.save(EEndpoints.SocialNetworkStatus, { id: id, status: statusId })
            .subscribe(data => {
                if (data.code == 100) {
                    this.toasterService.showToaster(this.translate.instant('settings.socialNetwork.messages.statusChanged'));
                    this.getPersonSocialNetwork();
                } else {
                    this.toasterService.showToaster(data.message);
                }
                this.isWorking = false;
            }, (err) => {
                this.responseError(err);
            });
    }

    manageAddressEvent(socialNetwork: IPersonSocialNetwork) {
        // if (this.isAddressRepeat(address)) {
        //     this.toasterService.showToaster(this.translate.instant('errors.AddressRepeat'));
        // } else {
        socialNetwork.personId = this.personId;
        if (socialNetwork.id > 0) {
            this.updatePersonSocialNetwork(socialNetwork);
        } else {
            if (this.personId > 0) {
                this.savePersonSocialNetwork(socialNetwork);
            } else {
                // this.addressList = this.addressList.filter(f => f.id !== address.id);
                // this.addressList.push(address);
                // this.bindTableData();
            }
        }
        // }
    }

    confirmDelete(id: number, name: string): void {
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
                // if (confirm)
                //     this.personPreferences.splice(id, 1);
            }
        });
    }

    private responseError(err: any) {
        this.isWorking = false;
        console.log('http error', err);
    }
    //#endregion
}
