import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArtistComponent } from "./components/artist/artist.component";
import { AddArtistComponent } from "./components/artist/add-artist.component";
import { AddArtistTypeComponent } from "./components/type/add-artist-type.component";
import { ArtistTypeComponent } from "./components/type/artist-type.component";
import { GroupComponent } from "./components/group/group.component";
import { AddGroupComponent } from "./components/group/addgroup/addgroup.component";
import { MembersgroupComponent } from "./components/membersgroup/membersgroup.component";
import { AddMembersgroupComponent } from "./components/membersgroup/addmembersgroup/addmembersgroup.component";
import { TrippreferenceComponent } from "./components/trippreference/trippreference.component";
import { AddtripprefereceComponent } from "./components/trippreference/addtrippreferece/addtrippreferece.component";
import { ArtistRoutingModule } from "./artist-routing.module";
import { SharedModule } from "@shared/shared.module";
import { FuseSharedModule } from '@fuse/shared.module';
import { MusicalInstrumentComponent } from './components/musical-instrument/musical-instrument.component';
import { AddMusicalInstrumentComponent } from './components/musical-instrument/add-musical-instrument/add-musical-instrument.component';
import { AlbumesComponent } from './components/albumes/albumes.component';
import { MembersComponent } from './components/members/members.component';
import { ArtistFormComponent } from "./components/artist-form/artist-form.component";
import { ArtistManageComponent } from "./components/artist-manage/artist-manage.component";
import { ArtistListComponent } from "./components/artist-list/artist-list.component";


@NgModule({
  declarations: [
    ArtistComponent,
    AddArtistTypeComponent,
    ArtistTypeComponent,
    GroupComponent,
    AddGroupComponent,
    MembersgroupComponent,
    AddMembersgroupComponent,
    AlbumesComponent,
    TrippreferenceComponent,
    AddtripprefereceComponent,
    AddGroupComponent,
    MusicalInstrumentComponent,
    AddMusicalInstrumentComponent,
    MembersComponent,
    ArtistFormComponent,
    ArtistManageComponent,
    ArtistListComponent,
  ],
  entryComponents: [
    AddArtistTypeComponent,
    AddtripprefereceComponent,
    AddGroupComponent,
    AddMusicalInstrumentComponent,

  ],
  imports: [
    CommonModule,
    ArtistRoutingModule,
    FuseSharedModule,
    SharedModule
  ]
})
export class ArtistModule { }
