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
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { allLang } from '@i18n/allLang';
import { AddCertificationAuthorityComponent } from './add-certification-authority/add-certification-authority.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ActivatedRoute } from '@angular/router';
var CertificationAuthorityComponent = /** @class */ (function () {
    function CertificationAuthorityComponent(toaster, apiService, translate, translationLoaderService, dialog, route) {
        this.toaster = toaster;
        this.apiService = apiService;
        this.translate = translate;
        this.translationLoaderService = translationLoaderService;
        this.dialog = dialog;
        this.route = route;
        this.displayedColumns = ['name', 'businessName', 'phone', 'contact', 'status', 'action'];
        this.isWorking = true;
        this.isDataAvailable = true;
        this.model = {};
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    CertificationAuthorityComponent.prototype.ngOnInit = function () {
        this.translationLoaderService.loadTranslationsList(allLang);
        this._getCertificationsApi();
    };
    CertificationAuthorityComponent.prototype.showForm = function (row) {
        var _this = this;
        if (row === void 0) { row = {}; }
        var dialogRef = this.dialog.open(AddCertificationAuthorityComponent, {
            width: '600px',
            data: row
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result != undefined) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemSaved'));
                _this._getCertificationsApi();
            }
        });
    };
    CertificationAuthorityComponent.prototype.updateStatus = function (id, status) {
        this.isWorking = true;
        var statusId = (status == 1) ? 2 : 1;
        this._updateStatusApi({ id: id, status: statusId });
    };
    CertificationAuthorityComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    CertificationAuthorityComponent.prototype.confirmDelete = function (id, name) {
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
                    _this._deleteCertificationAuthApi(id);
            }
        });
    };
    CertificationAuthorityComponent.prototype._reponseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        console.error(error);
        this.isWorking = false;
    };
    //#region API
    CertificationAuthorityComponent.prototype._updateStatusApi = function (params) {
        var _this = this;
        this.apiService.save(EEndpoints.CertificationAuthorityStatus, params).subscribe(function (response) {
            if (response.code == 100) {
                _this._getCertificationsApi();
            }
            else {
                _this.toaster.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this._reponseError(err); });
    };
    CertificationAuthorityComponent.prototype._deleteCertificationAuthApi = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.CertificationAuthority, { id: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this._getCertificationsApi();
                _this.toaster.showToaster(_this.translate.instant('messages.itemDeleted'));
            }
            else {
                _this.toaster.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this._reponseError(err); });
    };
    CertificationAuthorityComponent.prototype._getCertificationsApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.CertificationAuthorities).subscribe(function (response) {
            if (response.code == 100) {
                _this.isDataAvailable = response.result.length > 0;
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
            _this.isWorking = false;
        }, function (err) { return _this._reponseError(err); });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], CertificationAuthorityComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], CertificationAuthorityComponent.prototype, "sort", void 0);
    CertificationAuthorityComponent = __decorate([
        Component({
            selector: 'app-certification-authority',
            templateUrl: './certification-authority.component.html',
            styleUrls: ['./certification-authority.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            TranslateService,
            FuseTranslationLoaderService,
            MatDialog,
            ActivatedRoute])
    ], CertificationAuthorityComponent);
    return CertificationAuthorityComponent;
}());
export { CertificationAuthorityComponent };
//# sourceMappingURL=certification-authority.component.js.map