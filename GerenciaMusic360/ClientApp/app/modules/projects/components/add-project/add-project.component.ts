import { allLang } from '@i18n/allLang';
import { ApiService } from '@services/api.service';
import {
    Component,
    Inject,
    OnInit,
    Optional
} from '@angular/core';
import { EEndpoints } from '@enums/endpoints';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { IProject } from '@models/project';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ResponseApi } from '@models/response-api';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import {
    FormBuilder,
    FormGroup,
} from '@angular/forms';
import { IArtist, IProjectArtist } from '@models/artist';

@Component({
    selector: 'app-add-project',
    templateUrl: './add-project.component.html',
    styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

    projectId: number = 0;
    projectType: number = 0;
    projectTypeDesc: string = "";
    projectForm: FormGroup;
    isWorking: boolean = false;
    moduleFilter: string = '';

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private toaster: ToasterService,
        private translate: TranslateService,
        public dialogRef: MatDialogRef<AddProjectComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private translationLoaderService: FuseTranslationLoaderService,
    ) {
    }

    ngOnInit() {
        this.translationLoaderService.loadTranslations(...allLang);
        this.projectForm = this.fb.group({});
        this.projectId = this.data.projectId;
        this.projectType = this.data.projectType;
        this.projectTypeDesc = this.data.projectTypeDesc;
        if (this.data.moduleType != undefined) {
            this.moduleFilter = this.data.moduleType;
        }
    }

    //#region form
    get f() { return this.projectForm.controls; }

    bindExternalForm(controlName: string, form: FormGroup) {
        this.projectForm.setControl(controlName, form);
    }

    //#endregion

    saveProject() {
        let project = <IProject>this.f['generalData'].value;
        const artists = (project['selectedArtist']) ? project['selectedArtist'] : [];
        delete project.id;
        delete project['artistName'];
        delete project['selectedArtist']
        this.saveProjectApi(project, artists);
    }

    onNoClick(project: IProject = undefined): void {
        this.dialogRef.close(project);
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

    receiveProjectType($event: string) {
        this.projectTypeDesc = $event;
    }

    private responseError(error: any): void {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    }

    //#region API

    saveProjectApi(project: IProject, userList: IArtist[] = []): void {
        this.isWorking = true;
        this.apiService.save(EEndpoints.Project, project).subscribe(
            (response: ResponseApi<IProject>) => {
                if (response.code == 100) {
                    if (userList.length > 0) {
                        const projectArtists = this.prepareArtistProject(userList, response.result.id);
                        this.saveArtistProjectApi(projectArtists, response.result);
                    } else
                        this.onNoClick(response.result);
                } else {
                    this.toaster.showToaster(response.message);
                }
                this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    saveArtistProjectApi(artists: IProjectArtist[], project: IProject): void {
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectArtists, artists).subscribe(
            (response: ResponseApi<any>) => {
                this.onNoClick(project);
                this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    //#endregion
}