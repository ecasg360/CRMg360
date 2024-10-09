import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmComponent } from "ClientApp/app/shared/components/confirm/confirm.component";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { AddWorksmanageComponent } from "./add-worksmanage/add-worksmanage.component";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
import { allLang } from "@i18n/allLang";
import { Work } from "@models/work";
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-worksmanage',
  templateUrl: './worksmanage.component.html',
  styleUrls: ['./worksmanage.component.scss']
})

export class WorksmanageComponent implements OnInit {
    innerWidth: any;
    displayedColumns: string[] = ['name', 'description', 'status', 'action'];
    dataSource: MatTableDataSource<any>;
    isWorking = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    permisions:any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private toasterService: ToasterService,
        private apiService: ApiService,
        public dialog: MatDialog,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private activatedRoute: ActivatedRoute,
      ) {
        this.activatedRoute.data.subscribe((data: any) => {
            this.permisions = data;
            console.log('this.permisions: ', this.permisions);
        });
        this._unsubscribeAll = new Subject();
      }  

    ngOnInit() {
      this._fuseTranslationLoaderService.loadTranslations(...allLang);
      this.innerWidth = window.innerWidth;
      this.getWorks();
    }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
    }

    getWorks(): void {
        this.isWorking = true;
      this.apiService.get(EEndpoints.Works).subscribe(data => {
        console.log('data getWorks: ', data);
        if (data.code == 100) {
            this.dataSource = new MatTableDataSource(data.result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
        this.isWorking = false;
      }, err => this.responseError(err)
        );
    }

    getForeignWork(): void {
        this.isWorking = true;
      this.apiService.get(EEndpoints.ForeignWorks).subscribe(data => {
        if (data.code == 100) {
            this.dataSource = new MatTableDataSource(data.result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
          this.isWorking = false;
      }, err => this.responseError(err));
    }

  showWork(model: Work = <Work>{}): void {
    console.log('model to send: ', model);
      const dialogRef = this.dialog.open(AddWorksmanageComponent, {
          width: '700px',
          data: {
              model: model
          }
      });
      dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined)
              this.getWorks();
      });
  }

  confirmDelete(id, name): void {
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
                  this.delete(id);
          }
      });
  }

    updateStatus(id: number, status: number): void {
        this.isWorking = true;
    let statusId = status == 1 ? 2 : 1;
    this.apiService.save(EEndpoints.WorkStatus, { id: id, status: statusId })
        .subscribe(data => {
            if (data.code == 100) {
                this.getWorks();
                this.toasterService.showToaster(this.translate.instant('messages.statusChanged'));
            } else {
                this.toasterService.showToaster(data.message);
            }
            this.isWorking = false;
        }, err => this.responseError(err));
  }

    delete(id): void {
        this.isWorking = true;
      this.apiService.delete(EEndpoints.Work, { id: id }).subscribe(data => {
        if (data.code == 100) {
            this.getWorks();
            this.toasterService.showTranslate('messages.itemDeleted');
        } else {
            this.toasterService.showTranslate('errors.errorDeletingItem');
        }
          this.isWorking = false;
      }, err => this.responseError(err));
  }

  private responseError(error: any): void {
      this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
      this.isWorking = false;
  }

  downloadFile() {
    this.isWorking = true;
    this.apiService.download(EEndpoints.controlledListDownload)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        fileData => {
          const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let link = document.createElement("a");
          if (link.download !== undefined) {
            let url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "Controlled List");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          this.isWorking = false;
        }, err => this._responseError(err));
  }

  private _responseError(err: HttpErrorResponse) {
    this.isWorking = false;
    console.log(err);
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
  }

  seeDetails(row) {
    console.log('the row to see details: ', row);
    const dialogRef = this.dialog.open(AddWorksmanageComponent, {
      width: '700px',
      data: {
          model: row,
          onlyView: true
      }
  });
  dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined)
          this.getWorks();
  });
  }
}
