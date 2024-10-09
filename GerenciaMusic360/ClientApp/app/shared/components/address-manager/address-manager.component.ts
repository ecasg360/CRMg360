import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { IAddress } from '@models/address';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { ResponseApi } from '@models/response-api';
import { ToasterService } from '@services/toaster.service';
import { AddAddressComponent } from './add-address/add-address.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';

@Component({
    selector: 'app-address-manager',
    templateUrl: './address-manager.component.html',
    styleUrls: ['./address-manager.component.scss']
})

export class AddressManagerComponent implements OnInit, OnChanges {

    @Input() personId: number = 0;
    @Input() isArtist: boolean;

    innerWidth: any;
    displayedColumns: string[] = ['address', 'status', 'action'];
    dataSource: MatTableDataSource<any>;
    isWorking: boolean = false;
    addressTypes: any[] = [];
    addressList: any[] = [];

    //#region Lifetime Cycle
    constructor(
        public dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private translate: TranslateService,
        private apiService: ApiService,
        private toasterService: ToasterService,
    ) {
        this.getAddressType();
    }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.innerWidth = window.innerWidth;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.personId.currentValue > 0) {
            this.getAddressesApi();
        }
    }

    //#endregion

    //#region API Methods

    saveAddressApi(address: IAddress) {
        this.isWorking = true;
        delete address.id;
        this.apiService.save(EEndpoints.Address, address).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toasterService.showToaster(this.translate.instant('messages.addressSaved'));
                    this.getAddressesApi();
                } else {
                    this.toasterService.showToaster(this.translate.instant('errors.savedAddressFailed'));
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        )
    }

    editAddressApi(address: IAddress) {
        this.isWorking = true;
        this.apiService.update(EEndpoints.Address, address).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toasterService.showToaster(this.translate.instant('messages.addressEdited'));
                    this.getAddressesApi();
                } else {
                    this.toasterService.showToaster(this.translate.instant('errors.editedAddressFailed'));
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        )
    }

    getAddressesApi() {
        this.isWorking = true;
        this.apiService.get(EEndpoints.Addresses, { personId: this.personId }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.addressList = response.result;
                    this.dataSource = new MatTableDataSource(this.addressList);
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        )
    }

    deleteAddressApi(id: number) {
        this.isWorking = true;
        this.apiService.delete(EEndpoints.Address, { id: id, personId: this.personId }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toasterService.showToaster(this.translate.instant('messages.addressDeleted'));
                    this.getAddressesApi();
                } else {
                    this.toasterService.showToaster(this.translate.instant('errors.deleteAddressFailed'));
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        )
    }

    updateAddressStatusApi(model: any) {
        this.isWorking = true;
        this.apiService.save(EEndpoints.AddressStatus, model).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toasterService.showToaster(this.translate.instant('messages.changeStatusSuccess'));
                    this.getAddressesApi();
                } else {
                    this.toasterService.showToaster(this.translate.instant('errors.changeStatusFailed'));
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        );
    }

    getAddressType() {
        this.apiService.get(EEndpoints.AddressTypes).subscribe((data: ResponseApi<any>) => {
            if (data.code == 100) {
                this.addressTypes = data.result;
            }
        }, (err) => this.responseError(err));
    }

    //#endregion

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    showModalForm(id: number = 0): void {
        this.isWorking = true;
        let address = <IAddress>{};
        if (id !== 0) {
            address = this.addressList.find(f => f.id == id);
        }

        const dialogRef = this.dialog.open(AddAddressComponent, {
            width: '850px',
            data: {
                id: id,
                model: address,
                isArtist: this.isArtist
            }
        });
        dialogRef.afterClosed().subscribe((address: IAddress) => {
            if (address !== undefined) {
                this.manageAddressEvent(address);
            }
        });
        this.isWorking = false;
    }

    manageAddressEvent(address: IAddress) {
        address.personId = this.personId;
        if (this.isArtist) {
            let artista: any = address.stateId;
            let direccion: any = address.addressTypeId;
            address.stateId = artista.value;
            address.addressTypeId = direccion.value;
        }
        if (address.id > 0) {
            this.editAddressApi(address);
        } else {
            this.saveAddressApi(address);
        }
    }

    isAddressRepeat(address: IAddress) {
        const found = this.addressList.find(f => f.addressTypeId == address.addressTypeId);
        if (found) {
            return true;
        }
        return false;
    }

    updateStatus(id: any, statusRecordId: any, addressTypeId: any) {
        const status = (statusRecordId == 1) ? 2 : 1;
        this.updateAddressStatusApi({
            id: id,
            status: status,
            TypeId: addressTypeId
        });
    }

    confirmDelete(id: number, name: string): void {
        const desc = (name) ? name : this.translate.instant('general.address');
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: desc }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm)
                    this.deleteAddressEvent(id);
            }
        });
    }

    deleteAddressEvent(id: number): void {
        this.isWorking = true;
        if (id > 0) {
            this.deleteAddressApi(id);
        } else {
            this.addressList = this.addressList.filter(f => f.id !== id);
        }
        this.isWorking = false;
    }

    private responseError(err: any) {
        this.isWorking = false;
        console.log('http error', err);
    }

}
