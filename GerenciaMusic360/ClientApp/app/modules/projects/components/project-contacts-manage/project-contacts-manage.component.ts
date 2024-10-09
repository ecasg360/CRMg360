import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { IContact } from '@models/contact';
import { ResponseApi } from '@models/response-api';
import { AddContactComponent } from '@shared/components/add-contact/add-contact.component';

@Component({
  selector: 'app-project-contacts-manage',
  templateUrl: './project-contacts-manage.component.html',
  styleUrls: ['./project-contacts-manage.component.scss']
})
export class ProjectContactsManageComponent implements OnInit {

  moduleFilter: string = '';
  contactsList: IContact[] = [];
  isWorking: boolean = false;
  displayedColumns: string[] = ['name', 'email', 'cellPhone', 'officePhone', 'action'];
  dataSource: MatTableDataSource<IContact>;
  @ViewChild(MatPaginator, { static: true } as any) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  permisions:any;

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private translationLoaderService: FuseTranslationLoaderService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.data.subscribe((data: any) => {
      this.permisions = data;
    });
    
    this.activatedRoute.params.subscribe(
      (params: any) => {
        this.moduleFilter = params.projectFilter;
        this._manageGetContacts();
      }
    );
    
  }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showModalForm(model: IContact = <IContact>{}): void {
    const dialogRef = this.dialog.open(AddContactComponent, {
      width: '800px',
      data: {
        id: model.id,
        model: model,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._manageGetContacts();
      }
    });
  }

  private _manageGetContacts() {
    if (this.moduleFilter == 'label') {
      this._getProjectsContacts(EEndpoints.ProjectContactsByLabel);
    } else if (this.moduleFilter == 'event' || 'publishing') {
      this._getProjectsContacts(EEndpoints.ProjectContactsByEvent);
    } else if (this.moduleFilter == 'agency') {
      this._getProjectsContacts(EEndpoints.ProjectContactsByAgency);
    }
  }

  private _fillTable(): void {
    this.dataSource = new MatTableDataSource(this.contactsList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private _responseError(error: any): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API

  private _getProjectsContacts(url: EEndpoints) {
    this.isWorking = true;
    this.apiService.get(url).subscribe(
      (response: ResponseApi<IContact[]>) => {
        if (response.code == 100) {
          this.contactsList = response.result;
          this._fillTable();
        } else
          this.toaster.showTranslate('errors.errorGeetingItems');
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }
  //#region
}
