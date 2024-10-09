import { environment } from '@environments/environment';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { navigation } from '@app/navigation/navigation';

import { ChatAdapter} from 'ng-chat';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IUser } from '@models/user';
import { HttpClient } from '@angular/common/http';
import { SignalRGroupAdapter } from '@shared/signalr-group-adapter';
import { SignalRService } from '@services/signalR.service';
import { AccountService } from '@services/account.service';
import { Idle, DEFAULT_INTERRUPTSOURCES, AutoResume } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';

@Component({
    selector: 'vertical-layout-1',
    templateUrl: './layout-1.component.html',
    styleUrls: ['./layout-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerticalLayout1Component implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;

    chatTitle: string;
    currentTheme = 'dark-theme';
    triggeredEvents = [];
    fileUploadUrl: string = `${SignalRGroupAdapter.serverBaseUrl}UploadFile`;
    uploadForm: FormGroup;  

    userId: string = "";
    username: string;
    pullFriends = environment.pullListFirends;

    adapter: ChatAdapter;
    signalRAdapter: SignalRGroupAdapter;
    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    countdown?: any;

    //private
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private apiService: ApiService,
        private http: HttpClient,
        private _signalService: SignalRService,
        private _accountService: AccountService,
        private idle: Idle,
        private keepalive: Keepalive,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private translationLoaderService: FuseTranslationLoaderService,
    ) {
        // Set the defaults
        this.navigation = navigation;
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.translate.onLangChange.subscribe((lang=>{
            console.log(lang);
        } ));

        this.translationLoaderService.loadTranslations(...allLang);
        this.chatTitle = this.translate.instant('general.chatTitle');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        

        this.uploadForm = this.formBuilder.group({
            profile: ['']
          });

        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
                //TODO: Mejorar: aqui solo se verifica si existe el panel lateral de menu para mostrar el chat, ya que cuando esta oculto es la pantalla de login
                if (!config.layout.navbar.hidden) {
                    this._getUsers();
                    const user = this._accountService.getLocalUserProfile();
                    if(user){
                        this.signalRAdapter = new SignalRGroupAdapter(`${user.name} ${user.lastName}`, this.http, this.apiService);
                        this.signalRAdapter.userId = user.userId;
                        this.userId = user.userId;

                        // sets an idle timeout of 5 seconds, for testing purposes.
                        this.idle.setIdle(5);
                        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
                        this.idle.setTimeout(600);
                        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
                        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
                        this.idle.setAutoResume(AutoResume.idle);

                        this.idle.onIdleEnd.subscribe(() => {
                            this.idleState = 'No longer idle.';
                        });
                        this.idle.onTimeout.subscribe(() => {
                            this.idleState = 'Timed out!';
                            this.timedOut = true;
                            this.updateStatusUser(3);
                        });
                        this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
                        this.idle.onTimeoutWarning.subscribe((countdown) =>{
                             this.idleState = 'You will time out in ' + countdown + ' seconds!';
                             this.countdown = countdown;
                        });

                        // sets the ping interval to 15 seconds
                        this.keepalive.interval(15);

                        this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

                        this.reset();
                    }
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

    private formatUsersChat(users: IUser[]) {

    }

    //#region API
    private _getUsers() {
        this.apiService.get(EEndpoints.Users).subscribe(
            (response: ResponseApi<IUser[]>) => {
                if (response.code == 100) {
                    this.formatUsersChat(response.result);
                }
            }, err => console.log(err)
        )
    }
    //#endregion

    //#region API
    switchTheme(theme: string): void {
        this.currentTheme = theme;
    }

    onEventTriggered(event: string): void {
        this.triggeredEvents.push(event);
    }

    joinSignalRChatRoom(): void {
        const userName = prompt('Please enter a user name:');
        this.signalRAdapter = new SignalRGroupAdapter(userName, this.http, this.apiService);
    }

    reset() {
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
        this.updateStatusUser(0);
    }

    updateStatusUser(status: number){
        const params = [];
        params['userId'] = this.userId;
        params['status'] = status;
        this.apiService.get(EEndpoints.ChatUpdateStatus, params).subscribe((response: ResponseApi<any>) => {
            if (response.code == 100) {
            }
        }, (err) => console.log(err));
    }
}
