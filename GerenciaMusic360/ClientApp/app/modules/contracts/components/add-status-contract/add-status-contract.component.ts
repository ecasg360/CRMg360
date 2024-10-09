import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IStatusModule } from '@models/StatusModule';
import { SelectOption } from '@models/select-option.models';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-add-status-contract',
  templateUrl: './add-status-contract.component.html',
  styleUrls: ['./add-status-contract.component.scss']
})
export class AddStatusContractComponent implements OnInit {
  contractId: number;
  form: FormGroup;
  isWorking: boolean;
  status: SelectOption[] = [];
  statusModule: IStatusModule[] = [];
  selectedStatus: IStatusModule = <IStatusModule>{};

  constructor(
    public dialogRef: MatDialogRef<AddStatusContractComponent>,
    private apiService: ApiService,
    private toaster: ToasterService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.contractId = this.data.contractId;
    this.statusModule = <IStatusModule[]>this.data.statusModuleList;
    this.selectedStatus = <IStatusModule>this.data.selectedStatus;
    this.configureForm();
    this.getStatus();
  }

  configureForm(): void {
    this.form = this.formBuilder.group({
      contractId: [this.contractId],
      statusId: [this.selectedStatus.id],
      notes: ['']
    });
  }

  getStatus(): void {
    this.isWorking = true;
    if (this.statusModule.length > 0) {
      this.status = this.statusModule.map((m: IStatusModule) => ({
        value: m.id,
        viewValue: m.name
      }));
    }
    this.isWorking = false;
  }

  get f() { return this.form.controls; }

  set(): void {
    if (this.form.valid) {
      this.save();
    }
  }

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }

  private _responseError(err: any) {
    this.isWorking = false;
    this.toaster.showToaster(err);
  }

  save(): void {
    this.isWorking = true;
    this.apiService.save(EEndpoints.ContractStatus, this.form.value).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.dialogRef.close(true);
        } else {
          this.toaster.showToaster('Error: ' + response.message);
          //this.onNoClick();
        }
        this.isWorking = false;
      }, (err) => this._responseError(err)
    );
  }
}
