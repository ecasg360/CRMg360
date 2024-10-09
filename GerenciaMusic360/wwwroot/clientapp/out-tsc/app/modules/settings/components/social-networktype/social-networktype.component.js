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
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ToasterService } from '@services/toaster.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { allLang } from '@app/core/i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { AddSocialnetworktypeComponent } from './add-socialnetworktype/add-socialnetworktype.component';
import { ActivatedRoute } from '@angular/router';
var SocialNetworktypeComponent = /** @class */ (function () {
    function SocialNetworktypeComponent(toasterService, dialog, service, translate, route, _fuseTranslationLoaderService) {
        var _a;
        this.toasterService = toasterService;
        this.dialog = dialog;
        this.service = service;
        this.translate = translate;
        this.route = route;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.displayedColumns = ['name', 'photo', 'status', 'action'];
        this.isWorking = true;
        this.isDataAvailable = false;
        this.perm = {};
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.perm = this.route.snapshot.data;
    }
    SocialNetworktypeComponent.prototype.ngOnInit = function () {
        this.getSocialNetworkTypes();
    };
    SocialNetworktypeComponent.prototype.getSocialNetworkTypes = function () {
        var _this = this;
        this.isWorking = false;
        this.dataSource = undefined;
        this.service.get(EEndpoints.SocialNetworkTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.isDataAvailable = (response.result.length > 0);
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
                _this.isWorking = false;
            }
        }, function (err) { return _this.responseError(err); });
    };
    SocialNetworktypeComponent.prototype.showImage = function (image, caption) {
        var dialogRef = this.dialog.open(ImagePreviewComponent, {
            width: '500px',
            data: {
                imageUrl: image,
                caption: caption
            }
        });
    };
    SocialNetworktypeComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    SocialNetworktypeComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    SocialNetworktypeComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status == 1 ? 2 : 1;
        this.isWorking = true;
        this.service.save(EEndpoints.SocialNetworkTypeStatus, { id: id, typeId: this.typeId, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('settings.preferences.messages.statusChanged'));
                _this.getSocialNetworkTypes();
            }
            else
                _this.toasterService.showToaster(data.message);
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    SocialNetworktypeComponent.prototype.showModalForm = function (item) {
        var _this = this;
        if (item === void 0) { item = {}; }
        var dialogRef = this.dialog.open(AddSocialnetworktypeComponent, {
            width: '500px',
            data: {
                model: item,
                typeId: this.typeId
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.getSocialNetworkTypes();
            }
        });
    };
    SocialNetworktypeComponent.prototype.confirmDelete = function (id, name) {
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
    SocialNetworktypeComponent.prototype.delete = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = id;
        this.service.delete(EEndpoints.SocialNetworkType, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.getSocialNetworkTypes();
                _this.toasterService.showTranslate('messages.itemDeleted');
                _this.getSocialNetworkTypes();
            }
            else {
                _this.toasterService.showToaster(response.message);
                _this.isWorking = false;
            }
        }, function (err) { return _this.responseError(err); });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], SocialNetworktypeComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], SocialNetworktypeComponent.prototype, "sort", void 0);
    SocialNetworktypeComponent = __decorate([
        Component({
            selector: 'app-social-networktype',
            templateUrl: './social-networktype.component.html',
            styleUrls: ['./social-networktype.component.css']
        }),
        __metadata("design:paramtypes", [ToasterService,
            MatDialog,
            ApiService,
            TranslateService,
            ActivatedRoute,
            FuseTranslationLoaderService])
    ], SocialNetworktypeComponent);
    return SocialNetworktypeComponent;
}());
export { SocialNetworktypeComponent };
//# sourceMappingURL=social-networktype.component.js.map