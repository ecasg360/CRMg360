import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatTableDataSource, MatPaginatorIntl, MatPaginator, MatSort } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from "@models/response-api";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { IPerson } from "@models/person";
import { AddContactComponent } from "@shared/components/add-contact/add-contact.component";
import { environment } from '@environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'personTypeId', 'action'];
  dataSource: MatTableDataSource<any>;
  paginatorIntl: MatPaginatorIntl;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isWorking: boolean = false;
  perm: any = {};

  constructor(
    private toasterService: ToasterService,
    private ApiService: ApiService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) {
    this.perm = this.activatedRoute.snapshot.data;
  }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.getPersonsContacts();
  }

  getPersonsContacts() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.PersonsContacts)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          const data = response.result.map(m => {
            if (m.pictureUrl) {
              m.pictureUrl = `${environment.url}/${m.pictureUrl.replace(/\\/g, '/')}`;
            }
            return m;
          });
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isWorking = false;
        }
        //this.isWorking = false;
      }, (err) => this.responseError(err));
  }

  showModalForm(id: number = 0, model: IPerson = <IPerson>{}): void {
    const dialogRef = this.dialog.open(AddContactComponent, {
      width: '1000px',
      data: {
        id: id,
        model: model,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPersonsContacts();
    });
  }

  updateStatus(id: number, status: number): void {
    let statusId = status == 1 ? 2 : 1;
    this.isWorking = true;

    this.ApiService.save(EEndpoints.TimeStatus, { id: id, status: statusId })
      .subscribe(data => {
        if (data.code == 100) {
          this.getPersonsContacts();
          this.toasterService.showToaster(this.translate.instant('settings.time.messages.statusChanged'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => {
        this.responseError(err);
      });
  }

  confirmDelete(id: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this.deleteType(id);
      }
    });
  }

  deleteType(id: number) {
    this.isWorking = true;
    const params = [];
    params['id'] = id;
    this.ApiService.delete(EEndpoints.ProjectContact, params)
      .subscribe(data => {
        if (data.code == 100) {
          this.getPersonsContacts();
          this.toasterService.showToaster(this.translate.instant('settings.contact.messages.deleteSuccess'));
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => {
        this.responseError(err);
      });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }
}
