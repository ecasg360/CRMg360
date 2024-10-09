var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OperationsRoutingModule } from "./operations-routing.module";
import { SharedModule } from "ClientApp/app/shared/shared.module";
import { AddPromoterComponent } from "./components/promoter/add-promoter.component";
import { PromoterComponent } from "./components/promoter/promoter.component";
import { SponsorComponent } from "./components/sponsor/sponsor.component";
import { ContactssponsorComponent } from "./components/contactssponsor/contactssponsor.component";
import { AddcontactssponsorComponent } from "./components/contactssponsor/addcontactssponsor/addcontactssponsor.component";
import { AddsponsorComponent } from "./components/sponsor/addsponsor/addsponsor.component";
import { FuseSharedModule } from '@fuse/shared.module';
var OperationsModule = /** @class */ (function () {
    function OperationsModule() {
    }
    OperationsModule = __decorate([
        NgModule({
            declarations: [
                PromoterComponent,
                AddPromoterComponent,
                SponsorComponent,
                ContactssponsorComponent,
                AddcontactssponsorComponent,
                AddsponsorComponent,
            ],
            entryComponents: [
                AddPromoterComponent,
                AddcontactssponsorComponent,
                AddsponsorComponent,
            ],
            imports: [
                CommonModule,
                FuseSharedModule,
                SharedModule,
                OperationsRoutingModule
            ]
        })
    ], OperationsModule);
    return OperationsModule;
}());
export { OperationsModule };
//# sourceMappingURL=operations.module.js.map