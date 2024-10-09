var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainActivityComponent } from './components/main-activity/main-activity.component';
import { MaintenanceTypeComponent } from './components/maintenance-type/maintenance-type.component';
import { MusicalGenreComponent } from './components/musical-genre/musical-genre.component';
import { PreferenceComponent } from './components/preferences/preference.component';
import { RoleNotificationComponent } from './components/role-notification/role-notification.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { LocationComponent } from './components/location/location.component';
import { CompanyManagerComponent } from './components/company-manager/company-manager.component';
import { MenuComponent } from './components/menu/menu.component';
import { TimeComponent } from './components/time/time.component';
import { ContractTypeComponent } from './components/contract-type/contract-type.component';
import { CertificationAuthorityComponent } from './components/certification-authority/certification-authority.component';
import { SocialNetworktypeComponent } from './components/social-networktype/social-networktype.component';
import { ContactComponent } from './components/contact/contact.component';
import { FieldComponent } from './components/field/field.component';
import { ContractsMarkersTemplatesComponent } from './components/contracts-markers-templates/contracts-markers-templates.component';
import { ModuleGuard } from '@guards/module.guard';
var routes = [
    {
        path: 'main-activity',
        component: MainActivityComponent,
        canActivate: [ModuleGuard],
        data: { access: 'MainActivity' }
    },
    {
        path: 'catalog-type',
        component: MaintenanceTypeComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Type' }
    },
    {
        path: 'company',
        component: CompanyManagerComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Company' }
    },
    {
        path: 'currency',
        component: CurrencyComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Currency' }
    },
    {
        path: 'location',
        component: LocationComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Location' }
    },
    {
        path: 'menu',
        component: MenuComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Permission' }
    },
    {
        path: 'musical-genre',
        component: MusicalGenreComponent,
        canActivate: [ModuleGuard],
        data: { access: 'MusicalGenre' }
    },
    {
        path: 'preferences',
        component: PreferenceComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Preference' }
    },
    {
        path: 'role-notification',
        component: RoleNotificationComponent,
        canActivate: [ModuleGuard],
        data: { access: 'RoleNotification' }
    },
    {
        path: 'time',
        component: TimeComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Time' }
    },
    {
        path: 'contract-type',
        component: ContractTypeComponent,
        canActivate: [ModuleGuard],
        data: { access: 'ContractType' }
    },
    {
        path: 'certification-authority',
        component: CertificationAuthorityComponent,
        canActivate: [ModuleGuard],
        data: { access: 'CertificationAuthority' }
    },
    {
        path: 'socialmedia',
        component: SocialNetworktypeComponent,
        canActivate: [ModuleGuard],
        data: { access: 'SocialNetwork' }
    },
    {
        path: 'contact',
        component: ContactComponent,
        canActivate: [ModuleGuard],
        data: { access: 'ContactsSponsor' }
    },
    {
        path: 'field',
        component: FieldComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Field' }
    },
    {
        path: 'contract-markers',
        component: ContractsMarkersTemplatesComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Contract' }
    }
];
var SettingsRoutingModule = /** @class */ (function () {
    function SettingsRoutingModule() {
    }
    SettingsRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], SettingsRoutingModule);
    return SettingsRoutingModule;
}());
export { SettingsRoutingModule };
//# sourceMappingURL=settings-routing.module.js.map