import { Component, OnInit, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { IPerson } from '@models/person';
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from "@services/api.service";
import { ResponseApi } from '@models/response-api';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IWorkCollaborator } from '@models/work-collaborator';
import { SelectOption } from '@models/select-option.models';
import { IProjectWorkAdmin } from '@models/projectWorkAdmin';
import { IEditor } from '@models/editor';

@Component({
  selector: 'app-add-work-admin',
  templateUrl: './add-work-admin.component.html',
  styleUrls: ['./add-work-admin.component.scss']
})
export class AddWorkAdminComponent implements OnInit {
  @Output() formReady = new EventEmitter<FormGroup>();
  isWorking:boolean = false;
  editors: SelectOption[] = [];
  Form: FormGroup;
  model: IProjectWorkAdmin = <IProjectWorkAdmin>{};
  itemName: string = "";
  workId: number = 0;
  projectWorkId: number = 0;
  percentagePending:number = 100;

  action: string = this.translate.instant('general.save');

  constructor(
    public dialogRef: MatDialogRef<AddWorkAdminComponent>,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
  ) { }

  ngOnInit() {
    this.getEditors();
    this.workId = this.actionData.workId;
    this.projectWorkId = this.actionData.projectWorkId;
    this.percentagePending = this.actionData.percentagePending;
    this.itemName = this.actionData.itemName;
    
    this.configureComposerForm();
  }

  private configureComposerForm(): void {
    this.Form = this.formBuilder.group({      
      projectWorkId: [this.projectWorkId],
      workId: [this.workId],
      editorId: [0],
      percentage: [0, [Validators.required, Validators.max(this.percentagePending)]]
    });

    this.formReady.emit(this.Form);
  }

  getEditors():void{    
    this.isWorking = true;
    this.ApiService.get(EEndpoints.Editors).subscribe(
      (response: ResponseApi<IEditor[]>) => {
        if (response.code == 100)
        console.log(response.result);
          this.editors = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.dba,
            }
          });
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  save() {
    if (this.Form.valid) {
      this.isWorking = true;
      this.ApiService.save(EEndpoints.ProjectWorkAdmin, this.Form.value).subscribe(
        data => {
          if (data.code == 100) {
            this.toasterService.showToaster(this.translate.instant('composer.messages.saved'));
            this.onNoClick(true);
          } else
            this.toasterService.showToaster(data.message);
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
    }    
  }  

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

}
