var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { environment } from '@environments/environment';
import { Component, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { navigation } from '@app/navigation/navigation';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { HttpClient } from '@angular/common/http';
import { SignalRGroupAdapter } from '@shared/signalr-group-adapter';
import { SignalRService } from '@services/signalR.service';
import { AccountService } from '@services/account.service';
import { Idle, DEFAULT_INTERRUPTSOURCES, AutoResume } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
var VerticalLayout1Component = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    function VerticalLayout1Component(_fuseConfigService, apiService, http, _signalService, _accountService, idle, keepalive, formBuilder, translate, translationLoaderService) {
        var _a;
        this._fuseConfigService = _fuseConfigService;
        this.apiService = apiService;
        this.http = http;
        this._signalService = _signalService;
        this._accountService = _accountService;
        this.idle = idle;
        this.keepalive = keepalive;
        this.formBuilder = formBuilder;
        this.translate = translate;
        this.translationLoaderService = translationLoaderService;
        this.currentTheme = 'dark-theme';
        this.triggeredEvents = [];
        this.fileUploadUrl = SignalRGroupAdapter.serverBaseUrl + "UploadFile";
        this.userId = "";
        this.pullFriends = environment.pullListFirends;
        this.idleState = 'Not started.';
        this.timedOut = false;
        this.lastPing = null;
        // Set the defaults
        this.navigation = navigation;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.translate.onLangChange.subscribe((function (lang) {
            console.log(lang);
        }));
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.chatTitle = this.translate.instant('general.chatTitle');
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    VerticalLayout1Component.prototype.ngOnInit = function () {
        var _this = this;
        this.uploadForm = this.formBuilder.group({
            profile: ['']
        });
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (config) {
            _this.fuseConfig = config;
            //TODO: Mejorar: aqui solo se verifica si existe el panel lateral de menu para mostrar el chat, ya que cuando esta oculto es la pantalla de login
            if (!config.layout.navbar.hidden) {
                _this._getUsers();
                var user = _this._accountService.getLocalUserProfile();
                if (user) {
                    _this.signalRAdapter = new SignalRGroupAdapter(user.name + " " + user.lastName, _this.http, _this.apiService);
                    _this.signalRAdapter.userId = user.userId;
                    _this.userId = user.userId;
                    // sets an idle timeout of 5 seconds, for testing purposes.
                    _this.idle.setIdle(5);
                    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
                    _this.idle.setTimeout(600);
                    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
                    _this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
                    _this.idle.setAutoResume(AutoResume.idle);
                    _this.idle.onIdleEnd.subscribe(function () {
                        _this.idleState = 'No longer idle.';
                    });
                    _this.idle.onTimeout.subscribe(function () {
                        _this.idleState = 'Timed out!';
                        _this.timedOut = true;
                        _this.updateStatusUser(3);
                    });
                    _this.idle.onIdleStart.subscribe(function () { return _this.idleState = 'You\'ve gone idle!'; });
                    _this.idle.onTimeoutWarning.subscribe(function (countdown) {
                        _this.idleState = 'You will time out in ' + countdown + ' seconds!';
                        _this.countdown = countdown;
                    });
                    // sets the ping interval to 15 seconds
                    _this.keepalive.interval(15);
                    _this.keepalive.onPing.subscribe(function () { return _this.lastPing = new Date(); });
                    _this.reset();
                }
            }
        });
    };
    /**
     * On destroy
     */
    VerticalLayout1Component.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    VerticalLayout1Component.prototype.formatUsersChat = function (users) {
    };
    //#region API
    VerticalLayout1Component.prototype._getUsers = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Users).subscribe(function (response) {
            if (response.code == 100) {
                _this.formatUsersChat(response.result);
            }
        }, function (err) { return console.log(err); });
    };
    //#endregion
    //#region API
    VerticalLayout1Component.prototype.switchTheme = function (theme) {
        this.currentTheme = theme;
    };
    VerticalLayout1Component.prototype.onEventTriggered = function (event) {
        this.triggeredEvents.push(event);
    };
    VerticalLayout1Component.prototype.joinSignalRChatRoom = function () {
        var userName = prompt('Please enter a user name:');
        this.signalRAdapter = new SignalRGroupAdapter(userName, this.http, this.apiService);
    };
    VerticalLayout1Component.prototype.reset = function () {
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
        this.updateStatusUser(0);
    };
    VerticalLayout1Component.prototype.updateStatusUser = function (status) {
        var params = [];
        params['userId'] = this.userId;
        params['status'] = status;
        this.apiService.get(EEndpoints.ChatUpdateStatus, params).subscribe(function (response) {
            if (response.code == 100) {
            }
        }, function (err) { return console.log(err); });
    };
    VerticalLayout1Component = __decorate([
        Component({
            selector: 'vertical-layout-1',
            templateUrl: './layout-1.component.html',
            styleUrls: ['./layout-1.component.scss'],
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [FuseConfigService,
            ApiService,
            HttpClient,
            SignalRService,
            AccountService,
            Idle,
            Keepalive,
            FormBuilder,
            TranslateService,
            FuseTranslationLoaderService])
    ], VerticalLayout1Component);
    return VerticalLayout1Component;
}());
export { VerticalLayout1Component };
//# sourceMappingURL=layout-1.component.js.map