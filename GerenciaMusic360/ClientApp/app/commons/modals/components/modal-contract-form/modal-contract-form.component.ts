import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IContractType } from '@models/contractType';
import { IContract } from '@models/contract';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';

@Component({
  selector: 'app-modal-contract-form',
  templateUrl: './modal-contract-form.component.html',
  styleUrls: ['./modal-contract-form.component.scss']
})

export class ModalContractFormComponent implements OnInit {

  form: FormGroup;
  isWorking: boolean = false;
  contractTypes: IContractType[] = [];
  contractTypeSelected: IContractType = <IContractType>{};
  contract: IContract = <IContract>{};

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ModalContractFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private translationLoaderService: FuseTranslationLoaderService,
  ) {
    this.translationLoaderService.loadTranslations(...allLang);
    this._getContractType();
    this.form = this.fb.group({});
  }

  ngOnInit() {
    if (this.data && this.data.contract) {
      this.contract = this.data.contract;
    }
  }

  bindForm($event: FormGroup) {
    this.form = $event;
  }

  manageFormWork($event: boolean) {
    this.isWorking = $event;
  }

  get f() { return this.form.controls; }

  setContract(): void {
    if (this.form.valid) {
      this.contract = this.form.value;
      this.contract.id = 0;
      this.save();
    }
  }

  selectContractType(contractType: IContractType): void {
    this.contractTypeSelected = contractType;
    this.f.contractTypeId.setValue(contractType.id);
    this.f.localCompanyName.setValue(contractType.localCompanyName)
    this.f.localCompanyId.setValue(contractType.localCompanyId);
  }

  onNoClick(contract: IContract = undefined): void {
    this.dialogRef.close(contract);
  }

  private _responseError(error: any): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API

  save(): void {
    this.isWorking = true;
    this.apiService.save(EEndpoints.Contract, this.contract).subscribe(
      (response: ResponseApi<IContract>) => {
        if (response.code == 100) {
          this.onNoClick(response.result);
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _getContractType(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ContractTypes).subscribe(
      (response: ResponseApi<IContractType[]>) => {
        if (response.code == 100) {
          this.contractTypes = response.result;
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }
  //#endregion

}
