import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { IUser, ProjectUser } from '@models/user';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '@services/api.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { allLang } from '@i18n/allLang';
import { startWith, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '@services/toaster.service';
import { SelectOption } from '@models/select-option.models';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-project-members-image',
  templateUrl: './project-members-image.component.html',
  styleUrls: ['./project-members-image.component.scss']
})

export class ProjectMembersImageComponent implements OnInit {

  @Input() projectId: number;
  selectedMembersList: ProjectUser[] = [];

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.getMembersProjectApi();
  }

  private _responseError(err: HttpErrorResponse) {
    console.log(err);
  }

  //#region API
  getMembersProjectApi() {
    this.apiService.get(EEndpoints.ProjectMembersByProject, { projectId: this.projectId }).subscribe(
      (response: ResponseApi<any[]>) => {
        if (response.code == 100)
          this.selectedMembersList = response.result;
      }, err => this._responseError(err)
    );
  }
}
