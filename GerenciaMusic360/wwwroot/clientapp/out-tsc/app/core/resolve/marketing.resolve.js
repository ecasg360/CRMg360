var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@app/core/enums/endpoints';
var MarketingResolve = /** @class */ (function () {
    function MarketingResolve(apiService) {
        this.apiService = apiService;
    }
    MarketingResolve.prototype.resolve = function (route, state) {
        return this.apiService.get(EEndpoints.Marketing, { id: route.params.marketingId });
    };
    MarketingResolve = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [ApiService])
    ], MarketingResolve);
    return MarketingResolve;
}());
export { MarketingResolve };
//# sourceMappingURL=marketing.resolve.js.map