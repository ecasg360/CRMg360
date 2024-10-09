import { Component, OnInit, Optional, Inject } from "@angular/core";
import { ApiService } from "@services/api.service";
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { EEndpoints } from "@app/core/enums/endpoints";
import { ResponseApi } from "@shared/models/response-api";
import { SelectOption } from "@shared/models/select-option.models";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatCheckboxChange } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { IContractType } from "@models/contractType";
import { ITemplateContractDocumentMarker } from "@models/templateContractDocumentMarker";

@Component({
  selector: 'app-add-marker',
  templateUrl: './add-marker.component.html',
  styleUrls: ['./add-marker.component.scss']
})
export class AddMarkerComponent implements OnInit {
  id: number = 0;
  titleAction: string;
  action: string;  
  form: FormGroup;
  isWorking: boolean = true; 
  templateContractDocumentId: number = 0;
  constructor(
    public dialogRef: MatDialogRef<AddMarkerComponent>,
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,) { }

  ngOnInit() {
    this.titleAction = this.translate.instant('settings.addmarker.title');
    this.id = this.actionData.id;
    this.templateContractDocumentId = this.actionData.templateContractDocumentId;
    this.configureForm();
    if (this.id == 0) {
      this.isWorking = false;
      this.titleAction = this.translate.instant('settings.addmarker.saveTitle');
      this.action = this.translate.instant('general.save');
    } else {
      this.titleAction = this.translate.instant('settings.addmarker.editTitle');
      this.action = this.translate.instant('general.save');
      //this.getContractType();
    }
  }

  get f() { return this.form.controls; }
  
  private configureForm(): void {
      this.form = this.formBuilder.group({
        templateContractDocumentId: [this.templateContractDocumentId, [
            Validators.required            
        ]],
        marker: ['', [Validators.required]]        
      });
  }

  set(): void {
    if (this.form.valid) {
      this.isWorking = true;
      if (this.id == 0) {
        this.save();
      } else {
        
        this.update();
      }
    }
}

  save(): void {
    this.ApiService.save(EEndpoints.ContractType, this.form.value)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick(true);
            this.toasterService.showToaster(this.translate.instant('settings.addmarker.messages.saved'));
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  update(): void {
      this.form.value.id = this.id;
      this.ApiService.update(EEndpoints.ContractType, this.form.value)
        .subscribe(data => {
          if (data.code == 100) {
            this.onNoClick(true);
            this.toasterService.showToaster(this.translate.instant('settings.contractType.messages.saved'));
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
        )
  }

  private populateForm(data: ITemplateContractDocumentMarker): void {
    Object.keys(this.form.controls).forEach(name => {
        if (this.form.controls[name]) {
            this.form.controls[name].patchValue(data[name]);
        }
    });
    this.id = data.id;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
