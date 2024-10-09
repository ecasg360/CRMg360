var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { allLang } from '@app/core/i18n/allLang';
import { Component, ViewChild } from '@angular/core';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { AddMusicalInstrumentComponent } from './add-musical-instrument/add-musical-instrument.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from '@angular/router';
var MusicalInstrumentComponent = /** @class */ (function () {
    function MusicalInstrumentComponent(toasterService, apiService, dialog, translate, route, _fuseTranslationLoaderService) {
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this.route = route;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.displayedColumns = ['name', 'action'];
        this.isWorking = true;
        this.isDataAvailable = true;
        this.perm = {};
        this.getAll();
        this.perm = this.route.snapshot.data;
    }
    MusicalInstrumentComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    };
    MusicalInstrumentComponent.prototype.getAll = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MusicalInstruments).subscribe(function (response) {
            _this.isDataAvailable = (response.result.length > 0);
            _this.dataSource = new MatTableDataSource(response.result);
            _this.dataSource.paginator = _this.paginator;
            _this.dataSource.sort = _this.sort;
            _this.isWorking = false;
        }, function (error) { return _this.reponseError(error); });
    };
    MusicalInstrumentComponent.prototype.reponseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    MusicalInstrumentComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    MusicalInstrumentComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.apiService.update(EEndpoints.MusicalInstrument, { id: id, status: statusId }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getAll();
                _this.toasterService.showToaster(_this.translate.instant('messages.statusChanged'));
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
    MusicalInstrumentComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        var dialogRef = this.dialog.open(AddMusicalInstrumentComponent, {
            width: '500px',
            data: {
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('after close');
            if (result !== undefined) {
                _this.getAll();
            }
        });
    };
    MusicalInstrumentComponent.prototype.showImage = function (image, caption) {
        var dialogRef = this.dialog.open(ImagePreviewComponent, {
            width: '500px',
            data: {
                imageUrl: image,
                caption: caption
            }
        });
    };
    MusicalInstrumentComponent.prototype.confirmDelete = function (id, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('settings.deleteQuestion', { activity: name }),
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
    MusicalInstrumentComponent.prototype.deleteMainActivity = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MusicalInstrument, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getAll();
                _this.toasterService.showToaster(_this.translate.instant('messages.itemDeleted'));
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
    ], MusicalInstrumentComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], MusicalInstrumentComponent.prototype, "sort", void 0);
    MusicalInstrumentComponent = __decorate([
        Component({
            selector: 'app-musical-instrument',
            templateUrl: './musical-instrument.component.html',
            styleUrls: ['./musical-instrument.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            ActivatedRoute,
            FuseTranslationLoaderService])
    ], MusicalInstrumentComponent);
    return MusicalInstrumentComponent;
}());
export { MusicalInstrumentComponent };
//# sourceMappingURL=musical-instrument.component.js.map