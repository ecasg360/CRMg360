import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { AddGoalComponent } from './add-goal/add-goal.component';
import { IMarketingGoals } from '@models/goals';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { GoalAuditModalComponent } from '../goal-audit-modal/goal-audit-modal.component';
import { IMarketing } from '@models/marketing';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})

export class GoalsComponent implements OnInit, OnChanges {

  @Input() marketing: IMarketing = <IMarketing>{};
  @Input() perm:any = {};

  isWorking: boolean = false;
  marketingGoalsList: IMarketingGoals[] = [];

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private translationLoader: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this.translationLoader.loadTranslationsList(allLang);
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.marketing.currentValue.id)
      this._getMarketingGoals();
  }

  showModal(item: IMarketingGoals = <IMarketingGoals>{}) {
    if (!item.id) {
      item.marketingId = this.marketing.id;
    }
    const dialogRef = this.dialog.open(AddGoalComponent, {
      width: '700px',
      data: {
        model: item,
        marketingId: this.marketing.id,
      }
    });
    dialogRef.afterClosed().subscribe((result: IMarketingGoals) => {
      if (!result)
        return;
      this._getMarketingGoals();
    });
  }

  showAuditModal() {
    const requiredGoals = this.marketingGoalsList.filter(
      f => f.socialNetworkName.toLowerCase().indexOf('facebook') >= 0 || f.socialNetworkName.toLowerCase().indexOf('instagram') >= 0);
    if (requiredGoals.length != 2) {
      this.toaster.showTranslate('messages.mustSocial');
      return;
    }
    const dialogRef = this.dialog.open(GoalAuditModalComponent, {
      width: '900px',
      data: {
        marketing: this.marketing,
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result)
        return;
    });
  }

  deleteGoal(goal: IMarketingGoals) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: goal.goalName }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm) {
          this._deleteGoal(goal.id);
        }
      }
    });
  }

  private _responseError(error: any): void {
    this.toaster.showTranslate('general.errors.serverError');
    this.isWorking = false;
  }

  //#region API

  private _getMarketingGoals() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.MarketingGoals, { marketingId: this.marketing.id }).subscribe(
      (response: ResponseApi<IMarketingGoals[]>) => {
        if (response.code == 100)
          this.marketingGoalsList = response.result;
        else
          this.toaster.showTranslate('errors.errorGettingItems');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _deleteGoal(id: number) {
    this.apiService.delete(EEndpoints.MarketingGoal, { id: id }).subscribe(
      (response: ResponseApi<boolean>) => {
        this._getMarketingGoals();
        }, err => this._responseError(err)
        , () => { console.log('finish')}
    )
  }
  //#endregion
}
