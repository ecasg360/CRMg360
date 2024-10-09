var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMatchMediaService } from '@fuse/services/match-media.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
var FuseShortcutsComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {CookieService} _cookieService
     * @param {FuseMatchMediaService} _fuseMatchMediaService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {MediaObserver} _mediaObserver
     * @param {Renderer2} _renderer
     */
    function FuseShortcutsComponent(_cookieService, _fuseMatchMediaService, _fuseNavigationService, _mediaObserver, _renderer, translate, translationLoader) {
        this._cookieService = _cookieService;
        this._fuseMatchMediaService = _fuseMatchMediaService;
        this._fuseNavigationService = _fuseNavigationService;
        this._mediaObserver = _mediaObserver;
        this._renderer = _renderer;
        this.translate = translate;
        this.translationLoader = translationLoader;
        // Set the defaults
        this.shortcutItems = [];
        this.searching = false;
        this.mobileShortcutsPanelActive = false;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    FuseShortcutsComponent.prototype.ngOnInit = function () {
        var _a;
        var _this = this;
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        // Get the navigation items and flatten them
        this.filteredNavigationItems = this.navigationItems = this._fuseNavigationService.getFlatNavigation(this.navigation);
        if (this._cookieService.check('FUSE2.shortcuts')) {
            this.shortcutItems = JSON.parse(this._cookieService.get('FUSE2.shortcuts'));
        }
        else {
            // User's shortcut items
            this.shortcutItems = [
                {
                    'title': this.translate.instant('general.startCenter'),
                    'type': 'item',
                    'icon': 'home',
                    'url': '/'
                },
                {
                    'title': this.translate.instant('general.projects'),
                    'type': 'item',
                    'icon': 'business',
                    'url': '/projects'
                },
                {
                    'title': this.translate.instant('general.marketing'),
                    'type': 'item',
                    'icon': 'ballot',
                    'url': '/marketing'
                },
                {
                    'title': this.translate.instant('general.contracts'),
                    'type': 'item',
                    'icon': 'collections_bookmark',
                    'url': '/contracts'
                },
                {
                    'title': this.translate.instant('general.calendar'),
                    'type': 'item',
                    'icon': 'calendar_today',
                    'url': '/projects/event-calendar'
                },
                {
                    'title': this.translate.instant('general.contacts'),
                    'type': 'item',
                    'icon': 'contacts',
                    'url': '/settings/contact'
                },
            ];
        }
        // Subscribe to media changes
        this._fuseMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function () {
            if (_this._mediaObserver.isActive('gt-sm')) {
                _this.hideMobileShortcutsPanel();
            }
        });
    };
    /**
     * On destroy
     */
    FuseShortcutsComponent.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Search
     *
     * @param event
     */
    FuseShortcutsComponent.prototype.search = function (event) {
        var value = event.target.value.toLowerCase();
        if (value === '') {
            this.searching = false;
            this.filteredNavigationItems = this.navigationItems;
            return;
        }
        this.searching = true;
        this.filteredNavigationItems = this.navigationItems.filter(function (navigationItem) {
            return navigationItem.title.toLowerCase().includes(value);
        });
    };
    /**
     * Toggle shortcut
     *
     * @param event
     * @param itemToToggle
     */
    FuseShortcutsComponent.prototype.toggleShortcut = function (event, itemToToggle) {
        event.stopPropagation();
        for (var i = 0; i < this.shortcutItems.length; i++) {
            if (this.shortcutItems[i].url === itemToToggle.url) {
                this.shortcutItems.splice(i, 1);
                // Save to the cookies
                this._cookieService.set('FUSE2.shortcuts', JSON.stringify(this.shortcutItems));
                return;
            }
        }
        this.shortcutItems.push(itemToToggle);
        // Save to the cookies
        this._cookieService.set('FUSE2.shortcuts', JSON.stringify(this.shortcutItems));
    };
    /**
     * Is in shortcuts?
     *
     * @param navigationItem
     * @returns {any}
     */
    FuseShortcutsComponent.prototype.isInShortcuts = function (navigationItem) {
        return this.shortcutItems.find(function (item) {
            return item.url === navigationItem.url;
        });
    };
    /**
     * On menu open
     */
    FuseShortcutsComponent.prototype.onMenuOpen = function () {
        var _this = this;
        setTimeout(function () {
            _this.searchInputField.nativeElement.focus();
        });
    };
    /**
     * Show mobile shortcuts
     */
    FuseShortcutsComponent.prototype.showMobileShortcutsPanel = function () {
        this.mobileShortcutsPanelActive = true;
        this._renderer.addClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    };
    /**
     * Hide mobile shortcuts
     */
    FuseShortcutsComponent.prototype.hideMobileShortcutsPanel = function () {
        this.mobileShortcutsPanelActive = false;
        this._renderer.removeClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], FuseShortcutsComponent.prototype, "navigation", void 0);
    __decorate([
        ViewChild('searchInput'),
        __metadata("design:type", Object)
    ], FuseShortcutsComponent.prototype, "searchInputField", void 0);
    __decorate([
        ViewChild('shortcuts'),
        __metadata("design:type", ElementRef)
    ], FuseShortcutsComponent.prototype, "shortcutsEl", void 0);
    FuseShortcutsComponent = __decorate([
        Component({
            selector: 'fuse-shortcuts',
            templateUrl: './shortcuts.component.html',
            styleUrls: ['./shortcuts.component.scss']
        }),
        __metadata("design:paramtypes", [CookieService,
            FuseMatchMediaService,
            FuseNavigationService,
            MediaObserver,
            Renderer2,
            TranslateService,
            FuseTranslationLoaderService])
    ], FuseShortcutsComponent);
    return FuseShortcutsComponent;
}());
export { FuseShortcutsComponent };
//# sourceMappingURL=shortcuts.component.js.map