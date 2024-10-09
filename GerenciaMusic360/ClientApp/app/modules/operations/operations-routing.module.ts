import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PromoterComponent } from "./components/promoter/promoter.component";
import { SponsorComponent } from "./components/sponsor/sponsor.component";
import { ContactssponsorComponent } from "./components/contactssponsor/contactssponsor.component";
import { ModuleGuard } from "@guards/module.guard";


const routes: Routes = [
    {
        path: "promoter",
        component: PromoterComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Promoter'}
    },
    {
        path: "sponsor",
        component: SponsorComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Sponsor'}
    },
    {
        path: "contacts-sponsor",
        component: ContactssponsorComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Sponsor'}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OperationsRoutingModule { }
