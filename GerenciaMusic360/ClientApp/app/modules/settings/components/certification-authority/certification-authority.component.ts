import { Component, OnInit, ViewChild } from '@angular/core';
import { CertificationAuthority } from '@models/certification-authority';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EEndpoints } from '@enums/endpoints';
import { allLang } from '@i18n/allLang';
import { ResponseApi } from '@models/response-api';
import { AddCertificationAuthorityComponent } from './add-certification-authority/add-certification-authority.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-certification-authority',
  templateUrl: './certification-authority.component.html',
  styleUrls: ['./certification-authority.component.scss']
})

export class CertificationAuthorityComponent implements OnInit {

  displayedColumns: string[] = ['name', 'businessName', 'phone', 'contact', 'status', 'action'];
  dataSource: MatTableDataSource<CertificationAuthority>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isWorking: boolean = true;
  isDataAvailable: boolean = true;
  model: CertificationAuthority = <CertificationAuthority>{};
  perm:any = {};

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    private translate: TranslateService,
    private translationLoaderService: FuseTranslationLoaderService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    this.perm = this.route.snapshot.data;
  }

  ngOnInit() {
    this.translationLoaderService.loadTranslationsList(allLang);
    this._getCertificationsApi();
  }

  showForm(row: CertificationAuthority = <CertificationAuthority>{}): void {
    const dialogRef = this.dialog.open(AddCertificationAuthorityComponent, {
      width: '600px',
      data: row
    });

    dialogRef.afterClosed().subscribe((result: CertificationAuthority) => {
      if (result != undefined) {
        this.toaster.showToaster(this.translate.instant('messages.itemSaved'));
        this._getCertificationsApi();
      }
    });
  }

  updateStatus(id: number, status: number): void {
    this.isWorking = true;
    let statusId = (status == 1) ? 2 : 1;
    this._updateStatusApi({ id: id, status: statusId });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
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
          this._deleteCertificationAuthApi(id);
      }
    });
  }

  private _reponseError(error: HttpErrorResponse): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    console.error(error);
    this.isWorking = false;
  }

  //#region API

  _updateStatusApi(params: any) {
    this.apiService.save(EEndpoints.CertificationAuthorityStatus, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this._getCertificationsApi();
        } else {
          this.toaster.showToaster(response.message);
        }
        this.isWorking = false;
      }, err => this._reponseError(err)
    );
  }

  private _deleteCertificationAuthApi(id: number) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.CertificationAuthority, { id: id }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this._getCertificationsApi();
          this.toaster.showToaster(this.translate.instant('messages.itemDeleted'));
        } else {
          this.toaster.showToaster(response.message);
        }
        this.isWorking = false;
      }, err => this._reponseError(err)
    );
  }
  private _getCertificationsApi(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.CertificationAuthorities).subscribe(
      (response: ResponseApi<CertificationAuthority[]>) => {
        if (response.code == 100) {
          this.isDataAvailable = response.result.length > 0;
          this.dataSource = new MatTableDataSource(response.result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else
          this.toaster.showToaster(this.translate.instant('general.errors.requestError'));

        this.isWorking = false;
      }, err => this._reponseError(err)
    )
  }
  //#endregion

}
