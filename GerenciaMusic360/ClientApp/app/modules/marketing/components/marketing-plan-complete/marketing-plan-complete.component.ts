import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EEndpoints } from '@enums/endpoints';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { IMarketingPlan } from '@models/marketing-plan';
import { ResponseApi } from '@models/response-api';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-marketing-plan-complete',
  templateUrl: './marketing-plan-complete.component.html',
  styleUrls: ['./marketing-plan-complete.component.scss']
})
export class MarketingPlanCompleteComponent implements OnInit {

  model: IMarketingPlan = <IMarketingPlan>{};
  isWorking: boolean = false;

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<MarketingPlanCompleteComponent>,
    private translationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private toaster: ToasterService,
  ) { }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.model = <IMarketingPlan>this.data.model;
  }

  onNoClick(task: IMarketingPlan = undefined): void {
    this.dialogRef.close(task);
  }

  setTaskData() {
    const params = {
      id: this.model.id,
      notes: this.model.notes
    }
    this.apiMarkComplete(params);
  }

  private apiMarkComplete(params: any) {
    this.apiService.save(EEndpoints.MarketingPlanComplete, params).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this.onNoClick(this.model);
          this.toaster.showTranslate('messages.statusChanged');
        }
        else {
          this.toaster.showTranslate('general.errors.requestError');
          this.onNoClick(undefined);
        }
      }, err => this.toaster.showTranslate('general.errors.requestError')
    );
  }
}