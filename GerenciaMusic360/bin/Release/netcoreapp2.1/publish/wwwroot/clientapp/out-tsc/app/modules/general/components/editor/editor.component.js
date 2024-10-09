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
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { EEndpoints } from '@enums/endpoints';
import { AddEditorComponent } from './add-editor/add-editor.component';
import { ActivatedRoute } from '@angular/router';
var EditorComponent = /** @class */ (function () {
    function EditorComponent(dialog, translationLoaderService, translate, route, apiService, toaster) {
        this.dialog = dialog;
        this.translationLoaderService = translationLoaderService;
        this.translate = translate;
        this.route = route;
        this.apiService = apiService;
        this.toaster = toaster;
        this.displayedColumns = ['dba', 'name', 'company', 'association', 'internal', 'action'];
        this.editorList = [];
        this.isWorking = true;
        this.isDataAvailable = true;
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    ;
    EditorComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.getEditorsApi();
    };
    EditorComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    EditorComponent.prototype.showModalForm = function (row) {
        var _this = this;
        if (row === void 0) { row = {}; }
        var dialogRef = this.dialog.open(AddEditorComponent, {
            width: '400px',
            data: {
                model: row
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result)
                _this.getEditorsApi();
        });
    };
    EditorComponent.prototype.confirmDelete = function (row) {
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
            if (result)
                _this.deleteEditorApi(row.id);
        });
    };
    EditorComponent.prototype._fillTable = function () {
        this.dataSource = new MatTableDataSource(this.editorList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    EditorComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        console.error(error);
        this.isWorking = false;
    };
    //#region API
    EditorComponent.prototype.getEditorsApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Editors).subscribe(function (response) {
            if (response.code == 100) {
                _this.editorList = response.result;
                _this._fillTable();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorGettingItems'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    EditorComponent.prototype.deleteEditorApi = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = { id: id };
        this.apiService.delete(EEndpoints.Editor, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemDeleted'));
                _this.editorList = _this.editorList.filter(function (f) { return f.id !== id; });
                _this._fillTable();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorDeletingItem'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], EditorComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], EditorComponent.prototype, "sort", void 0);
    EditorComponent = __decorate([
        Component({
            selector: 'app-editor',
            templateUrl: './editor.component.html',
            styleUrls: ['./editor.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            FuseTranslationLoaderService,
            TranslateService,
            ActivatedRoute,
            ApiService,
            ToasterService])
    ], EditorComponent);
    return EditorComponent;
}());
export { EditorComponent };
//# sourceMappingURL=editor.component.js.map