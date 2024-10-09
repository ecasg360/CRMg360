import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { IContractTerms } from '@models/contractTerms';
import { ITermType, IContractTermType } from '@models/termType';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ITerms } from '@models/terms';
import { SelectionContractTermsComponent } from '../selection-contract-terms/selection-contract-terms.component';
import { AddTermTypeComponent } from '../add-term-type/add-term-type.component';

@Component({
  selector: 'app-contract-terms-manager',
  templateUrl: './contract-terms-manager.component.html',
  styleUrls: ['./contract-terms-manager.component.scss']
})

export class ContractTermsManagerComponent implements OnInit, OnChanges {

  @Input() contractId: number;
  isWorking: boolean = false;
  termsTypes: ITermType[] = [];
  term: ITerms;
  contractTermTypeList: IContractTermType[] = [];

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private _translationLoaderService: FuseTranslationLoaderService) {
    this._translationLoaderService.loadTranslations(...allLang);
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.contractId.currentValue) {
      this._getContractTerms();
      this._getTermsTypesByContract();
    }
  }

  ngOnInit() {
  }

  trackList(index: number, item) {
    return (item.id) ? item.id : index;
  }

  openContractTypeModal(): void {
    const dialogRef = this.dialog.open(AddTermTypeComponent, {
      width: '700px',
      data: {
        contractId: this.contractId,
        contractTermType: this.contractTermTypeList
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this._getContractTerms();
      }
    });
  }

  addClausuleModal(term: ITermType) {
    const dialogRef = this.dialog.open(SelectionContractTermsComponent, {
      width: '900px',
      data: {
        contractTerms: <IContractTermType>{
          termTypeId: term.id,
          contractId: this.contractId,
          termTypeName: term.name,
        },
        clausules: term.contractTerms
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this._getContractTerms();
      }
    });
  }

  deleteTermType(term: ITermType) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '700px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: term.name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this._deleteTermType({ contractId: this.contractId, termTypeId: term.id });
      }
    });
  }

  drop(event: CdkDragDrop<IContractTerms[]>, termTypeId: number) {
    const find = this.termsTypes.find((x) => x.id === termTypeId);

    this.moveItemInArray(find.contractTerms, event.previousIndex, event.currentIndex);
  }

  moveItemInArray(contractTerms: IContractTerms[], previousIndex: number, currentIndex: number): void {
    const posPrevious = contractTerms[previousIndex].position;
    contractTerms[previousIndex].position = contractTerms[currentIndex].position;
    contractTerms[currentIndex].position = posPrevious;

    const newList: IContractTerms[] = [];
    newList.push(contractTerms[previousIndex]);
    newList.push(contractTerms[currentIndex]);

    this.apiService.update(EEndpoints.ContractTerms, newList)
      .subscribe(
        (response: ResponseApi<any[]>) => {
          if (response.code == 100) {
            this._getContractTerms();
          }
          this.isWorking = false;
        }, (err) => this._responseError(err)
      );
  }


  delete(id: number): void {
    const params = [];
    params['id'] = id;
    this.apiService.delete(EEndpoints.ContractTerm, params).subscribe(
      (response: ResponseApi<any[]>) => {
        if (response.code == 100) {
          this._getContractTerms();
        }
        this.isWorking = false;
      }, (err) => this._responseError(err)
    );
  }

  confirmDelete(id: number, name: string) {
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
        if (confirm)
          this.delete(id);
      }
    });
  }

  private _responseError(error: any): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API
  private _getContractTerms(): void {
    this.isWorking = true;
    this.term = undefined;
    this.apiService.get(EEndpoints.ContractTermsByContractId, { contractid: this.contractId }).subscribe(
      (response: ResponseApi<ITermType[]>) => {
        if (response.code == 100) {
          this.termsTypes = response.result;
        }
        this.isWorking = false;
      }, (err) => this._responseError(err)
    );
  }

  private _getTermsTypesByContract() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ContractTermTypes, { contractId: this.contractId }).subscribe(
      (response: ResponseApi<IContractTermType[]>) => {
        if (response.code == 100)
          this.contractTermTypeList = response.result;
        else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _deleteTermType(params: any) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.ContractTermTypes, params).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this._getContractTerms();
        } else
          this.isWorking = false;
      }, err => this._responseError(err)
    )
  }
  //#endregion

}
