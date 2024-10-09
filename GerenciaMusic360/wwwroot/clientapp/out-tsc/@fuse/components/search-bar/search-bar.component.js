var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
var FuseSearchBarComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    function FuseSearchBarComponent(_fuseConfigService) {
        this._fuseConfigService = _fuseConfigService;
        // Set the defaults
        this.input = new EventEmitter();
        this.collapsed = true;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    FuseSearchBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (config) {
            _this.fuseConfig = config;
        });
    };
    /**
     * On destroy
     */
    FuseSearchBarComponent.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Collapse
     */
    FuseSearchBarComponent.prototype.collapse = function () {
        this.collapsed = true;
    };
    /**
     * Expand
     */
    FuseSearchBarComponent.prototype.expand = function () {
        this.collapsed = false;
    };
    /**
     * Search
     *
     * @param event
     */
    FuseSearchBarComponent.prototype.search = function (event) {
        this.input.emit(event.target.value);
    };
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], FuseSearchBarComponent.prototype, "input", void 0);
    FuseSearchBarComponent = __decorate([
        Component({
            selector: 'fuse-search-bar',
            templateUrl: './search-bar.component.html',
            styleUrls: ['./search-bar.component.scss']
        }),
        __metadata("design:paramtypes", [FuseConfigService])
    ], FuseSearchBarComponent);
    return FuseSearchBarComponent;
}());
export { FuseSearchBarComponent };
//# sourceMappingURL=search-bar.component.js.map