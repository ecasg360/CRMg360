import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { SignalRService } from '@services/signalR.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EAnnouncementType } from '@enums/types';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { AccountService } from '@services/account.service';
import { INotificationWeb } from '@models/notification-web';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ProjectTask } from '@models/project-task';
import { ToasterService } from '@services/toaster.service';
import { Router } from '@angular/router';


@Component({
    selector: 'quick-panel',
    templateUrl: './quick-panel.component.html',
    styleUrls: ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class QuickPanelComponent implements OnInit, OnDestroy {

    date: Date;
    events: any[];
    notes: any[];
    settings: any;
    isWorking: boolean = true;
    notificationsList: INotificationWeb[] = [];
    private _unsubscribeAll: Subject<any>;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    /**
     * Constructor
     */
    constructor(
        private _signalService: SignalRService,
        private apiService: ApiService,
        private accountService: AccountService,
        public dialog: MatDialog,
        private translate: TranslateService,
        private translationLoader: FuseTranslationLoaderService,
        private toaster: ToasterService,
        private router: Router,
    ) {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud: false,
            retro: true
        };
    }

    ngOnInit(): void {
        this.translationLoader.loadTranslations(...allLang);
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        //subscribe to Announcement
        this._signalService.getAnnouncement()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((type: EAnnouncementType) => {
                if (type == EAnnouncementType.notification) {
                    const user = this.accountService.getLocalUserProfile();
                    this._getNotifications(user.id);
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackFun(index, item) {
        return (item.id) ? item.id : index;
    }

    deleteNotification(notificationId: number) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
          });
      
          this.confirmDialogRef.componentInstance.confirmMessage = this.translate.instant('messages.deleteQuestion', { field: '' });
      
          this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._deleteNotification(notificationId);
            }
            this.confirmDialogRef = null;
          });        
    }

    sortNotification(a:INotificationWeb, b:INotificationWeb) {
        
    }

    private _getNotifications(userId: number) {
        this.isWorking = true;
        this.apiService.get(EEndpoints.NotificationWeb, { userId: userId })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (response: ResponseApi<INotificationWeb[]>) => {
                    this.isWorking = false;
                    if (response.code == 100) {
                        this.notificationsList = response.result
                        .filter(f => f.active)
                        .sort((a, b) => {
                            const timeA = (new Date(a.created)).getTime();
                            const timeB = (new Date(b.created)).getTime();
                            if (timeA > timeB) return -1;
                            if (timeA < timeB) return 1;
                            return 0;
                          });
                    }
                    this.isWorking = false;
                    console.log(this.notificationsList);
                }
            ), (err: any) => {
                this.isWorking = false;
            }
    }

    private _deleteNotification(notificationId: number) {
        this.isWorking = true;
        this.apiService.delete(EEndpoints.NotificationWeb, { id: notificationId })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (response: ResponseApi<boolean>) => {
                    this.isWorking = false;
                    if (response.code == 100)
                        this.notificationsList = this.notificationsList.filter(f => f.id != notificationId);
                    this.isWorking = false;
                }
            ), (err: any) => {
                this.isWorking = false;
            }
    }

    goToProject(taskId) {
        console.log('taskId: ', taskId);
        this.apiService.get(EEndpoints.ProjectTask, { id: taskId }).subscribe(
            (response: ResponseApi<ProjectTask>) => {
                if (response.code == 100) {
                    console.log('the response goToProject: ', response);
                    this.router.navigateByUrl(`/projects/manage/${response.result.projectId}`);
                }
            }, err => this._responseError(err)
        );
    }

    private _responseError(err: any) {
        console.log(err);
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
      }
}
