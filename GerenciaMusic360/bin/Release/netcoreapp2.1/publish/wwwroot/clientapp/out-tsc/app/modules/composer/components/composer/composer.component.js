var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, Input } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { AddGeneralComposerComponent } from "@shared/components/add-general-composer/add-general-composer.component";
import { ConfirmComponent } from "ClientApp/app/shared/components/confirm/confirm.component";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { FuseTranslationLoaderService } from "../../../../../@fuse/services/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
import { allLang } from "../../../../core/i18n/allLang";
import { ActivatedRoute } from '@angular/router';
var ComposerComponent = /** @class */ (function () {
    function ComposerComponent(toasterService, apiService, dialog, translate, _fuseTranslationLoaderService, activatedRoute) {
        var _a;
        var _this = this;
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.activatedRoute = activatedRoute;
        this.displayedColumns = ['name', 'email', 'phone', 'status', 'action'];
        this.isWorking = false;
        this.perm = {};
        this.activatedRoute.data.subscribe(function (data) {
            _this.permisions = data;
        });
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    }
    ComposerComponent.prototype.ngOnInit = function () {
        this.getComposers();
        this.innerWidth = window.innerWidth;
    };
    ComposerComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    ComposerComponent.prototype.getComposers = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Composers).subscribe(function (data) {
            if (data.code == 100) {
                _this.dataSource = new MatTableDataSource(data.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            else
                _this.toasterService.showTranslate('errors.errorGettingItems');
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ComposerComponent.prototype.openModal = function (row) {
        var _this = this;
        var action = this.translate.instant(row ? 'save' : 'update');
        var dialogRef = this.dialog.open(AddGeneralComposerComponent, {
            width: '700px',
            data: {
                action: action,
                model: row
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this.getComposers();
        });
    };
    ComposerComponent.prototype.confirmDelete = function (id, name) {
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
                    _this.deleteComposer(id);
            }
        });
    };
    ComposerComponent.prototype.deleteComposer = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.Composer, { id: id })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getComposers();
                _this.toasterService.showTranslate('messages.itemDeleted');
            }
            else {
                _this.toasterService.showTranslate('errors.errorDeletingItem');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ComposerComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        this.isWorking = true;
        status = status == 1 ? 2 : 1;
        this.apiService.save(EEndpoints.ComposerStatus, { id: id, status: status })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getComposers();
                _this.toasterService.showTranslate('messages.statusChanged');
            }
            else {
                _this.toasterService.showTranslate('errors.errorChangingStatus');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ComposerComponent.prototype.responseError = function (error) {
        this.toasterService.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], ComposerComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], ComposerComponent.prototype, "sort", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ComposerComponent.prototype, "perm", void 0);
    ComposerComponent = __decorate([
        Component({
            selector: 'app-composer',
            templateUrl: './composer.component.html',
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService,
            ActivatedRoute])
    ], ComposerComponent);
    return ComposerComponent;
}());
export { ComposerComponent };
//# sourceMappingURL=composer.component.js.map