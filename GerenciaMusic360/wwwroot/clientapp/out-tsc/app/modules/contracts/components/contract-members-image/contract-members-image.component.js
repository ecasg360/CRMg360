var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
var ContractMembersImageComponent = /** @class */ (function () {
    function ContractMembersImageComponent() {
        this.selectedMembersList = {};
    }
    ContractMembersImageComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ContractMembersImageComponent.prototype, "selectedMembersList", void 0);
    ContractMembersImageComponent = __decorate([
        Component({
            selector: 'app-contract-members-image',
            templateUrl: './contract-members-image.component.html',
            styleUrls: ['./contract-members-image.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], ContractMembersImageComponent);
    return ContractMembersImageComponent;
}());
export { ContractMembersImageComponent };
//# sourceMappingURL=contract-members-image.component.js.map