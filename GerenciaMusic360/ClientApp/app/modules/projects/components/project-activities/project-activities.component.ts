import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IActivities } from '@models/activities';
import { ComponentsComunicationService } from '@services/components-comunication.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-activities',
  templateUrl: './project-activities.component.html',
  styleUrls: ['./project-activities.component.scss']
})

export class ProjectActivitiesComponent implements OnInit, OnChanges, OnDestroy {

  @Input() projectId: number;

  isWorking: boolean = false;
    activitiesList: IActivities[] = [];
    private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
      private translationLoader: FuseTranslationLoaderService,
      private notification: ComponentsComunicationService
  ) { }

  ngOnInit() {
      this.translationLoader.loadTranslations(...allLang);
      this.notification.listenTaskChange().pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
          this._getActivities();
      });
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.projectId.currentValue > 0) {
      this._getActivities();
    }
  }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

  private _responseError(err: any) {
    console.log(err);
    this.toaster.showTranslate('general.errors.serverError');
    this.isWorking = false;
  }


  //#region API
  private _getActivities() {
    this.isWorking = true;
      this.apiService.get(EEndpoints.Activities, { projectId: this.projectId })
          .pipe(takeUntil(this.unsubscribeAll)).subscribe(
      (response: ResponseApi<IActivities[]>) => {
        if (response.code == 100)
          this.activitiesList = response.result;
        else
          this.toaster.showTranslate('general.errors.requestError');
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }
  //end region

}
