var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '../confirm/confirm.component';
import { PersonDocumentFormComponent } from '../person-document-form/person-document-form.component';
import { ToasterService } from '@services/toaster.service';
import { EEndpoints } from '@enums/endpoints';
import { ApiService } from '@services/api.service';
var PersonDocumentManagerComponent = /** @class */ (function () {
    //#region Lifetime Cycle
    function PersonDocumentManagerComponent(dialog, _fuseTranslationLoaderService, translate, apiService, toasterService) {
        this.dialog = dialog;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.translate = translate;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.emitPersonDocumentData = new EventEmitter();
        this._personId = 0;
        this.displayedColumns = ['name', 'documentType', 'country', 'documentNumber', 'expirationDate', 'status', 'action'];
        this.isWorking = false;
        this.isDataAvailable = true;
        this.documentTypes = [];
        this.countries = [];
        this.documentPersonList = [];
        this.getDocumentsTypesApi();
        this.getCountriesApi();
    }
    Object.defineProperty(PersonDocumentManagerComponent.prototype, "personId", {
        get: function () {
            return this._personId;
        },
        set: function (v) {
            this._personId = v;
            if (this._personId > 0) {
                this.triggerPersonDocumentQueue();
            }
        },
        enumerable: false,
        configurable: true
    });
    PersonDocumentManagerComponent.prototype.ngOnChanges = function (changes) {
    };
    PersonDocumentManagerComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.innerWidth = window.innerWidth;
    };
    PersonDocumentManagerComponent.prototype.ngOnDestroy = function () {
        this.emitPersonDocumentData.complete();
    };
    //#endregion
    //#region API methods
    PersonDocumentManagerComponent.prototype.savePersonDocumentsApi = function () {
        var _this = this;
        if (this.documentPersonList.length > 0) {
            var params = [];
            for (var index = 0; index < this.documentPersonList.length; index++) {
                var element = this.documentPersonList[index];
                delete element.id;
                delete element.country;
                delete element.documentType;
                element.personId = this.personId;
                params.push(element);
            }
            this.apiService.save(EEndpoints.PersonDocuments, params).subscribe(function (response) {
                if (response.code == 100) {
                    _this.toasterService.showToaster(_this.translate.instant('messages.personDocumentSaved'));
                    _this.getPersonDocumentApi();
                }
                else {
                    _this.toasterService.showToaster(_this.translate.instant('errors.savedPersonDocumentFailed'));
                    console.log(response.message);
                }
            }, function (err) { return _this.responseError(err); });
        }
    };
    PersonDocumentManagerComponent.prototype.savePersonDocumentApi = function (document) {
        var _this = this;
        this.isWorking = true;
        delete document.id;
        delete document.country;
        delete document.documentType;
        delete document.expiredDate;
        document.personId = this.personId;
        this.apiService.save(EEndpoints.PersonDocument, document).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.personDocumentSaved'));
                _this.getPersonDocumentApi();
                _this.isWorking = false;
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('errors.savedPersonDocumentFailed'));
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    PersonDocumentManagerComponent.prototype.updatePersonDocumentApi = function (document) {
        var _this = this;
        this.isWorking = true;
        delete document.country;
        delete document.documentType;
        delete document.expiredDate;
        this.apiService.update(EEndpoints.PersonDocument, document).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.personDocumentEdited'));
                _this.getPersonDocumentApi();
                _this.isWorking = false;
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('errors.personDocumentEditFailed'));
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    PersonDocumentManagerComponent.prototype.updatePersonDocumentStatusApi = function (model) {
        var _this = this;
        this.apiService.save(EEndpoints.PersonDocumentStatus, model).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.statusChanged'));
                _this.getPersonDocumentApi();
                _this.isWorking = false;
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('errors.changeStatusFailed'));
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    PersonDocumentManagerComponent.prototype.deletePersonDocumentApi = function (id) {
        var _this = this;
        this.apiService.delete(EEndpoints.PersonDocument, { id: id, personId: this.personId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.personDocumentDeleted'));
                _this.getPersonDocumentApi();
                _this.isWorking = false;
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('errors.personDocumentDeletedFailed'));
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    PersonDocumentManagerComponent.prototype.getPersonDocumentApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.PersonDocuments, { personId: this.personId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.documentPersonList = [];
                for (var i = 0; i < response.result.length; i++) {
                    var element = response.result[i];
                    _this.documentPersonList.push(element);
                }
                _this.bindDataTable();
            }
            else {
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    PersonDocumentManagerComponent.prototype.getDocumentsTypesApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.PersonDocumentTypes).subscribe(function (data) {
            if (data.code == 100) {
                _this.documentTypes = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    PersonDocumentManagerComponent.prototype.getCountriesApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Countries).subscribe(function (data) {
            if (data.code == 100) {
                _this.countries = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    //#endregion
    //#region general Methods
    PersonDocumentManagerComponent.prototype.bindDataTable = function () {
        var _this = this;
        this.dataSource = new MatTableDataSource(this.documentPersonList.map(function (doc) {
            if (_this.documentTypes) {
                var documentFound = _this.documentTypes.find(function (f) { return f.value == doc.personDocumentTypeId; });
                if (documentFound) {
                    doc.documentType = documentFound.viewValue;
                }
            }
            if (_this.countries) {
                var countryFound = _this.countries.find(function (f) { return f.value == doc.countryId; });
                if (countryFound) {
                    doc.country = countryFound.viewValue;
                }
            }
            return doc;
        }));
        this.emitPersonDocumentData.emit(this.documentPersonList);
    };
    PersonDocumentManagerComponent.prototype.triggerPersonDocumentQueue = function () {
        if (this.documentPersonList.length > 0) {
            var found = this.documentPersonList.filter(function (f) { return f.id < 0; });
            if (found.length > 0) {
                this.savePersonDocumentsApi();
            }
        }
        else {
            this.getPersonDocumentApi();
        }
    };
    PersonDocumentManagerComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        this.isWorking = true;
        var document = this.documentPersonList.find(function (f) { return f.id == id; });
        var dialogRef = this.dialog.open(PersonDocumentFormComponent, {
            width: '800px',
            data: {
                id: id,
                model: document,
                documentTypes: this.documentTypes,
                countries: this.countries
            }
        });
        dialogRef.afterClosed().subscribe(function (document) {
            if (document !== undefined) {
                if (document.id == 0) {
                    document.id = (new Date()).getMilliseconds() * -1;
                }
                _this.managePersonDocumentEvent(document);
            }
        });
        this.isWorking = false;
    };
    PersonDocumentManagerComponent.prototype.managePersonDocumentEvent = function (document) {
        if (document.id > 0) {
            this.updatePersonDocumentApi(document);
        }
        else {
            if (this.personId > 0) {
                this.savePersonDocumentApi(document);
            }
            this.documentPersonList = this.documentPersonList.filter(function (f) { return f.id !== document.id; });
            this.documentPersonList.push(document);
            this.bindDataTable();
        }
    };
    PersonDocumentManagerComponent.prototype.updateStatus = function (id, statusRecordId, personDocumentTypeId) {
        statusRecordId = statusRecordId == 1 ? 2 : 1;
        this.updatePersonDocumentStatusApi({
            id: id,
            status: statusRecordId,
            TypeId: personDocumentTypeId
        });
    };
    PersonDocumentManagerComponent.prototype.confirmDelete = function (id, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1) {
                    _this.deletePersonDocumentApi(id);
                }
            }
        });
    };
    PersonDocumentManagerComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log('http error', err);
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], PersonDocumentManagerComponent.prototype, "emitPersonDocumentData", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], PersonDocumentManagerComponent.prototype, "personId", null);
    PersonDocumentManagerComponent = __decorate([
        Component({
            selector: 'app-person-document-manager',
            templateUrl: './person-document-manager.component.html',
            styleUrls: ['./person-document-manager.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            FuseTranslationLoaderService,
            TranslateService,
            ApiService,
            ToasterService])
    ], PersonDocumentManagerComponent);
    return PersonDocumentManagerComponent;
}());
export { PersonDocumentManagerComponent };
//# sourceMappingURL=person-document-manager.component.js.map