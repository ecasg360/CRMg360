import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ResponseApi } from '@models/response-api';
import { EEndpoints } from '@enums/endpoints';
import { IContract } from '@models/contract';
import { ProjectDetailComponent } from '@shared/components/project-detail/project-detail.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { Router } from '@angular/router';
import { ModalContractFormComponent } from '@app/commons/modals/components/modal-contract-form/modal-contract-form.component';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {

  isWorking: boolean = false;
  month: number;
  year: number;
  contracts: IContract[] = [];
  filteredContracts: IContract[] = [];
  perm: any = {};
  @ViewChild("searchInput") searchInput: ElementRef;

  constructor(
    private toasterService: ToasterService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router
  ) {
    this.perm = this.activatedRoute.snapshot.data;
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: any) => {
        const moduleFilter = params.menuFilter;
        this.month = params.month;
        this.year = params.year;
        console.log('this.perm en contracts: ', this.perm);
        switch (moduleFilter) {
          case 'label':
            if (this.perm.Contract.GetByLabel) {
              this.getContracts(EEndpoints.ContractsByLabel);
            } else {
              this.router.navigateByUrl('/');
            }
            break;
          case 'event':
          case 'publishing':
            if (this.perm.Contract.GetByEvent) {
              this.getContracts(EEndpoints.ContractsByEvent);
            } else {
              this.router.navigateByUrl('/');
            }
            break;
          case 'agency':
            if (this.perm.Contract.GetByAgency) {
              this.getContracts(EEndpoints.ContractsByAgency);
            } else {
              this.router.navigateByUrl('/');
            }
            break;
          default:
            if (this.perm.Contract.Get) {
              this.getContracts(EEndpoints.Contracts);
            } else {
              this.router.navigateByUrl('/');
            }
        }
      }
    );
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    if (!filterValue)
      this.filteredContracts = this.contracts;
    else
      this.filteredContracts = this.contracts.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  openModal(): void {
    const dialogRef = this.dialog.open(ModalContractFormComponent, {
      width: '900px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.router.navigate(['/contracts/manage/', result.id]);
      }
    });
  }

  showProjectDetail(projectId: number = 0): void {
    this.dialog.open(ProjectDetailComponent, {
      width: '700px',
      data: {
        projectId: projectId,
      }
    });
  }

  confirmDelete(contractId: number, name: string): void {
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
        if (result.confirm)
          this._deleteContract(contractId);
      }
    });
  }

  private _filterProjectsByMonthYear(list: IContract[]): IContract[] {
    if (this.year && this.month) {
      list = list.filter(f => {
        let date = new Date(f.endDate);
        if (this.year == date.getFullYear() && date.getMonth() == this.month)
          return f;
      });
    }
    return list;
  }

  private _responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API

  downloadFile(id: number): void {
    this.isWorking = true;
    this.apiService.download(EEndpoints.TemplateContractDocumentCreate, { contractId: id }).subscribe(
      fileData => {
        const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        let link = document.createElement("a");
        if (link.download !== undefined) {
          let url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "Contract Contrato");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        this.isWorking = false;
      }, err => this._responseError(err));
  }

  getContracts(url: EEndpoints): void {
    this.isWorking = true;
    this.apiService.get(url).subscribe(
      (response: ResponseApi<IContract[]>) => {
        if (response.code == 100) {
          const result = this._filterProjectsByMonthYear(response.result);
          this.contracts = result;
          this.filteredContracts = result;
        }
        this.isWorking = false;
      }, (err) => this._responseError(err));
  }

  private _deleteContract(id: number) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.Contract, { id: id }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          const found = this.contracts.findIndex(f => f.id == id);
          if (found >= 0) {
            this.contracts.splice(found, 1);
            this.filteredContracts = this.contracts;
            this.searchInput.nativeElement.value = '';
          }
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }
  //#endregion
}
