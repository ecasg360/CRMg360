var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { fuseConfig } from '@app/fuse-config';
import { AppComponent } from '@app/app.component';
import { LayoutModule } from '@app/layout/layout.module';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app.routes';
import { JwtInterceptor } from '@interceptors/jwt.interceptor';
import { SettingsModule } from './modules/settings/settings.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                AppComponent,
            ],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                HttpClientModule,
                TranslateModule.forRoot(),
                // Material moment date module
                MatMomentDateModule,
                // Material
                MatButtonModule,
                MatIconModule,
                CoreModule.forRoot(),
                // Fuse modules
                FuseModule.forRoot(fuseConfig),
                FuseProgressBarModule,
                FuseSharedModule,
                FuseSidebarModule,
                FuseThemeOptionsModule,
                // App modules
                LayoutModule,
                AppRoutingModule,
                SettingsModule,
                MarketingModule,
                MomentModule,
                NgIdleKeepaliveModule.forRoot(),
            ],
            providers: [
                { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
            ],
            bootstrap: [
                AppComponent
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map