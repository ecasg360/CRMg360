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
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { AddArtistTypeComponent } from "./add-artist-type.component";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { entity } from '@enums/entity';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from "@ngx-translate/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
import { ToasterService } from '@services/toaster.service';
import { ActivatedRoute } from '@angular/router';
var ArtistTypeComponent = /** @class */ (function () {
    function ArtistTypeComponent(toaster, apiService, translate, translationLoaderService, dialog, route) {
        var _this = this;
        this.toaster = toaster;
        this.apiService = apiService;
        this.translate = translate;
        this.translationLoaderService = translationLoaderService;
        this.dialog = dialog;
        this.route = route;
        this.displayedColumns = ['id', 'name', 'status', 'action'];
        this.isWorking = false;
        this.personTypeList = [];
        this.perm = {};
        //this.perm = this.route.snapshot.data;
        this.route.data.subscribe(function (data) {
            _this.perm = data;
            console.log('this.perm en artist type: ', _this.perm);
        });
    }
    ArtistTypeComponent.prototype.ngOnInit = function () {
        this.translationLoaderService.loadTranslationsList(allLang);
        this._getArtistTypesApi();
    };
    ArtistTypeComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    ArtistTypeComponent.prototype.showModal = function (row) {
        var _this = this;
        if (row === void 0) { row = {}; }
        if (!row.id) {
            row.entityId = entity.Artist;
        }
        var dialogRef = this.dialog.open(AddArtistTypeComponent, {
            width: '500px',
            data: {
                model: row
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this._getArtistTypesApi();
        });
    };
    ArtistTypeComponent.prototype.confirmDelete = function (row) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: row.name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this._deleteArtistTypeApi(row.id);
            }
        });
    };
    ArtistTypeComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        console.error(error);
        this.isWorking = false;
    };
    //#region API
    ArtistTypeComponent.prototype._getArtistTypesApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.PersonTypes, { entityId: entity.Artist }).subscribe(function (response) {
            if (response.code == 100) {
                _this.personTypeList = response.result;
                _this.dataSource = new MatTableDataSource(_this.personTypeList);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ArtistTypeComponent.prototype._deleteArtistTypeApi = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.PersonType, { id: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this._getArtistTypesApi();
                _this.toaster.showToaster(_this.translate.instant('messages.itemDeleted'));
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorDeletingItem'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ArtistTypeComponent.prototype.updateStatusApi = function (id, status) {
        var _this = this;
        this.isWorking = true;
        var statusId = status == 1 ? 2 : 1;
        var params = { id: id, status: statusId };
        this.apiService.save(EEndpoints.PersonTypeStatus, params).subscribe(function (response) {
            if (response.code == 100) {
                _this._getArtistTypesApi();
                _this.toaster.showToaster(_this.translate.instant('messages.statusChanged'));
            }
            else
                _this.toaster.showToaster(_this.translate.instant('messages.errorChangingStatus'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], ArtistTypeComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], ArtistTypeComponent.prototype, "sort", void 0);
    ArtistTypeComponent = __decorate([
        Component({
            selector: 'app-artist-type',
            templateUrl: './artist-type.component.html',
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            TranslateService,
            FuseTranslationLoaderService,
            MatDialog,
            ActivatedRoute])
    ], ArtistTypeComponent);
    return ArtistTypeComponent;
}());
export { ArtistTypeComponent };
//# sourceMappingURL=artist-type.component.js.map