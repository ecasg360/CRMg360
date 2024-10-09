var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ToasterService } from '@services/toaster.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { allLang } from '@app/core/i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { AddPreferenceComponent } from './add-preference/add-preference.component';
import { ActivatedRoute } from '@angular/router';
var PreferenceComponent = /** @class */ (function () {
    function PreferenceComponent(toasterService, dialog, service, translate, route, _fuseTranslationLoaderService) {
        this.toasterService = toasterService;
        this.dialog = dialog;
        this.service = service;
        this.translate = translate;
        this.route = route;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.displayedColumns = ['photo', 'name', 'status', 'action'];
        this.isWorking = true;
        this.isDataAvailable = false;
        this.preferencesTypes = [];
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    PreferenceComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.innerWidth = window.innerWidth;
        this.getPreferenceTypes();
    };
    PreferenceComponent.prototype.getPreferenceTypes = function () {
        var _this = this;
        this.isWorking = false;
        this.dataSource = undefined;
        this.service.get(EEndpoints.PreferenceTypes)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.preferencesTypes = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    PreferenceComponent.prototype.SelectionChange = function (id) {
        this.typeId = id;
        this.apiGetTypeDetail();
    };
    PreferenceComponent.prototype.showImage = function (image, caption) {
        this.dialog.open(ImagePreviewComponent, {
            width: '500px',
            data: {
                imageUrl: image,
                caption: caption
            }
        });
    };
    PreferenceComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    PreferenceComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    PreferenceComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.service.save(EEndpoints.PreferenceStatus, { id: id, typeId: this.typeId, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.SelectionChange(_this.typeId);
                _this.toasterService.showToaster(_this.translate.instant('settings.preferences.messages.statusChanged'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    PreferenceComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        if (this.typeId === undefined) {
            this.toasterService.showToaster(this.translate.instant('settings.preferences.messages.selectPreferenceType'));
            return;
        }
        var dialogRef = this.dialog.open(AddPreferenceComponent, {
            width: '500px',
            data: {
                id: id,
                typeId: this.typeId
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.SelectionChange(_this.typeId);
            }
        });
    };
    PreferenceComponent.prototype.confirmDelete = function (id, name) {
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
                if (confirm_1)
                    _this.deleteType(id);
            }
        });
    };
    PreferenceComponent.prototype.apiGetTypeDetail = function () {
        var _this = this;
        this.isWorking = true;
        this.service.get(EEndpoints.PreferencesByType, { typeId: this.typeId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.isDataAvailable = (response.result.length > 0);
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    PreferenceComponent.prototype.deleteType = function (id) {
        var _this = this;
        this.isWorking = true;
        this.service.delete(EEndpoints.Preference, { id: id })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.isWorking = false;
                _this.apiGetTypeDetail();
                _this.toasterService.showToaster(_this.translate.instant('settings.preferences.messages.deleteSuccess'));
            }
            else {
                _this.toasterService.showToaster(data.message);
                _this.isWorking = false;
            }
        }, function (err) {
            _this.responseError(err);
        });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], PreferenceComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], PreferenceComponent.prototype, "sort", void 0);
    PreferenceComponent = __decorate([
        Component({
            selector: 'app-preferences',
            templateUrl: './preference.component.html',
            styleUrls: ['./preference.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            MatDialog,
            ApiService,
            TranslateService,
            ActivatedRoute,
            FuseTranslationLoaderService])
    ], PreferenceComponent);
    return PreferenceComponent;
}());
export { PreferenceComponent };
//# sourceMappingURL=preference.component.js.map