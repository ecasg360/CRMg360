import { Component, OnInit, Optional, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToasterService } from "@services/toaster.service";
import { SelectOption } from "@models/select-option.models";
import { TranslateService } from '@ngx-translate/core';
import { entity } from '@enums/entity';
import { IArtist } from '@models/artist';
import { IMember } from '@models/member';
import { ResponseApi } from '@models/response-api';
import { IPerson } from '@models/person';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'app-add-artist',
    templateUrl: './add-artist.component.html'
})
export class AddArtistComponent implements OnInit {
    title: string;
    @Input() artist: IArtist;
    entityType: entity = entity.Artist;
    isBuyer: boolean = false;
    isArtist: boolean = false;

    addArtistForm: FormGroup;
    id: number = 0;
    actionLabel: string;
    pictureUrl: any;
    isWorking: boolean = false;
    musicalGenres: SelectOption[] = [];
    personTypes: SelectOption[] = [];
    membersList: IMember[] = [];

    person: IPerson;
    musicalGenresId: number[] = [];
    agentsList: SelectOption[] = [];
    isInternal: boolean = false;
    //#region Lifetime Cycle

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toaster: ToasterService,
        private translate: TranslateService,
        public dialogRef: MatDialogRef<IArtist>,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit() {
        console.log('Entró al onInit en add artist: ', this.data);
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.id = 0;
        this.title = (this.data.title)? this.data.title : this.translate.instant('general.artist');
        if (this.data !== null) {
            this.id = this.data.personId;
            this.artist = (this.data.model != undefined) ? <IArtist>this.data.model : <IArtist>{};
            this.person = <IPerson>this.artist;
            this.isInternal = this.person.isInternal;
            this.pictureUrl = this.artist.pictureUrl;
            this.isArtist = this.data.isArtist ? true : false;
        }

        this.initForm();

        if (!isNullOrUndefined(this.data.entityType)) {
            this.isBuyer = this.data.isBuyer;
            this.entityType = this.data.entityType;
            this.f.personTypeId.setValue(entity.Buyer);
        }

        this.getPersonTypesApi();
        this.getMusicalGenresApi();
        this.getAgentsApi();

        if (this.id > 0) {
            this.actionLabel = this.translate.instant('general.save');
            this.getArtistMusicalGenresApi();
        } else {
            this.actionLabel = this.translate.instant('general.new');
        }
    }

    //#endregion

    //#region form

    initForm(): void {
        console.log('this.isArtist en initForm: ', this.isArtist);
        const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.addArtistForm = this.formBuilder.group({
            aliasName: [this.artist.aliasName, []],
            price: [this.artist.price, [
                Validators.pattern("^[0-9]*$"),
            ]],
            personTypeId: [this.artist.personTypeId, [
                Validators.required
            ]],
            musicalGenreId: [this.musicalGenresId, [
                Validators.required
            ]],
            website: [this.artist.webSite, [
                Validators.pattern(reg)
            ]],
            personRelationId: [this.artist.personRelationId, []],
            biography: [this.artist.biography, []],
        });
    }

    get f() { return this.addArtistForm.controls; }

    bindExternalForm(name: string, form: FormGroup) {
        this.addArtistForm.setControl(name, form);
    }
    //#endregion

    //#region API

    saveArtistApi(): void {
        this.isWorking = true;
        this.prepareDataToSend();
        this.apiService.save(EEndpoints.Artist, this.artist).subscribe(
            (response: ResponseApi<number>) => {
                if (response.code == 100) {
                    this.id = response.result;
                    this.saveMusicalGenres();
                    this.deleteAgentApi();
                    this.toaster.showToaster(this.translate.instant('messages.itemSaved'));
                } else {
                    this.toaster.showToaster(this.translate.instant('messages.savedArtistFailed'));
                }
                this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    saveBuyerApi(): void {
        this.isWorking = true;
        this.prepareDataToSend();
        this.artist.personRelationId = 0;
        this.apiService.save(EEndpoints.Buyer, this.artist).subscribe(
            (response: ResponseApi<IArtist>) => {
                if (response.code == 100) {
                    this.id = response.result.id;
                    this.saveMusicalGenres();
                    this.deleteAgentApi();
                    this.toaster.showToaster(this.translate.instant('messages.dataSaved'));
                    this.onNoClick(response.result);
                } else {
                    this.toaster.showToaster(this.translate.instant('messages.savedArtistFailed'));
                }
                this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    updateArtistApi(): void {
        this.prepareDataToSend();
        this.artist.id = this.id;
        this.deleteAgentApi();
        this.apiService.update(EEndpoints.Artist, this.artist).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.dataEdited'));
                    this.saveMusicalGenres();
                } else {
                    this.toaster.showToaster(this.translate.instant('errors.dataEditedFailed'));
                }
            }, err => this.responseError(err)
        );
    }

    updateBuyerApi(): void {
        this.prepareDataToSend();
        this.artist.id = this.id;
        this.apiService.update(EEndpoints.Buyer, this.artist).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.dataEdited'));
                    this.saveMusicalGenres();
                    this.deleteAgentApi();
                } else {
                    this.toaster.showToaster(this.translate.instant('errors.dataEditedFailed'));
                }
            }, err => this.responseError(err)
        );
    }

