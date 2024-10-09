import { Component, OnInit, Optional, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort, MatAutocompleteSelectedEvent } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { SelectOption } from '@models/select-option.models';
import { Observable } from 'rxjs';
import { ITermType, IContractTermType } from '@models/termType';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-term-type',
  templateUrl: './add-term-type.component.html',
  styleUrls: ['./add-term-type.component.scss']
})

export class AddTermTypeComponent implements OnInit {
  form: FormGroup;
  isWorking: boolean = false;
  contractId: number = 0;
  termTypes: SelectOption[] = [];
  selectedTermTypes: SelectOption[] = [];
  termTypeFC = new FormControl();
  filteredOptions: Observable<SelectOption[]>;
  question = '';
  contractTermTypeList: IContractTermType[] = [];

  displayedColumns: string[] = ['name', 'action'];
  dataSource: MatTableDataSource<SelectOption>;
  @ViewChild(MatPaginator, { static: true } as any) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<AddTermTypeComponent>,
    private toaster: ToasterService,
    private apiService: ApiService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private _translationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this._getTermTypes();
  }

  ngOnInit() {
    this._translationLoaderService.loadTranslations(...allLang);
    this.contractId = this.data.contractId;
    this.contractTermTypeList = <IContractTermType[]>this.data.contractTermType;
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    this.configureForm();
  }

  configureForm(): void {
    this.form = this.fb.group({
      termType: ['', [Validators.required]]
    });
  }

  get f() { return this.form.controls; }

  enter() {
    const value = this.termTypeFC.value;
    if (value.indexOf(this.question) < 0) {
      const found = this.termTypes.find(f => f.viewValue.toLowerCase() == value.toLowerCase());
      if (found) {
        this.selectedTermTypes.push(found);
        this.termTypes = this.termTypes.filter(f => f.value != found.value);
        this._fillTable();
      } else
        this._saveTermType(value);

      this.termTypeFC.patchValue('');
    }
  }

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
    if ($event.option.id != '0') {
      const found = this.termTypes.find(f => f.value == $event.option.id);
      if (found) {
        this.selectedTermTypes.push(found);
        this.termTypes = this.termTypes.filter(f => f.value != found.value);
        this._fillTable();
      }
    } else {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
      this._saveTermType(newItem);
    }
    this.termTypeFC.patchValue('');
  }

  deleteTermTypeTable(row: SelectOption) {
    const found = this.selectedTermTypes.find(f => f.value == row.value);
    if (found) {
      this.selectedTermTypes = this.selectedTermTypes.filter(f => f.value != row.value);
      this.termTypes.push(found);
      this._fillTable();
    }
  }

  set() {
    const params = this._formatTermTypes();
    this._save(params);
  }

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }

  private _fillTable(): void {
    this.dataSource = new MatTableDataSource(this.selectedTermTypes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.f.termType.patchValue(this.selectedTermTypes);
    this.termTypeFC.setValue('');
  }

  private _filter(value: string): SelectOption[] {
    const filterValue = value.toLowerCase();
    let result = this.termTypes.filter(option => option.viewValue.toLowerCase().includes(filterValue));
    return (result.length == 0)
      ? [{
        value: 0,
        viewValue: `${this.question}${value.trim()}"?`
      }]
      : result;
  }

  private _formatTermTypes(): IContractTermType[] {
    return this.selectedTermTypes.map(m => {
      return <IContractTermType>{
        termTypeId: m.value,
        contractId: this.contractId
      }
    });
  }

  private _responseError(error: any): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  //#region API

  private _getTermTypes() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.TermTypes).subscribe(
      (response: ResponseApi<ITermType[]>) => {
        if (response.code == 100) {
          response.result.forEach((item: ITermType) => {
            const index = this.contractTermTypeList.findIndex(f => f.termTypeId == item.id);
            if (index < 0) {
              this.termTypes.push(<SelectOption>{
                value: item.id,
                viewValue: item.name
              })
            }
          });
          this.filteredOptions = this.termTypeFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _save(types: IContractTermType[]): void {
    this.isWorking = true;
    this.apiService.save(EEndpoints.ContractTermTypes, types).subscribe(
      (response: ResponseApi<any[]>) => {
        if (response.code == 100) {
          this.dialogRef.close(true);
        }
        this.isWorking = false;
      }, (err) => this._responseError(err)
    );
  }

  private _saveTermType(name: string) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.TermType, { name: name }).subscribe(
      (response: ResponseApi<ITermType>) => {
        if (response.code == 100) {
          this.selectedTermTypes.push({
            value: response.result.id,
            viewValue: response.result.name
          });
          this._fillTable();
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }
  //#endregion
}
