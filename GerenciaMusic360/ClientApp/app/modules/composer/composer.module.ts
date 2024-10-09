import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorksComponent } from './components/works/works.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from '@shared/shared.module';
import { ComposerComponent } from './components/composer/composer.component';
import { ComposerRoutingModule } from './composer-routing.module';

@NgModule({
  declarations: [
    WorksComponent,
    ComposerComponent,
  ],
  entryComponents: [
  ],
  imports: [
    CommonModule,
    ComposerRoutingModule,
    FuseSharedModule,
    SharedModule
  ]
})
export class ComposerModule { }
