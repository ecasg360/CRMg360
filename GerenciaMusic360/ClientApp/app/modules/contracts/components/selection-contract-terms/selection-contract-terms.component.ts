import { Component, OnInit, Optional, Inject, ViewChild } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ITerms } from '@models/terms';
import { allLang } from '@i18n/allLang';
import { IContractTermType, IContractTerms } from '@models/contractTerms';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ITermType } from '@models/termType';

@Component({
  selector: 'app-selection-contract-terms',
  templateUrl: './selection-contract-terms.component.html',
  styleUrls: ['./selection-contract-terms.component.scss']
})
export class SelectionContractTermsComponent implements OnInit {

  isWorking: boolean = false;
  termTypeContract: IContractTermType;
  isCreatingClausule: boolean = false;
  selectedClausules: IContractTerms[];

  displayedColumns: string[] = ['select', 'name'];
  dataSource: MatTableDataSource<ITerms> = new MatTableDataSource([]);
  selection = new SelectionModel<ITerms>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  formClausule: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SelectionContractTermsComponent>,
    private toaster: ToasterService,
    private apiService: ApiService,
    private translate: TranslateService,
    private _translationLoaderService: FuseTranslationLoaderService,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this._translationLoaderService.loadTranslations(...allLang);
    this.termTypeContract = <IContractTermType>this.data.contractTerms;
    this.selectedClausules = <IContractTerms[]>this.data.clausules;
    this._getTerms();

    this.formClausule = this.fb.group({
      id: [null, []],
      name: [null, [Validators.required]],
      termTypeId: [this.termTypeContract.termTypeId]
    });
  }

  get f() { return this.formClausule.controls; }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ITerms): string {
    return row ?
      `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ` :
      `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }

  cancelClausule() {
    this.formClausule.reset();
    this.formClausule.clearValidators();
    this.isCreatingClausule = false;
  }

  setClausule() {
    if (this.formClausule.valid) {
      const term = <ITerms>this.formClausule.value;
      if (term.id)
        this._updateClausule(term);
      else {
        term.id = 0;
        this._saveClausule(term);
      }
    }
  }

  set(): void {
    if (this.selection.selected.length > 0) {
      const contractTerms = this.selection.selected.map((m: ITerms, index: number) => {
        return <IContractTerms>{
          id: 0,
          contractId: this.termTypeContract.contractId,
          termId: m.id,
          position: this.selectedClausules.length + (index + 1)
        }
      });
      this._save(contractTerms);
    }
  }

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }

  private _formatTerms(terms: ITerms[]): ITerms[] {
    const valids = [];
    if (this.selectedClausules.length == 0)
      return terms;

    if (terms.length > 0) {
      terms.forEach((item: ITerms) => {
        const found = this.selectedClausules.findIndex(f => f.termId == item.id);
        if (found < 0)
          valids.push(item);
      });
    }
    return valids;
  }

  private _responseError(error: any): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API
  private _getTerms(): void {
    this.isWorking = true;
    const params = { termTypeId: this.termTypeContract.termTypeId };
    this.apiService.get(EEndpoints.TermsByTermType, params).subscribe(
      (response: ResponseApi<ITerms[]>) => {
        if (response.code == 100) {
          this.selection.clear();
          this.dataSource.data = this._formatTerms(response.result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.onNoClick();
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _saveClausule(term: ITerms): void {
    this.isWorking = true;
    this.apiService.save(EEndpoints.Term, term).subscribe(
      (response: ResponseApi<ITermType>) => {
        if (response.code == 100) {
          //this._saveContractTerms(response.result.id);
          this._getTerms();
          this.cancelClausule();
        } else
          this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _updateClausule(term: ITerms): void {
    this.isWorking = true;
    this.apiService.update(EEndpoints.Term, term).subscribe(
      (response: ResponseApi<ITermType>) => {
        if (response.code == 100) {
          this._getTerms();
          this.cancelClausule();
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _saveContractTerms(termId: number): void {
    this.isWorking = true;
    const contractTerm: IContractTerms = {
      id: 0,
      contractId: this.termTypeContract.contractId,
      termId: termId,
      position: 0
    };
    this.apiService.save(EEndpoints.ContractTerm, contractTerm).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this._getTerms();
          this.cancelClausule();
        } else
          this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _save(contractTerms: IContractTerms[]): void {
    this.isWorking = true;
    this.apiService.save(EEndpoints.ContractTerms, contractTerms).subscribe(
      (response: ResponseApi<ITerms[]>) => {
        if (response.code == 100) {
          this.dialogRef.close(true);
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }
  //#endregion
}
