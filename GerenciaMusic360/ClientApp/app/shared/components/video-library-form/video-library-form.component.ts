import { Component, OnInit, Optional, Inject, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatAutocomplete,
    MatAutocompleteSelectedEvent
} from '@angular/material';
import { allLang } from '@i18n/allLang';
import { SelectOption } from '@models/select-option.models';
import { IVideo } from '@models/video';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ResponseSelect } from '@models/select-response';
import { ApiService } from '@services/api.service';
import { IArtist } from '@models/artist';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-video-library-form',
    templateUrl: './video-library-form.component.html',
    styleUrls: ['video-library-form.component.scss']
})
export class VideoLibraryFormComponent implements OnInit {

    videoForm: FormGroup;
    artistCtrl = new FormControl();
    filteredArtists: Observable<IArtist[]>;
    action: string;
    isWorking: boolean = true;
    pictureUrl: any;
    allArtists: IArtist[] = []; //workListSource
    artists: IArtist[] = []; //workList
    video: IVideo; //model 
    artistVideo: IArtist[] = []; //userWorkList
    videoTypes: SelectOption[] = [];

    constructor(
        private fb: FormBuilder,
        private translate: TranslateService,
        private service: ApiService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        public dialogRef: MatDialogRef<IVideo>
    ) {
    }

    ngOnInit() {
        this.isWorking = true;
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.video = <IVideo>this.actionData.model;
        this.configureForm();
        this.artistCtrl.disable();
        this.getArtists();  
        this.getVideoTypes();
    }

    private initComposers() {      
        if (!this.video.id) {
            this.action = this.translate.instant('general.save');
        } else {
            this.action = this.translate.instant('general.edit');
            this.pictureUrl = this.video.pictureUrl;
            this.getVideoComposers();
        }     
        this.isWorking = false;
    }

    get f() { return this.videoForm.controls; }

    private configureForm() {
        this.videoForm = this.fb.group({
            name: [this.video.name, [Validators.required]],
            videoTypeId: [this.video.videoTypeId, [Validators.required]],
            videoUrl: [this.video.videoUrl, [Validators.required]],
            cover: [this.video.cover, []],
            pictureUrl: [this.video.pictureUrl, []],
            videoTypeName: [this.video.videoTypeName, []]
        });

        this.filteredArtists = this.artistCtrl.valueChanges
            .pipe(
                startWith(''),
                map(artist => artist ? this._filterArtist(artist) : this.artists.slice())
            );
    }

    selectImage($evt: any): void {
        this.pictureUrl = $evt;
        this.videoForm.controls['pictureUrl'].patchValue($evt);
    }

    onNoClick(data: IVideo = undefined) {
        this.dialogRef.close(data);
    }

    setVideo() {
        if (!this.videoForm.invalid) {
            this.video = <IVideo>this.videoForm.value;
            this.video.artists = this.artistVideo;
            this.isWorking = true;

            this.video.pictureUrl = (this.pictureUrl.indexOf('assets') >= 0)
                ? null : this.video.pictureUrl;

            this.onNoClick(this.video);
        }
    }

    private getArtists() {
        this.service.get(EEndpoints.Artists).subscribe((response: ResponseApi<any>) => {
            if (response.code == 100) {
                this.initComposers();
                this.allArtists = response.result;
                this.artists = this.allArtists;
                this.artistCtrl.enable();
            }
        }, (err) => this.responseError(err));
    }

    private getVideoComposers() {
        const params = {
            videoId: this.video.id,
            typeId: 1
        };
        this.service.get(EEndpoints.VideoComposers, params).subscribe(
            (response: ResponseApi<any[]>) => {
                if (response.code == 100) {
                    this.artistVideo = response.result.map(m => {
                        return this.allArtists.find(f => f.id == m.personComposerId);
                    });
                } else
                    console.log('response', response);
            }, err => console.log('http', err)
        )
    }

    private _filterArtist(value: string): IArtist[] {
        const filterValue = value.toLowerCase();
        return this.artists.filter(artist => artist.name.toLowerCase().indexOf(filterValue) === 0);
    }

    selectedArtist($event: MatAutocompleteSelectedEvent) {
        const artistId = parseInt($event.option.id);
        const artist = this.artists.find(f => f.id == artistId);
        this.artistVideo.push(artist);
        this.artists = this.artists.filter(f => f.id != artistId);
        this.artistCtrl.setValue('');
    }

    removeChip(chip: any): void {
        const index = this.artistVideo.findIndex(fi => fi.id == chip.id);
        if (index >= 0) {
            this.artistVideo.splice(index, 1);
            const found = this.allArtists.find(f => f.id == chip.id);
            if (found) {
                this.artists.push(found);
                this.artists.slice();
                //Nota: para forzar el evento valueChanges de control y asi actualizar el datasource
                this.artistCtrl.setValue(this.artistCtrl.value);
            }
        }
    }

    private getVideoTypes() {
        const params = [];
        params['typeId'] = 4;
        this.service.get(EEndpoints.Types, params).subscribe((response: ResponseApi<any>) => {
            if (response.code == 100) {
                this.videoTypes = response.result.map((s: ResponseSelect) => ({
                    value: s.id,
                    viewValue: s.name
                }));
            }
        }, (err) => this.responseError(err));
    }

    private responseError(err: any) {
        console.log('http error', err);
    }
}
