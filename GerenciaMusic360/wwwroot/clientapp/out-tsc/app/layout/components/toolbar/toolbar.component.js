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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import * as signalR from '@aspnet/signalr';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { navigation } from '@app/navigation/navigation';
import { AccountService } from '@services/account.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { SignalRService } from '@services/signalR.service';
import { EAnnouncementType } from '@enums/types';
import { ToasterService } from '@services/toaster.service';
import { ComponentsComunicationService } from '@services/components-comunication.service';
var ToolbarComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    function ToolbarComponent(_fuseConfigService, _fuseSidebarService, _translateService, accountService, _router, toaster, _signalService, _fuseTranslationLoaderService, comunication) {
        var _a;
        var _this = this;
        this._fuseConfigService = _fuseConfigService;
        this._fuseSidebarService = _fuseSidebarService;
        this._translateService = _translateService;
        this.accountService = accountService;
        this._router = _router;
        this.toaster = toaster;
        this._signalService = _signalService;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.comunication = comunication;
        // notificaitons count
        this.notificationsCount = 0;
        this.buildConnection = function () {
            _this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(environment.url + "/notificationHub")
                .build();
        };
        /**
         *
         */
        this.startConnection = function () {
            _this.hubConnection
                .start()
                .then(function () {
                //if (this.hubConnection) {
                //    let user = localStorage.getItem(environment.currentUser);
                //    if (user)
                //        this.hubConnection.send("join", JSON.parse(user).id);
                //} else
                //    console.log('no hub connection');
                console.log('Connection Started ...');
                _this.registerSignalEvents();
            })
                .catch(function (err) {
                console.log('Error while starting connection: ', err);
                setTimeout(function () {
                    _this.startConnection();
                }, 3000);
            });
        };
        // Set the defaults
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];
        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'es',
                title: 'Spanish',
                flag: 'es'
            }
        ];
        this.navigation = navigation;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.buildConnection();
        this.startConnection();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ToolbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (settings) {
            _this.horizontalNavbar = settings.layout.navbar.position === 'top';
            _this.rightNavbar = settings.layout.navbar.position === 'right';
            _this.hiddenNavbar = settings.layout.navbar.hidden === true;
        });
        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, { 'id': this._translateService.currentLang });
        var userData = this.accountService.getLocalUserProfile();
        if (userData) {
            this.avatar = (userData.pictureUrl)
                ? this.avatar = userData.pictureUrl
                : "assets/images/avatars/profile_" + userData.gender.toLowerCase() + ".png?" + new Date().getMilliseconds();
            this.userName = userData.name + " " + userData.lastName;
        }
        this.comunication.getProfileChangeNotification()
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (message) {
            var userData = _this.accountService.getLocalUserProfile();
            _this.avatar = (userData.pictureUrl)
                ? _this.avatar = userData.pictureUrl
                : "assets/images/avatars/profile_" + userData.gender.toLowerCase() + ".png?" + new Date().getMilliseconds();
            _this.userName = userData.name + " " + userData.lastName;
        });
    };
    /**
     * On destroy
     */
    ToolbarComponent.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Toggle sidebar open
     *
     * @param key
     */
    ToolbarComponent.prototype.toggleSidebarOpen = function (key) {
        this.notificationsCount = 0;
        if (key == 'quickPanel') {
            this._signalService.sendAnnouncement(EAnnouncementType.notification);
        }
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    };
    ToolbarComponent.prototype.registerSignalEvents = function () {
        var _this = this;
        this.hubConnection.on('SignalMessagereceived', function (data) {
            var user = JSON.parse(localStorage.getItem(environment.currentUser));
            if ((data.usersGuids && data.usersGuids.findIndex(function (f) { return f == user.id; }) >= 0) ||
                data.usersIds && data.usersIds.findIndex(function (f) { return f == user.userId; }) >= 0) {
                _this.toaster.showTranslate('messages.notificationMessage', 8000);
                _this._signalService.sendAnnouncement(EAnnouncementType.notification);
                _this.notificationsCount++;
                console.log(_this.notificationsCount);
            }
        });
        this.hubConnection.on("ReceiveNotification", function (message) {
            var count = parseInt(message);
            console.log('ReceiveNotification', message);
            _this.toaster.showTranslate('messages.notificationMessage');
            _this._signalService.sendAnnouncement(EAnnouncementType.notification);
            _this.notificationsCount++;
        });
    };
    /**
     * Search
     *
     * @param value
     */
    ToolbarComponent.prototype.search = function (value) {
        // Do your search here...
        console.log(value);
    };
    /**
     * Set the language
     *
     * @param lang
     */
    ToolbarComponent.prototype.setLanguage = function (lang) {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;
        // Use the selected language for translations
        this._translateService.use(lang.id);
        localStorage.setItem(environment.lang, lang.id);
        console.log(lang.id);
    };
    ToolbarComponent.prototype.goToProfile = function () {
        this._router.navigate(['/security/profile']);
    };
    ToolbarComponent.prototype.goToInbox = function () {
        this._router.navigate(['/general/inbox']);
    };
    ToolbarComponent.prototype.logout = function () {
        this.accountService.logout();
    };
    ToolbarComponent = __decorate([
        Component({
            selector: 'toolbar',
            templateUrl: './toolbar.component.html',
            styleUrls: ['./toolbar.component.scss'],
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [FuseConfigService,
            FuseSidebarService,
            TranslateService,
            AccountService,
            Router,
            ToasterService,
            SignalRService,
            FuseTranslationLoaderService,
            ComponentsComunicationService])
    ], ToolbarComponent);
    return ToolbarComponent;
}());
export { ToolbarComponent };
//# sourceMappingURL=toolbar.component.js.map