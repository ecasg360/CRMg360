var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
var NavbarVerticalStyle2Component = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {Router} _router
     */
    function NavbarVerticalStyle2Component(_fuseConfigService, _fuseNavigationService, _fuseSidebarService, _router) {
        this._fuseConfigService = _fuseConfigService;
        this._fuseNavigationService = _fuseNavigationService;
        this._fuseSidebarService = _fuseSidebarService;
        this._router = _router;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    Object.defineProperty(NavbarVerticalStyle2Component.prototype, "directive", {
        // -----------------------------------------------------------------------------------------------------
        // @ Accessors
        // -----------------------------------------------------------------------------------------------------
        // Directive
        set: function (theDirective) {
            var _this = this;
            if (!theDirective) {
                return;
            }
            this._fusePerfectScrollbar = theDirective;
            // Update the scrollbar on collapsable item toggle
            this._fuseNavigationService.onItemCollapseToggled
                .pipe(delay(500), takeUntil(this._unsubscribeAll))
                .subscribe(function () {
                _this._fusePerfectScrollbar.update();
            });
            // Scroll to the active item position
            this._router.events
                .pipe(filter(function (event) { return event instanceof NavigationEnd; }), take(1))
                .subscribe(function () {
                setTimeout(function () {
                    var activeNavItem = document.querySelector('navbar .nav-link.active');
                    if (activeNavItem) {
                        var activeItemOffsetTop = activeNavItem.offsetTop, activeItemOffsetParentTop = activeNavItem.offsetParent.offsetTop, scrollDistance = activeItemOffsetTop - activeItemOffsetParentTop - (48 * 3);
                        _this._fusePerfectScrollbar.scrollToTop(scrollDistance);
                    }
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    NavbarVerticalStyle2Component.prototype.ngOnInit = function () {
        var _this = this;
        this._router.events
            .pipe(filter(function (event) { return event instanceof NavigationEnd; }), takeUntil(this._unsubscribeAll))
            .subscribe(function () {
            if (_this._fuseSidebarService.getSidebar('navbar')) {
                _this._fuseSidebarService.getSidebar('navbar').close();
            }
        });
        // Get current navigation
        this._fuseNavigationService.onNavigationChanged
            .pipe(filter(function (value) { return value !== null; }), takeUntil(this._unsubscribeAll))
            .subscribe(function () {
            _this.navigation = _this._fuseNavigationService.getCurrentNavigation();
        });
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (config) {
            _this.fuseConfig = config;
        });
    };
    /**
     * On destroy
     */
    NavbarVerticalStyle2Component.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Toggle sidebar opened status
     */
    NavbarVerticalStyle2Component.prototype.toggleSidebarOpened = function () {
        this._fuseSidebarService.getSidebar('navbar').toggleOpen();
    };
    /**
     * Toggle sidebar folded status
     */
    NavbarVerticalStyle2Component.prototype.toggleSidebarFolded = function () {
        this._fuseSidebarService.getSidebar('navbar').toggleFold();
    };
    __decorate([
        ViewChild(FusePerfectScrollbarDirective),
        __metadata("design:type", FusePerfectScrollbarDirective),
        __metadata("design:paramtypes", [FusePerfectScrollbarDirective])
    ], NavbarVerticalStyle2Component.prototype, "directive", null);
    NavbarVerticalStyle2Component = __decorate([
        Component({
            selector: 'navbar-vertical-style-2',
            templateUrl: './style-2.component.html',
            styleUrls: ['./style-2.component.scss'],
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [FuseConfigService,
            FuseNavigationService,
            FuseSidebarService,
            Router])
    ], NavbarVerticalStyle2Component);
    return NavbarVerticalStyle2Component;
}());
export { NavbarVerticalStyle2Component };
//# sourceMappingURL=style-2.component.js.map