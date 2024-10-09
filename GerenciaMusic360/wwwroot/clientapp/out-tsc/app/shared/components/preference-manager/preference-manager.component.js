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
import { EEndpoints } from '@app/core/enums/endpoints';
import { AddRPersonPreferenceComponent } from './add-person-preferences/add-person-preference.component';
var PreferenceManagerComponent = /** @class */ (function () {
    // preferencesTypes: IPreference[] = [];
    // preferencesSubTypes: SelectOption[] = [];
    function PreferenceManagerComponent(dialog, _fuseTranslationLoaderService, translate, service, toasterService) {
        this.dialog = dialog;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.translate = translate;
        this.service = service;
        this.toasterService = toasterService;
        this.emitPersonPreferencekData = new EventEmitter();
        this.typeId = 0;
        this.displayedColumns = ['id', 'name', 'subPreference', 'add'];
        this.isWorking = true;
        this.isDataAvailable = true;
        this.personPreferences = [];
    }
    PreferenceManagerComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.innerWidth = window.innerWidth;
        this.getPersonPreferences();
    };
    PreferenceManagerComponent.prototype.ngOnChanges = function (changes) {
        var personId = changes.personId;
        if (personId.currentValue > 0) {
            this.triggerAddressesQueue();
            this.getPersonPreferences();
        }
    };
    PreferenceManagerComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    PreferenceManagerComponent.prototype.triggerAddressesQueue = function () {
        var _this = this;
        if (this.personPreferences.length > 0) {
            var dataToSave_1 = [];
            this.personPreferences.forEach(function (x) {
                x.preferences.forEach(function (p) {
                    p.personId = _this.personId;
                });
                dataToSave_1.push(x.preferences);
            });
            this.savePersonPreference(dataToSave_1);
        }
        else {
            this.getPersonPreferences();
        }
    };
    PreferenceManagerComponent.prototype.getPersonPreferences = function () {
        var _this = this;
        this.dataSource = undefined;
        var params = [];
        params['personId'] = this.personId;
        this.service.get(EEndpoints.PersonPreferences, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.personPreferences = response.result;
                _this.dataSource = new MatTableDataSource(_this.personPreferences);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    PreferenceManagerComponent.prototype.savePersonPreference = function (personPreference) {
        var _this = this;
        this.service.save(EEndpoints.PersonPreferences, personPreference)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.preferenceSaved'));
            }
            _this.getPersonPreferences();
        }, function (err) { return _this.responseError(err); });
    };
    PreferenceManagerComponent.prototype.addPersonPreference = function (row) {
        var _this = this;
        var dialogRef = this.dialog.open(AddRPersonPreferenceComponent, {
            width: '500px',
            data: {
                data: row,
                personId: this.personId
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                if (_this.personId === 0) {
                    row.preferences = result;
                }
                else {
                    _this.manageAddressEvent(result);
                }
            }
        });
    };
    PreferenceManagerComponent.prototype.updatePersonSocialNetwork = function (personPreference) {
        var _this = this;
        this.service.update(EEndpoints.PersonPreference, personPreference)
            .subscribe(function (response) {
            if (response.code == 100) {
                //this.toasterService.showToaster(this.translate.instant('messages.artistSaved'));
            }
        }, function (err) { return _this.responseError(err); });
    };
    PreferenceManagerComponent.prototype.manageAddressEvent = function (personPreference) {
        this.savePersonPreference(personPreference);
    };
    PreferenceManagerComponent.prototype.confirmDelete = function (row) {
        var _this = this;
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
                if (confirm_1) {
                    var params = [];
                    params['personId'] = _this.personId;
                    params['id'] = row.id;
                    _this.service.delete(EEndpoints.PersonPreference, params).subscribe(function (response) {
                        _this.toasterService.showToaster(_this.translate.instant('messages.preferenceSaved'));
                        _this.getPersonPreferences();
                    }, function (err) { return _this.responseError(err); });
                }
            }
        });
    };
    PreferenceManagerComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log('http error', err);
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], PreferenceManagerComponent.prototype, "emitPersonPreferencekData", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], PreferenceManagerComponent.prototype, "personId", void 0);
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], PreferenceManagerComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], PreferenceManagerComponent.prototype, "sort", void 0);
    PreferenceManagerComponent = __decorate([
        Component({
            selector: 'app-preference-manager',
            templateUrl: './preference-manager.component.html',
            styleUrls: ['./preference-manager.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            FuseTranslationLoaderService,
            TranslateService,
            ApiService,
            ToasterService])
    ], PreferenceManagerComponent);
    return PreferenceManagerComponent;
}());
export { PreferenceManagerComponent };
//# sourceMappingURL=preference-manager.component.js.map