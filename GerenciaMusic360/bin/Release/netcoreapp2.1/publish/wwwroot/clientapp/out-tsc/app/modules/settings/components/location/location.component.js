var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from "@angular/core";
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@app/core/enums/endpoints";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { AddLocationComponent } from "./add-location/add-location.component";
var LocationComponent = /** @class */ (function () {
    function LocationComponent(toasterService, service, dialog, translate, route, _fuseTranslationLoaderService) {
        var _a;
        this.toasterService = toasterService;
        this.service = service;
        this.dialog = dialog;
        this.translate = translate;
        this.route = route;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.displayedColumns = ['name', 'capacity', 'website', 'status', 'action'];
        this.isDataAvailable = false;
        this.isWorking = true;
        this.perm = {};
        this.perm = this.route.snapshot.data;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    }
    LocationComponent.prototype.ngOnInit = function () {
        this.getLocations();
    };
    LocationComponent.prototype.getLocations = function () {
        var _this = this;
        this.isWorking = false;
        this.dataSource = undefined;
        this.service.get(EEndpoints.Locations)
            .subscribe(function (response) {
            if (response.code == 100) {
                if (response.result.length > 0) {
                    _this.isDataAvailable = (response.result.length > 0);
                    _this.dataSource = new MatTableDataSource(response.result);
                    _this.dataSource.paginator = _this.paginator;
                    _this.dataSource.sort = _this.sort;
                }
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    LocationComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        var dialogRef = this.dialog.open(AddLocationComponent, {
            width: '800px',
            data: {
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getLocations();
        });
    };
    LocationComponent.prototype.confirmDelete = function (id, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: 'item' }),
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
    LocationComponent.prototype.deleteType = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = id;
        this.service.delete(EEndpoints.Location, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getLocations();
                _this.toasterService.showToaster(_this.translate.instant('messages.itemDeleted'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    LocationComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.service.save(EEndpoints.LocationStatus, { id: id, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getLocations();
                _this.toasterService.showToaster(_this.translate.instant('messages.statusChanged'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    LocationComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    LocationComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], LocationComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], LocationComponent.prototype, "sort", void 0);
    LocationComponent = __decorate([
        Component({
            selector: 'app-location',
            templateUrl: './location.component.html',
            styleUrls: ['./location.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            ActivatedRoute,
            FuseTranslationLoaderService])
    ], LocationComponent);
    return LocationComponent;
}());
export { LocationComponent };
//# sourceMappingURL=location.component.js.map