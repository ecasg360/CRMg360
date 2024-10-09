var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewEncapsulation } from '@angular/core';
import { SignalRService } from '@services/signalR.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EAnnouncementType } from '@enums/types';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { AccountService } from '@services/account.service';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { Router } from '@angular/router';
var QuickPanelComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function QuickPanelComponent(_signalService, apiService, accountService, dialog, translate, translationLoader, toaster, router) {
        this._signalService = _signalService;
        this.apiService = apiService;
        this.accountService = accountService;
        this.dialog = dialog;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.toaster = toaster;
        this.router = router;
        this.isWorking = true;
        this.notificationsList = [];
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud: false,
            retro: true
        };
    }
    QuickPanelComponent.prototype.ngOnInit = function () {
        var _a;
        var _this = this;
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        //subscribe to Announcement
        this._signalService.getAnnouncement()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (type) {
            if (type == EAnnouncementType.notification) {
                var user = _this.accountService.getLocalUserProfile();
                _this._getNotifications(user.id);
            }
        });
    };
    /**
     * On destroy
     */
    QuickPanelComponent.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    QuickPanelComponent.prototype.trackFun = function (index, item) {
        return (item.id) ? item.id : index;
    };
    QuickPanelComponent.prototype.deleteNotification = function (notificationId) {
        var _this = this;
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = this.translate.instant('messages.deleteQuestion', { field: '' });
        this.confirmDialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this._deleteNotification(notificationId);
            }
            _this.confirmDialogRef = null;
        });
    };
    QuickPanelComponent.prototype.sortNotification = function (a, b) {
    };
    QuickPanelComponent.prototype._getNotifications = function (userId) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.NotificationWeb, { userId: userId })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (response) {
            _this.isWorking = false;
            if (response.code == 100) {
                _this.notificationsList = response.result
                    .filter(function (f) { return f.active; })
                    .sort(function (a, b) {
                    var timeA = (new Date(a.created)).getTime();
                    var timeB = (new Date(b.created)).getTime();
                    if (timeA > timeB)
                        return -1;
                    if (timeA < timeB)
                        return 1;
                    return 0;
                });
            }
            _this.isWorking = false;
            console.log(_this.notificationsList);
        }), function (err) {
            _this.isWorking = false;
        };
    };
    QuickPanelComponent.prototype._deleteNotification = function (notificationId) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.NotificationWeb, { id: notificationId })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (response) {
            _this.isWorking = false;
            if (response.code == 100)
                _this.notificationsList = _this.notificationsList.filter(function (f) { return f.id != notificationId; });
            _this.isWorking = false;
        }), function (err) {
            _this.isWorking = false;
        };
    };
    QuickPanelComponent.prototype.goToProject = function (taskId) {
        var _this = this;
        console.log('taskId: ', taskId);
        this.apiService.get(EEndpoints.ProjectTask, { id: taskId }).subscribe(function (response) {
            if (response.code == 100) {
                console.log('the response goToProject: ', response);
                _this.router.navigateByUrl("/projects/manage/" + response.result.projectId);
            }
        }, function (err) { return _this._responseError(err); });
    };
    QuickPanelComponent.prototype._responseError = function (err) {
        console.log(err);
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    QuickPanelComponent = __decorate([
        Component({
            selector: 'quick-panel',
            templateUrl: './quick-panel.component.html',
            styleUrls: ['./quick-panel.component.scss'],
            encapsulation: ViewEncapsulation.None,
            animations: fuseAnimations
        }),
        __metadata("design:paramtypes", [SignalRService,
            ApiService,
            AccountService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService,
            ToasterService,
            Router])
    ], QuickPanelComponent);
    return QuickPanelComponent;
}());
export { QuickPanelComponent };
//# sourceMappingURL=quick-panel.component.js.map