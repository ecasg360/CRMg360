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
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { ConfirmComponent } from "ClientApp/app/shared/components/confirm/confirm.component";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { AddWorksmanageComponent } from "./add-worksmanage/add-worksmanage.component";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
import { allLang } from "@i18n/allLang";
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
var WorksmanageComponent = /** @class */ (function () {
    function WorksmanageComponent(toasterService, apiService, dialog, translate, _fuseTranslationLoaderService, activatedRoute) {
        var _this = this;
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.activatedRoute = activatedRoute;
        this.displayedColumns = ['name', 'description', 'status', 'action'];
        this.isWorking = false;
        this.activatedRoute.data.subscribe(function (data) {
            _this.permisions = data;
            console.log('this.permisions: ', _this.permisions);
        });
        this._unsubscribeAll = new Subject();
    }
    WorksmanageComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.innerWidth = window.innerWidth;
        this.getWorks();
    };
    WorksmanageComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    WorksmanageComponent.prototype.getWorks = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Works).subscribe(function (data) {
            console.log('data getWorks: ', data);
            if (data.code == 100) {
                _this.dataSource = new MatTableDataSource(data.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    WorksmanageComponent.prototype.getForeignWork = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ForeignWorks).subscribe(function (data) {
            if (data.code == 100) {
                _this.dataSource = new MatTableDataSource(data.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    WorksmanageComponent.prototype.showWork = function (model) {
        var _this = this;
        if (model === void 0) { model = {}; }
        console.log('model to send: ', model);
        var dialogRef = this.dialog.open(AddWorksmanageComponent, {
            width: '700px',
            data: {
                model: model
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this.getWorks();
        });
    };
    WorksmanageComponent.prototype.confirmDelete = function (id, name) {
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
                    _this.delete(id);
            }
        });
    };
    WorksmanageComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        this.isWorking = true;
        var statusId = status == 1 ? 2 : 1;
        this.apiService.save(EEndpoints.WorkStatus, { id: id, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getWorks();
                _this.toasterService.showToaster(_this.translate.instant('messages.statusChanged'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    WorksmanageComponent.prototype.delete = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.Work, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getWorks();
                _this.toasterService.showTranslate('messages.itemDeleted');
            }
            else {
                _this.toasterService.showTranslate('errors.errorDeletingItem');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    WorksmanageComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    WorksmanageComponent.prototype.downloadFile = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.download(EEndpoints.controlledListDownload)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (fileData) {
            var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "Controlled List");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    WorksmanageComponent.prototype._responseError = function (err) {
        this.isWorking = false;
        console.log(err);
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    };
    WorksmanageComponent.prototype.seeDetails = function (row) {
        var _this = this;
        console.log('the row to see details: ', row);
        var dialogRef = this.dialog.open(AddWorksmanageComponent, {
            width: '700px',
            data: {
                model: row,
                onlyView: true
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this.getWorks();
        });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], WorksmanageComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], WorksmanageComponent.prototype, "sort", void 0);
    WorksmanageComponent = __decorate([
        Component({
            selector: 'app-worksmanage',
            templateUrl: './worksmanage.component.html',
            styleUrls: ['./worksmanage.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService,
            ActivatedRoute])
    ], WorksmanageComponent);
    return WorksmanageComponent;
}());
export { WorksmanageComponent };
//# sourceMappingURL=worksmanage.component.js.map