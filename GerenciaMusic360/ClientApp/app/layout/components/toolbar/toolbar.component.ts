import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    avatar: string;
    userName: string;

    //tags
    logoutTag: string;

    // Private
    private _unsubscribeAll: Subject<any>;
    // hub connector
    private hubConnection: signalR.HubConnection;

    // notificaitons count
    notificationsCount: number = 0;


    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private accountService: AccountService,
        private _router: Router,
        private toaster: ToasterService,
        private _signalService: SignalRService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private comunication: ComponentsComunicationService,
    ) {
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

        this._fuseTranslationLoaderService.loadTranslations(...allLang);

        this.buildConnection();
        this.startConnection();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, { 'id': this._translateService.currentLang });

        const userData = this.accountService.getLocalUserProfile();
        if (userData) {
            this.avatar = (userData.pictureUrl)
                ? this.avatar = userData.pictureUrl
                : `assets/images/avatars/profile_${userData.gender.toLowerCase()}.png?${new Date().getMilliseconds()}`;

            this.userName = `${userData.name} ${userData.lastName}`;
        }

        this.comunication.getProfileChangeNotification()
        .pipe(takeUntil(this._unsubscribeAll)).subscribe(message => {
            const userData = this.accountService.getLocalUserProfile();
            this.avatar = (userData.pictureUrl)
                ? this.avatar = userData.pictureUrl
                : `assets/images/avatars/profile_${userData.gender.toLowerCase()}.png?${new Date().getMilliseconds()}`;

            this.userName = `${userData.name} ${userData.lastName}`;
        })
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this.notificationsCount = 0;
        if (key == 'quickPanel') {
            this._signalService.sendAnnouncement(EAnnouncementType.notification);
        }
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    public buildConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.url}/notificationHub`)
            .build();
    }

    /**
     * 
     */
    public startConnection = () => {

        this.hubConnection
            .start()
            .then(() => {
                //if (this.hubConnection) {
                //    let user = localStorage.getItem(environment.currentUser);
                //    if (user)
                //        this.hubConnection.send("join", JSON.parse(user).id);
                //} else
                //    console.log('no hub connection');
                console.log('Connection Started ...');
                this.registerSignalEvents();
            })
            .catch(err => {
                console.log('Error while starting connection: ', err);
                setTimeout(() => {
                    this.startConnection();
                }, 3000);
            })
    }

    public registerSignalEvents() {
        this.hubConnection.on('SignalMessagereceived', (data: any) => {            

            let user = JSON.parse(localStorage.getItem(environment.currentUser));
            if ((data.usersGuids && data.usersGuids.findIndex(f => f == user.id) >= 0) ||
                data.usersIds && data.usersIds.findIndex(f => f == user.userId) >= 0)
            {
                this.toaster.showTranslate('messages.notificationMessage', 8000);
                this._signalService.sendAnnouncement(EAnnouncementType.notification);
                this.notificationsCount++;
                console.log(this.notificationsCount);
            }
        });

        this.hubConnection.on("ReceiveNotification", (message: any) => {
            const count = parseInt(message);
            console.log('ReceiveNotification', message);
            this.toaster.showTranslate('messages.notificationMessage');
            this._signalService.sendAnnouncement(EAnnouncementType.notification);
            this.notificationsCount++;
        });
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;
        // Use the selected language for translations
        this._translateService.use(lang.id);
        localStorage.setItem(environment.lang, lang.id);
        console.log(lang.id);
    }

    goToProfile(): void {
        this._router.navigate(['/security/profile']);
    }

    goToInbox() {
        this._router.navigate(['/general/inbox']);
    }

    logout(): void {
        this.accountService.logout();
    }
}
