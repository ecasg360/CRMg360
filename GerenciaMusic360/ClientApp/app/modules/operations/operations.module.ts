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

@NgModule({
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
export class OperationsModule { }
