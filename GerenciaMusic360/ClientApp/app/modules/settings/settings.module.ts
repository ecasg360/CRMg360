import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { MainActivityComponent } from './components/main-activity/main-activity.component';
import { AddMainActivityComponent } from './components/main-activity/add-main-activity/add-main-activity.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from '@shared/shared.module';
import { MaintenanceTypeComponent } from './components/maintenance-type/maintenance-type.component';
import { MusicalGenreComponent } from './components/musical-genre/musical-genre.component';
import { AddMusicalGenreComponent } from './components/musical-genre/add-musical-genre/add-musical-genre.component';
import { PreferenceComponent } from './components/preferences/preference.component';
import { AddPreferenceComponent } from './components/preferences/add-preference/add-preference.component';
import { RoleNotificationComponent } from './components/role-notification/role-notification.component';
import { AddRoleNotificationComponent } from './components/role-notification/add-role-notification/add-role-notification.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { AddCurrencyComponent } from './components/currency/add-currency.component/add-currency.component';
import { LocationComponent } from './components/location/location.component';
import { AddLocationComponent } from './components/location/add-location/add-location.component';
import { CompanyManagerComponent } from './components/company-manager/company-manager.component';
import { MenuComponent } from './components/menu/menu.component';
import { AddMenuComponent } from './components/menu/add-menu/add-menu.component';
import { TimeComponent } from './components/time/time.component';
import { AddTimeComponent } from './components/time/add-time/add-time.component';
import { ContractTypeComponent } from './components/contract-type/contract-type.component';
import { AddContractTypeComponent } from './components/contract-type/add-contract-type/add-contract-type.component';
import { CertificationAuthorityComponent } from './components/certification-authority/certification-authority.component';
import { AddCertificationAuthorityComponent } from './components/certification-authority/add-certification-authority/add-certification-authority.component';
import { SocialNetworktypeComponent } from './components/social-networktype/social-networktype.component';
import { AddSocialnetworktypeComponent } from './components/social-networktype/add-socialnetworktype/add-socialnetworktype.component';
import { ContactComponent } from './components/contact/contact.component';
import { FieldComponent } from './components/field/field.component';
import { AddFieldComponent } from './components/field/add-field/add-field.component';
import { ContractsMarkersTemplatesComponent } from './components/contracts-markers-templates/contracts-markers-templates.component';
import { AddMarkerComponent } from './components/contracts-markers-templates/add-marker/add-marker.component';

@NgModule({
    declarations: [
        MainActivityComponent,
        AddMainActivityComponent,
        MaintenanceTypeComponent,
        MusicalGenreComponent,
        AddMusicalGenreComponent,
        PreferenceComponent,
        AddPreferenceComponent,
        RoleNotificationComponent,
        AddRoleNotificationComponent,
        CurrencyComponent,
        AddCurrencyComponent,
        LocationComponent,
        AddLocationComponent,
        CompanyManagerComponent,
        MenuComponent,
        AddMenuComponent,
        TimeComponent,
        AddTimeComponent,
        ContractTypeComponent,
        AddContractTypeComponent,
        CertificationAuthorityComponent,
        AddCertificationAuthorityComponent,
        SocialNetworktypeComponent,
        AddSocialnetworktypeComponent,
        ContactComponent,
        FieldComponent,
        AddFieldComponent,
        ContractsMarkersTemplatesComponent,
        AddMarkerComponent,
        // ProjectContactFormComponent
    ],
    entryComponents: [
        AddMainActivityComponent,
        AddMusicalGenreComponent,
        PreferenceComponent,
        AddPreferenceComponent,
        AddRoleNotificationComponent,
        AddCurrencyComponent,
        AddLocationComponent,
        AddMenuComponent,
        AddTimeComponent,
        AddContractTypeComponent,
        AddCertificationAuthorityComponent,
        AddSocialnetworktypeComponent,
        AddFieldComponent,
        AddMarkerComponent
        // ProjectContactFormComponent
    ],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        FuseSharedModule,
        SharedModule,
    ]
})
export class SettingsModule { }