    getMusicalGenresApi(): void {
        this.apiService.get(EEndpoints.MusicalGenres).subscribe(
            (data: ResponseApi<any>) => {
                if (data.code == 100) {
                    this.musicalGenres = data.result.map((s: any) => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                }
            }, (err) => this.responseError(err)
        );
    }

    getArtistMusicalGenresApi(): void {
        this.apiService.get(EEndpoints.PersonMusicalGenres, { personId: this.id }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.musicalGenresId = [];
                    if (response.result.length > 0) {
                        for (let i = 0; i < response.result.length; i++) {
                            const element = response.result[i];
                            this.musicalGenresId.push(element.musicalGenreId);
                        }
                    }

                    this.addArtistForm.patchValue({ musicalGenreId: this.musicalGenresId });
                } else {
                    console.log(response.message);
                }
            }, (err) => this.responseError(err)
        )
    }

    setMusicalGenresApi() {
        this.isWorking = true;
        const data = this.musicalGenresId.map(m => {
            return {
                personId: this.id,
                musicalGenreId: m
            }
        });

        this.apiService.save(EEndpoints.PersonMusicalGenres, data).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code != 100) {
                    this.toaster.showToaster(this.translate.instant('error.savedMusicalGenreFailed'));
                    console.log(response.message);
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        );
    }

    deleteMusicalGenresApi() {
        this.isWorking = true;
        this.apiService.delete(EEndpoints.PersonMusicalGenres, { id: this.id }).subscribe(
            (data: ResponseApi<any>) => {
                if (data.code == 100) {
                    this.setMusicalGenresApi();
                } else {
                    console.log(data.message);
                }
                this.isWorking = false;;
            }, err => this.responseError(err)
        );
    }

    getAgentsApi() {
        this.apiService.get(EEndpoints.Agents).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.agentsList = response.result.map((m: IPerson) => {
                        return {
                            value: m.id,
                            viewValue: m.name
                        };
                    });
                } else
                    console.log(response.message);
            }, err => this.responseError(err)
        )
    }

    saveAgentApi() {
        const params = {
            PersonArtistId: this.id,
            PersonAgentId: this.artist.personRelationId
        };
        this.apiService.save(EEndpoints.ArtistAgent, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code != 100) {
                    this.toaster.showToaster('Ocurrio un error asociando al agente del artista');
                }
            }, err => this.responseError(err)
        )
    }

    deleteAgentApi() {
        console.log('borrando agente');
        if (this.artist.personRelationId > 0) {
            console.log('agent: ' + this.artist.personRelationId);
            console.log('artist: ' + this.artist.id);
            this.apiService.delete(EEndpoints.ArtistAgent, { agentId: this.artist.personRelationId, artistId: this.artist.id }).subscribe(
                (response: ResponseApi<any>) => {
                    this.saveAgentApi();
                }, err => this.responseError(err)
            )
        }
    }

    getPersonTypesApi() {
        this.apiService.get(EEndpoints.PersonTypes, { entityId: entity.Artist }).subscribe(data => {
            if (data.code == 100) {
                this.personTypes = data.result.map((s: any) => ({
                    value: s.id,
                    viewValue: s.name
                }));
            }
        }, (err) => console.error('Failed artist type! ', err)
        );
    }

    //#endregion

    //#region general methods
    setArtist() {
        if (!this.addArtistForm.invalid) {
            console.log(this.id);
            if (!this.id) {
                switch (this.entityType) {
                    case entity.Artist:
                        this.saveArtistApi();
                        break;
                    case entity.Buyer:
                        this.saveBuyerApi();
                        break;
                    default:
                        this.saveArtistApi();
                        break;
                }
            } else {
                switch (this.entityType) {
                    case entity.Artist:
                        this.updateArtistApi();
                        break;
                    case entity.Buyer:
                        this.updateBuyerApi();
                        break;
                    default:
                        this.saveArtistApi();
                        break;
                }
            }
        }
    }

    prepareDataToSend(): void {
        this.artist = this.addArtistForm.value['generalData'];
        this.artist.pictureUrl = (this.artist.pictureUrl && this.artist.pictureUrl.indexOf('assets') >= 0)
            ? null : this.artist.pictureUrl;

        const values = this.addArtistForm.value;
        this.musicalGenresId = values.musicalGenreId;

        for (const key in values) {
            if (
                key != 'generalData' && key != 'musicalGenreId' &&
                key != 'generalTaste' && key != 'birthDate') {
                let value = values[key];
                this.artist[key] = value;
            }
        }
    }

    saveMusicalGenres(): void {
        if (this.musicalGenres.length > 0 && this.id > 0) {
            this.deleteMusicalGenresApi();
        }
    }

    responseError(err: any) {
        console.log('http error', err);
        this.isWorking = false;
    }

    onNoClick(artist: IArtist = undefined): void {
        this.dialogRef.close(artist);
    }
    outIsInternal($event) {
        this.isInternal = $event;
    }
    //#endregion
}