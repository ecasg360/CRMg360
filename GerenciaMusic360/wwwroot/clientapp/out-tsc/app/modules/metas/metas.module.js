var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from '@shared/shared.module';
import { MetasRoutingModule } from './metas-routing.module';
import { MetasListComponent } from './components/metas-list/metas-list.component';
import { MetasAddComponent } from './components/metas-add/metas-add.component';
import { MetasReplyComponent } from './components/metas-reply/metas-reply.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportAddComponent } from './components/report-add/report-add.component';
var MetasModule = /** @class */ (function () {
    function MetasModule() {
    }
    MetasModule = __decorate([
        NgModule({
            declarations: [
                MetasListComponent,
                MetasAddComponent,
                MetasReplyComponent,
                ReportAddComponent
            ],
            entryComponents: [
                MetasAddComponent,
                MetasReplyComponent,
                ReportAddComponent
            ],
            imports: [
                CommonModule,
                MetasRoutingModule,
                FuseSharedModule,
                SharedModule,
                PickerModule,
                NgxChartsModule
            ]
        })
    ], MetasModule);
    return MetasModule;
}());
export { MetasModule };
//# sourceMappingURL=metas.module.js.map