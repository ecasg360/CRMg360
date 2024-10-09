import { Component, OnInit } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IProject } from '@models/project';
import { ProjectTask } from '@models/project-task';
import { fuseAnimations } from '@fuse/animations';
import { ProjectTaskDetail } from '@models/project-task';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  animations: fuseAnimations,
})
export class ProjectDetailComponent implements OnInit {

  projectId: number;
  project: IProject = <IProject>{};
  projectTaskList: ProjectTaskDetail[] = [];

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private _translationLoaderService: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this._translationLoaderService.loadTranslations(...allLang);
    this.projectId = this.route.snapshot.params.projectId;
    if (!this.projectId) {
      this.router.navigate(['projects']);
    } else {
      this.getProjectApi();
      this.getTaskProject();
    }
  }

  private _responseError(err): void {
    console.log(err);
    this.toaster.showTranslate('general.errors.serverError');
  }

  //#region API
  getProjectApi(): void {
    this.apiService.get(EEndpoints.Project, { id: this.projectId }).subscribe(
      (response: ResponseApi<IProject>) => {
        if (response.code == 100) {
          this.project = response.result;
        } else {
          this.toaster.showToaster(response.message);
          this.router.navigate(['projects']);
        }
      }, (err) => this._responseError(err)
    )
  }

  getTaskProject(): void {
    this.apiService.get(EEndpoints.ProjectTasksByProject, { projectId: this.projectId }).subscribe(
      (response: ResponseApi<ProjectTask[]>) => {
        if (response.code == 100) {
          this.projectTaskList = response.result.map((m: ProjectTask) => {
            const dateVerfication = new Date(m.estimatedDateVerfication);
            const detail = <ProjectTaskDetail>m;
            detail.year = dateVerfication.getFullYear();
            detail.day = dateVerfication.getDate();
            detail.weekDay = dateVerfication.getDay();
            detail.month = (dateVerfication.getMonth() + 1);
            return detail;
          });
        }
      }, err => this._responseError(err)
    );
  }

  //#endregion
}
