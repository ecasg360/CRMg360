var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AddMainActivityComponent } from './add-main-activity/add-main-activity.component';
import { allLang } from '@i18n/allLang';
import { Component, ViewChild } from '@angular/core';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from '@angular/router';
var MainActivityComponent = /** @class */ (function () {
    function MainActivityComponent(toasterService, apiService, dialog, translate, route, _fuseTranslationLoaderService) {
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this.route = route;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.displayedColumns = ['name', 'description', 'status', 'edit', 'delete'];
        this.isWorking = true;
        this.isDataAvailable = true;
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    MainActivityComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.innerWidth = window.innerWidth;
        this.getMainActivity();
    };
    MainActivityComponent.prototype.getMainActivity = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MainActivities).subscribe(function (response) {
            _this.isDataAvailable = (response.result.length > 0);
            _this.dataSource = new MatTableDataSource(response.result);
            _this.dataSource.paginator = _this.paginator;
            _this.dataSource.sort = _this.sort;
            _this.isWorking = false;
        }, function (error) { return _this.reponseError(error); });
    };
    MainActivityComponent.prototype.reponseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    MainActivityComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    MainActivityComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MainActivityStatus, { id: id, status: statusId }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getMainActivity();
                _this.toasterService.showToaster(_this.translate.instant('settings.mainActivity.messages.statusChanged'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.reponseError(err);
        });
    };
    /**
     * Abre el modal con el formulario para agregar una nueva actividad
     */
    MainActivityComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        var dialogRef = this.dialog.open(AddMainActivityComponent, {
            width: '500px',
            data: {
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.getMainActivity();
            }
        });
    };
    MainActivityComponent.prototype.showImage = function (image, caption) {
        var dialogRef = this.dialog.open(ImagePreviewComponent, {
            width: '500px',
            data: {
                imageUrl: image,
                caption: caption
            }
        });
    };
    MainActivityComponent.prototype.confirmDelete = function (id, name) {
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
                    _this.deleteMainActivity(id);
            }
        });
    };
    MainActivityComponent.prototype.deleteMainActivity = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MainActivity, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getMainActivity();
                _this.toasterService.showToaster(_this.translate.instant('settings.mainActivity.messages.deleteSuccess'));
            }
            else {
                _this.toasterService.showToaster(data.message);
                _this.isWorking = false;
            }
        }, function (err) {
            _this.reponseError(err);
        });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], MainActivityComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], MainActivityComponent.prototype, "sort", void 0);
    MainActivityComponent = __decorate([
        Component({
            selector: 'app-main-activity',
            templateUrl: './main-activity.component.html',
            styleUrls: ['./main-activity.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            ActivatedRoute,
            FuseTranslationLoaderService])
    ], MainActivityComponent);
    return MainActivityComponent;
}());
export { MainActivityComponent };
//# sourceMappingURL=main-activity.component.js.map