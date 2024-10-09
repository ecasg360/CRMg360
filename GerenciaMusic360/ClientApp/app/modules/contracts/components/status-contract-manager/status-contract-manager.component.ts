import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IContract } from '@models/contract';
import { IStatusModule } from '@models/StatusModule';
import { MatDialog, MatSliderChange } from '@angular/material';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { AddStatusContractComponent } from '../add-status-contract/add-status-contract.component';
import { IContractStatus } from '@models/contractStatus';
import * as _ from "lodash";
import { EModules } from '@enums/modules';

@Component({
  selector: 'app-status-contract-manager',
  templateUrl: './status-contract-manager.component.html',
  styleUrls: ['./status-contract-manager.component.scss']
})

export class StatusContractManagerComponent implements OnInit, OnChanges {

  @Input() contract: IContract = <IContract>{};

  isWorking: boolean;
  maxValueStatus: number;
  valueStatus: number;
  statusModule: IStatusModule[] = [];
  contractStatus: IContractStatus[] = [];
  currentStatus: IContractStatus = <IContractStatus>{};
  statusList = [];
  statusSelected = 0;

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private _translationLoaderService: FuseTranslationLoaderService
  ) {
    this._translationLoaderService.loadTranslations(...allLang);
    this.currentStatus = <IContractStatus>{
      id: 1,
      statusModule: <IStatusModule>{
        name: 'Enviado'
      }
    };
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (Object.values(changes.contract).length > 0) {
      this.getStatus();
    }
  }

  ngOnInit() { }

  sliderChange(event): void {
    /*
    const selectedStatusModule = this.statusModule[event.value - 1];
    if (selectedStatusModule.id == this.currentStatus.statusId) {
      return;
    }
    */
   if (this.currentStatus.statusId === parseInt(event.value)) {
     return;
   }

    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '600px',
      data: {
        text: this.translate.instant('messages.changeStatusContractsQuestion', { field: name }),
        action: this.translate.instant('general.confirm'),
        icon: 'save_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this.openDialogChangeStatus();
        else
          //this.valueStatus--;
          this.statusSelected = this.currentStatus.statusId;
      }
    });
  }

  openDialogChangeStatus(): void {
    let theIndex = 1;
    this.statusModule.forEach( (status, index) => {
      if (this.statusSelected == status.id) {
        theIndex = index;
      }
    });
    const dialogRef = this.dialog.open(AddStatusContractComponent, {
      width: '600px',
      data: {
        contractId: this.contract.id,
        statusModuleList: this.statusModule,
        selectedStatus: this.statusModule[theIndex]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result)
          this.getStatusContracts();
      } else
        //this.valueStatus--;
        this.statusSelected = this.currentStatus.statusId;
    });
  }

  private _responseError(error: any): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API
  getStatus(): void {
    this.isWorking = true;
    const params = { moduleId: EModules.Contract };
    this.apiService.get(EEndpoints.StatusByModule, params).subscribe(
      (response: ResponseApi<IStatusModule[]>) => {
        if (response.code == 100) {
          this.statusModule = response.result;
          this.statusList = this.statusModule;
          this.maxValueStatus = this.statusModule.length;
          this.valueStatus = 1;
          this.getStatusContracts();
        } else
          this.isWorking = false;
      }, (err) => this._responseError(err)
    );
  }

  getStatusContracts(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ContractStatusByContractId, { contractId: this.contract.id }).subscribe(
      (response: ResponseApi<IContractStatus[]>) => {
        if (response.code == 100) {
          this.contractStatus = response.result;
          this.valueStatus = this.contractStatus.length;
          this.currentStatus = _.maxBy(this.contractStatus, (x) => x.statusId);
          this.currentStatus.statusModule = this.statusModule.find(f => f.id == this.currentStatus.statusId);
          this.statusSelected = this.currentStatus.statusId;
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }
  //#endregion
}
