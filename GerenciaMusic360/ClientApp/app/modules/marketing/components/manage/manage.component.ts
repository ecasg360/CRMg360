import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { IMarketing, IMarketingDates } from '@models/marketing';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEventType } from '@enums/modules-types';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ActivatedRoute } from '@angular/router';
import { IProject } from '@models/project';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  animations: fuseAnimations
})
export class ManageComponent implements OnInit {

  backgroundImg: any;
  isEdit: boolean = false;
  addMarketingForm: FormGroup;
  isWorking: boolean = false;
  isUploading: boolean = false;
  eventType = EEventType;
  marketing: IMarketing = <IMarketing>{};
  project: IProject = <IProject>{};
  formatStartDate: IMarketingDates = <IMarketingDates>{};
  formatEndDate: IMarketingDates = <IMarketingDates>{};
  file: any;
  filename: string;
  isChangeImage: boolean = false;
  marketingId: string;
  perm: any = {};

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toaster: ToasterService,
    private translationLoaderService: FuseTranslationLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer) {
    this.backgroundImg = sanitizer.bypassSecurityTrustStyle('url(assets/images/marketing/background-marketing-default.jpg)');
    this.translationLoaderService.loadTranslations(...allLang);
    this.perm = this.route.snapshot.data;
  }

  ngOnInit() {
    this.addMarketingForm = this.fb.group({});
    this.marketing = this.route.snapshot.data.marketingResolve.result;
    this.marketingId = this.route.snapshot.paramMap.get("marketingId");
    if (!this.marketingId)
      this.router.navigate(['/marketing']);
    this._formatMarketing();
    const id = parseInt(this.marketingId);
    this._getMarketingImage(id);
  }

  //#region form
  get f() { return this.addMarketingForm.controls; }

  bindExternalForm(controlName: string, form: FormGroup) {
    this.addMarketingForm.setControl(controlName, form);
  }

  //#endregion

  updateMarketing(): void {
    let marketing = <IMarketing>this.f['marketing'].value;
    delete marketing.created;

    this._updateMarketingApi(marketing);
  }

  editAction(): void {
    this.isEdit = !this.isEdit;
  }

  cancelChange() {
    this.isChangeImage = !this.isChangeImage;
    this.file = null;
    this.filename = '';
  }

  changeImage() {
    if (this.file) {
      this.isUploading = true;
      this._saveMarketingImage();
    } else {
      this.cancelChange();
    }
  }

  uploadClick() {
    this.isUploading = true;
    const fileUpload = document.getElementById('fileUploadMarketing') as HTMLInputElement;
    fileUpload.onchange = ($evt) => {
      let file = fileUpload.files[0];
      this.filename = file.name;
      this.getBase64(file);
    };
    fileUpload.click();
  }

  getBase64(file: File) {
    let reader = new FileReader();
    reader.onloadend = () => {
      this.file = reader.result;
      this.isUploading = false;
    }
    reader.readAsDataURL(file);
  }

  private _responseError(error: any): void {
    this.isWorking = false;
    this.isUploading = false;
    this.toaster.showTranslate('general.errors.serverError');
  }

  private _formatMarketing() {
    this.formatStartDate = this._formatDate(this.marketing.startDateString);
    this.formatEndDate = this._formatDate(this.marketing.endDateString);
    if (this.marketing.projectId)
      this._getProjectApi(this.marketing.projectId);
  }

  private _formatDate(date: string) {
    if (date) {
      const dateVerfication = new Date(date);
      return {
        year: dateVerfication.getFullYear(),
        day: dateVerfication.getDate(),
        weekDay: dateVerfication.getDay(),
        month: (dateVerfication.getMonth() + 1),
      }
    }
    return {
      year: '0000',
      day: '00',
      weekDay: 'waiting',
      month: 'waiting',
    };
  }

  //#region API
  private _getMarketing(id: number) {
    this.apiService.get(EEndpoints.Marketing, { id: id }).subscribe(
      (response: ResponseApi<IMarketing>) => {
        if (response.code == 100) {
          this.marketing = response.result;
          this._formatMarketing();
        } else
          this.toaster.showTranslate('general.errors.requestError');
      },
    )
  }

  private _getMarketingImage(id: number) {
    this.apiService.get(EEndpoints.MarketingImage, { id: id }).subscribe(
      (response: ResponseApi<string>) => {
        if (response.code == 100 && response.result) {
          let image = response.result.replace(/\\/g, '/');
          this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
        }
      },
    )
  }

  private _getProjectApi(projectId: number): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Project, { id: projectId }).subscribe(
      (response: ResponseApi<IProject>) => {
        if (response.code == 100) {
          this.project = response.result;
        } else {
          this.toaster.showTranslate('general.errors.requestError');
        }
        this.isWorking = false;
      }, (err) => this._responseError(err)
    )
  }

  private _updateMarketingApi(marketing: IMarketing): void {
    this.isWorking = true;
    this.apiService.update(EEndpoints.Marketing, marketing).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this.toaster.showTranslate('messages.itemUpdated');
          this.marketing = <IMarketing>this.f['marketing'].value;
          if (this.marketing.projectId)
            this._getProjectApi(this.marketing.projectId);
        }
        else
          this.toaster.showTranslate('errors.errorEditingItem');
        this.isWorking = false;
      }, (err) => this._responseError(err)
    );
  }

  private _saveMarketingImage() {
    this.isUploading = true;
    const params = {
      id: this.marketing.id,
      PictureUrl: this.file
    };
    this.apiService.save(EEndpoints.MarketingImage, params).subscribe(
      (response: ResponseApi<string>) => {
        if (response.code == 100) {
          let image = response.result.replace(/\\/g, '/');
          this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
        }
        else
          this.toaster.showTranslate('general.errors.requestError');
        this.isUploading = false;
        this.cancelChange();
      }, err => this._responseError(err)
    )
  }

  downloadReport() {
    this.apiService.download(EEndpoints.MarketingPlanDownload, { marketingId: this.marketingId }).subscribe(
      fileData => {
        const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        let link = document.createElement("a");
        if (link.download !== undefined) {
          let url = URL.createObjectURL(blob);
          console.log('url: ', url);
          link.setAttribute("href", url);
          let filename = this.marketing.name.replace('.', '_');
          link.setAttribute("download", `Reporte_MarketingPlan_${filename}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }
  //#endregion

}
