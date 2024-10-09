var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PromoterComponent } from "./components/promoter/promoter.component";
import { SponsorComponent } from "./components/sponsor/sponsor.component";
import { ContactssponsorComponent } from "./components/contactssponsor/contactssponsor.component";
import { ModuleGuard } from "@guards/module.guard";
var routes = [
    {
        path: "promoter",
        component: PromoterComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Promoter' }
    },
    {
        path: "sponsor",
        component: SponsorComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Sponsor' }
    },
    {
        path: "contacts-sponsor",
        component: ContactssponsorComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Sponsor' }
    }
];
var OperationsRoutingModule = /** @class */ (function () {
    function OperationsRoutingModule() {
    }
    OperationsRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], OperationsRoutingModule);
    return OperationsRoutingModule;
}());
export { OperationsRoutingModule };
//# sourceMappingURL=operations-routing.module.js.map