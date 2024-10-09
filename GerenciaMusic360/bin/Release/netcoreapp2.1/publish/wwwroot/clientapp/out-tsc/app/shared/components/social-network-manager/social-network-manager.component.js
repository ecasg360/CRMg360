var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { AddPersonSocialNetworkComponent } from './add-social-network/add-person-social-network.component';
var SocialNetworkManagerComponent = /** @class */ (function () {
    //socialNetworkTypes: MainActivity[] = [];
    // preferencesSubTypes: SelectOption[] = [];
    function SocialNetworkManagerComponent(dialog, _fuseTranslationLoaderService, translate, service, toasterService) {
        this.dialog = dialog;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.translate = translate;
        this.service = service;
        this.toasterService = toasterService;
        this.emitSocialNetWorkData = new EventEmitter();
        //'socialNetwork.name'
        this.displayedColumns = ['id', 'link', 'status', 'edit'];
        this.isWorking = true;
        this.isDataAvailable = true;
        this.personSocialNetwork = [];
    }
    Object.defineProperty(SocialNetworkManagerComponent.prototype, "personId", {
        get: function () {
            return this._personId;
        },
        set: function (v) {
            this._personId = v;
            if (this._personId > 0) {
                this.triggerAddressesQueue();
            }
        },
        enumerable: false,
        configurable: true
    });
    SocialNetworkManagerComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.innerWidth = window.innerWidth;
        this.getPersonSocialNetwork();
    };
    SocialNetworkManagerComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    SocialNetworkManagerComponent.prototype.triggerAddressesQueue = function () {
        if (this.personSocialNetwork.length > 0) {
            var found = this.personSocialNetwork.filter(function (f) { return f.id < 0; });
            if (found.length > 0) {
                //this.savePersonSocialNetwork();
            }
        }
        else {
            this.getPersonSocialNetwork();
        }
    };
    SocialNetworkManagerComponent.prototype.savePersonSocialNetwork = function (socialNetwork) {
        var _this = this;
        this.service.save(EEndpoints.SocialNetwork, socialNetwork)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.artistSaved'));
            }
            _this.getPersonSocialNetwork();
        }, function (err) { return _this.responseError(err); });
    };
    SocialNetworkManagerComponent.prototype.getPersonSocialNetwork = function () {
        var _this = this;
        this.isWorking = false;
        this.dataSource = undefined;
        var params = [];
        params['personId'] = this.personId;
        this.service.get(EEndpoints.SocialNetworks, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.personSocialNetwork = response.result;
                _this.dataSource = new MatTableDataSource(_this.personSocialNetwork);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
        }, function (err) { return _this.responseError(err); });
    };
    SocialNetworkManagerComponent.prototype.addSocialNetwork = function (row) {
        var _this = this;
        var dialogRef = this.dialog.open(AddPersonSocialNetworkComponent, {
            width: '500px',
            data: {
                data: row,
                personId: this.personId
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                if (result.personId == 0) {
                    result.personId = (new Date()).getMilliseconds() * -1;
                }
                _this.manageAddressEvent(result);
            }
        });
    };
    SocialNetworkManagerComponent.prototype.updatePersonSocialNetwork = function (socialNetwork) {
        // const model: IPersonPreference[] = [];
        // const form = this.addPersonsocialNetworkForm.value;
        var _this = this;
        // form.subTypeId.forEach((x) => {
        //     const newPrs: IPersonPreference = { id: 0, personId: this.id, preferenceId: x }
        //     model.push(newPrs);
        // });
        this.service.update(EEndpoints.SocialNetwork, socialNetwork)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.itemSaved'));
                _this.getPersonSocialNetwork();
            }
        }, function (err) { return _this.responseError(err); });
    };
    SocialNetworkManagerComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.service.save(EEndpoints.SocialNetworkStatus, { id: id, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('settings.socialNetwork.messages.statusChanged'));
                _this.getPersonSocialNetwork();
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    SocialNetworkManagerComponent.prototype.manageAddressEvent = function (socialNetwork) {
        // if (this.isAddressRepeat(address)) {
        //     this.toasterService.showToaster(this.translate.instant('errors.AddressRepeat'));
        // } else {
        socialNetwork.personId = this.personId;
        if (socialNetwork.id > 0) {
            this.updatePersonSocialNetwork(socialNetwork);
        }
        else {
            if (this.personId > 0) {
                this.savePersonSocialNetwork(socialNetwork);
            }
            else {
                // this.addressList = this.addressList.filter(f => f.id !== address.id);
                // this.addressList.push(address);
                // this.bindTableData();
            }
        }
        // }
    };
    SocialNetworkManagerComponent.prototype.confirmDelete = function (id, name) {
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                // if (confirm)
                //     this.personPreferences.splice(id, 1);
            }
        });
    };
    SocialNetworkManagerComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log('http error', err);
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], SocialNetworkManagerComponent.prototype, "emitSocialNetWorkData", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], SocialNetworkManagerComponent.prototype, "personId", null);
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], SocialNetworkManagerComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], SocialNetworkManagerComponent.prototype, "sort", void 0);
    SocialNetworkManagerComponent = __decorate([
        Component({
            selector: 'app-social-network-manager',
            templateUrl: './social-network-manager.component.html',
            styleUrls: ['./social-network-manager.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            FuseTranslationLoaderService,
            TranslateService,
            ApiService,
            ToasterService])
    ], SocialNetworkManagerComponent);
    return SocialNetworkManagerComponent;
}());
export { SocialNetworkManagerComponent };
//# sourceMappingURL=social-network-manager.component.js.map