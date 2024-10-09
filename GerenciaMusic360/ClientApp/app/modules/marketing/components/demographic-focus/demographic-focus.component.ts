import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { IMarketingDemographics } from '@models/marketing-demographics';
import { ResponseApi } from '@models/response-api';
import { HttpErrorResponse } from '@angular/common/http';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-demographic-focus',
  templateUrl: './demographic-focus.component.html',
  styleUrls: ['./demographic-focus.component.scss'],
  animations: fuseAnimations
})

export class DemographicFocusComponent implements OnInit, OnChanges {
  @Input() marketingId: number;
  @Input() perm:any = {};

  isWorking: boolean = false;
  showError: boolean = false;
  errorMessage: string;
  list: IMarketingDemographics[] = [];
  demographicForm: FormGroup;

  basePieChart: any = {
    // pie options
    legend: true,
    legendTitle: "Legend",
    legendPosition: 'right',
    explodeSlices: false,
    labels: true,
    showLegend: true,
    doughnut: true,
    gradient: false,
    scheme: {
      domain: ['#4fc3f7', '#e57373', '#f06292', '#ba68c8', '#7986cb', '#9575cd',
        '#4dd0e1', '#4db6ac', '#81c784', '#dce775', '#ffb74d', '#7d818c',
        '#f44336', '#9c27b0', '#03a9f4', '#e91e63', '#666666']
    },
    data: [],
  };

  displayedColumns: string[] = ['name', 'percentage', 'action'];
  dataSource: MatTableDataSource<IMarketingDemographics>;

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private translationLoaderService: FuseTranslationLoaderService,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this.translationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.demographicForm = this.fb.group({
      id: [null, []],
      marketingId: [this.marketingId, []],
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)]],
      percentage: [0, [
        Validators.required
      ]]
    });
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.marketingId.currentValue) {
      this._getMarketingDemographics(this.marketingId);
    }
  }

  get f() { return this.demographicForm.controls; }

  setFocus() {
    this.isWorking = true;
    const model = <IMarketingDemographics>this.demographicForm.value;
    if (model.id) {
      const index = this.list.findIndex(f => f.id == model.id);
      if (index >= 0) {
        this.list.splice(index, 1, model);
      }
    } else
      this.list.push(model);

    this._saveMarketingDemographics(this._formatData());
  }

  delete(id: number) {
    const index = this.list.findIndex(f => f.id == id);
    if (index >= 0) {
      this.list.splice(index, 1);
      this._saveMarketingDemographics(this._formatData());
    }
  }

  edit(item: IMarketingDemographics) {
    this.demographicForm.setValue({
      id: item.id,
      name: item.name,
      percentage: item.percentage,
      marketingId: item.marketingId,
    })
  }

  private _formatData(): IMarketingDemographics[] {
    return this.list.map(m => {
      return <IMarketingDemographics>{
        name: m.name,
        percentage: m.percentage,
        marketingId: this.marketingId,
      }
    });
  }


  private _responseError(err: HttpErrorResponse): void {
    console.log(err);
    this.isWorking = false;
    this.toaster.showTranslate('general.errors.serverError');
  }

  //#region API
  private _getMarketingDemographics(marketingId: number) {
    this.isWorking = true;
    this.apiService.get(EEndpoints.MarketingDemographics, { marketingId: marketingId }).subscribe(
      (response: ResponseApi<IMarketingDemographics[]>) => {
        if (response.code == 100) {
          this.basePieChart.data = response.result.map(m => {
            return {
              name: m.name,
              value: m.percentage
            }
          });
          this.list = response.result;
          this.dataSource = new MatTableDataSource(this.list);
        } else
          this.toaster.showTranslate('general.errors.requestError');

        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _saveMarketingDemographics(data: IMarketingDemographics[]) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingDemographics, data).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this._getMarketingDemographics(this.marketingId);
          this.demographicForm.reset();
        } else {
          this.toaster.showTranslate('general.errors.requestError');
          this.isWorking = false;
        }
      }, err => this._responseError(err)
    )
  }
  //#endregion
}
