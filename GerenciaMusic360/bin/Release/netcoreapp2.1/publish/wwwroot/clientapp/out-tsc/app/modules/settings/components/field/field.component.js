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
import { EEndpoints } from "@enums/endpoints";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { AddFieldComponent } from "./add-field/add-field.component";
var FieldComponent = /** @class */ (function () {
    function FieldComponent(toasterService, ApiService, dialog, route, translate, _fuseTranslationLoaderService) {
        var _a;
        this.toasterService = toasterService;
        this.ApiService = ApiService;
        this.dialog = dialog;
        this.route = route;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.displayedColumns = ['fieldTypeName', 'marker', 'moduleName', 'position', 'required', 'status', 'action'];
        this.isDataAvailable = false;
        this.isWorking = true;
        this.perm = {};
        this.perm = this.route.snapshot.data;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    }
    FieldComponent.prototype.ngOnInit = function () {
        this.getFields();
    };
    FieldComponent.prototype.getFields = function () {
        var _this = this;
        this.isDataAvailable = true;
        this.isWorking = false;
        this.dataSource = undefined;
        this.ApiService.get(EEndpoints.Fields)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.isDataAvailable = (response.result.length > 0);
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    FieldComponent.prototype.showModalForm = function (model) {
        var _this = this;
        if (model === void 0) { model = {}; }
        var dialogRef = this.dialog.open(AddFieldComponent, {
            width: '500px',
            data: {
                field: model
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getFields();
        });
    };
    FieldComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.ApiService.save(EEndpoints.FieldStatus, { id: id, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getFields();
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
    FieldComponent.prototype.confirmDelete = function (id, name) {
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
                    _this.deleteField(id);
            }
        });
    };
    FieldComponent.prototype.deleteField = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = id;
        this.ApiService.delete(EEndpoints.Field, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getFields();
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
    FieldComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    FieldComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], FieldComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], FieldComponent.prototype, "sort", void 0);
    FieldComponent = __decorate([
        Component({
            selector: 'app-field',
            templateUrl: './field.component.html',
            styleUrls: ['./field.component.css']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            ActivatedRoute,
            TranslateService,
            FuseTranslationLoaderService])
    ], FieldComponent);
    return FieldComponent;
}());
export { FieldComponent };
//# sourceMappingURL=field.component.js.map