import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IUser, ProjectUser } from '@models/user';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '@services/api.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { allLang } from '@i18n/allLang';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatTableDataSource, MatRadioChange, MatDialog } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectMemberDataComponent } from './project-member-data/project-member-data.component';
import { ToasterService } from '@services/toaster.service';
import { SelectOption } from '@models/select-option.models';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-project-members-manager',
  templateUrl: './project-members-manager.component.html',
  styleUrls: ['./project-members-manager.component.scss']
})
export class ProjectMembersManagerComponent implements OnInit, OnChanges {

  @Input() projectId: number;
  @Input() listMode: boolean = false;

  membersList: ProjectUser[] = [];
  selectedMembersList: ProjectUser[] = [];
  membersCtrl = new FormControl();
  filteredOptions: Observable<IUser[]>;
  projectRolesList: SelectOption[] = [];
  isWorking: boolean = false;

  constructor(
    public dialog: MatDialog,
    private toaster: ToasterService,
    private apiService: ApiService,
    private translate: TranslateService,
    private _fuseTranslationLoader: FuseTranslationLoaderService,
  ) {
    this.getProjectRolesApi();
  }

  ngOnInit() {
    this._fuseTranslationLoader.loadTranslationsList(allLang);
    this.filteredOptions = this.membersCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const projectId = changes.projectId;
    if (projectId.currentValue != undefined || projectId.currentValue > 0) {
      this.getUsersApi();
    }
  }

  autoCompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
    const userId = parseInt($event.option.id);
    const existUser = this.selectedMembersList.find(f => f.id == userId);
    if (!existUser) {
      const user = this.membersList.find(f => f.id == userId);
      user.projectRoleId = 0;
      user.projectId = this.projectId;
      this.showModalForm('add', user);
    }
    this.membersCtrl.setValue('');
  }

  showModalForm(action: string, projectUser: ProjectUser): void {
    this.isWorking = true;
    const dialogRef = this.dialog.open(ProjectMemberDataComponent, {
      width: '500px',
      data: {
        user: projectUser,
        action: action,
        projectRoles: this.projectRolesList
      }
    });
    dialogRef.afterClosed().subscribe((projectUser: ProjectUser) => {
      if (projectUser !== undefined) {
        this.getMembersProjectApi();
      }
    });
    this.isWorking = false;
  }

  confirmDelete(id: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm) {
          const params = {
            projectId: this.projectId,
            userId: id
          };
          this.deleteMemberProjectApi(params);
        }
      }
    });
  }

  private _filter(value: string): IUser[] {
    const filterValue = value.toLowerCase();
    return this.membersList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _responseError(err: HttpErrorResponse) {
    console.log(err);
    this.isWorking = false;
  }

  //#region API

  getUsersApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Users).subscribe(
      (response: ResponseApi<IUser[]>) => {
        if (response.code == 100) {
          this.membersList = <ProjectUser[]>response.result;
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  getProjectRolesApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Types, { typeId: 6 }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.projectRolesList = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });
          this.getMembersProjectApi();
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  getMembersProjectApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ProjectMembersByProject, { projectId: this.projectId }).subscribe(
      (response: ResponseApi<any[]>) => {
        if (response.code == 100) {
          this.selectedMembersList = response.result.map(m => {
            m.rolName = this.projectRolesList.find(f => f.value == m.projectRoleId).viewValue;
            return m;
          });
        } else
          this.toaster.showToaster('Error obteniendo los miembros del proyecto');
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  deleteMemberProjectApi(params: any) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.ProjectMemberRelation, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100)
          this.selectedMembersList = this.selectedMembersList.filter(f => f.id != params.userId);
        else
          this.toaster.showToaster('Error eliminando miembro');
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  //#endregion
}
