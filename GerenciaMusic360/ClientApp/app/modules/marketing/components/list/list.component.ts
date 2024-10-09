import { Component, OnInit } from '@angular/core';
import { IMarketing } from '@models/marketing';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { ToasterService } from '@services/toaster.service';
import { ResponseApi } from '@models/response-api';
import { EEndpoints } from '@enums/endpoints';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CampainFormModalComponent } from '../campain-form-modal/campain-form-modal.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  isWorking: boolean = false;
  marketingList: IMarketing[] = [];
  month: number;
  year: number;
  perm: any = {};

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translationLoaderService: FuseTranslationLoaderService,
  ) {
    this.perm = this.activatedRoute.snapshot.data;
  }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.activatedRoute.params.subscribe(
      (params: any) => {
        const moduleFilter = params.menuFilter;
        this.month = params.month;
        this.year = params.year;
        if (moduleFilter == 'label') {
          if (this.perm.Marketing.GetByLabel) {
            this._getMarketings(EEndpoints.MarketingsByLabel);
          } else {
            this.router.navigateByUrl('/');
          }
        } else if (moduleFilter == 'event') {
          if (this.perm.Marketing.GetByEvent) {
            this._getMarketings(EEndpoints.MarketingsByEvent);
          } else {
            this.router.navigateByUrl('/');
          }
        } else {
          if (this.perm.Marketing.Get) {
            this._getMarketings(EEndpoints.Marketings);
          } else {
            this.router.navigateByUrl('/');
          }
        }
      }
    );
  }

  trackByFn(index, item) {
    return item.id ? item.id : index;
  }

  openModal(): void {
    const dialogRef = this.dialog.open(CampainFormModalComponent, {
      width: '900px',
      data: {
        projectId: 0,
        projectType: 0,
      }
    });
    dialogRef.afterClosed().subscribe((result: IMarketing) => {
      if (result != undefined) {
        this.router.navigate(['/marketing/manage/', result.id]);
      }
    });
  }

  confirmDelete(row: IMarketing) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: row.name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this._deleteMarketingApi(row.id);
      }
    });
  }

  private _filterByMonthYear() {
    if (this.year && this.month) {
      this.marketingList = this.marketingList.filter(f => {
        let date = new Date(f.endDate);
        if (this.year == date.getFullYear() && date.getMonth() == this.month)
          return f;
      });
    }
  }

  private _responseError(err: any): void {
    console.log(err);
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API
  private _getMarketings(url: EEndpoints): void {
    this.isWorking = true;
    this.apiService.get(url).subscribe(
      (response: ResponseApi<IMarketing[]>) => {
        if (response.code == 100) {
          this.marketingList = response.result;
          this._filterByMonthYear();
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _deleteMarketingApi(id: number) {
    this.apiService.delete(EEndpoints.MarketingDelete, { id: id }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.marketingList = this.marketingList.filter(f => f.id !== id);
          this.toaster.showToaster(this.translate.instant('messages.itemDeleted'));
        } else
          this.toaster.showToaster(this.translate.instant('messages.errorDeletingItem'));
      }, err => this._responseError(err)
    )
  }

  downloadReport(item: IMarketing) {
    this.apiService.download(EEndpoints.MarketingPlanDownload, { marketingId: item.id }).subscribe(
      fileData => {
        const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        let link = document.createElement("a");
        if (link.download !== undefined) {
          let url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
            link.setAttribute("download", `Reporte_MarketingPlan_${item.name.replace(' ','').replace('.', '')}.docx`);
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
