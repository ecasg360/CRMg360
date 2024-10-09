import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from '@models/response-api';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '../confirm/confirm.component';
import { environment } from '@environments/environment';

// const URL = '/api/';
const URL = environment.baseUrl + 'Marketing/Upload/';

@Component({
  selector: 'app-upload-multi-file',
  templateUrl: './upload-multi-file.component.html',
  styleUrls: ['./upload-multi-file.component.css']
})
export class UploadMultiFileComponent implements OnInit, OnChanges {

  @Input() marketingId: number;
  @Input() perm:any ={};

  api: string;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;

  isWorking: boolean = false;
  files: any[];
  indexSplit = environment.splitImageMarketing;

  constructor(
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    public dialog: MatDialog,
  ) {

  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.marketingId.currentValue) {
      this.getFiles();
    }
  }

  ngOnInit() {
    console.log(this.marketingId)

    this.api = URL + this.marketingId;
    this.uploader = new FileUploader({
      url: this.api,
    });

    this.uploader.onErrorItem = (item, response, status, headers) => {
      if (status === 404) {
        this.toasterService.showToaster(
          this.translate.instant('general.fileId') + ' ' +
          this.translate.instant('general.errors.alreadyExists')
        );
      } else {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
      }
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      console.log('item: ', item);
      console.log('response: ', response);
      console.log('status: ', status);
      console.log('headers: ', headers);
      if (status === 201) {
        item.remove();
      }
      this.getFiles();
      this.toasterService.showToaster(this.translate.instant('multiFileUpload.messages.addSuccess'));
    }

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe(res => this.response = res);
    this.getFiles();
  }

  getFiles() {
    this.isWorking = true;
    const params = [];
    if (!this.marketingId)
      return;
    params['marketingId'] = this.marketingId;
    this.ApiService.get(EEndpoints.MarketingFiles, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response && response.code == 100) {
          this.files = response.result;
          console.log('this.files: ', this.files);
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  onProgress(): void{
    this.isWorking = true;
  }

  confirmDelete(fileName: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: fileName }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this.deleteFile(fileName, this.marketingId);
      }
    });
  }

  deleteFile(fileName: string, marketingId: number) {
    this.isWorking = true;
    const params = [];
    params['fileName'] = fileName;
    params['marketingId'] = marketingId;
    this.ApiService.delete(EEndpoints.MarketingFileDelete, params)
      .subscribe(data => {
        if (data.code == 100) {
          this.getFiles();
          this.toasterService.showToaster(this.translate.instant('multiFileUpload.messages.deleteSuccess'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => {
        this.responseError(err);
      });
  }

  removeAll() {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('multiFileUpload.messages.deleteAllQuestion'),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm){
          this.deleteAllFiles(this.marketingId);
        }
      }
    });
  }

  deleteAllFiles(marketingId) {
    this.isWorking = true;
    this.files.forEach(async file => {
      const params = [];
      params['fileName'] = file.name;
      params['marketingId'] = marketingId;
      await this.ApiService.delete(EEndpoints.MarketingFileDelete, params)
      .subscribe(data => {
        if (data.code == 100) {
          this.toasterService.showToaster(this.translate.instant('multiFileUpload.messages.deleteSuccess'));
          this.getFiles();
        } else {
          this.toasterService.showToaster(data.message);
        }
      }, (err) => {
        this.responseError(err);
      });
      this.isWorking = false;
    });
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
