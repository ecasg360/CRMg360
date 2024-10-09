import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ProjectTask } from '@models/project-task';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';

@Component({
  selector: 'app-project-task-complete',
  templateUrl: './project-task-complete.component.html',
  styleUrls: ['./project-task-complete.component.scss']
})
export class ProjectTaskCompleteComponent implements OnInit {

  model: ProjectTask = <ProjectTask>{};
  isWorking: boolean = false;

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ProjectTaskCompleteComponent>,
    private translationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private toaster: ToasterService,
  ) { }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.model = <ProjectTask>this.data.model;
  }

  onNoClick(task: ProjectTask = undefined): void {
    this.dialogRef.close(task);
  }

  setTaskData() {
    const params = {
      id: this.model.id,
      notes: this.model.notes
    }
    this.apiMarkComplete(params);
  }

  private apiMarkComplete(params: any) {
    this.apiService.save(EEndpoints.ProjectTaskComplete, params).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this.onNoClick(this.model);
          this.toaster.showTranslate('messages.statusChanged');
        }
        else {
          this.toaster.showTranslate('general.errors.requestError');
          this.onNoClick(undefined);
        }
      }, err => this.toaster.showTranslate('general.errors.requestError')
    );
  }
}
