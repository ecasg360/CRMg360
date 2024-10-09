import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { IMarketingPlan, IMarketingPlanAutorizes } from '@models/marketing-plan';
import { ECommentType } from '@enums/modules-types';
import { EModules } from '@enums/modules';
import { IMarketing } from '@models/marketing';
import { MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ModalPlanComponent } from './modal-plan/modal-plan.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MarketingPlanCompleteComponent } from '../marketing-plan-complete/marketing-plan-complete.component';

@Component({
  selector: 'app-campain-plan',
  templateUrl: './campain-plan.component.html',
  styleUrls: ['./campain-plan.component.scss']
})
export class CampainPlanComponent implements OnInit, OnDestroy {

  @Input() marketing: IMarketing = <IMarketing>{};
  @Input() perm:any ={};

  marketingPlans: IMarketingPlan[] = [];
  isWorking: boolean = false;
  isAllSelected: boolean = false;
  commentType = ECommentType;
  moduleType = EModules;
  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private translationLoader: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this.translationLoader.loadTranslationsList(allLang);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.marketing) {
      if (Object.keys(changes.marketing.currentValue).length > 0) {
        this._getMarketingPlanApi();
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  trackByFn(index, item) {
    return (item.id) ? item.id : index;
  }

  drop(event: CdkDragDrop<IMarketingPlan[]>) {
    moveItemInArray(this.marketingPlans, event.previousIndex, event.currentIndex);
    const params = this.marketingPlans.map((m: IMarketingPlan, index: number) => {
      return {
        id: m.id,
        TaskDocumentDetailId: m.taskDocumentDetailId,
        position: index + 1
      }
    });
    this._updatePositionPlan(params);
  }

  addData(action: string, row: IMarketingPlan = <IMarketingPlan>{}): void {
    this.isWorking = true;

    if (action == 'new') {
      row = <IMarketingPlan>{
        id: null,
        marketingId: this.marketing.id,
        taskDocumentDetailId: 0,
        position: this.marketingPlans.length + 1,
        notes: null,
        estimatedDateVerification: null,
        required: false,
        status: true,
        name: null,
        complete: false,
        estimatedDateVerificationString: null,
      };
    }

    const dialogRef = this.dialog.open(ModalPlanComponent, {
      width: '500px',
      data: {
        model: row,
        maxDate: (this.marketing.endDateString) ? this.marketing.endDateString : new Date(2120, 0, 1),
        minDate: this.marketing.startDateString,
        action: action,
      }
    });
    dialogRef.afterClosed().subscribe((result: IMarketingPlan) => {
      this.isWorking = false;
      if (!result)
        return;

      if (result.id) {
        result = this._formatTaskProjectParams(result, false);
        this._updateMarketingPlanApi(result);
      } else {
        result = this._formatTaskProjectParams(result);
        this._saveMarketingPlanApi(result);
      }
    });

  }

  getComments(task: IMarketingPlan): void {
    task.comments = !task.comments;
  }

  private _formatTaskProjectParams(task: any, deleteId: boolean = true): IMarketingPlan {

    if (deleteId)
      delete task.id;

    delete task.created;
    delete task.creator;
    delete task.estimatedDateVerfication;
    delete task.modified;
    delete task.modifier;
    delete task.isNew;
    delete task.comments;
    delete task.checked;
    return task;
  }

  private _formatUserAuthorizers(marketingPlanIdId: number, users: any[]): IMarketingPlanAutorizes[] {
    if (users.length > 0)
      return users.map(m => {
        return <IMarketingPlanAutorizes>{
          marketingPlanId: marketingPlanIdId,
          userVerificationId: m.id,
          notes: null,
        }
      });

    return null;
  }

  private _responseError(err: any) {
    console.log(err);
    this.toaster.showTranslate('general.errors.serverError');
    this.isWorking = false;
  }

  undoTask(task: IMarketingPlan) {
    const params = {
      id: task.id,
      notes: '',
      }
      this.setUndoProjectTaskApi(params);
  }

  //#region API

  markAsComplete(task: any) {
    this.isWorking = true;
    const dialogRef = this.dialog.open(MarketingPlanCompleteComponent, {
      width: '500px',
        data: {
        model: task,
      }
    });
      dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeAll)).subscribe((result: any) => {
      if (result) {
        this._getMarketingPlanApi();
      }
    });
    this.isWorking = false;
  }
  y
  setUndoProjectTaskApi(params: any): void {
    this.isWorking = true;

      this.apiService.save(EEndpoints.MarketingPlanUndoComplete, params).pipe(takeUntil(this.unsubscribeAll)).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
            this._getMarketingPlanApi();
        } else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

  private _getMarketingPlanApi(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.MarketingPlans, { marketingId: this.marketing.id }).subscribe(
      (response: ResponseApi<IMarketingPlan[]>) => {
        if (response.code == 100)
          this.marketingPlans = response.result;
        else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _saveMarketingPlanApi(plan: IMarketingPlan) {
    this.isWorking = true;
    const selectedUsers = plan['selectedUsers'];
    delete plan['selectedUsers'];

    this.apiService.save(EEndpoints.MarketingPlan, plan).subscribe(
      (response: ResponseApi<IMarketingPlan>) => {
        if (response.code == 100) {
          this.toaster.showTranslate('messages.itemSaved');
          if (selectedUsers)
            this._deleteMarketingPlanUsers(response.result.id, this._formatUserAuthorizers(response.result.id, selectedUsers));
          this._getMarketingPlanApi();
        } else {
          this.isWorking = false;
          this.toaster.showTranslate("errors.errorSavingItem");
        }
      }, err => this._responseError(err)
    )
  }

  private _updateMarketingPlanApi(plan: IMarketingPlan) {
    const selectedUsers = plan['selectedUsers'];
    delete plan['selectedUsers'];

    this.apiService.update(EEndpoints.MarketingPlan, plan).subscribe(
      (response: ResponseApi<number>) => {
        if (response.code == 100) {
          const index = this.marketingPlans.findIndex(f => f.id == plan.id);
          this.marketingPlans.splice(index, 1, plan);
          if (selectedUsers)
            this._deleteMarketingPlanUsers(plan.id, this._formatUserAuthorizers(plan.id, selectedUsers));
          else
            this.isWorking = false;
        } else {
          this.isWorking = false;
          this.toaster.showTranslate("errors.errorEditingItem");
        }          
      }, err => this._responseError(err)
    );
  }

  private _updatePositionPlan(params: any): void {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingPlanPosition, params).subscribe(
      (response: ResponseApi<number>) => {
        if (response.code != 100) {
          this._getMarketingPlanApi();
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _deleteMarketingPlanUsers(marketingPlanId: number, users: IMarketingPlanAutorizes[]) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.MarketingPlanAutorizes, {marketingPlanId: marketingPlanId}).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100)
          this._saveMarketingPlanUsers(users);
        else {
          this.toaster.showTranslate('errors.errorSavingUsers');
          this.isWorking = false;
        }
      }, err => this._responseError(err)
    )
  }

  private _saveMarketingPlanUsers(users: IMarketingPlanAutorizes[]) {
    this.isWorking = true;
    this.apiService.save(EEndpoints.MarketingPlanAutorizes, users).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code != 100)
          this.toaster.showTranslate('errors.errorSavingUsers');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }
  //#endregion

}
