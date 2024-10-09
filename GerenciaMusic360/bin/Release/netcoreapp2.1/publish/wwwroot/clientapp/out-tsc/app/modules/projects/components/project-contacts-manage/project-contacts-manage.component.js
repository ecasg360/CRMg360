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
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { AddContactComponent } from '@shared/components/add-contact/add-contact.component';
var ProjectContactsManageComponent = /** @class */ (function () {
    function ProjectContactsManageComponent(toaster, apiService, dialog, translate, translationLoaderService, activatedRoute) {
        var _this = this;
        this.toaster = toaster;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this.translationLoaderService = translationLoaderService;
        this.activatedRoute = activatedRoute;
        this.moduleFilter = '';
        this.contactsList = [];
        this.isWorking = false;
        this.displayedColumns = ['name', 'email', 'cellPhone', 'officePhone', 'action'];
        this.activatedRoute.data.subscribe(function (data) {
            _this.permisions = data;
        });
        this.activatedRoute.params.subscribe(function (params) {
            _this.moduleFilter = params.projectFilter;
            _this._manageGetContacts();
        });
    }
    ProjectContactsManageComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    };
    ProjectContactsManageComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    ProjectContactsManageComponent.prototype.showModalForm = function (model) {
        var _this = this;
        if (model === void 0) { model = {}; }
        var dialogRef = this.dialog.open(AddContactComponent, {
            width: '800px',
            data: {
                id: model.id,
                model: model,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this._manageGetContacts();
            }
        });
    };
    ProjectContactsManageComponent.prototype._manageGetContacts = function () {
        if (this.moduleFilter == 'label') {
            this._getProjectsContacts(EEndpoints.ProjectContactsByLabel);
        }
        else if (this.moduleFilter == 'event' || 'publishing') {
            this._getProjectsContacts(EEndpoints.ProjectContactsByEvent);
        }
        else if (this.moduleFilter == 'agency') {
            this._getProjectsContacts(EEndpoints.ProjectContactsByAgency);
        }
    };
    ProjectContactsManageComponent.prototype._fillTable = function () {
        this.dataSource = new MatTableDataSource(this.contactsList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    ProjectContactsManageComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    ProjectContactsManageComponent.prototype._getProjectsContacts = function (url) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(url).subscribe(function (response) {
            if (response.code == 100) {
                _this.contactsList = response.result;
                _this._fillTable();
            }
            else
                _this.toaster.showTranslate('errors.errorGeetingItems');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild(MatPaginator, { static: true }),
        __metadata("design:type", MatPaginator)
    ], ProjectContactsManageComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], ProjectContactsManageComponent.prototype, "sort", void 0);
    ProjectContactsManageComponent = __decorate([
        Component({
            selector: 'app-project-contacts-manage',
            templateUrl: './project-contacts-manage.component.html',
            styleUrls: ['./project-contacts-manage.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService,
            ActivatedRoute])
    ], ProjectContactsManageComponent);
    return ProjectContactsManageComponent;
}());
export { ProjectContactsManageComponent };
//# sourceMappingURL=project-contacts-manage.component.js.map