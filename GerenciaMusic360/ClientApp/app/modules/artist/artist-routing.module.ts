import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtistComponent } from './components/artist/artist.component';
import { GroupComponent } from './components/group/group.component';
import { MembersgroupComponent } from './components/membersgroup/membersgroup.component';
import { TrippreferenceComponent } from './components/trippreference/trippreference.component';
import { ArtistTypeComponent } from './components/type/artist-type.component';
import { MusicalInstrumentComponent } from './components/musical-instrument/musical-instrument.component';
import { AlbumesComponent } from './components/albumes/albumes.component';
import { MembersComponent } from './components/members/members.component';
import { AddArtistComponent } from './components/artist/add-artist.component';
import { ModuleGuard } from '@guards/module.guard';

const routes: Routes = [
    {
        path: '',
        component: ArtistComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Artist'}
    },
    {
        path: 'manage',
        component: ArtistComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Artist'}
    },
     {
        path: 'type',
        component: ArtistTypeComponent,
        canActivate: [ModuleGuard],
        data: {access: 'PersonType'}
     },
    {
        path: 'group',
        component: GroupComponent,
        canActivate: [ModuleGuard],
        data: {access: 'ArtistMember'}
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
        data: {access: 'MusicalInstrument'}
    },
    {
        path: 'trip-preference',
        component: TrippreferenceComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Artist'}
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

@NgModule({
    imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ArtistRoutingModule { }
