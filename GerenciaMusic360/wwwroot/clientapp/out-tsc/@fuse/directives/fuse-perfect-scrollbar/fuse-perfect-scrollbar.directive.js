var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';
import * as _ from 'lodash';
import { FuseConfigService } from '@fuse/services/config.service';
var FusePerfectScrollbarDirective = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {ElementRef} elementRef
     * @param {FuseConfigService} _fuseConfigService
     * @param {Platform} _platform
     * @param {Router} _router
     */
    function FusePerfectScrollbarDirective(elementRef, _fuseConfigService, _platform, _router) {
        this.elementRef = elementRef;
        this._fuseConfigService = _fuseConfigService;
        this._platform = _platform;
        this._router = _router;
        // Set the defaults
        this.isInitialized = false;
        this.isMobile = false;
        // Set the private defaults
        this._enabled = false;
        this._debouncedUpdate = _.debounce(this.update, 150);
        this._options = {
            updateOnRouteChange: false
        };
        this._unsubscribeAll = new Subject();
    }
    Object.defineProperty(FusePerfectScrollbarDirective.prototype, "fusePerfectScrollbarOptions", {
        get: function () {
            // Return the options
            return this._options;
        },
        // -----------------------------------------------------------------------------------------------------
        // @ Accessors
        // -----------------------------------------------------------------------------------------------------
        /**
         * Perfect Scrollbar options
         *
         * @param value
         */
        set: function (value) {
            // Merge the options
            this._options = _.merge({}, this._options, value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FusePerfectScrollbarDirective.prototype, "enabled", {
        get: function () {
            // Return the enabled status
            return this._enabled;
        },
        /**
         * Is enabled
         *
         * @param {boolean | ""} value
         */
        set: function (value) {
            // If nothing is provided with the directive (empty string),
            // we will take that as a true
            if (value === '') {
                value = true;
            }
            // Return, if both values are the same
            if (this.enabled === value) {
                return;
            }
            // Store the value
            this._enabled = value;
            // If enabled...
            if (this.enabled) {
                // Init the directive
                this._init();
            }
            else {
                // Otherwise destroy it
                this._destroy();
            }
        },
        enumerable: false,
        configurable: true
    });
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * After view init
     */
    FusePerfectScrollbarDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        // Check if scrollbars enabled or not from the main config
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (settings) {
            _this.enabled = settings.customScrollbars;
        });
        // Scroll to the top on every route change
        if (this.fusePerfectScrollbarOptions.updateOnRouteChange) {
            this._router.events
                .pipe(takeUntil(this._unsubscribeAll), filter(function (event) { return event instanceof NavigationEnd; }))
                .subscribe(function () {
                setTimeout(function () {
                    _this.scrollToTop();
                    _this.update();
                }, 0);
            });
        }
    };
    /**
     * On destroy
     */
    FusePerfectScrollbarDirective.prototype.ngOnDestroy = function () {
        this._destroy();
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Initialize
     *
     * @private
     */
    FusePerfectScrollbarDirective.prototype._init = function () {
        // Return, if already initialized
        if (this.isInitialized) {
            return;
        }
        // Check if is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.isMobile = true;
        }
        // Return if it's mobile
        if (this.isMobile) {
            // Return...
            return;
        }
        // Set as initialized
        this.isInitialized = true;
        // Initialize the perfect-scrollbar
        this.ps = new PerfectScrollbar(this.elementRef.nativeElement, __assign({}, this.fusePerfectScrollbarOptions));
        // Unbind 'keydown' events of PerfectScrollbar since it causes an extremely
        // high CPU usage on Angular Material inputs.
        // Loop through all the event elements of this PerfectScrollbar instance
        this.ps.event.eventElements.forEach(function (eventElement) {
            // If we hit to the element with a 'keydown' event...
            if (typeof eventElement.handlers['keydown'] !== 'undefined') {
                // Unbind it
                eventElement.element.removeEventListener('keydown', eventElement.handlers['keydown'][0]);
            }
        });
    };
    /**
     * Destroy
     *
     * @private
     */
    FusePerfectScrollbarDirective.prototype._destroy = function () {
        if (!this.isInitialized || !this.ps) {
            return;
        }
        // Destroy the perfect-scrollbar
        this.ps.destroy();
        // Clean up
        this.ps = null;
        this.isInitialized = false;
    };
    /**
     * Update scrollbars on window resize
     *
     * @private
     */
    FusePerfectScrollbarDirective.prototype._updateOnResize = function () {
        this._debouncedUpdate();
    };
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Document click
     *
     * @param {Event} event
     */
    FusePerfectScrollbarDirective.prototype.documentClick = function (event) {
        if (!this.isInitialized || !this.ps) {
            return;
        }
        // Update the scrollbar on document click..
        // This isn't the most elegant solution but there is no other way
        // of knowing when the contents of the scrollable container changes.
        // Therefore, we update scrollbars on every document click.
        this.ps.update();
    };
    /**
     * Update the scrollbar
     */
    FusePerfectScrollbarDirective.prototype.update = function () {
        if (!this.isInitialized) {
            return;
        }
        // Update the perfect-scrollbar
        this.ps.update();
    };
    /**
     * Destroy the scrollbar
     */
    FusePerfectScrollbarDirective.prototype.destroy = function () {
        this.ngOnDestroy();
    };
    /**
     * Scroll to X
     *
     * @param {number} x
     * @param {number} speed
     */
    FusePerfectScrollbarDirective.prototype.scrollToX = function (x, speed) {
        this.animateScrolling('scrollLeft', x, speed);
    };
    /**
     * Scroll to Y
     *
     * @param {number} y
     * @param {number} speed
     */
    FusePerfectScrollbarDirective.prototype.scrollToY = function (y, speed) {
        this.animateScrolling('scrollTop', y, speed);
    };
    /**
     * Scroll to top
     *
     * @param {number} offset
     * @param {number} speed
     */
    FusePerfectScrollbarDirective.prototype.scrollToTop = function (offset, speed) {
        this.animateScrolling('scrollTop', (offset || 0), speed);
    };
    /**
     * Scroll to left
     *
     * @param {number} offset
     * @param {number} speed
     */
    FusePerfectScrollbarDirective.prototype.scrollToLeft = function (offset, speed) {
        this.animateScrolling('scrollLeft', (offset || 0), speed);
    };
    /**
     * Scroll to right
     *
     * @param {number} offset
     * @param {number} speed
     */
    FusePerfectScrollbarDirective.prototype.scrollToRight = function (offset, speed) {
        var width = this.elementRef.nativeElement.scrollWidth;
        this.animateScrolling('scrollLeft', width - (offset || 0), speed);
    };
    /**
     * Scroll to bottom
     *
     * @param {number} offset
     * @param {number} speed
     */
    FusePerfectScrollbarDirective.prototype.scrollToBottom = function (offset, speed) {
        var height = this.elementRef.nativeElement.scrollHeight;
        this.animateScrolling('scrollTop', height - (offset || 0), speed);
    };
    /**
     * Animate scrolling
     *
     * @param {string} target
     * @param {number} value
     * @param {number} speed
     */
    FusePerfectScrollbarDirective.prototype.animateScrolling = function (target, value, speed) {
        var _this = this;
        if (!speed) {
            this.elementRef.nativeElement[target] = value;
            // PS has weird event sending order, this is a workaround for that
            this.update();
            this.update();
        }
        else if (value !== this.elementRef.nativeElement[target]) {
            var newValue_1 = 0;
            var scrollCount_1 = 0;
            var oldTimestamp_1 = performance.now();
            var oldValue_1 = this.elementRef.nativeElement[target];
            var cosParameter_1 = (oldValue_1 - value) / 2;
            var step_1 = function (newTimestamp) {
                scrollCount_1 += Math.PI / (speed / (newTimestamp - oldTimestamp_1));
                newValue_1 = Math.round(value + cosParameter_1 + cosParameter_1 * Math.cos(scrollCount_1));
                // Only continue animation if scroll position has not changed
                if (_this.elementRef.nativeElement[target] === oldValue_1) {
                    if (scrollCount_1 >= Math.PI) {
                        _this.elementRef.nativeElement[target] = value;
                        // PS has weird event sending order, this is a workaround for that
                        _this.update();
                        _this.update();
                    }
                    else {
                        _this.elementRef.nativeElement[target] = oldValue_1 = newValue_1;
                        oldTimestamp_1 = newTimestamp;
                        window.requestAnimationFrame(step_1);
                    }
                }
            };
            window.requestAnimationFrame(step_1);
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], FusePerfectScrollbarDirective.prototype, "fusePerfectScrollbarOptions", null);
    __decorate([
        Input('fusePerfectScrollbar'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], FusePerfectScrollbarDirective.prototype, "enabled", null);
    __decorate([
        HostListener('window:resize'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FusePerfectScrollbarDirective.prototype, "_updateOnResize", null);
    __decorate([
        HostListener('document:click', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Event]),
        __metadata("design:returntype", void 0)
    ], FusePerfectScrollbarDirective.prototype, "documentClick", null);
    FusePerfectScrollbarDirective = __decorate([
        Directive({
            selector: '[fusePerfectScrollbar]'
        }),
        __metadata("design:paramtypes", [ElementRef,
            FuseConfigService,
            Platform,
            Router])
    ], FusePerfectScrollbarDirective);
    return FusePerfectScrollbarDirective;
}());
export { FusePerfectScrollbarDirective };
//# sourceMappingURL=fuse-perfect-scrollbar.directive.js.map