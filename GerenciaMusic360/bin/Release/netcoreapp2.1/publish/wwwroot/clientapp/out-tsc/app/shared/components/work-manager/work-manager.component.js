var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { WorkFormComponent } from '../work-form/work-form.component';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { allLang } from '@i18n/allLang';
var WorkManagerComponent = /** @class */ (function () {
    function WorkManagerComponent(toaster, apiService, dialog, translate, _fuseTranslationLoaderService) {
        this.toaster = toaster;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.workList = [];
    }
    WorkManagerComponent.prototype.ngOnInit = function () {
        this._fuseTranslationLoaderService.loadTranslationsList(allLang);
    };
    WorkManagerComponent.prototype.ngOnChanges = function (changes) {
        var personId = changes.personId;
        if (personId.currentValue > 0) {
            this.getWorksApi();
        }
    };
    WorkManagerComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        this.isWorking = true;
        var work = {};
        if (id !== 0) {
            work = this.workList.find(function (f) { return f.id == id; });
        }
        else {
            work.id = 0;
            work.certificationAuthorityId = 0;
            work.personRelationId = this.personId;
        }
        var dialogRef = this.dialog.open(WorkFormComponent, {
            width: '750px',
            data: {
                model: work
            }
        });
        dialogRef.afterClosed().subscribe(function (work) {
            if (work !== undefined) {
                work.personRelationId = _this.personId;
                console.log(work);
                if (id == 0)
                    _this.saveWorkApi(work);
                else {
                    work.id = id;
                    _this.updateWorkApi(work);
                }
            }
        });
        this.isWorking = false;
    };
    WorkManagerComponent.prototype.confirmDelete = function (id, name) {
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
                    _this.deleteWorkApi(id);
            }
        });
    };
    WorkManagerComponent.prototype.updateStatus = function (id, statusRecordId) {
        this.isWorking = true;
        var status = statusRecordId == 1 ? 2 : 1;
        var params = {
            id: id,
            typeId: this.personId,
            status: status
        };
        this.updateStatuApi(params);
    };
    WorkManagerComponent.prototype.responseError = function (err) {
        console.log('http', err);
        this.isWorking = false;
    };
    //#region API
    WorkManagerComponent.prototype.getWorksApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.WorkByPerson, { personId: this.personId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.workList = response.result;
            }
            else {
                _this.toaster.showToaster('Error obteniendo datos');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    WorkManagerComponent.prototype.saveWorkApi = function (data) {
        var _this = this;
        this.isWorking = true;
        delete data.id;
        this.apiService.save(EEndpoints.Work, data).subscribe(function (response) {
            if (response.code == 100) {
                _this.getWorksApi();
                _this.toaster.showToaster('Registro guardado');
            }
            else {
                _this.toaster.showToaster('Error guardando registro');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    WorkManagerComponent.prototype.updateWorkApi = function (data) {
        var _this = this;
        this.apiService.update(EEndpoints.Work, data).subscribe(function (response) {
            if (response.code == 100) {
                _this.getWorksApi();
                _this.toaster.showToaster('Registro modificado');
            }
            else {
                _this.toaster.showToaster('Error modificando registro');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    WorkManagerComponent.prototype.updateStatuApi = function (params) {
        var _this = this;
        this.apiService.save(EEndpoints.WorkStatus, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.getWorksApi();
            }
            else {
                _this.toaster.showToaster('Error actualizando datos');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    WorkManagerComponent.prototype.deleteWorkApi = function (id) {
        var _this = this;
        var params = {
            id: id,
            personId: this.personId
        };
        this.apiService.delete(EEndpoints.Work, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.getWorksApi();
                _this.toaster.showToaster('registro eliminado');
            }
            else {
                _this.toaster.showToaster('ocurrio un error eliminando el registro');
            }
        }, function (err) { return _this.responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], WorkManagerComponent.prototype, "personId", void 0);
    WorkManagerComponent = __decorate([
        Component({
            selector: 'app-work-manager',
            templateUrl: './work-manager.component.html',
            styleUrls: ['./work-manager.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService])
    ], WorkManagerComponent);
    return WorkManagerComponent;
}());
export { WorkManagerComponent };
//# sourceMappingURL=work-manager.component.js.map