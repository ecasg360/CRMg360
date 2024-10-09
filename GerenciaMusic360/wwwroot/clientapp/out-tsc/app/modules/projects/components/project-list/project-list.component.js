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
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AddProjectComponent } from '../add-project/add-project.component';
import { EEntityProjectType, ProjectTypesString } from '@enums/project-type';
import { fuseAnimations } from '@fuse/animations';
var ProjectListComponent = /** @class */ (function () {
    function ProjectListComponent(toasterService, apiService, dialog, translate, router, translationLoaderService, activatedRoute) {
        var _a;
        var _this = this;
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translate = translate;
        this.router = router;
        this.translationLoaderService = translationLoaderService;
        this.activatedRoute = activatedRoute;
        this.isWorking = false;
        this.statusList = [];
        this.projects = [];
        this.projectList = [];
        this.projectTypes = [];
        this.moduleFilter = '';
        this.displayedColumns = ['name', 'type', 'artist', 'initialDate', 'status', 'totalBudget', 'action'];
        this.viewLabel = this.translate.instant('general.table');
        this.isTable = false;
        this.viewIcon = 'dashboard';
        this.activatedRoute.data.subscribe(function (data) {
            _this.permisions = data;
        });
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.getProjects();
    }
    ProjectListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.statusList = this.activatedRoute.snapshot.data.projectsStatus.result;
        this.fillStatusCount();
        if (!this.statusList) {
            this.router.navigate(['/projects']);
        }
        this._prepareProjectTypes();
        this.activatedRoute.params.subscribe(function (params) {
            _this.moduleFilter = params.projectFilter;
            _this.month = params.month;
            _this.year = params.year;
            _this.statusFilterUrl = params.status;
            if (_this.year && _this.month) {
                _this.getProjectsMonth(_this.month, _this.year);
            }
            if (_this.projects.length > 0) {
                _this.isWorking = true;
                _this.getProjects();
            }
        });
    };
    ProjectListComponent.prototype.changeView = function () {
        this.isTable = !this.isTable;
        if (this.isTable) {
            this.viewLabel = this.translate.instant('general.cards');
            this.viewIcon = 'featured_play_list';
        }
        else {
            this.viewLabel = this.translate.instant('general.table');
            this.viewIcon = 'dashboard';
        }
    };
    ProjectListComponent.prototype.applyFilter = function (filterValue) {
        this.projectList = this.projects.filter(function (f) { return f.name.toLowerCase().includes(filterValue.toLowerCase()); });
        this.fillTable();
    };
    ProjectListComponent.prototype.filterByStatus = function (statusId, statusName) {
        if (statusId === void 0) { statusId = 0; }
        this.projectList = (statusId > 0)
            ? this.projects.filter(function (f) { return f.statusProjectId == statusId; })
            : this.projects;
        if (statusId == 0 && statusName)
            this.projectList = this.projects.filter(function (f) { return f.statusProjectName.toLowerCase().replace(/ /g, '') == statusName; });
        this.filterActive = statusName;
        this.fillTable();
    };
    ProjectListComponent.prototype.filterByType = function (type) {
        this.projectList = (type > 0)
            ? this.projects.filter(function (f) { return f.projectTypeId == type; })
            : this.projects;
        this.fillTable();
    };
    ProjectListComponent.prototype.openModal = function (_projectTypeDescription, _projectType) {
        var _this = this;
        if (_projectTypeDescription === void 0) { _projectTypeDescription = ""; }
        if (_projectType === void 0) { _projectType = 0; }
        var dialogRef = this.dialog.open(AddProjectComponent, {
            width: '900px',
            data: {
                projectId: 0,
                projectType: _projectType,
                moduleType: this.moduleFilter,
                projectTypeDesc: _projectTypeDescription
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result != undefined) {
                _this.router.navigate(['/projects/manage/', result.id]);
            }
        });
    };
    ProjectListComponent.prototype.downloadFile = function (projectId, name) {
        var _this = this;
        this.isWorking = true;
        this.apiService.download(EEndpoints.ProjectBudgetDownload, { projectId: projectId }).subscribe(function (fileData) {
            var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "ProjectBudget Proyecto " + name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectListComponent.prototype.downloadLabelCopy = function (projectId, name) {
        var _this = this;
        this.isWorking = true;
        this.apiService.download(EEndpoints.LabelCopyDownload, { projectId: projectId }).subscribe(function (fileData) {
            var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "Label Copy " + name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectListComponent.prototype.canDownloadLC = function (projectType) {
        projectType = projectType.replace(/ /g, '');
        return (projectType == 'SingleRelease' || projectType == 'AlbumRelease' ||
            projectType == 'VideoLiricMusic' || projectType == 'videoMusic');
    };
    ProjectListComponent.prototype._responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    ProjectListComponent.prototype.fillStatusCount = function () {
        var _this = this;
        this.statusList = this.statusList.map(function (m) {
            var found = _this.projects.filter(function (f) { return f.statusProjectId == m.id; });
            m.count = (found) ? found.length : 0;
            return m;
        });
    };
    ProjectListComponent.prototype.confirmDelete = function (projectId, projectName) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: projectName }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteProjectApi(projectId);
            }
        });
    };
    ProjectListComponent.prototype._filterProjects = function () {
        var _this = this;
        if (this.moduleFilter == 'label') {
            this.projectList = this.projects.filter(function (f) { return f.projectTypeName != 'Event' && f.projectTypeName != 'Artist Sale'; });
        }
        else if (this.moduleFilter == 'event') {
            this.projectList = this.projects.filter(function (f) { return f.projectTypeName == 'Event'; });
        }
        else if (this.moduleFilter == 'agency') {
            this.projectList = this.projects.filter(function (f) { return f.projectTypeName == 'Artist Sale'; });
        }
        else {
            this.projectList = this.projects;
        }
        if (this.year && this.month) {
            this.projectList = this.projects.filter(function (f) {
                var date = new Date(f.endDate);
                if (_this.year == date.getFullYear() && date.getMonth() == _this.month)
                    return f;
            });
        }
        this.fillTable();
        this.fillStatusCount();
    };
    ProjectListComponent.prototype._filterProjectsTypeByMenu = function () {
        if (this.moduleFilter == 'label') {
            this.projectTypes = this.projectTypes.filter(function (f) { return f.name != 'ArtistSale' && f.name != 'Event'; });
        }
        else if (this.moduleFilter == 'event') {
            this.projectTypes = this.projectTypes.filter(function (f) { return f.name == 'Event'; });
        }
        else if (this.moduleFilter == 'agency') {
            this.projectTypes = this.projectTypes.filter(function (f) { return f.name == 'ArtistSale'; });
        }
    };
    ProjectListComponent.prototype._prepareProjectTypes = function () {
        var _this = this;
        this.isWorking = true;
        var keys = Object.keys(EEntityProjectType).filter(function (key) { return !isNaN(Number(EEntityProjectType[key])); });
        if (keys.length > 0) {
            this.projectTypes = [];
            keys.forEach(function (key) {
                var id = EEntityProjectType[key];
                _this.projectTypes.push({
                    id: id,
                    name: key,
                    description: '',
                    statusRecordId: 1,
                    pictureUrl: "assets/images/projects/icon-btn/100/" + ProjectTypesString[id] + ".png",
                });
            });
        }
        this._filterProjectsTypeByMenu();
    };
    ProjectListComponent.prototype.fillTable = function () {
        this.dataSource = new MatTableDataSource(this.projectList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    //#region API
    ProjectListComponent.prototype.getProjects = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Projects).subscribe(function (response) {
            if (response.code == 100 && response.result.length) {
                _this.projects = response.result.filter(function (f) { return f.statusRecordId < 3; });
                _this.projectList = _this.projects;
                _this._filterProjects();
                if (_this.statusFilterUrl) {
                    _this.filterByStatus(0, _this.statusFilterUrl);
                }
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectListComponent.prototype.getProjectsMonth = function (month, year) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectsAnalistics, { month: month, year: year }).subscribe(function (response) {
            if (response.code == 100 && response.result.length) {
                _this.projects = response.result.filter(function (f) { return f.statusRecordId < 3; });
                _this._filterProjects();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectListComponent.prototype.deleteProjectApi = function (id) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.Project, { id: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.projects = _this.projects.filter(function (f) { return f.id !== id; });
                _this._filterProjects();
                _this.toasterService.showToaster(_this.translate.instant('messages.itemDeleted'));
            }
            else
                _this.toasterService.showToaster(_this.translate.instant('errors.errorDeletingItem'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], ProjectListComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], ProjectListComponent.prototype, "sort", void 0);
    ProjectListComponent = __decorate([
        Component({
            selector: 'app-project-list',
            templateUrl: './project-list.component.html',
            styleUrls: ['./project-list.component.scss'],
            animations: fuseAnimations
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            TranslateService,
            Router,
            FuseTranslationLoaderService,
            ActivatedRoute])
    ], ProjectListComponent);
    return ProjectListComponent;
}());
export { ProjectListComponent };
//# sourceMappingURL=project-list.component.js.map