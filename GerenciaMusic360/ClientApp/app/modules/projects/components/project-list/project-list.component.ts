import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginatorIntl, MatPaginator, MatSort } from '@angular/material';
import { IProject } from '@models/project';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IStatusProject } from '@models/status-project';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AddProjectComponent } from '../add-project/add-project.component';
import { IProjectType } from '@models/project-type';
import { EEntityProjectType, ProjectTypesString } from '@enums/project-type';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
    animations: fuseAnimations
})
export class ProjectListComponent implements OnInit {

    isWorking: boolean = false;
    statusList: IStatusProject[] = [];
    projects: IProject[] = [];
    projectList: IProject[] = [];
    projectTypes: IProjectType[] = [];
    filterActive: string;
    moduleFilter: string = '';
    month: number;
    year: number;
    statusFilterUrl: string;
    permisions:any;

    displayedColumns: string[] = ['name', 'type', 'artist', 'initialDate', 'status', 'totalBudget', 'action'];
    dataSource: MatTableDataSource<any>;
    paginatorIntl: MatPaginatorIntl;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    viewLabel = this.translate.instant('general.table');
    isTable = false;
    viewIcon = 'dashboard'

    constructor(
        private toasterService: ToasterService,
        private apiService: ApiService,
        public dialog: MatDialog,
        private translate: TranslateService,
        private router: Router,
        private translationLoaderService: FuseTranslationLoaderService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.activatedRoute.data.subscribe((data: any) => {
            this.permisions = data;
        });
        this.translationLoaderService.loadTranslations(...allLang);
        this.getProjects();
    }

    ngOnInit() {
        this.statusList = this.activatedRoute.snapshot.data.projectsStatus.result;
        this.fillStatusCount();
        if (!this.statusList) {
            this.router.navigate(['/projects']);
        }
        this._prepareProjectTypes();

        this.activatedRoute.params.subscribe(
            (params: any) => {
                this.moduleFilter = params.projectFilter;
                this.month = params.month;
                this.year = params.year;
                this.statusFilterUrl = params.status;
                if (this.year && this.month) {
                    this.getProjectsMonth(this.month, this.year);
                }

                if (this.projects.length > 0) {
                    this.isWorking = true;
                    this.getProjects();
                }
            });
    }

    changeView() {
        this.isTable = !this.isTable;
        if (this.isTable) {
            this.viewLabel = this.translate.instant('general.cards');
            this.viewIcon = 'featured_play_list';
        } else {
            this.viewLabel = this.translate.instant('general.table');
            this.viewIcon = 'dashboard';
        }
    }

    applyFilter(filterValue: string): void {
        this.projectList = this.projects.filter(f => f.name.toLowerCase().includes(filterValue.toLowerCase()));
        this.fillTable();
    }

    filterByStatus(statusId: number = 0, statusName: string) {
        this.projectList = (statusId > 0)
            ? this.projects.filter((f: IProject) => f.statusProjectId == statusId)
            : this.projects;

        if (statusId == 0 && statusName)
            this.projectList = this.projects.filter(
                (f: IProject) => f.statusProjectName.toLowerCase().replace(/ /g, '') == statusName);

        this.filterActive = statusName;
        this.fillTable();
    }

    filterByType(type: number) {
        this.projectList = (type > 0)
            ? this.projects.filter((f: IProject) => f.projectTypeId == type)
            : this.projects;
        this.fillTable();
    }

    openModal(_projectTypeDescription: string = "", _projectType: number = 0): void {
        const dialogRef = this.dialog.open(AddProjectComponent, {
            width: '900px',
            data: {
                projectId: 0,
                projectType: _projectType,
                moduleType: this.moduleFilter,
                projectTypeDesc: _projectTypeDescription
            }
        });
        dialogRef.afterClosed().subscribe((result: IProject) => {
            if (result != undefined) {
                this.router.navigate(['/projects/manage/', result.id]);
            }
        });
    }

    downloadFile(projectId: number, name: string) {
        this.isWorking = true;
        this.apiService.download(EEndpoints.ProjectBudgetDownload, { projectId: projectId }).subscribe(
            fileData => {
                const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                let link = document.createElement("a");
                if (link.download !== undefined) {
                    let url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "ProjectBudget Proyecto " + name);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                this.isWorking = false;
            }, err => this._responseError(err)
        );
    }

