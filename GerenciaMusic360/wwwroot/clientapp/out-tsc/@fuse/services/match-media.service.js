var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MediaObserver } from '@angular/flex-layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
var FuseMatchMediaService = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {MediaObserver} _mediaObserver
     */
    function FuseMatchMediaService(_mediaObserver) {
        this._mediaObserver = _mediaObserver;
        this.onMediaChange = new BehaviorSubject('');
        // Set the defaults
        this.activeMediaQuery = '';
        // Initialize
        this._init();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Initialize
     *
     * @private
     */
    FuseMatchMediaService.prototype._init = function () {
        var _this = this;
        this._mediaObserver.media$
            .pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(function (change) {
            if (_this.activeMediaQuery !== change.mqAlias) {
                _this.activeMediaQuery = change.mqAlias;
                _this.onMediaChange.next(change.mqAlias);
            }
        });
    };
    FuseMatchMediaService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [MediaObserver])
    ], FuseMatchMediaService);
    return FuseMatchMediaService;
}());
export { FuseMatchMediaService };
//# sourceMappingURL=match-media.service.js.map