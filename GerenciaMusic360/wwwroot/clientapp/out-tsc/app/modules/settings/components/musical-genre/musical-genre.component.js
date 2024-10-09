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
import { ToasterService } from "@services/toaster.service";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
import { allLang } from "@i18n/allLang";
import { AddMusicalGenreComponent } from './add-musical-genre/add-musical-genre.component';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ActivatedRoute } from "@angular/router";
var MusicalGenreComponent = /** @class */ (function () {
    function MusicalGenreComponent(apiService, dialog, _fuseTranslationLoaderService, translate, toasterService, route) {
        var _a;
        this.apiService = apiService;
        this.dialog = dialog;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.translate = translate;
        this.toasterService = toasterService;
        this.route = route;
        this.displayedColumns = ['name', 'description', 'status', 'action'];
        this.isWorking = true;
        this.musicalGenresList = [];
        this.perm = {};
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.perm = this.route.snapshot.data;
    }
    MusicalGenreComponent.prototype.ngOnInit = function () {
        this.getMusicalGenresApi();
    };
    MusicalGenreComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    MusicalGenreComponent.prototype.getMusicalGenresApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MusicalGenres).subscribe(function (response) {
            if (response.code == 100) {
                _this.musicalGenresList = response.result;
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            else {
                //TODO: translate
                _this.toasterService.showToaster(response.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    MusicalGenreComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        this.isWorking = true;
        var dialogRef = this.dialog.open(AddMusicalGenreComponent, {
            width: '700px',
            data: {
                id: id,
                data: this.musicalGenresList
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.getMusicalGenresApi();
            }
        });
        this.isWorking = false;
    };
    MusicalGenreComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MusicalGenreStatus, { id: id, status: statusId }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getMusicalGenresApi();
                _this.toasterService.showToaster(_this.translate.instant('messages.changeStatusSuccess'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    MusicalGenreComponent.prototype.confirmDelete = function (id, name) {
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
                    _this.deleteMusicalGenreApi(id);
            }
        });
    };
    MusicalGenreComponent.prototype.deleteMusicalGenreApi = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MusicalGenre, { id: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.getMusicalGenresApi();
                //TODO translate
                _this.toasterService.showToaster(_this.translate.instant('messages.itemDeleted'));
            }
            else {
                //TODO: translate 
                _this.toasterService.showToaster('ocurrio un error');
                console.log(response.result);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    MusicalGenreComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log('http error', err);
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], MusicalGenreComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], MusicalGenreComponent.prototype, "sort", void 0);
    MusicalGenreComponent = __decorate([
        Component({
            selector: 'app-musical-genre',
            templateUrl: './musical-genre.component.html',
        }),
        __metadata("design:paramtypes", [ApiService,
            MatDialog,
            FuseTranslationLoaderService,
            TranslateService,
            ToasterService,
            ActivatedRoute])
    ], MusicalGenreComponent);
    return MusicalGenreComponent;
}());
export { MusicalGenreComponent };
//# sourceMappingURL=musical-genre.component.js.map