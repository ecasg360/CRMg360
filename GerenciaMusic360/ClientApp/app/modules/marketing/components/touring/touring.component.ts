import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IMarketingKeyIdeas, IKeysIdeas, IMarketingKeyIdeasNames, IMarketingKeyIdeasBudget } from '@models/keys-ideas-view-models';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatTableDataSource } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-touring',
  templateUrl: './touring.component.html',
  styleUrls: ['./touring.component.scss']
})
export class TouringComponent implements OnInit {
  isWorking: boolean = false;
  model: IMarketingKeyIdeas = <IMarketingKeyIdeas>{};
  usedKeysIdeas: IKeysIdeas[] = [];
  keysIdeasList: IKeysIdeas[] = [];
  descriptionFC = new FormControl();
  filteredOptions: Observable<IKeysIdeas[]>;
  question = '';
  displayedColumns: string[] = ['description', 'action'];
  dataSource: MatTableDataSource<IKeysIdeas>;

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private translationLoaderService: FuseTranslationLoaderService,
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<TouringComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.translationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.model = <IMarketingKeyIdeas>this.data.marketingKey;
    this.usedKeysIdeas = <IKeysIdeas[]>this.data.keysIdeas;
    this._getKeyIdeas();
    this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    this.dataSource = new MatTableDataSource(this.usedKeysIdeas);
  }

  enter() {
    const value = this.descriptionFC.value;
    if (value.indexOf(this.question) < 0) {
      const found = this.keysIdeasList.find(f => f.name == value);
      if (found)
        this._fillTable(found);
      else
        this._setKeyIdea(value);
    }
  }

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
    if ($event.option.id != '0') {
      const found = this.keysIdeasList.find(f => f.id == parseInt($event.option.id));
      if (found) {
        this._fillTable(found);
      }
    } else {
      let newItem = $event.option.value.substring(this.question.length).split('"?')[0];
      this._setKeyIdea(newItem);
    }
  }

  delete(keyIdea: IKeysIdeas) {
    const index = this.usedKeysIdeas.findIndex(f => f.id == keyIdea.id);
    if (index >= 0) {
      this.usedKeysIdeas.splice(index, 1);
      this.keysIdeasList.push(keyIdea);
      this._fillTable(undefined);
    }
  }

  private _fillTable(keyIdea: IKeysIdeas) {
    if (keyIdea != undefined && keyIdea != null) {
      this.usedKeysIdeas.push(keyIdea);
      this.keysIdeasList = this.keysIdeasList.filter(f => f.id != keyIdea.id);
      this.descriptionFC.patchValue('');
    }
    this.dataSource.data = this.usedKeysIdeas;
  }

  private _setKeyIdea(name: string) {
    const keyIdea = <IKeysIdeas>{
      categoryId: this.model.categoryId,
      keyIdeasTypeId: this.model.keyIdeasTypeId,
      name: name,
      position: this.keysIdeasList.length + 1,
    }
    this._createKeysIdeas(keyIdea);
  }

  onNoClick(overview: IMarketingKeyIdeas = undefined): void {
    this.dialogRef.close(overview);
  }

  save() {
    if (this.usedKeysIdeas.length > 0) {
      const keysNames = this.usedKeysIdeas.map((m) => {
        return <IMarketingKeyIdeasNames>{
          marketingKeyIdeasId: this.model.id,
          keyIdeasId: m.id
        }
      });
      this._deleteKeysNames(this.model.id, keysNames);
    }
  }

  private _filter(value: string): IKeysIdeas[] {
    const filterValue = value.toLowerCase();
    let result = this.keysIdeasList.filter(option => option.name.toLowerCase().includes(filterValue));
    return (result.length == 0)
      ? [<IKeysIdeas>{
        id: 0,
        name: `${this.question}${value.trim()}"?`
      }]
      : result;
  }

  private _responseError(error: any): void {
    this.isWorking = false;
    this.toaster.showTranslate('general.errors.serverError');
  }

  //#region API

  private _getKeyIdeas() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.KeyIdeasByType, { keyIdeasTypeId: this.model.keyIdeasTypeId }).subscribe(
      (response: ResponseApi<IKeysIdeas[]>) => {
        if (response.code == 100) {
          this.keysIdeasList = response.result.filter(f => {
            const found = this.usedKeysIdeas.find(used => used.id == f.id);
            return found ? false : true;
          });
          this.filteredOptions = this.descriptionFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _createKeysIdeas(keyIdea: IKeysIdeas) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.KeyIdea, keyIdea).subscribe(
      (response: ResponseApi<IKeysIdeas>) => {
        if (response.code == 100) {
          keyIdea.id = response.result.id;
          this._fillTable(keyIdea);
          setTimeout(() => this.descriptionFC.setValue(''));
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.descriptionFC.patchValue('');
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _saveKeyIdeasNames(keyNames: IMarketingKeyIdeasNames[]) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingKeyIdeaNames, keyNames).subscribe(
      (response: ResponseApi<IMarketingKeyIdeasNames[]>) => {
        if (response.code == 100) {
          this.onNoClick(this.model);
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _deleteKeysNames(marketingKeyIdeasId: number, marketingKeyIdeasNames: IMarketingKeyIdeasNames[]) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.MarketingKeyIdeaNameByMarketingKeysId, { marketingKeyIdeasId: marketingKeyIdeasId }).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100)
          this._saveKeyIdeasNames(marketingKeyIdeasNames);
        else
          this.isWorking = false;
      }, err => this._responseError(err)
    )
  }
  //#endregion
}
