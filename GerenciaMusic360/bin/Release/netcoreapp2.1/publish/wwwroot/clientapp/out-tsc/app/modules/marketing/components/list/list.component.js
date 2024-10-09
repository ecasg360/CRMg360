var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { ToasterService } from '@services/toaster.service';
import { EEndpoints } from '@enums/endpoints';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CampainFormModalComponent } from '../campain-form-modal/campain-form-modal.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
var ListComponent = /** @class */ (function () {
    function ListComponent(toaster, apiService, dialog, translate, router, activatedRoute, translationLoaderService) {
        this.toaster = toaster;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.translationLoaderService = translationLoaderService;
        this.isWorking = false;
        this.marketingList = [];
        this.perm = {};
        this.perm = this.activatedRoute.snapshot.data;
    }
    ListComponent.prototype.ngOnInit = function () {
        var _a;
        var _this = this;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.activatedRoute.params.subscribe(function (params) {
            var moduleFilter = params.menuFilter;
            _this.month = params.month;
            _this.year = params.year;
            if (moduleFilter == 'label') {
                if (_this.perm.Marketing.GetByLabel) {
                    _this._getMarketings(EEndpoints.MarketingsByLabel);
                }
                else {
                    _this.router.navigateByUrl('/');
                }
            }
            else if (moduleFilter == 'event') {
                if (_this.perm.Marketing.GetByEvent) {
                    _this._getMarketings(EEndpoints.MarketingsByEvent);
                }
                else {
                    _this.router.navigateByUrl('/');
                }
            }
            else {
                if (_this.perm.Marketing.Get) {
                    _this._getMarketings(EEndpoints.Marketings);
                }
                else {
                    _this.router.navigateByUrl('/');
                }
            }
        });
    };
    ListComponent.prototype.trackByFn = function (index, item) {
        return item.id ? item.id : index;
    };
    ListComponent.prototype.openModal = function () {
        var _this = this;
        var dialogRef = this.dialog.open(CampainFormModalComponent, {
            width: '900px',
            data: {
                projectId: 0,
                projectType: 0,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result != undefined) {
                _this.router.navigate(['/marketing/manage/', result.id]);
            }
        });
    };
    ListComponent.prototype.confirmDelete = function (row) {
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
                    _this._deleteMarketingApi(row.id);
            }
        });
    };
    ListComponent.prototype._filterByMonthYear = function () {
        var _this = this;
        if (this.year && this.month) {
            this.marketingList = this.marketingList.filter(function (f) {
                var date = new Date(f.endDate);
                if (_this.year == date.getFullYear() && date.getMonth() == _this.month)
                    return f;
            });
        }
    };
    ListComponent.prototype._responseError = function (err) {
        console.log(err);
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    ListComponent.prototype._getMarketings = function (url) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(url).subscribe(function (response) {
            if (response.code == 100) {
                _this.marketingList = response.result;
                _this._filterByMonthYear();
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ListComponent.prototype._deleteMarketingApi = function (id) {
        var _this = this;
        this.apiService.delete(EEndpoints.MarketingDelete, { id: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.marketingList = _this.marketingList.filter(function (f) { return f.id !== id; });
                _this.toaster.showToaster(_this.translate.instant('messages.itemDeleted'));
            }
            else
                _this.toaster.showToaster(_this.translate.instant('messages.errorDeletingItem'));
        }, function (err) { return _this._responseError(err); });
    };
    ListComponent.prototype.downloadReport = function (item) {
        var _this = this;
        this.apiService.download(EEndpoints.MarketingPlanDownload, { marketingId: item.id }).subscribe(function (fileData) {
            var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "Reporte_MarketingPlan_" + item.name.replace(' ', '').replace('.', '') + ".docx");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ListComponent = __decorate([
        Component({
            selector: 'app-list',
            templateUrl: './list.component.html',
            styleUrls: ['./list.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            Router,
            ActivatedRoute,
            FuseTranslationLoaderService])
    ], ListComponent);
    return ListComponent;
}());
export { ListComponent };
//# sourceMappingURL=list.component.js.map