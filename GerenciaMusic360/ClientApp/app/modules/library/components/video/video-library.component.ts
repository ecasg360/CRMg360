import { Component, OnInit } from '@angular/core';
import { SelectOption } from '@models/select-option.models';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';

@Component({
    selector: 'app-video-library',
    templateUrl: './video-library.component.html'
})
export class VideoLibraryComponent implements OnInit {

    constructor(
        private apiService: ApiService,
        private toaster: ToasterService
    ) { }

    ngOnInit() {
 
    }

}
