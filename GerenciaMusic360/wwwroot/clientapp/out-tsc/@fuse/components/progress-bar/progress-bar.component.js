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
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
var FuseProgressBarComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {FuseProgressBarService} _fuseProgressBarService
     */
    function FuseProgressBarComponent(_fuseProgressBarService) {
        // Set the defaults
        this._fuseProgressBarService = _fuseProgressBarService;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    FuseProgressBarComponent.prototype.ngOnInit = function () {
        // Subscribe to the progress bar service properties
        var _this = this;
        // Buffer value
        this._fuseProgressBarService.bufferValue
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (bufferValue) {
            _this.bufferValue = bufferValue;
        });
        // Mode
        this._fuseProgressBarService.mode
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (mode) {
            _this.mode = mode;
        });
        // Value
        this._fuseProgressBarService.value
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (value) {
            _this.value = value;
        });
        // Visible
        this._fuseProgressBarService.visible
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (visible) {
            _this.visible = visible;
        });
    };
    /**
     * On destroy
     */
    FuseProgressBarComponent.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    FuseProgressBarComponent = __decorate([
        Component({
            selector: 'fuse-progress-bar',
            templateUrl: './progress-bar.component.html',
            styleUrls: ['./progress-bar.component.scss'],
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [FuseProgressBarService])
    ], FuseProgressBarComponent);
    return FuseProgressBarComponent;
}());
export { FuseProgressBarComponent };
//# sourceMappingURL=progress-bar.component.js.map