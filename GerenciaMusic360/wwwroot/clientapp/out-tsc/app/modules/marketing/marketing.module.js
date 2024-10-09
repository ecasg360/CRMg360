var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingRoutingModule } from './marketing-routing.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from '@shared/shared.module';
import { ListComponent } from './components/list/list.component';
import { CampainFormComponent } from './components/campain-form/campain-form.component';
import { CampainFormModalComponent } from './components/campain-form-modal/campain-form-modal.component';
import { ManageComponent } from './components/manage/manage.component';
import { GoalsComponent } from './components/goals/goals.component';
import { CampainPlanComponent } from './components/campain-plan/campain-plan.component';
import { ModalPlanComponent } from './components/campain-plan/modal-plan/modal-plan.component';
import { DemographicFocusComponent } from './components/demographic-focus/demographic-focus.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseWidgetModule } from '@fuse/components';
import { AddGoalComponent } from './components/goals/add-goal/add-goal.component';
import { GoalAuditModalComponent } from './components/goal-audit-modal/goal-audit-modal.component';
import { StreamingPlaylistComponent } from './components/streaming-playlist/streaming-playlist.component';
import { MediaTargetsComponent } from './components/media-targets/media-targets.component';
import { MarketingSocialMediaComponent } from './components/marketing-social-media/marketing-social-media.component';
import { GeneralViewContainerComponent } from './components/general-view-container/general-view-container.component';
import { MarketingResolve } from '@app/core/resolve/marketing.resolve';
import { StreamAddPlaylistsComponent } from './components/stream-add-playlists/stream-add-playlists.component';
import { KeysIdeasManageComponent } from './components/keys-ideas-manage/keys-ideas-manage.component';
import { AssetsComponent } from './components/assets/assets.component';
import { AssetsModalComponent } from './components/assets/assets-modal/assets-modal.component';
import { ConventionalMediaComponent } from './components/conventional-media/conventional-media.component';
import { DigitalPlatformComponent } from './components/digital-platform/digital-platform.component';
import { TouringComponent } from './components/touring/touring.component';
import { SocialMediaComponent } from './components/social-media/social-media.component';
import { CalendarModule } from '@commons/feature/calendar-manager/calendar.module';
import { MarketingPlanCompleteComponent } from './components/marketing-plan-complete/marketing-plan-complete.component';
var MarketingModule = /** @class */ (function () {
    function MarketingModule() {
    }
    MarketingModule = __decorate([
        NgModule({
            declarations: [
                ListComponent,
                CampainFormComponent,
                CampainFormModalComponent,
                ManageComponent, GoalsComponent,
                CampainPlanComponent,
                ModalPlanComponent,
                DemographicFocusComponent,
                AddGoalComponent,
                GoalAuditModalComponent,
                StreamingPlaylistComponent,
                MediaTargetsComponent,
                MarketingSocialMediaComponent,
                GeneralViewContainerComponent,
                StreamAddPlaylistsComponent,
                KeysIdeasManageComponent,
                AssetsComponent,
                AssetsModalComponent,
                ConventionalMediaComponent,
                DigitalPlatformComponent,
                TouringComponent,
                SocialMediaComponent,
                MarketingPlanCompleteComponent,
            ],
            entryComponents: [
                CampainFormModalComponent,
                ModalPlanComponent,
                AddGoalComponent,
                GoalAuditModalComponent,
                StreamingPlaylistComponent,
                MediaTargetsComponent,
                StreamAddPlaylistsComponent,
                MarketingSocialMediaComponent,
                AssetsModalComponent,
                ConventionalMediaComponent,
                DigitalPlatformComponent,
                TouringComponent,
                SocialMediaComponent,
                MarketingPlanCompleteComponent
            ],
            imports: [
                CommonModule,
                MarketingRoutingModule,
                FuseSharedModule,
                SharedModule,
                NgxChartsModule,
                FuseWidgetModule,
                CalendarModule,
            ],
            providers: [
                MarketingResolve
            ],
        })
    ], MarketingModule);
    return MarketingModule;
}());
export { MarketingModule };
//# sourceMappingURL=marketing.module.js.map