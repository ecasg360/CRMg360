import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ProjectBudget, ProjectBudgetExtend } from '@models/project-budget';
import { IProject } from '@models/project';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ProjectBudgetModalComponent } from './project-budget-modal/project-budget-modal.component';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectBudgetDetailComponent } from './project-budget-detail/project-budget-detail.component';
import { ProjectBudgetDetail } from '@models/project-budget-detail';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { Subject } from 'rxjs';
import { ComponentsComunicationService } from '@services/components-comunication.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-budget',
  templateUrl: './project-budget.component.html',
  styleUrls: ['./project-budget.component.scss']
})

export class ProjectBudgetComponent implements OnInit, OnChanges, OnDestroy {

  @Input() project: IProject = <IProject>{};
  @Input() perm: any = {};

  isWorking: boolean = false;
  isEdit: boolean = false;
  availableBudget: number = 0;
  projectBudgetList: ProjectBudgetExtend[] = [];
  // Private
  private _unsubscribeAll: Subject<any>;
  totalSpent: number = 0.0;

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
    private comunicationService: ComponentsComunicationService,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.translationLoader.loadTranslationsList(allLang);
    this.comunicationService.getTravelLogisticBudget()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
          (response: boolean) => {
          console.log(response);
          this._getProjectBudget();
        }
      )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.project) {
      if (Object.keys(changes.project.currentValue).length > 0) {
        this._getProjectBudget();
      }
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  showModalBudget(budget: ProjectBudget = <ProjectBudget>{}): void {
    this.isWorking = true;
    const dialogRef = this.dialog.open(ProjectBudgetModalComponent, {
      width: '500px',
      data: {
        model: budget,
        projectId: this.project.id,
        projectTypeId: this.project.projectTypeId,
        budget: this.project.totalBudget,
        availableBudget: this.project.totalBudget,
        spent: 0,
      }
    });
    dialogRef.afterClosed().subscribe((result: ProjectBudget) => {
      if (result)
        this._getProjectBudget();
    });
    this.isWorking = false;
  }

  showModalDetail(budget: ProjectBudget, detail: ProjectBudgetDetail = <ProjectBudgetDetail>{}) {
    this.isWorking = true;

    const dialogRef = this.dialog.open(ProjectBudgetDetailComponent, {
      width: '500px',
      data: {
        budget: budget,
        budgetDetail: detail,
        projectTypeId: this.project.projectTypeId,
      }
    });
    dialogRef.afterClosed().subscribe((result: ProjectBudgetDetail) => {
      if (result) {
        this._getProjectBudget();
      }
    });
    this.isWorking = false;
  }

  deleteBudget(budget: ProjectBudget) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: budget.category.name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this._deleteBudgetApi(budget.id);
      }
    });
  }

  deleteBudgetDetail(detail: ProjectBudgetDetail) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: detail.category.name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this._deleteBudgetDetailApi(detail.id);
      }
    });
  }

  downloadFile() {
    this.isWorking = true;
    let projectId = this.project.id;
    this.apiService.download(EEndpoints.ProjectBudgetDownload, { projectId: projectId })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        fileData => {
          const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let link = document.createElement("a");
          if (link.download !== undefined) {
            let url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "ProjectBudget Proyecto");
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
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
  }

  //#region API
  private _getProjectBudget(): void {
    this.isWorking = true;
    this.totalSpent = 0.0;
    this.apiService.get(EEndpoints.ProjectBudgets, { projectId: this.project.id })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: ResponseApi<ProjectBudget[]>) => {
          if (response.code == 100) {
            this.projectBudgetList = response.result.map(m => {
              m['saldo'] = m.budget - m.spent;
              return <ProjectBudgetExtend>m;
            });
            if (response.result.length == 0) {
              this._getConfigurationBudget();
            }
            this.projectBudgetList.forEach(element => {
              this.totalSpent += element.spent;
            });
          } else
            this.toaster.showToaster(this.translate.instant('errors.errorGettingBudgets'));
          this.isWorking = false;
        }, err => this._responseError(err)
      )
  }

  private _deleteBudgetApi(id: number) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.ProjectBudget, { id: id })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: ResponseApi<boolean>) => {
          if (response.code == 100) {
            this.projectBudgetList = this.projectBudgetList.filter(f => f.id != id);
            this._getProjectBudget();
          } else {
            this.toaster.showToaster(this.translate.instant('errors.errorDeletingItem'));
          }
          this.isWorking = false;
        }, err => this._responseError(err)
      )
  }

  private _deleteBudgetDetailApi(id: number) {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.ProjectBudgetDetail, { id: id })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: ResponseApi<boolean>) => {
          if (response.code == 100)
            this._getProjectBudget();
          else
            this.toaster.showToaster(this.translate.instant('errors.errorDeletingItem'));
          this.isWorking = false;
        }, err => this._responseError(err)
      )
  }

  private _getConfigurationBudget() {
    this.apiService.get(EEndpoints.ConfigurationPBudgetCategory, { projectTypeId: this.project.projectTypeId })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: ResponseApi<any>) => {
          console.log(response);
        }, err => this._responseError(err)
      );
  }
  //#endregion
}
