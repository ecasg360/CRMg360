import { CommonModule } from "@angular/common";
import { FuseSharedModule } from "@fuse/shared.module";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { LibraryRoutingModule } from "./library-routing.module";
import { VideoLibraryComponent } from "./components/video/video-library.component";


@NgModule({
    declarations: [
        VideoLibraryComponent
    ],
    entryComponents: [
    ],
    imports: [
        CommonModule,
        FuseSharedModule,
        LibraryRoutingModule,
        SharedModule
    ]
})
export class LibraryModule { }
