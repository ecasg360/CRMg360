var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from "@angular/core";
import { ToasterService } from "@services/toaster.service";
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { ProjectContactFormComponent } from './project-contact-form/project-contact-form.component';
import { FormControl } from "@angular/forms";
import { startWith, map } from "rxjs/operators";
var ProjectContactComponent = /** @class */ (function () {
    //#region Lifetime Cycle
    function ProjectContactComponent(dialog, translationLoaderService, translate, apiService, toaster) {
        this.dialog = dialog;
        this.translationLoaderService = translationLoaderService;
        this.translate = translate;
        this.apiService = apiService;
        this.toaster = toaster;
        this.listMode = false;
        this.perm = {};
        this.contactCtrl = new FormControl();
        this.isWorking = false;
        this.isDataAvailable = true;
        this.contactsList = [];
        this.projectContactsList = [];
    }
    ProjectContactComponent.prototype.ngOnInit = function () {
        var _a;
        var _this = this;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.filteredOptions = this.contactCtrl.valueChanges
            .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
    };
    ProjectContactComponent.prototype.ngOnChanges = function (changes) {
        var projectId = changes.projectId;
        if (projectId.currentValue != undefined && projectId.currentValue > 0) {
            this.getContactsApi();
            this.getProjectContactsApi();
        }
    };
    //#endregion
    //#region general Methods
    ProjectContactComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        this.isWorking = true;
        var contact = this.contactsList.find(function (f) { return f.id == id; });
        var dialogRef = this.dialog.open(ProjectContactFormComponent, {
            width: '950px',
            data: {
                id: id,
                model: contact,
                projectId: this.projectId
            }
        });
        dialogRef.afterClosed().subscribe(function (contact) {
            if (contact !== undefined) {
                if (contact.id == 0) {
                    contact.id = (new Date()).getMilliseconds() * -1;
                }
                _this.manageContactsEvent(contact);
            }
        });
        this.isWorking = false;
    };
    ProjectContactComponent.prototype.manageContactsEvent = function (contact) {
        if (contact.id > 0) {
            this.updateContactApi(contact);
        }
        else {
            if (this.projectId > 0) {
                this.saveContactApi(contact);
            }
            else {
                this.contactsList = this.contactsList.filter(function (f) { return f.id !== contact.id; });
                this.contactsList.push(contact);
            }
        }
    };
    ProjectContactComponent.prototype.confirmDelete = function (id, name) {
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
                if (confirm_1)
                    _this.deleteContactEvent(id);
            }
        });
    };
    ProjectContactComponent.prototype.deleteContactEvent = function (id) {
        if (id > 0) {
            this.deleteContactApi(id);
        }
        else {
            this.contactsList = this.contactsList.filter(function (f) { return f.id !== id; });
        }
    };
    ProjectContactComponent.prototype.autoCompleteOptionSelected = function ($event) {
        this.contactCtrl.setValue('');
        var contactId = parseInt($event.option.id);
        var existUser = this.projectContactsList.find(function (f) { return f.id == contactId; });
        if (!existUser) {
            var params = {
                personId: contactId,
                TypeId: 1,
                ProjectId: this.projectId
            };
            this.bindContactProjectApi(params);
        }
    };
    ProjectContactComponent.prototype._responseError = function (err) {
        this.isWorking = false;
        console.log('http error', err);
    };
    ProjectContactComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        return this.contactsList.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
    };
    //#endregion
    //#region members API
    ProjectContactComponent.prototype.saveContactApi = function (contact) {
        var _this = this;
        this.isWorking = true;
        delete contact.id;
        contact.projectId = this.projectId;
        this.apiService.save(EEndpoints.ProjectContact, contact).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.contactSaved'));
                _this.getProjectContactsApi();
                _this.getContactsApi();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.contactSavedfailed'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectContactComponent.prototype.bindContactProjectApi = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectContactRelation, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.getProjectContactsApi();
                _this.getContactsApi();
            }
            else
                _this.toaster.showToaster('Error vinculando contacto');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectContactComponent.prototype.getContactsApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectContacts).subscribe(function (response) {
            if (response.code == 100)
                _this.contactsList = response.result;
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectContactComponent.prototype.getProjectContactsApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectContactsByProject, { projectId: this.projectId }).subscribe(function (response) {
            if (response.code == 100)
                _this.projectContactsList = response.result;
            else
                _this.toaster.showToaster('Error obteniendo contactos del proyecto');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectContactComponent.prototype.updateContactApi = function (contact) {
        var _this = this;
        this.isWorking = true;
        delete contact.birthDate;
        contact.projectId = this.projectId;
        this.apiService.update(EEndpoints.ProjectContact, contact).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.contactEdited'));
                _this.getProjectContactsApi();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.contactEditedFailed'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectContactComponent.prototype.deleteContactApi = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = { projectId: this.projectId, personId: id };
        this.apiService.delete(EEndpoints.ProjectContactRelation, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.contactDeleted'));
                _this.getProjectContactsApi();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.memberDeletedFailed'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectContactComponent.prototype, "projectId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ProjectContactComponent.prototype, "listMode", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectContactComponent.prototype, "perm", void 0);
    ProjectContactComponent = __decorate([
        Component({
            selector: 'app-project-contact',
            templateUrl: './project-contact.component.html',
            styleUrls: ['./project-contact.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            FuseTranslationLoaderService,
            TranslateService,
            ApiService,
            ToasterService])
    ], ProjectContactComponent);
    return ProjectContactComponent;
}());
export { ProjectContactComponent };
//# sourceMappingURL=project-contact.component.js.map