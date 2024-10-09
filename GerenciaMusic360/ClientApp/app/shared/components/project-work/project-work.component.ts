import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from '@models/response-api';
import { IProjectWork } from '@models/project-work';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { AddProjectWorkComponent } from './add-project-work/add-project-work.component';
import { IProject } from '@models/project';
import { AddAlbumReleaseComponent } from './add-album-release/add-album-release.component';
import { MatDialog } from '@angular/material';
import { IWorkCollaborator } from '@models/work-collaborator';
import { AddComposerComponent } from './add-composer/add-composer.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { AddWorkAdminComponent } from './add-work-admin/add-work-admin.component';
import { Work } from '@models/work';

@Component({
  selector: 'app-project-work',
  templateUrl: './project-work.component.html',
  styleUrls: ['./project-work.component.css']
})
export class ProjectWorkComponent implements OnInit {
  
  @Input() projectId:number = 0;
  @Input() project:IProject = <IProject>{};
  @Input() perm: any = {};

  isWorking: boolean = false;
    projectWorks: IProjectWork[] = [];

  constructor(
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.getProjectWorks();
  }

  getProjectWorks():void{
    //aca debo llamar a las categorias del proyecto
    this.isWorking = true;
    this.ApiService.get(EEndpoints.ProjectWorks, { projectId: this.projectId }).subscribe(
      (response: ResponseApi<IProjectWork[]>) => {
        if (response.code == 100)
          this.projectWorks = response.result;
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  showModalComposerForm(workId:number, itemName:string, percentagePending:number, model: IWorkCollaborator = <IWorkCollaborator>{}): void {
    model.workId = workId;
    const dialogRef = this.dialog.open(AddComposerComponent, {
      width: '700px',
      data: {
        workCollaborator: model,
        itemName: itemName,
        percentagePending: percentagePending,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProjectWorks();
      }
    });
  }

  showModalWorkAdminForm(workId:number, itemId:number, itemName:string, percentagePending:number): void {
    const dialogRef = this.dialog.open(AddWorkAdminComponent, {
      width: '700px',
      data: {
        workId: itemId,
        projectWorkId:  workId,
        itemName: itemName,
        percentagePending: percentagePending,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProjectWorks();
      }
    });
  }

  confirmDeleteWork(workId: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this.deleteWork(this.projectId, workId);
      }
    });
  }

  deleteWork(projectId:number, workId:number) {
    this.isWorking = true;
    const params = [];
    params['projectId'] = projectId;
    params['workId'] = workId;
    this.ApiService.delete(EEndpoints.DeleteProjectWork, params)
      .subscribe(data => {
        if (data.code == 100) {
          this.getProjectWorks();
          this.toasterService.showToaster(this.translate.instant('projectWork.work.messages.deleteSuccess'));
        } else {
          this.toasterService.showToaster(data.message);
        }
      }, (err) => {
        this.responseError(err);
      });
  }


  confirmDelete(workId: number, composerId: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this.deleteComposerToWork(workId, composerId);
      }
    });
  }

  deleteComposerToWork(workId:number, composerId:number) {
    this.isWorking = true;
    const params = [];
    params['workId'] = workId;
    params['composerId'] = composerId;
    this.ApiService.delete(EEndpoints.WorkCollaborator, params)
      .subscribe(data => {
        if (data.code == 100) {
          this.getProjectWorks();
          this.toasterService.showToaster(this.translate.instant('composer.messages.deleteSuccess'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => {
        this.responseError(err);
      });
  }

  confirmDeleteWorkAdmin(id: number, name:string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this.deleteComposerToWorkAdmin(id);
      }
    });
  }

  deleteComposerToWorkAdmin(id: number) {
    this.isWorking = true;
    const params = [];
    params['id'] = id;    
    this.ApiService.delete(EEndpoints.ProjectWorkAdmin, params)
      .subscribe(data => {
        if (data.code == 100) {
          this.getProjectWorks();
          this.toasterService.showToaster(this.translate.instant('projectWork.messages.deleteSuccess'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => {
        this.responseError(err);
      });
  }

  addData() {
    this.isWorking = true;
    let component: any = AddProjectWorkComponent;
    if (this.project.projectTypeId === 1) { //album release
      component = AddAlbumReleaseComponent;
    }
    const dialogRef = this.dialog.open(component, {
      width: '1000px',
      data: {
        projectId: this.projectId,
        projectTypeId: this.project.projectTypeId,
        artistId: this.project.artistId,
        projectWorks: this.projectWorks,
        project: this.project
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProjectWorks();
      }
    });
    this.isWorking = false;
  }

  editWork(workId:number, projectWorkId: number, projectWork: IProjectWork = <IProjectWork>{}){
    this.isWorking = true;
    let component: any = AddProjectWorkComponent;
    if (this.project.projectTypeId === 1) { //album release
      component = AddAlbumReleaseComponent;
    }
    const dialogRef = this.dialog.open(component, {
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
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProjectWorks();
      }
    });
    this.isWorking = false;
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
