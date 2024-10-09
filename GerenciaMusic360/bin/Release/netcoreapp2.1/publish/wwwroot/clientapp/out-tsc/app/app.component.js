var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as navigationEnglish } from '@app/navigation/i18n/en';
import { locale as navigationSpanish } from '@app/navigation/i18n/es';
import { environment } from '@environments/environment';
var AppComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    function AppComponent(document, _fuseConfigService, _fuseNavigationService, _fuseSidebarService, _fuseSplashScreenService, _fuseTranslationLoaderService, _translateService, _platform) {
        // Get default navigation
        //this.navigation = navigation;
        this.document = document;
        this._fuseConfigService = _fuseConfigService;
        this._fuseNavigationService = _fuseNavigationService;
        this._fuseSidebarService = _fuseSidebarService;
        this._fuseSplashScreenService = _fuseSplashScreenService;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this._translateService = _translateService;
        this._platform = _platform;
        // Register the navigation to the service
        //this._fuseNavigationService.register('main', this.navigation);
        // Set the main navigation as our current navigation
        //this._fuseNavigationService.setCurrentNavigation('main');
        // Add languages
        this._translateService.addLangs(['en', 'es']);
        // Set the default language
        this._translateService.setDefaultLang('en');
        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationSpanish);
        // Use a language
        var currentLang = localStorage.getItem(environment.lang);
        var lang = (currentLang) ? currentLang : 'en';
        this._translateService.use(lang);
        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */
        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/
        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */
        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */
        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getMenus();
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (config) {
            _this.fuseConfig = config;
            // Boxed
            if (_this.fuseConfig.layout.width === 'boxed') {
                _this.document.body.classList.add('boxed');
            }
            else {
                _this.document.body.classList.remove('boxed');
            }
            // Color theme - Use normal for loop for IE11 compatibility
            for (var i = 0; i < _this.document.body.classList.length; i++) {
                var className = _this.document.body.classList[i];
                if (className.startsWith('theme-')) {
                    _this.document.body.classList.remove(className);
                }
            }
            _this.document.body.classList.add(_this.fuseConfig.colorTheme);
        });
    };
    AppComponent.prototype.getMenus = function () {
        this.navigation = JSON.parse(localStorage.getItem(environment.menu));
        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);
        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');
    };
    /**
     * On destroy
     */
    AppComponent.prototype.ngOnDestroy = function () {
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
    AppComponent.prototype.toggleSidebarOpen = function (key) {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    };
    AppComponent = __decorate([
        Component({
            selector: 'app',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        }),
        __param(0, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [Object, FuseConfigService,
            FuseNavigationService,
            FuseSidebarService,
            FuseSplashScreenService,
            FuseTranslationLoaderService,
            TranslateService,
            Platform])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map