    downloadLabelCopy(projectId: number, name: string) {
        this.isWorking = true;
        this.apiService.download(EEndpoints.LabelCopyDownload, { projectId: projectId }).subscribe(fileData => {
            const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let link = document.createElement("a");
            if (link.download !== undefined) {
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "Label Copy " + name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            this.isWorking = false;
        }, err => this._responseError(err));
    }

    canDownloadLC(projectType: string): boolean {
        projectType = projectType.replace(/ /g, '');
        return (projectType == 'SingleRelease' || projectType == 'AlbumRelease' ||
            projectType == 'VideoLiricMusic' || projectType == 'videoMusic');
    }

    private _responseError(error: any): void {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    }

    fillStatusCount() {
        this.statusList = this.statusList.map(m => {
            const found = this.projects.filter(f => f.statusProjectId == m.id);
            m.count = (found) ? found.length : 0;
            return m;
        });
    }

    confirmDelete(projectId: number, projectName: string) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: projectName }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm)
                    this.deleteProjectApi(projectId);
            }
        });
    }

    private _filterProjects() {
        if (this.moduleFilter == 'label') {
            this.projectList = this.projects.filter(f => f.projectTypeName != 'Event' && f.projectTypeName != 'Artist Sale');
        } else if (this.moduleFilter == 'event') {
            this.projectList = this.projects.filter(f => f.projectTypeName == 'Event');
        } else if (this.moduleFilter == 'agency') {
            this.projectList = this.projects.filter(f => f.projectTypeName == 'Artist Sale');
        } else {
            this.projectList = this.projects;
        }

        if (this.year && this.month) {
            this.projectList = this.projects.filter(f => {
                let date = new Date(f.endDate);
                if (this.year == date.getFullYear() && date.getMonth() == this.month)
                    return f;
            });
        }
        this.fillTable();
        this.fillStatusCount();
    }

    private _filterProjectsTypeByMenu() {
        if (this.moduleFilter == 'label') {
            this.projectTypes = this.projectTypes.filter(f => f.name != 'ArtistSale' && f.name != 'Event');
        } else if (this.moduleFilter == 'event') {
            this.projectTypes = this.projectTypes.filter(f => f.name == 'Event');
        } else if (this.moduleFilter == 'agency') {
            this.projectTypes = this.projectTypes.filter(f => f.name == 'ArtistSale');
        }
    }

    _prepareProjectTypes() {
        this.isWorking = true;
        const keys = Object.keys(EEntityProjectType).filter(key => !isNaN(Number(EEntityProjectType[key])));
        if (keys.length > 0) {
            this.projectTypes = [];
            keys.forEach((key: string) => {
                const id = EEntityProjectType[key];
                this.projectTypes.push(<IProjectType>{
                    id: id,
                    name: key,
                    description: '',
                    statusRecordId: 1,
                    pictureUrl: `assets/images/projects/icon-btn/100/${ProjectTypesString[id]}.png`,
                });
            });
        }
        this._filterProjectsTypeByMenu();
    }

    fillTable() {
        this.dataSource = new MatTableDataSource(this.projectList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
    }

    //#region API
    getProjects() {
        this.isWorking = true;
        this.apiService.get(EEndpoints.Projects).subscribe(
            (response: ResponseApi<IProject[]>) => {
                if (response.code == 100 && response.result.length) {
                    this.projects = response.result.filter(f => f.statusRecordId < 3);
                    this.projectList = this.projects;
                    this._filterProjects();
                    if (this.statusFilterUrl) {
                        this.filterByStatus(0, this.statusFilterUrl);
                    }
                }
                this.isWorking = false;
            }, (err) => this._responseError(err));
    }

    getProjectsMonth(month: number, year: number): void {
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectsAnalistics, { month: month, year: year }).subscribe(
            (response: ResponseApi<IProject[]>) => {
                if (response.code == 100 && response.result.length) {
                    this.projects = response.result.filter(f => f.statusRecordId < 3);
                    this._filterProjects();
                }
                this.isWorking = false;
            }, err => this._responseError(err)
        );
    }

    deleteProjectApi(id: number) {
        this.isWorking = true;
        this.apiService.delete(EEndpoints.Project, { id: id }).subscribe(
            (response: ResponseApi<boolean>) => {
                if (response.code == 100) {
                    this.projects = this.projects.filter(f => f.id !== id);
                    this._filterProjects();
                    this.toasterService.showToaster(this.translate.instant('messages.itemDeleted'));
                } else
                    this.toasterService.showToaster(this.translate.instant('errors.errorDeletingItem'));
                this.isWorking = false;
            }, err => this._responseError(err)
        );
    }

    //#endregion
}
