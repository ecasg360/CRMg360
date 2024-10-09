import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { SelectOption } from '@models/select-option.models';
import { IContract } from '@models/contract';
import { MatDialog } from '@angular/material';
import { ProjectDetailComponent } from '@shared/components/project-detail/project-detail.component';
import { allLang } from '@i18n/allLang';

@Component({
  selector: 'app-contract-data',
  templateUrl: './contract-data.component.html',
  styleUrls: ['./contract-data.component.scss']
})

export class ContractDataComponent implements OnInit, OnChanges {

  @Input() contractId: number = 0;
  @Input() contract: IContract = <IContract>{};

  form: FormGroup;
  isWorking: boolean;
  times: SelectOption[] = [];
  currencies: SelectOption[] = [];
  initDate: Date = new Date(2000, 0, 1);
  endDate: Date = new Date(2120, 0, 1);

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private _translationLoaderService: FuseTranslationLoaderService,
    public dialog: MatDialog,
  ) {
    this._translationLoaderService.loadTranslations(...allLang);
    this.form = this.fb.group({});
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.contract) {
      if (Object.keys(changes.contract.currentValue).length == 0)
        this.getContract();
    }
  }

  ngOnInit() {
  }

  get f() { return this.form.controls; }

  bindForm($event: FormGroup) {
    this.form = $event;
  }

  manageFormWork($event: boolean) {
    this.isWorking = $event;
  }

  showProjectDetail(projectId: number = 0): void {
    const dialogRef = this.dialog.open(ProjectDetailComponent, {
      width: '700px',
      data: {
        projectId: projectId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Confirm");
      }
      console.log("cancel");
    });
  }

  private responseError(error: any): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API
  save(): void {
    this.isWorking = true;
    this.apiService.update(EEndpoints.Contract, this.form.value).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100)
          this.toaster.showTranslate('messages.itemSaved');
        else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  getContract() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Contract, { id: this.contractId }).subscribe(
      (response: ResponseApi<IContract>) => {
        if (response.code == 100) {
          this.contract = response.result;
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  //#endregion
}
