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
import { ApiService } from '@services/api.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { AddMarkerComponent } from './add-marker/add-marker.component';
var ContractsMarkersTemplatesComponent = /** @class */ (function () {
    function ContractsMarkersTemplatesComponent(toasterService, ApiService, dialog, route, translate, _fuseTranslationLoaderService) {
        this.toasterService = toasterService;
        this.ApiService = ApiService;
        this.dialog = dialog;
        this.route = route;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.displayedColumns = ['id', 'marker', 'action'];
        this.isDataAvailable = false;
        this.isWorking = false;
        this.templateSelected = 0;
        this.templates = [];
        this.templateMarker = [];
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    ContractsMarkersTemplatesComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.getTemplatesMarkers();
    };
    ContractsMarkersTemplatesComponent.prototype.getTemplatesMarkers = function () {
        var _this = this;
        this.isWorking = true;
        this.dataSource = undefined;
        this.ApiService.get(EEndpoints.TemplateContractDocument)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.templateMarker = response.result;
                _this.templates = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.documentName
                }); });
            }
            _this.isWorking = false;
            if (_this.templateSelected > 0) {
                _this.SelectionChangeTemplate(_this.templateSelected);
            }
        }, function (err) { return _this.responseError(err); });
    };
    ContractsMarkersTemplatesComponent.prototype.SelectionChangeTemplate = function (id) {
        this.templateSelected = id;
        var list = this.templateMarker.find(function (x) { return x.id === id; });
        this.isDataAvailable = false;
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (list) {
            this.isDataAvailable = (list.templateContractDocumentMarker.length > 0);
            this.dataSource = new MatTableDataSource(list.templateContractDocumentMarker);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    };
    ContractsMarkersTemplatesComponent.prototype.showModalForm = function () {
        var _this = this;
        if (this.templateSelected === 0) {
            this.toasterService.showToaster(this.translate.instant('settings.catalogTypes.messages.selectCatalogType'));
            return;
        }
        var dialogRef = this.dialog.open(AddMarkerComponent, {
            width: '500px',
            data: {
                id: 0,
                templateContractDocumentId: this.templateSelected
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.getTemplatesMarkers();
            }
        });
    };
    ContractsMarkersTemplatesComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], ContractsMarkersTemplatesComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], ContractsMarkersTemplatesComponent.prototype, "sort", void 0);
    ContractsMarkersTemplatesComponent = __decorate([
        Component({
            selector: 'app-contracts-markers-templates',
            templateUrl: './contracts-markers-templates.component.html',
            styleUrls: ['./contracts-markers-templates.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            ActivatedRoute,
            TranslateService,
            FuseTranslationLoaderService])
    ], ContractsMarkersTemplatesComponent);
    return ContractsMarkersTemplatesComponent;
}());
export { ContractsMarkersTemplatesComponent };
//# sourceMappingURL=contracts-markers-templates.component.js.map