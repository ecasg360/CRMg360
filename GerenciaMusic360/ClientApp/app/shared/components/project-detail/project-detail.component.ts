import { Component, OnInit, Input, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponseApi } from '@models/response-api';
import { IProject } from '@models/project';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  @Input() projectId: number = 0;

  project: IProject = <IProject>{};

  isWorking: boolean = false;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ProjectDetailComponent>,
  ) { }

  ngOnInit() {
    this.projectId = this.actionData.projectId;
    if(this.projectId > 0){
      this.getProjectDetail();
    }
  }

  private getProjectDetail(): void {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.Project, { id: this.projectId }).subscribe(
      (response: ResponseApi<IProject>) => {
        console.log(response);
        if (response.code == 100) {
          this.project = response.result;
        }
        this.isWorking = false;
      }
      , err => this.responseError(err)
    )
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
