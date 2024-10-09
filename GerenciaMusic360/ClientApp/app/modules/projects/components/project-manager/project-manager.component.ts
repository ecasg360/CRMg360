import { Component, OnInit } from "@angular/core";
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from "@models/response-api";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from '@angular/forms';
import { ICurrency } from "@models/currency";
import { ProjectTask } from "@models/project-task";
import { IProject } from "@models/project";
import { fuseAnimations } from '@fuse/animations';
import { EEventType } from '@enums/modules-types';
import { IArtist, IProjectArtist } from "@models/artist";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import { ComponentsComunicationService } from "@services/components-comunication.service";

@Component({
    selector: 'app-project-manager',
    templateUrl: './project-manager.component.html',
    styleUrls: ['./project-manager.component.scss'],
    animations: fuseAnimations
})
export class ProjectManagerComponent implements OnInit {

    projectTypeId: number = 0;
    projectId: number = 0;
    project: IProject = <IProject>{};
    addProjectForm: FormGroup;
    id: number = 0;
    titleAction: string;
    action: string;
    isWorking: boolean = true;
    saveAction: boolean = false;
    projectContacts: any[] = [];
    currencies: ICurrency[] = [];
    taskList: ProjectTask[] = [];
    eventType = EEventType;
    budgetLabel: string;
    tabBudgetLabel: string;
    perm: any = {};

    constructor(
        private toaster: ToasterService,
        private apiService: ApiService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private comunication: ComponentsComunicationService,
        private _translationLoaderService: FuseTranslationLoaderService,
    ) {
        this.perm = this.route.snapshot.data;
        this._translationLoaderService.loadTranslations(...allLang);
    }

    ngOnInit() {
        this.budgetLabel = this.translate.instant('general.budget');
        this.tabBudgetLabel = this.translate.instant('general.budgetAndTravel');
        this.projectId = this.route.snapshot.params.projectId;
        this.projectTypeId = this.route.snapshot.params.projectTypeId;
        this.addProjectForm = this.fb.group({});
        if (!this.projectId) {
            this.router.navigate(['projects']);
        }
        this.getProjectApi();
    }

    get f() { return this.addProjectForm.controls; }

    bindExternalForm(controlName: string, form: FormGroup) {
        this.addProjectForm = this.fb.group({});
        this.addProjectForm.setControl(controlName, form);
    }

    goBack($event) {
        if (window.history.state.navigationId <= 1)
            this.router.navigate(['/projects']);
        else
            window.history.back();
        return;
    }

    private prepareArtistProject(userList: IArtist[], projectId: number): IProjectArtist[] {
        const artists = [];
        userList.forEach((value: IArtist) => {
            artists.push({
                projectId: projectId,
                guestArtistId: value.id
            });
        });
        return artists;
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
        }, err => this.responseError(err));
    }

    private _formatLabel() {
        if (this.projectTypeId == 5 || this.projectTypeId == 6) {
            this.budgetLabel = this.translate.instant('general.expenses');
            this.tabBudgetLabel = this.translate.instant('general.expenseAndTravel');
        }
    }

    private responseError(error: any): void {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    }

    //#region API

    update(): void {
        this.isWorking = true;
        this.saveAction = true;
        let project = <IProject>Object.assign({},this.f['generalData'].value);
        const artists = (project['selectedArtist']) ? project['selectedArtist'] : [];
        delete project['artistName'];
        delete project['selectedArtist'];

        this.apiService.update(EEndpoints.Project, project).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showTranslate("messages.itemUpdated");
                    if (artists.length > 0) {
                        const projectArtists = this.prepareArtistProject(artists, response.result.id);
                        this.deleteArtistProjectApi(projectArtists, project.id);
                    } else
                        this.isWorking = false;
                    this.project = response.result;
                    console.log(response.result);
                    this.comunication.notifyProjectChange(response.result);
                } else {
                    this.toaster.showTranslate("errors.errorEditingItem");
                    this.isWorking = false;
                }
            }, (err) => this.responseError(err)
        )
    }

    saveArtistProjectApi(artists: IProjectArtist[]): void {
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectArtists, artists).subscribe(
            (response: ResponseApi<any>) => {
                this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    deleteArtistProjectApi(artists: IProjectArtist[], projectId: number): void {
        this.isWorking = true;
        this.apiService.delete(EEndpoints.ProjectArtists, { projectId: projectId }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100)
                    this.saveArtistProjectApi(artists);
                else
                    this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    getProjectApi(): void {
        this.isWorking = true;
        this.apiService.get(EEndpoints.Project, { id: this.projectId }).subscribe(
            (response: ResponseApi<IProject>) => {
                if (response.code == 100) {
                    this.project = response.result;
                    this.projectTypeId = response.result.projectTypeId;
                    this._formatLabel();
                } else {
                    this.toaster.showToaster(response.message);
                    this.router.navigate(['projects']);
                }
                this.isWorking = false;
            }, (err) => this.responseError(err)
        )
    }

    getCurrencies(): void {
        this.apiService.get(EEndpoints.Currencies).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.currencies = response.result.map((s: any) => ({
                        value: s.id,
                        viewValue: s.code
                    }));
                }
            }, (err) => this.responseError(err)
        );
    }
    //#endregion
}