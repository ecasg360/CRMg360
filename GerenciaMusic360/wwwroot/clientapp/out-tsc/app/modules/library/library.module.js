var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CommonModule } from "@angular/common";
import { FuseSharedModule } from "@fuse/shared.module";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { LibraryRoutingModule } from "./library-routing.module";
import { VideoLibraryComponent } from "./components/video/video-library.component";
var LibraryModule = /** @class */ (function () {
    function LibraryModule() {
    }
    LibraryModule = __decorate([
        NgModule({
            declarations: [
                VideoLibraryComponent
            ],
            entryComponents: [],
            imports: [
                CommonModule,
                FuseSharedModule,
                LibraryRoutingModule,
                SharedModule
            ]
        })
    ], LibraryModule);
    return LibraryModule;
}());
export { LibraryModule };
//# sourceMappingURL=library.module.js.map