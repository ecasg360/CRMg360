import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-album-detail',
    templateUrl: './album-detail.component.html',
    styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit, OnDestroy {

    constructor(private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
    }
    ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }


}
