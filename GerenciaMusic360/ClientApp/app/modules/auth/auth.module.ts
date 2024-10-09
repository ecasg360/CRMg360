import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCaptchaModule } from 'ngx-captcha';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from 'ClientApp/app/shared/shared.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { SoundWaveComponent } from './components/sound-wave/sound-wave.component';
import { TurnImagesComponent } from './components/turn-images/turn-images.component';

const routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login/:backUrl',
    component: LoginComponent
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    SoundWaveComponent,
    TurnImagesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    SharedModule,
    NgxCaptchaModule,
  ]
})
export class AuthModule { }
