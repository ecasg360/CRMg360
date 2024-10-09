import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { IMarketing } from '@models/marketing';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';

@Component({
  selector: 'app-campain-form-modal',
  templateUrl: './campain-form-modal.component.html',
  styleUrls: ['./campain-form-modal.component.scss']
})
export class CampainFormModalComponent implements OnInit {

  addMarketingForm: FormGroup;
  isWorking: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toaster: ToasterService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<CampainFormModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private translationLoaderService: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.addMarketingForm = this.fb.group({});
  }

  //#region form
  get f() { return this.addMarketingForm.controls; }

  bindExternalForm(controlName: string, form: FormGroup) {
    this.addMarketingForm.setControl(controlName, form);
  }

  //#endregion

  saveMarketing() {
    let marketing = <IMarketing>this.f['marketing'].value;
    delete marketing.id;
    delete marketing.created;

    this.saveMarketingApi(marketing);
  }

  onNoClick(project: IMarketing = undefined): void {
    this.dialogRef.close(project);
  }

  private _responseError(error: any): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API

  saveMarketingApi(marketing: IMarketing): void {
    this.isWorking = true;
    this.apiService.save(EEndpoints.Marketing, marketing).subscribe(
      (response: ResponseApi<IMarketing>) => {
        if (response.code == 100)
          this.onNoClick(<IMarketing>response.result);
        else
          this.toaster.showToaster(response.message);

        this.isWorking = false;
      }, (err) => this._responseError(err)
    );
  }

  //#endregion
}
