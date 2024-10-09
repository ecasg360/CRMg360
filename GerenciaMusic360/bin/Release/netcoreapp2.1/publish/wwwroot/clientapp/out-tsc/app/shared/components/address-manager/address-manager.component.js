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
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { AddAddressComponent } from './add-address/add-address.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var AddressManagerComponent = /** @class */ (function () {
    //#region Lifetime Cycle
    function AddressManagerComponent(dialog, _fuseTranslationLoaderService, translate, apiService, toasterService) {
        this.dialog = dialog;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.translate = translate;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.personId = 0;
        this.displayedColumns = ['address', 'status', 'action'];
        this.isWorking = false;
        this.addressTypes = [];
        this.addressList = [];
        this.getAddressType();
    }
    AddressManagerComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.innerWidth = window.innerWidth;
    };
    AddressManagerComponent.prototype.ngOnChanges = function (changes) {
        if (changes.personId.currentValue > 0) {
            this.getAddressesApi();
        }
    };
    //#endregion
    //#region API Methods
    AddressManagerComponent.prototype.saveAddressApi = function (address) {
        var _this = this;
        this.isWorking = true;
        delete address.id;
        this.apiService.save(EEndpoints.Address, address).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.addressSaved'));
                _this.getAddressesApi();
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('errors.savedAddressFailed'));
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddressManagerComponent.prototype.editAddressApi = function (address) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.Address, address).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.addressEdited'));
                _this.getAddressesApi();
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('errors.editedAddressFailed'));
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddressManagerComponent.prototype.getAddressesApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Addresses, { personId: this.personId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.addressList = response.result;
                _this.dataSource = new MatTableDataSource(_this.addressList);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddressManagerComponent.prototype.deleteAddressApi = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.Address, { id: id, personId: this.personId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.addressDeleted'));
                _this.getAddressesApi();
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('errors.deleteAddressFailed'));
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddressManagerComponent.prototype.updateAddressStatusApi = function (model) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.AddressStatus, model).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.changeStatusSuccess'));
                _this.getAddressesApi();
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('errors.changeStatusFailed'));
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddressManagerComponent.prototype.getAddressType = function () {
        var _this = this;
        this.apiService.get(EEndpoints.AddressTypes).subscribe(function (data) {
            if (data.code == 100) {
                _this.addressTypes = data.result;
            }
        }, function (err) { return _this.responseError(err); });
    };
    //#endregion
    AddressManagerComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    AddressManagerComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        this.isWorking = true;
        var address = {};
        if (id !== 0) {
            address = this.addressList.find(function (f) { return f.id == id; });
        }
        var dialogRef = this.dialog.open(AddAddressComponent, {
            width: '850px',
            data: {
                id: id,
                model: address,
                isArtist: this.isArtist
            }
        });
        dialogRef.afterClosed().subscribe(function (address) {
            if (address !== undefined) {
                _this.manageAddressEvent(address);
            }
        });
        this.isWorking = false;
    };
    AddressManagerComponent.prototype.manageAddressEvent = function (address) {
        address.personId = this.personId;
        if (this.isArtist) {
            var artista = address.stateId;
            var direccion = address.addressTypeId;
            address.stateId = artista.value;
            address.addressTypeId = direccion.value;
        }
        if (address.id > 0) {
            this.editAddressApi(address);
        }
        else {
            this.saveAddressApi(address);
        }
    };
    AddressManagerComponent.prototype.isAddressRepeat = function (address) {
        var found = this.addressList.find(function (f) { return f.addressTypeId == address.addressTypeId; });
        if (found) {
            return true;
        }
        return false;
    };
    AddressManagerComponent.prototype.updateStatus = function (id, statusRecordId, addressTypeId) {
        var status = (statusRecordId == 1) ? 2 : 1;
        this.updateAddressStatusApi({
            id: id,
            status: status,
            TypeId: addressTypeId
        });
    };
    AddressManagerComponent.prototype.confirmDelete = function (id, name) {
        var _this = this;
        var desc = (name) ? name : this.translate.instant('general.address');
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: desc }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteAddressEvent(id);
            }
        });
    };
    AddressManagerComponent.prototype.deleteAddressEvent = function (id) {
        this.isWorking = true;
        if (id > 0) {
            this.deleteAddressApi(id);
        }
        else {
            this.addressList = this.addressList.filter(function (f) { return f.id !== id; });
        }
        this.isWorking = false;
    };
    AddressManagerComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log('http error', err);
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AddressManagerComponent.prototype, "personId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], AddressManagerComponent.prototype, "isArtist", void 0);
    AddressManagerComponent = __decorate([
        Component({
            selector: 'app-address-manager',
            templateUrl: './address-manager.component.html',
            styleUrls: ['./address-manager.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            FuseTranslationLoaderService,
            TranslateService,
            ApiService,
            ToasterService])
    ], AddressManagerComponent);
    return AddressManagerComponent;
}());
export { AddressManagerComponent };
//# sourceMappingURL=address-manager.component.js.map