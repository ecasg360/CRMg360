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
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { AddProjectWorkComponent } from './add-project-work/add-project-work.component';
import { AddAlbumReleaseComponent } from './add-album-release/add-album-release.component';
import { MatDialog } from '@angular/material';
import { AddComposerComponent } from './add-composer/add-composer.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { AddWorkAdminComponent } from './add-work-admin/add-work-admin.component';
var ProjectWorkComponent = /** @class */ (function () {
    function ProjectWorkComponent(ApiService, toasterService, translate, dialog) {
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.dialog = dialog;
        this.projectId = 0;
        this.project = {};
        this.perm = {};
        this.isWorking = false;
        this.projectWorks = [];
    }
    ProjectWorkComponent.prototype.ngOnInit = function () {
        this.getProjectWorks();
    };
    ProjectWorkComponent.prototype.getProjectWorks = function () {
        var _this = this;
        //aca debo llamar a las categorias del proyecto
        this.isWorking = true;
        this.ApiService.get(EEndpoints.ProjectWorks, { projectId: this.projectId }).subscribe(function (response) {
            if (response.code == 100)
                _this.projectWorks = response.result;
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    ProjectWorkComponent.prototype.showModalComposerForm = function (workId, itemName, percentagePending, model) {
        var _this = this;
        if (model === void 0) { model = {}; }
        model.workId = workId;
        var dialogRef = this.dialog.open(AddComposerComponent, {
            width: '700px',
            data: {
                workCollaborator: model,
                itemName: itemName,
                percentagePending: percentagePending,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.getProjectWorks();
            }
        });
    };
    ProjectWorkComponent.prototype.showModalWorkAdminForm = function (workId, itemId, itemName, percentagePending) {
        var _this = this;
        var dialogRef = this.dialog.open(AddWorkAdminComponent, {
            width: '700px',
            data: {
                workId: itemId,
                projectWorkId: workId,
                itemName: itemName,
                percentagePending: percentagePending,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.getProjectWorks();
            }
        });
    };
    ProjectWorkComponent.prototype.confirmDeleteWork = function (workId, name) {
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
                    _this.deleteWork(_this.projectId, workId);
            }
        });
    };
    ProjectWorkComponent.prototype.deleteWork = function (projectId, workId) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['projectId'] = projectId;
        params['workId'] = workId;
        this.ApiService.delete(EEndpoints.DeleteProjectWork, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getProjectWorks();
                _this.toasterService.showToaster(_this.translate.instant('projectWork.work.messages.deleteSuccess'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
        }, function (err) {
            _this.responseError(err);
        });
    };
    ProjectWorkComponent.prototype.confirmDelete = function (workId, composerId, name) {
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
                var confirm_2 = result.confirm;
                if (confirm_2)
                    _this.deleteComposerToWork(workId, composerId);
            }
        });
    };
    ProjectWorkComponent.prototype.deleteComposerToWork = function (workId, composerId) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['workId'] = workId;
        params['composerId'] = composerId;
        this.ApiService.delete(EEndpoints.WorkCollaborator, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getProjectWorks();
                _this.toasterService.showToaster(_this.translate.instant('composer.messages.deleteSuccess'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    ProjectWorkComponent.prototype.confirmDeleteWorkAdmin = function (id, name) {
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
                var confirm_3 = result.confirm;
                if (confirm_3)
                    _this.deleteComposerToWorkAdmin(id);
            }
        });
    };
    ProjectWorkComponent.prototype.deleteComposerToWorkAdmin = function (id) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['id'] = id;
        this.ApiService.delete(EEndpoints.ProjectWorkAdmin, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getProjectWorks();
                _this.toasterService.showToaster(_this.translate.instant('projectWork.messages.deleteSuccess'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    ProjectWorkComponent.prototype.addData = function () {
        var _this = this;
        this.isWorking = true;
        var component = AddProjectWorkComponent;
        if (this.project.projectTypeId === 1) { //album release
            component = AddAlbumReleaseComponent;
        }
        var dialogRef = this.dialog.open(component, {
            width: '1000px',
            data: {
                projectId: this.projectId,
                projectTypeId: this.project.projectTypeId,
                artistId: this.project.artistId,
                projectWorks: this.projectWorks,
                project: this.project
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.getProjectWorks();
            }
        });
        this.isWorking = false;
    };
    ProjectWorkComponent.prototype.editWork = function (workId, projectWorkId, projectWork) {
        var _this = this;
        if (projectWork === void 0) { projectWork = {}; }
        this.isWorking = true;
        var component = AddProjectWorkComponent;
        if (this.project.projectTypeId === 1) { //album release
            component = AddAlbumReleaseComponent;
        }
        var dialogRef = this.dialog.open(component, {
            width: '1000px',
            data: {
                projectId: this.projectId,
                projectTypeId: this.project.projectTypeId,
                artistId: this.project.artistId,
                projectWorks: this.projectWorks,
                project: this.project,
                isEditData: true,
                modelProjectWork: projectWork,
                workId: workId,
                projectWorkId: projectWorkId
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.getProjectWorks();
            }
        });
        this.isWorking = false;
    };
    ProjectWorkComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectWorkComponent.prototype, "projectId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectWorkComponent.prototype, "project", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectWorkComponent.prototype, "perm", void 0);
    ProjectWorkComponent = __decorate([
        Component({
            selector: 'app-project-work',
            templateUrl: './project-work.component.html',
            styleUrls: ['./project-work.component.css']
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            TranslateService,
            MatDialog])
    ], ProjectWorkComponent);
    return ProjectWorkComponent;
}());
export { ProjectWorkComponent };
//# sourceMappingURL=project-work.component.js.map