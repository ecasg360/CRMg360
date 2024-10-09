import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '../confirm/confirm.component';
import { PersonDocument } from '@models/person-document';
import { PersonDocumentFormComponent } from '../person-document-form/person-document-form.component';
import { ResponseApi } from '@models/response-api';
import { ResponseSelect } from '@models/select-response';
import { SelectOption } from '@models/select-option.models';
import { ToasterService } from '@services/toaster.service';
import { EEndpoints } from '@enums/endpoints';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-person-document-manager',
  templateUrl: './person-document-manager.component.html',
  styleUrls: ['./person-document-manager.component.scss']
})

export class PersonDocumentManagerComponent implements OnInit, OnChanges, OnDestroy {

  @Output() emitPersonDocumentData = new EventEmitter<PersonDocument[]>();

  private _personId: number = 0;
  @Input()
  set personId(v: number) {
    this._personId = v;
    if (this._personId > 0) {
      this.triggerPersonDocumentQueue();
    }
  }

  get personId(): number {
    return this._personId;
  }

  innerWidth: any;
  displayedColumns: string[] = ['name', 'documentType', 'country', 'documentNumber', 'expirationDate', 'status', 'action'];
  dataSource: MatTableDataSource<any>;
  isWorking: boolean = false;
  isDataAvailable: boolean = true;
  documentTypes: SelectOption[] = [];
  countries: SelectOption[] = [];
  documentPersonList: any[] = [];

  //#region Lifetime Cycle
  constructor(
    public dialog: MatDialog,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private translate: TranslateService,
    private apiService: ApiService,
    private toasterService: ToasterService,
  ) {
    this.getDocumentsTypesApi();
    this.getCountriesApi();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    this.emitPersonDocumentData.complete();
  }

  //#endregion

  //#region API methods

  savePersonDocumentsApi(): void {
    if (this.documentPersonList.length > 0) {
      const params = [];
      for (let index = 0; index < this.documentPersonList.length; index++) {
        let element = this.documentPersonList[index];
        delete element.id;
        delete element.country;
        delete element.documentType;
        element.personId = this.personId;
        params.push(element);
      }

      this.apiService.save(EEndpoints.PersonDocuments, params).subscribe(
        (response: ResponseApi<any>) => {
          if (response.code == 100) {
            this.toasterService.showToaster(this.translate.instant('messages.personDocumentSaved'));
            this.getPersonDocumentApi();
          } else {
            this.toasterService.showToaster(this.translate.instant('errors.savedPersonDocumentFailed'));
            console.log(response.message);
          }
        }, err => this.responseError(err)
      );
    }
  }

