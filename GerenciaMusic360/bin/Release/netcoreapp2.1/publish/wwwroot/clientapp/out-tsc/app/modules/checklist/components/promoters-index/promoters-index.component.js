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
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { PromotersFormComponent } from '../promoters-form/promoters-form.component';
import { PromotersViewComponent } from '../promoters-view/promoters-view.component';
var PromotersIndexComponent = /** @class */ (function () {
    function PromotersIndexComponent(toasterService, dialog, router, activatedRoute, translate, _fuseTranslationLoaderService, apiService) {
        this.toasterService = toasterService;
        this.dialog = dialog;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.apiService = apiService;
        this.records = [];
        this.displayedColumns = [
            'name',
            'lastname',
            'phone',
            'email',
            'terms',
            'contactType',
            'deal',
            'dateContact',
            'by',
            'action'
        ];
        this.isWorking = false;
        this.perm = {};
        this.perm = this.activatedRoute.snapshot.data;
    }
    PromotersIndexComponent.prototype.ngOnInit = function () {
        this.getRecords();
    };
    PromotersIndexComponent.prototype.getRecords = function () {
        var _this = this;
        return this.apiService.get(EEndpoints.Checklist).subscribe(function (response) {
            if (response.code == 100) {
                _this.dataSource = new MatTableDataSource(response.result);
            }
        }, function (err) { return console.log('http error', err); });
    };
    PromotersIndexComponent.prototype.openModal = function (row) {
        var _this = this;
        var action = this.translate.instant(!row ? 'save' : 'update');
        var dialogRef = this.dialog.open(PromotersFormComponent, {
            width: '700px',
            data: {
                action: action,
                model: row
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.getRecords();
            }
        });
    };
    PromotersIndexComponent.prototype.openView = function (row) {
        var dialogRef = this.dialog.open(PromotersViewComponent, {
            width: '700px',
            data: {
                model: row
            }
        });
    };
    PromotersIndexComponent.prototype.applyFilter = function (value) {
        console.log('value: ', value);
    };
    PromotersIndexComponent.prototype.confirmDelete = function (id, name) {
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
                    _this.deletePromoter(id);
            }
        });
    };
    PromotersIndexComponent.prototype.deletePromoter = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.Checklist, { id: id })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getRecords();
                _this.toasterService.showTranslate('messages.itemDeleted');
            }
            else {
                _this.toasterService.showTranslate('errors.errorDeletingItem');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    PromotersIndexComponent.prototype.responseError = function (error) {
        this.toasterService.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], PromotersIndexComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], PromotersIndexComponent.prototype, "sort", void 0);
    PromotersIndexComponent = __decorate([
        Component({
            selector: 'app-promoters-index',
            templateUrl: './promoters-index.component.html',
            styleUrls: ['./promoters-index.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            MatDialog,
            Router,
            ActivatedRoute,
            TranslateService,
            FuseTranslationLoaderService,
            ApiService])
    ], PromotersIndexComponent);
    return PromotersIndexComponent;
}());
export { PromotersIndexComponent };
//# sourceMappingURL=promoters-index.component.js.map