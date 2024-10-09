var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
var ContractManagerComponent = /** @class */ (function () {
    function ContractManagerComponent(route, router, _translationLoaderService) {
        var _a;
        this.route = route;
        this.router = router;
        this._translationLoaderService = _translationLoaderService;
        this.contract = {};
        this.statusModule = [];
        this.perm = {};
        (_a = this._translationLoaderService).loadTranslations.apply(_a, allLang);
        this.perm = this.route.snapshot.data;
    }
    ContractManagerComponent.prototype.ngOnInit = function () {
        this.contractId = this.route.snapshot.params.contractId;
        this.contract = this.route.snapshot.data.contract.result;
        if (!this.contractId || !this.contract.id) {
            this.router.navigate(['contracts']);
        }
    };
    ContractManagerComponent.prototype.additionalFields = function (event) {
        console.log(event);
    };
    ContractManagerComponent = __decorate([
        Component({
            selector: 'app-contract-manager',
            templateUrl: './contract-manager.component.html',
            styleUrls: ['./contract-manager.component.scss']
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            FuseTranslationLoaderService])
    ], ContractManagerComponent);
    return ContractManagerComponent;
}());
export { ContractManagerComponent };
//# sourceMappingURL=contract-manager.component.js.map