import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { IMarketing } from '@models/marketing';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { MatDatepickerInputEvent } from '@angular/material';
import { ApiService } from '@services/api.service';
import { IProject } from '@models/project';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ToasterService } from '@services/toaster.service';
import { IConfigMarketingTemplates } from '@models/config-marketing-templates';

@Component({
  selector: 'app-campain-form',
  templateUrl: './campain-form.component.html',
  styleUrls: ['./campain-form.component.scss']
})
export class CampainFormComponent implements OnInit, OnDestroy, OnChanges {

  @Input() marketing: IMarketing = <IMarketing>{};
  @Output() formReady = new EventEmitter<FormGroup>();

  marketingForm: FormGroup;
  disableDate: boolean = true;
  initDate: Date = new Date(2000, 0, 1);
  endDate: Date = new Date(2220, 0, 1);
  projects: IProject[] = [];
  langList: IConfigMarketingTemplates[] = [];

  constructor(
    private translationLoader: FuseTranslationLoaderService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toaster: ToasterService,
  ) { }

  ngOnInit() {
    this.translationLoader.loadTranslations(...allLang);
    this._getProjects();
    this._getLangs();
    this.configureForm();
  }

  ngOnDestroy(): void {
    this.formReady.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const marketing = changes.marketing;
    if (marketing) {
      this.configureForm();
    }
  }

  //#region form
  get f() { return this.marketingForm.controls; }

  private configureForm(): void {
    const initDate = (this.marketing.startDateString)
      ? (new Date(this.marketing.startDateString)).toISOString() : null;

    const endDateString = (this.marketing.endDateString)
      ? (new Date(this.marketing.endDateString)).toISOString() : null;

    this.marketingForm = this.formBuilder.group({
      id: [this.marketing.id, []],
      name: [this.marketing.name, [
        Validators.required,
        Validators.maxLength(450),
        Validators.minLength(3),
      ]],
      generalInformation: [this.marketing.generalInformation, [
        Validators.required,
        Validators.maxLength(450),
        Validators.minLength(3),
      ]],
      descriptionKeyIdeas: [this.marketing.descriptionKeyIdeas, [
        Validators.required,
        Validators.maxLength(450),
        Validators.minLength(3),
      ]],
      descriptionHeaderPlan: [this.marketing.descriptionHeaderPlan, [
        Validators.required,
        Validators.maxLength(450),
        Validators.minLength(3),
      ]],
      descriptionHeaderOverviewMaterial: [this.marketing.descriptionHeaderOverviewMaterial, [
        Validators.required,
        Validators.maxLength(450),
        Validators.minLength(3),
      ]],
      startDateString: [initDate, [Validators.required,]],
      endDateString: [endDateString/*, [Validators.required,]*/],
      projectId: [this.marketing.projectId/*, [Validators.required,]*/],
      created: [this.marketing.created],
      fileId: [this.marketing.fileId, [Validators.required,]],
    });

    if (initDate)
      this.initDate = new Date(initDate);

    if (endDateString)
      this.endDate = new Date(endDateString);

    this.formReady.emit(this.marketingForm);
  }

  //#endregion

  dateChangeEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (type == 'init') {
      if (event.value) {
        this.initDate = new Date(event.value);
        this.f['endDateString'].enable();
      } else {
        this.f['endDateString'].disable();
      }
    } else {
      if (event.value) {
        this.endDate = new Date(event.value);
      }
    }
  }

  private _responseError(error: any): void {
    this.toaster.showTranslate('general.errors.serverError');
  }

  //#region api
  private _getProjects() {
    this.apiService.get(EEndpoints.Projects).subscribe(
      (response: ResponseApi<IProject[]>) => {
        if (response.code == 100)
          this.projects = response.result;
        else
          this.toaster.showTranslate('general.errors.requestError');
      }, err => this._responseError(err)
    )
  }

  private _getLangs() {
    this.apiService.get(EEndpoints.ConfigMarketingTemplates).subscribe(
      (response: ResponseApi<IConfigMarketingTemplates[]>) => {
        if (response.code == 100)
          this.langList = response.result.map(m => {
            if (!this.marketing.fileId && m.isDefault)
              this.f.fileId.patchValue(m.templateFileId);
            return m;
          });
        else
          this.toaster.showTranslate('general.errors.requestError');
      }, err => this._responseError(err)
    )
  }
  //#endregion

}
