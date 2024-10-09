import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Album } from '@models/album';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ResponseApi } from '@models/response-api';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { Work } from '@models/work';
import { MAT_DIALOG_DATA, MatDialogRef, MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
    selector: 'app-album-form',
    templateUrl: './album-form.component.html',
    styleUrls: ['album-form.component.scss']
})
export class AlbumFormComponent implements OnInit {

    albumForm: FormGroup;
    workCtrl = new FormControl();
    filteredWorks: Observable<Work[]>;
    action: string;
    isWorking: boolean;
    pictureURL: any;
    workListSource: Work[] = [];
    workList: Work[] = [];
    model: Album = <Album>{};
    userWorkList: Work[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private apiService: ApiService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        public dialogRef: MatDialogRef<Album>
    ) { }

    ngOnInit() {
        this.isWorking = true;
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.model = <Album>this.actionData.model;
        this.getWoksApi();
        if (!this.model.id) {
            this.action = this.translate.instant('general.save');
        } else {
            this.action = this.translate.instant('general.save');
            this.pictureURL = this.model.pictureUrl;
            //this.getAlbumWorksApi();
        }
        this.configureForm();
        this.workCtrl.disable();
        this.isWorking = false;

    }

    get f() { return this.albumForm.controls; }

    configureForm(): void {
        const releaseDateString = (this.model.releaseDate)
            ? (new Date(this.model.releaseDate)).toISOString()
            : '';
        this.albumForm = this.formBuilder.group({
            name: [this.model.name, [Validators.required]],
            numRecord: [this.model.numRecord, []],
            pictureUrl: [this.model.pictureUrl, []],
            releaseDateString: [releaseDateString, [Validators.required]],
        });

        this.filteredWorks = this.workCtrl.valueChanges
            .pipe(
                startWith(''),
                map(work => work ? this._filterWorks(work) : this.workList.slice())
            );
    }

    selectImage($evt: any): void {
        this.pictureURL = $evt;
        this.albumForm.controls['pictureUrl'].patchValue($evt);
    }

    onNoClick(data: Album = undefined) {
        this.dialogRef.close(data);
    }

    setAlbum() {
        if (!this.albumForm.invalid) {
            this.model = <Album>this.albumForm.value;
            this.model.numRecord = this.userWorkList.length.toString();
            this.model.works = this.userWorkList;
            this.model.pictureUrl = (this.pictureURL)
                ? this.pictureURL : this.model.pictureUrl;
            this.onNoClick(this.model);
        }
    }

    getWoksApi() {
        this.apiService.get(EEndpoints.Works).subscribe(
            (response: ResponseApi<Work[]>) => {
                if (response.code == 100) {
                    this.workListSource = response.result;
                    this.workList = this.workListSource;
                    this.workCtrl.enable();
                    this.getAlbumWorksApi();
                }
            }, err => console.log('http', err)
        )
    }

    getAlbumWorksApi() {
        const params = {
            albumId: this.model.id,
            typeId: 1
        };
        console.log('getAlbumWorksApi');
        this.apiService.get(EEndpoints.AlbumWorks, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    var works = [];
                    response.result.works.map(item => {
                        works.push(this.workListSource.find(work => work.id === item.id));
                    });
                    this.userWorkList = works;
                } else
                    console.log('response', response);
            }, err => console.log('http', err)
        )
    }

    private _filterWorks(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.workList.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
    }

    selectedWork($event: MatAutocompleteSelectedEvent) {
        const workId = parseInt($event.option.id);
        const work = this.workList.find(f => f.id == workId);
        this.userWorkList.push(work);
        this.workList = this.workList.filter(f => f.id != workId);
        this.workCtrl.setValue('');
    }

    removeChip(chip: any): void {
        const index = this.userWorkList.findIndex(fi => fi.id == chip.id);
        if (index >= 0) {
            this.userWorkList.splice(index, 1);
            const found = this.workListSource.find(f => f.id == chip.id);
            if (found) {
                this.workList.push(found);
                this.workList.slice();
                //Nota: para forzar el evento valueChanges de control y asi actualizar el datasource
                this.workCtrl.setValue(this.workCtrl.value);
            }
        }
    }
}
