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
import { FormControl } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@enums/endpoints';
import { allLang } from '@i18n/allLang';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ProjectMemberDataComponent } from './project-member-data/project-member-data.component';
import { ToasterService } from '@services/toaster.service';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
var ProjectMembersManagerComponent = /** @class */ (function () {
    function ProjectMembersManagerComponent(dialog, toaster, apiService, translate, _fuseTranslationLoader) {
        this.dialog = dialog;
        this.toaster = toaster;
        this.apiService = apiService;
        this.translate = translate;
        this._fuseTranslationLoader = _fuseTranslationLoader;
        this.listMode = false;
        this.membersList = [];
        this.selectedMembersList = [];
        this.membersCtrl = new FormControl();
        this.projectRolesList = [];
        this.isWorking = false;
        this.getProjectRolesApi();
    }
    ProjectMembersManagerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._fuseTranslationLoader.loadTranslationsList(allLang);
        this.filteredOptions = this.membersCtrl.valueChanges
            .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
    };
    ProjectMembersManagerComponent.prototype.ngOnChanges = function (changes) {
        var projectId = changes.projectId;
        if (projectId.currentValue != undefined || projectId.currentValue > 0) {
            this.getUsersApi();
        }
    };
    ProjectMembersManagerComponent.prototype.autoCompleteOptionSelected = function ($event) {
        var userId = parseInt($event.option.id);
        var existUser = this.selectedMembersList.find(function (f) { return f.id == userId; });
        if (!existUser) {
            var user = this.membersList.find(function (f) { return f.id == userId; });
            user.projectRoleId = 0;
            user.projectId = this.projectId;
            this.showModalForm('add', user);
        }
        this.membersCtrl.setValue('');
    };
    ProjectMembersManagerComponent.prototype.showModalForm = function (action, projectUser) {
        var _this = this;
        this.isWorking = true;
        var dialogRef = this.dialog.open(ProjectMemberDataComponent, {
            width: '500px',
            data: {
                user: projectUser,
                action: action,
                projectRoles: this.projectRolesList
            }
        });
        dialogRef.afterClosed().subscribe(function (projectUser) {
            if (projectUser !== undefined) {
                _this.getMembersProjectApi();
            }
        });
        this.isWorking = false;
    };
    ProjectMembersManagerComponent.prototype.confirmDelete = function (id, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '500px',
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
                    var params = {
                        projectId: _this.projectId,
                        userId: id
                    };
                    _this.deleteMemberProjectApi(params);
                }
            }
        });
    };
    ProjectMembersManagerComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        return this.membersList.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
    };
    ProjectMembersManagerComponent.prototype._responseError = function (err) {
        console.log(err);
        this.isWorking = false;
    };
    //#region API
    ProjectMembersManagerComponent.prototype.getUsersApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Users).subscribe(function (response) {
            if (response.code == 100) {
                _this.membersList = response.result;
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectMembersManagerComponent.prototype.getProjectRolesApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Types, { typeId: 6 }).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectRolesList = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
                _this.getMembersProjectApi();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectMembersManagerComponent.prototype.getMembersProjectApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectMembersByProject, { projectId: this.projectId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.selectedMembersList = response.result.map(function (m) {
                    m.rolName = _this.projectRolesList.find(function (f) { return f.value == m.projectRoleId; }).viewValue;
                    return m;
                });
            }
            else
                _this.toaster.showToaster('Error obteniendo los miembros del proyecto');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectMembersManagerComponent.prototype.deleteMemberProjectApi = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.ProjectMemberRelation, params).subscribe(function (response) {
            if (response.code == 100)
                _this.selectedMembersList = _this.selectedMembersList.filter(function (f) { return f.id != params.userId; });
            else
                _this.toaster.showToaster('Error eliminando miembro');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectMembersManagerComponent.prototype, "projectId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ProjectMembersManagerComponent.prototype, "listMode", void 0);
    ProjectMembersManagerComponent = __decorate([
        Component({
            selector: 'app-project-members-manager',
            templateUrl: './project-members-manager.component.html',
            styleUrls: ['./project-members-manager.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            ToasterService,
            ApiService,
            TranslateService,
            FuseTranslationLoaderService])
    ], ProjectMembersManagerComponent);
    return ProjectMembersManagerComponent;
}());
export { ProjectMembersManagerComponent };
//# sourceMappingURL=project-members-manager.component.js.map