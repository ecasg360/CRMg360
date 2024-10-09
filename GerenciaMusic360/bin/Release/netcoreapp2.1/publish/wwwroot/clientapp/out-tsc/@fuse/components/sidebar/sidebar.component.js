var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { animate, AnimationBuilder, style } from '@angular/animations';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseSidebarService } from './sidebar.service';
import { FuseMatchMediaService } from '@fuse/services/match-media.service';
import { FuseConfigService } from '@fuse/services/config.service';
var FuseSidebarComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {AnimationBuilder} _animationBuilder
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {ElementRef} _elementRef
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseMatchMediaService} _fuseMatchMediaService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MediaObserver} _mediaObserver
     * @param {Renderer2} _renderer
     */
    function FuseSidebarComponent(_animationBuilder, _changeDetectorRef, _elementRef, _fuseConfigService, _fuseMatchMediaService, _fuseSidebarService, _mediaObserver, _renderer) {
        this._animationBuilder = _animationBuilder;
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._fuseConfigService = _fuseConfigService;
        this._fuseMatchMediaService = _fuseMatchMediaService;
        this._fuseSidebarService = _fuseSidebarService;
        this._mediaObserver = _mediaObserver;
        this._renderer = _renderer;
        this._backdrop = null;
        // Set the defaults
        this.foldedAutoTriggerOnHover = true;
        this.foldedWidth = 64;
        this.foldedChanged = new EventEmitter();
        this.openedChanged = new EventEmitter();
        this.opened = false;
        this.position = 'left';
        this.invisibleOverlay = false;
        // Set the private defaults
        this._animationsEnabled = false;
        this._folded = false;
        this._unsubscribeAll = new Subject();
    }
    Object.defineProperty(FuseSidebarComponent.prototype, "folded", {
        get: function () {
            return this._folded;
        },
        // -----------------------------------------------------------------------------------------------------
        // @ Accessors
        // -----------------------------------------------------------------------------------------------------
        /**
         * Folded
         *
         * @param {boolean} value
         */
        set: function (value) {
            // Set the folded
            this._folded = value;
            // Return if the sidebar is closed
            if (!this.opened) {
                return;
            }
            // Programmatically add/remove padding to the element
            // that comes after or before based on the position
            var sibling, styleRule;
            var styleValue = this.foldedWidth + 'px';
            // Get the sibling and set the style rule
            if (this.position === 'left') {
                sibling = this._elementRef.nativeElement.nextElementSibling;
                styleRule = 'padding-left';
            }
            else {
                sibling = this._elementRef.nativeElement.previousElementSibling;
                styleRule = 'padding-right';
            }
            // If there is no sibling, return...
            if (!sibling) {
                return;
            }
            // If folded...
            if (value) {
                // Fold the sidebar
                this.fold();
                // Set the folded width
                this._renderer.setStyle(this._elementRef.nativeElement, 'width', styleValue);
                this._renderer.setStyle(this._elementRef.nativeElement, 'min-width', styleValue);
                this._renderer.setStyle(this._elementRef.nativeElement, 'max-width', styleValue);
                // Set the style and class
                this._renderer.setStyle(sibling, styleRule, styleValue);
                this._renderer.addClass(this._elementRef.nativeElement, 'folded');
            }
            // If unfolded...
            else {
                // Unfold the sidebar
                this.unfold();
                // Remove the folded width
                this._renderer.removeStyle(this._elementRef.nativeElement, 'width');
                this._renderer.removeStyle(this._elementRef.nativeElement, 'min-width');
                this._renderer.removeStyle(this._elementRef.nativeElement, 'max-width');
                // Remove the style and class
                this._renderer.removeStyle(sibling, styleRule);
                this._renderer.removeClass(this._elementRef.nativeElement, 'folded');
            }
            // Emit the 'foldedChanged' event
            this.foldedChanged.emit(this.folded);
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
    FuseSidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (config) {
            _this._fuseConfig = config;
        });
        // Register the sidebar
        this._fuseSidebarService.register(this.name, this);
        // Setup visibility
        this._setupVisibility();
        // Setup position
        this._setupPosition();
        // Setup lockedOpen
        this._setupLockedOpen();
        // Setup folded
        this._setupFolded();
    };
    /**
     * On destroy
     */
    FuseSidebarComponent.prototype.ngOnDestroy = function () {
        // If the sidebar is folded, unfold it to revert modifications
        if (this.folded) {
            this.unfold();
        }
        // Unregister the sidebar
        this._fuseSidebarService.unregister(this.name);
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Setup the visibility of the sidebar
     *
     * @private
     */
    FuseSidebarComponent.prototype._setupVisibility = function () {
        // Remove the existing box-shadow
        this._renderer.setStyle(this._elementRef.nativeElement, 'box-shadow', 'none');
        // Make the sidebar invisible
        this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
    };
    /**
     * Setup the sidebar position
     *
     * @private
     */
    FuseSidebarComponent.prototype._setupPosition = function () {
        // Add the correct class name to the sidebar
        // element depending on the position attribute
        if (this.position === 'right') {
            this._renderer.addClass(this._elementRef.nativeElement, 'right-positioned');
        }
        else {
            this._renderer.addClass(this._elementRef.nativeElement, 'left-positioned');
        }
    };
    /**
     * Setup the lockedOpen handler
     *
     * @private
     */
    FuseSidebarComponent.prototype._setupLockedOpen = function () {
        var _this = this;
        // Return if the lockedOpen wasn't set
        if (!this.lockedOpen) {
            // Return
            return;
        }
        // Set the wasActive for the first time
        this._wasActive = false;
        // Set the wasFolded
        this._wasFolded = this.folded;
        // Show the sidebar
        this._showSidebar();
        // Act on every media change
        this._fuseMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function () {
            // Get the active status
            var isActive = _this._mediaObserver.isActive(_this.lockedOpen);
            // If the both status are the same, don't act
            if (_this._wasActive === isActive) {
                return;
            }
            // Activate the lockedOpen
            if (isActive) {
                // Set the lockedOpen status
                _this.isLockedOpen = true;
                // Show the sidebar
                _this._showSidebar();
                // Force the the opened status to true
                _this.opened = true;
                // Emit the 'openedChanged' event
                _this.openedChanged.emit(_this.opened);
                // If the sidebar was folded, forcefully fold it again
                if (_this._wasFolded) {
                    // Enable the animations
                    _this._enableAnimations();
                    // Fold
                    _this.folded = true;
                    // Mark for check
                    _this._changeDetectorRef.markForCheck();
                }
                // Hide the backdrop if any exists
                _this._hideBackdrop();
            }
            // De-Activate the lockedOpen
            else {
                // Set the lockedOpen status
                _this.isLockedOpen = false;
                // Unfold the sidebar in case if it was folded
                _this.unfold();
                // Force the the opened status to close
                _this.opened = false;
                // Emit the 'openedChanged' event
                _this.openedChanged.emit(_this.opened);
                // Hide the sidebar
                _this._hideSidebar();
            }
            // Store the new active status
            _this._wasActive = isActive;
        });
    };
    /**
     * Setup the initial folded status
     *
     * @private
     */
    FuseSidebarComponent.prototype._setupFolded = function () {
        // Return, if sidebar is not folded
        if (!this.folded) {
            return;
        }
        // Return if the sidebar is closed
        if (!this.opened) {
            return;
        }
        // Programmatically add/remove padding to the element
        // that comes after or before based on the position
        var sibling, styleRule;
        var styleValue = this.foldedWidth + 'px';
        // Get the sibling and set the style rule
        if (this.position === 'left') {
            sibling = this._elementRef.nativeElement.nextElementSibling;
            styleRule = 'padding-left';
        }
        else {
            sibling = this._elementRef.nativeElement.previousElementSibling;
            styleRule = 'padding-right';
        }
        // If there is no sibling, return...
        if (!sibling) {
            return;
        }
        // Fold the sidebar
        this.fold();
        // Set the folded width
        this._renderer.setStyle(this._elementRef.nativeElement, 'width', styleValue);
        this._renderer.setStyle(this._elementRef.nativeElement, 'min-width', styleValue);
        this._renderer.setStyle(this._elementRef.nativeElement, 'max-width', styleValue);
        // Set the style and class
        this._renderer.setStyle(sibling, styleRule, styleValue);
        this._renderer.addClass(this._elementRef.nativeElement, 'folded');
    };
    /**
     * Show the backdrop
     *
     * @private
     */
    FuseSidebarComponent.prototype._showBackdrop = function () {
        var _this = this;
        // Create the backdrop element
        this._backdrop = this._renderer.createElement('div');
        // Add a class to the backdrop element
        this._backdrop.classList.add('fuse-sidebar-overlay');
        // Add a class depending on the invisibleOverlay option
        if (this.invisibleOverlay) {
            this._backdrop.classList.add('fuse-sidebar-overlay-invisible');
        }
        // Append the backdrop to the parent of the sidebar
        this._renderer.appendChild(this._elementRef.nativeElement.parentElement, this._backdrop);
        // Create the enter animation and attach it to the player
        this._player =
            this._animationBuilder
                .build([
                animate('300ms ease', style({ opacity: 1 }))
            ]).create(this._backdrop);
        // Play the animation
        this._player.play();
        // Add an event listener to the overlay
        this._backdrop.addEventListener('click', function () {
            _this.close();
        });
        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Hide the backdrop
     *
     * @private
     */
    FuseSidebarComponent.prototype._hideBackdrop = function () {
        var _this = this;
        if (!this._backdrop) {
            return;
        }
        // Create the leave animation and attach it to the player
        this._player =
            this._animationBuilder
                .build([
                animate('300ms ease', style({ opacity: 0 }))
            ]).create(this._backdrop);
        // Play the animation
        this._player.play();
        // Once the animation is done...
        this._player.onDone(function () {
            // If the backdrop still exists...
            if (_this._backdrop) {
                // Remove the backdrop
                _this._backdrop.parentNode.removeChild(_this._backdrop);
                _this._backdrop = null;
            }
        });
        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Change some properties of the sidebar
     * and make it visible
     *
     * @private
     */
    FuseSidebarComponent.prototype._showSidebar = function () {
        // Remove the box-shadow style
        this._renderer.removeStyle(this._elementRef.nativeElement, 'box-shadow');
        // Make the sidebar invisible
        this._renderer.removeStyle(this._elementRef.nativeElement, 'visibility');
        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Change some properties of the sidebar
     * and make it invisible
     *
     * @private
     */
    FuseSidebarComponent.prototype._hideSidebar = function (delay) {
        var _this = this;
        if (delay === void 0) { delay = true; }
        var delayAmount = delay ? 300 : 0;
        // Add a delay so close animation can play
        setTimeout(function () {
            // Remove the box-shadow
            _this._renderer.setStyle(_this._elementRef.nativeElement, 'box-shadow', 'none');
            // Make the sidebar invisible
            _this._renderer.setStyle(_this._elementRef.nativeElement, 'visibility', 'hidden');
        }, delayAmount);
        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Enable the animations
     *
     * @private
     */
    FuseSidebarComponent.prototype._enableAnimations = function () {
        // Return if animations already enabled
        if (this._animationsEnabled) {
            return;
        }
        // Enable the animations
        this._animationsEnabled = true;
        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Open the sidebar
     */
    FuseSidebarComponent.prototype.open = function () {
        if (this.opened || this.isLockedOpen) {
            return;
        }
        // Enable the animations
        this._enableAnimations();
        // Show the sidebar
        this._showSidebar();
        // Show the backdrop
        this._showBackdrop();
        // Set the opened status
        this.opened = true;
        // Emit the 'openedChanged' event
        this.openedChanged.emit(this.opened);
        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Close the sidebar
     */
    FuseSidebarComponent.prototype.close = function () {
        if (!this.opened || this.isLockedOpen) {
            return;
        }
        // Enable the animations
        this._enableAnimations();
        // Hide the backdrop
        this._hideBackdrop();
        // Set the opened status
        this.opened = false;
        // Emit the 'openedChanged' event
        this.openedChanged.emit(this.opened);
        // Hide the sidebar
        this._hideSidebar();
        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Toggle open/close the sidebar
     */
    FuseSidebarComponent.prototype.toggleOpen = function () {
        if (this.opened) {
            this.close();
        }
        else {
            this.open();
        }
    };
    /**
     * Mouseenter
     */
    FuseSidebarComponent.prototype.onMouseEnter = function () {
        // Only work if the auto trigger is enabled
        if (!this.foldedAutoTriggerOnHover) {
            return;
        }
        this.unfoldTemporarily();
    };
    /**
     * Mouseleave
     */
    FuseSidebarComponent.prototype.onMouseLeave = function () {
        // Only work if the auto trigger is enabled
        if (!this.foldedAutoTriggerOnHover) {
            return;
        }
        this.foldTemporarily();
    };
    /**
     * Fold the sidebar permanently
     */
    FuseSidebarComponent.prototype.fold = function () {
        // Only work if the sidebar is not folded
        if (this.folded) {
            return;
        }
        // Enable the animations
        this._enableAnimations();
        // Fold
        this.folded = true;
        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Unfold the sidebar permanently
     */
    FuseSidebarComponent.prototype.unfold = function () {
        // Only work if the sidebar is folded
        if (!this.folded) {
            return;
        }
        // Enable the animations
        this._enableAnimations();
        // Unfold
        this.folded = false;
        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Toggle the sidebar fold/unfold permanently
     */
    FuseSidebarComponent.prototype.toggleFold = function () {
        if (this.folded) {
            this.unfold();
        }
        else {
            this.fold();
        }
    };
    /**
     * Fold the temporarily unfolded sidebar back
     */
    FuseSidebarComponent.prototype.foldTemporarily = function () {
        // Only work if the sidebar is folded
        if (!this.folded) {
            return;
        }
        // Enable the animations
        this._enableAnimations();
        // Fold the sidebar back
        this.unfolded = false;
        // Set the folded width
        var styleValue = this.foldedWidth + 'px';
        this._renderer.setStyle(this._elementRef.nativeElement, 'width', styleValue);
        this._renderer.setStyle(this._elementRef.nativeElement, 'min-width', styleValue);
        this._renderer.setStyle(this._elementRef.nativeElement, 'max-width', styleValue);
        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Unfold the sidebar temporarily
     */
    FuseSidebarComponent.prototype.unfoldTemporarily = function () {
        // Only work if the sidebar is folded
        if (!this.folded) {
            return;
        }
        // Enable the animations
        this._enableAnimations();
        // Unfold the sidebar temporarily
        this.unfolded = true;
        // Remove the folded width
        this._renderer.removeStyle(this._elementRef.nativeElement, 'width');
        this._renderer.removeStyle(this._elementRef.nativeElement, 'min-width');
        this._renderer.removeStyle(this._elementRef.nativeElement, 'max-width');
        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FuseSidebarComponent.prototype, "name", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FuseSidebarComponent.prototype, "key", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FuseSidebarComponent.prototype, "position", void 0);
    __decorate([
        HostBinding('class.open'),
        __metadata("design:type", Boolean)
    ], FuseSidebarComponent.prototype, "opened", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], FuseSidebarComponent.prototype, "lockedOpen", void 0);
    __decorate([
        HostBinding('class.locked-open'),
        __metadata("design:type", Boolean)
    ], FuseSidebarComponent.prototype, "isLockedOpen", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], FuseSidebarComponent.prototype, "foldedWidth", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], FuseSidebarComponent.prototype, "foldedAutoTriggerOnHover", void 0);
    __decorate([
        HostBinding('class.unfolded'),
        __metadata("design:type", Boolean)
    ], FuseSidebarComponent.prototype, "unfolded", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], FuseSidebarComponent.prototype, "invisibleOverlay", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], FuseSidebarComponent.prototype, "foldedChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], FuseSidebarComponent.prototype, "openedChanged", void 0);
    __decorate([
        HostBinding('class.animations-enabled'),
        __metadata("design:type", Boolean)
    ], FuseSidebarComponent.prototype, "_animationsEnabled", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], FuseSidebarComponent.prototype, "folded", null);
    __decorate([
        HostListener('mouseenter'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FuseSidebarComponent.prototype, "onMouseEnter", null);
    __decorate([
        HostListener('mouseleave'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FuseSidebarComponent.prototype, "onMouseLeave", null);
    FuseSidebarComponent = __decorate([
        Component({
            selector: 'fuse-sidebar',
            templateUrl: './sidebar.component.html',
            styleUrls: ['./sidebar.component.scss'],
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [AnimationBuilder,
            ChangeDetectorRef,
            ElementRef,
            FuseConfigService,
            FuseMatchMediaService,
            FuseSidebarService,
            MediaObserver,
            Renderer2])
    ], FuseSidebarComponent);
    return FuseSidebarComponent;
}());
export { FuseSidebarComponent };
//# sourceMappingURL=sidebar.component.js.map