import { Component, OnInit, ViewChild } from '@angular/core';
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
import { environment } from '@environments/environment';
import { IChecklist } from '@models/checklist';
import { PromotersFormComponent } from '../promoters-form/promoters-form.component';
import { PromotersViewComponent } from '../promoters-view/promoters-view.component';

@Component({
  selector: 'app-promoters-index',
  templateUrl: './promoters-index.component.html',
  styleUrls: ['./promoters-index.component.scss']
})
export class PromotersIndexComponent implements OnInit {

  records: IChecklist[] = [];

  displayedColumns: string[] = [
    'name',
    'lastname',
    'phone',
    'email',
    'terms',
    'contactType',
    'deal',
    'dateContact',
    'by',
    'action'
  ];
  dataSource: MatTableDataSource<any>;
  paginatorIntl: MatPaginatorIntl;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isWorking: boolean = false;
  perm: any = {};

  constructor(
    private toasterService: ToasterService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private apiService: ApiService,
  ) {
    this.perm = this.activatedRoute.snapshot.data;
  }

  ngOnInit() {
    this.getRecords();
  }

  getRecords() {
    return this.apiService.get(EEndpoints.Checklist).subscribe(
      (response: ResponseApi<IChecklist[]>) => {
        if (response.code == 100) {
          this.dataSource = new MatTableDataSource(response.result);
        }
      }, err => console.log('http error', err)
    )
  }

  openModal(row: any): void {
    let action = this.translate.instant(!row ? 'save': 'update');
    const dialogRef = this.dialog.open(PromotersFormComponent, {
        width: '700px',
        data: {
            action: action,
            model: row
        }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.getRecords();
        }
    });
  }

  openView(row: any): void {
    const dialogRef = this.dialog.open(PromotersViewComponent, {
        width: '700px',
        data: {
            model: row
        }
    });

  }

  applyFilter(value) {
    console.log('value: ', value);
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
                this.deletePromoter(id);
        }
    });
  }

  deletePromoter(id: number) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.Checklist, { id: id })
    .subscribe(data => {
        if (data.code == 100) {
            this.getRecords();
            this.toasterService.showTranslate('messages.itemDeleted');
        } else {
            this.toasterService.showTranslate('errors.errorDeletingItem');
        }
        this.isWorking = false;
    }, err => this.responseError(err));
  }

  private responseError(error: any): void {
    this.toasterService.showTranslate('general.errors.serverError');
    this.isWorking = false;
  }

}
