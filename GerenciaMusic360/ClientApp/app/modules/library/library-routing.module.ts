import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoLibraryComponent } from './components/video/video-library.component';
import { ModuleGuard } from '@guards/module.guard';

const routes: Routes = [
    {
        path: 'video',
        component: VideoLibraryComponent,
        canActivate: [ModuleGuard],
        data: {access: 'Video'}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LibraryRoutingModule { }