  savePersonDocumentApi(document: PersonDocument) {
    this.isWorking = true;
    delete document.id;
    delete document.country;
    delete document.documentType;
    delete document.expiredDate;
    document.personId = this.personId;

    this.apiService.save(EEndpoints.PersonDocument, document).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toasterService.showToaster(this.translate.instant('messages.personDocumentSaved'));
          this.getPersonDocumentApi();
          this.isWorking = false;
        } else {
          this.toasterService.showToaster(this.translate.instant('errors.savedPersonDocumentFailed'));
          console.log(response.message);
        }
      }, err => this.responseError(err)
    )
  }

  updatePersonDocumentApi(document: PersonDocument) {
    this.isWorking = true;

    delete document.country;
    delete document.documentType;
    delete document.expiredDate;

    this.apiService.update(EEndpoints.PersonDocument, document).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toasterService.showToaster(this.translate.instant('messages.personDocumentEdited'));
          this.getPersonDocumentApi();
          this.isWorking = false;
        } else {
          this.toasterService.showToaster(this.translate.instant('errors.personDocumentEditFailed'));
          console.log(response.message);
        }
      }, err => this.responseError(err)
    )
  }

  updatePersonDocumentStatusApi(model: any) {
    this.apiService.save(EEndpoints.PersonDocumentStatus, model).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toasterService.showToaster(this.translate.instant('messages.statusChanged'));
          this.getPersonDocumentApi();
          this.isWorking = false;
        } else {
          this.toasterService.showToaster(this.translate.instant('errors.changeStatusFailed'));
          console.log(response.message);
        }
      }, err => this.responseError(err)
    );

  }

  deletePersonDocumentApi(id: number) {
    this.apiService.delete(EEndpoints.PersonDocument, { id: id, personId: this.personId }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toasterService.showToaster(this.translate.instant('messages.personDocumentDeleted'));
          this.getPersonDocumentApi();
          this.isWorking = false;
        } else {
          this.toasterService.showToaster(this.translate.instant('errors.personDocumentDeletedFailed'));
          console.log(response.message);
        }
      }, err => this.responseError(err)
    )
  }

  getPersonDocumentApi() {
    this.apiService.get(EEndpoints.PersonDocuments, { personId: this.personId }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.documentPersonList = [];
          for (let i = 0; i < response.result.length; i++) {
            const element = response.result[i];
            this.documentPersonList.push(element);
          }
          this.bindDataTable();
        } else {
          console.log(response.message);
        }
      }, err => this.responseError(err)
    )
  }

  getDocumentsTypesApi() {
    this.apiService.get(EEndpoints.PersonDocumentTypes).subscribe(
      (data: ResponseApi<any>) => {
        if (data.code == 100) {
          this.documentTypes = data.result.map((s: ResponseSelect) => ({
            value: s.id,
            viewValue: s.name
          }));
        }
      }, (err) => this.responseError(err));
  }

  getCountriesApi() {
    this.apiService.get(EEndpoints.Countries).subscribe((data: ResponseApi<any>) => {
      if (data.code == 100) {
        this.countries = data.result.map((s: ResponseSelect) => ({
          value: s.id,
          viewValue: s.name
        }));
      }
    }, (err) => this.responseError(err));
  }

  //#endregion

  //#region general Methods
  bindDataTable() {
    this.dataSource = new MatTableDataSource(this.documentPersonList.map(
      (doc: PersonDocument) => {
        if (this.documentTypes) {
          const documentFound = this.documentTypes.find(f => f.value == doc.personDocumentTypeId);
          if (documentFound) {
            doc.documentType = documentFound.viewValue;
          }
        }

        if (this.countries) {
          const countryFound = this.countries.find(f => f.value == doc.countryId);
          if (countryFound) {
            doc.country = countryFound.viewValue;
          }
        }
        return doc;
      }
    ));

    this.emitPersonDocumentData.emit(this.documentPersonList);
  }

  triggerPersonDocumentQueue() {
    if (this.documentPersonList.length > 0) {
      const found = this.documentPersonList.filter(f => f.id < 0);
      if (found.length > 0) {
        this.savePersonDocumentsApi();
      }
    } else {
      this.getPersonDocumentApi();
    }
  }

  showModalForm(id: number = 0): void {
    this.isWorking = true;
    const document = <PersonDocument>this.documentPersonList.find(f => f.id == id);

    const dialogRef = this.dialog.open(PersonDocumentFormComponent, {
      width: '800px',
      data: {
        id: id,
        model: document,
        documentTypes: this.documentTypes,
        countries: this.countries
      }
    });
    dialogRef.afterClosed().subscribe((document: PersonDocument) => {
      if (document !== undefined) {
        if (document.id == 0) {
          document.id = (new Date()).getMilliseconds() * -1;
        }
        this.managePersonDocumentEvent(document);
      }
    });
    this.isWorking = false;
  }

  managePersonDocumentEvent(document: PersonDocument) {
    if (document.id > 0) {
      this.updatePersonDocumentApi(document);
    } else {
      if (this.personId > 0) {
        this.savePersonDocumentApi(document);
      }

      this.documentPersonList = this.documentPersonList.filter(f => f.id !== document.id);
      this.documentPersonList.push(document);
      this.bindDataTable();
    }
  }

  updateStatus(id: any, statusRecordId: any, personDocumentTypeId: any) {
    statusRecordId = statusRecordId == 1 ? 2 : 1;
    this.updatePersonDocumentStatusApi({
      id: id,
      status: statusRecordId,
      TypeId: personDocumentTypeId
    });
  }

  confirmDelete(id: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '700px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm) {
          this.deletePersonDocumentApi(id);
        }
      }
    });
  }

  private responseError(err: any) {
    this.isWorking = false;
    console.log('http error', err);
  }
  //#endregion
}
