import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectOption } from '@models/select-option.models';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { ProjectUser } from '@models/user';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-project-member-data',
  templateUrl: './project-member-data.component.html',
  styleUrls: ['./project-member-data.component.scss']
})
export class ProjectMemberDataComponent implements OnInit {

  memberDataForm: FormGroup;
  member: ProjectUser = <ProjectUser>{};
  isWorking = false;
  projectRolesList: SelectOption[] = [];
  action: string;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private _translationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    public dialogRef: MatDialogRef<ProjectMemberDataComponent>,
    private toaster: ToasterService,
    private apiService: ApiService) { }

  ngOnInit() {
    this._translationLoaderService.loadTranslations(...allLang);
    this.member = <ProjectUser>this.actionData.user;
    this.projectRolesList = <SelectOption[]>this.actionData.projectRoles;
    this.action = this.actionData.action;
    this.initForm();
  }

  //#region form

  initForm() {
    if (this.member.projectRoleId == 0)
      this.member.projectRoleId = undefined;

    this.memberDataForm = this.fb.group({
      projectRol: [this.member.projectRoleId, Validators.required],
    });
  }

  get f() { return this.memberDataForm.controls; }

  //#endregion

  addMember(): void {
    this.isWorking = true;
    this.member.projectRoleId = this.f['projectRol'].value;
    this.member.rolName = this.projectRolesList.find(f => f.value == this.member.projectRoleId).viewValue;
    const params = {
      userId: this.member.id,
      projectRoleId: this.member.projectRoleId,
      projectId: this.member.projectId,
    };
    this.bindProjectMemberApi(params);
  }

  onNoClick(userProject: ProjectUser = undefined): void {
    this.dialogRef.close(userProject);
  }

  private _responseError(err: HttpErrorResponse) {
    console.log(err);
    this.isWorking = false;
  }

  //#region API

  bindProjectMemberApi(params: any) {
    if (this.action == 'add')
      this.saveMemberApi(params);
    else
      this.updateMemberApi(params);
  }

  saveMemberApi(params: any) {
    this.apiService.save(EEndpoints.ProjectMemberRelation, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.onNoClick(this.member);
        } else {
          this.onNoClick();
        }
      }, err => this._responseError(err)
    );
  }

  updateMemberApi(params: any) {
    this.apiService.update(EEndpoints.ProjectMemberRelation, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.onNoClick(this.member);
        } else {
          this.onNoClick();
        }
      }, err => this._responseError(err)
    );
  }

  //#endregion
}
