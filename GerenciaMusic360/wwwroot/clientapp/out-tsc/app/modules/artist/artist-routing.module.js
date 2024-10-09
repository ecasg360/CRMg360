var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArtistComponent } from './components/artist/artist.component';
import { GroupComponent } from './components/group/group.component';
import { TrippreferenceComponent } from './components/trippreference/trippreference.component';
import { ArtistTypeComponent } from './components/type/artist-type.component';
import { MusicalInstrumentComponent } from './components/musical-instrument/musical-instrument.component';
import { ModuleGuard } from '@guards/module.guard';
var routes = [
    {
        path: '',
        component: ArtistComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Artist' }
    },
    {
        path: 'manage',
        component: ArtistComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Artist' }
    },
    {
        path: 'type',
        component: ArtistTypeComponent,
        canActivate: [ModuleGuard],
        data: { access: 'PersonType' }
    },
    {
        path: 'group',
        component: GroupComponent,
        canActivate: [ModuleGuard],
        data: { access: 'ArtistMember' }
    },
    // {
    //     path: 'members-group',
    //     component: MembersgroupComponent,
    //     canActivate: [ModuleGuard],
    //     data: {access: 'ArtistMember'}
    // },
    {
        path: 'musical-instrument',
        component: MusicalInstrumentComponent,
        canActivate: [ModuleGuard],
        data: { access: 'MusicalInstrument' }
    },
    {
        path: 'trip-preference',
        component: TrippreferenceComponent,
        canActivate: [ModuleGuard],
        data: { access: 'Artist' }
    },
    // {
    //     path: 'albumes',
    //     component: AlbumesComponent,
    //     canActivate: [ModuleGuard],
    //     data: {access: 'Album'}
    // },
    // {
    //     path: 'team',
    //     component: MembersComponent,
    //     canActivate: [ModuleGuard],
    //     data: {access: 'ArtistMember'}
    // },
];
var ArtistRoutingModule = /** @class */ (function () {
    function ArtistRoutingModule() {
    }
    ArtistRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], ArtistRoutingModule);
    return ArtistRoutingModule;
}());
export { ArtistRoutingModule };
//# sourceMappingURL=artist-routing.module.js.map