import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { IArtist } from '@models/artist';
import { entity } from '@enums/entity';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectOption } from '@models/select-option.models';
import { IMember } from '@models/member';
import { IPerson } from '@models/person';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { isNullOrUndefined } from 'util';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-artist-form',
  templateUrl: './artist-form.component.html',
  styleUrls: ['./artist-form.component.scss']
})

export class ArtistFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() artist: IArtist;
  @Input() entityType: entity = entity.Artist;
  @Output() formReady = new EventEmitter<FormGroup>();
  @Output() formWorking = new EventEmitter<boolean>();

  private _unsubscribeAll: Subject<any> = new Subject();
  private _isWorking: boolean;

  isBuyer: boolean = false;
  artistForm: FormGroup;
  pictureUrl: any;
  musicalGenres: SelectOption[] = [];
  personTypes: SelectOption[] = [];
  membersList: IMember[] = [];

  person: IPerson = <IPerson>{};
  musicalGenresId: number[] = [];
  agentsList: SelectOption[] = [];
  isInternal: boolean = false;

  public get isWorking(): boolean {
    return this._isWorking;
  }
  public set isWorking(v: boolean) {
    this._isWorking = v;
    this._manageFormStates();
  }

  //#region Lifetime Cycle

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toaster: ToasterService,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) { }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (!changes.artist.firstChange) {
      this.person = <IPerson>this.artist;
      this.initForm();
    }
  }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.person = <IPerson>this.artist;
    this.isInternal = this.person.isInternal;
    this.pictureUrl = this.artist.pictureUrl;
    this.initForm();

    if (!isNullOrUndefined(this.entityType)) {
      this.isBuyer = true;
      this.f.personTypeId.setValue(entity.Buyer);
    }

    this.getPersonTypesApi();
    this.getMusicalGenresApi();
    this.getAgentsApi();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.formReady.complete();
    this.formWorking.complete();
  }

  //#endregion

  //#region form

  initForm(): void {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.artistForm = this.formBuilder.group({
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

  get f() { return this.artistForm.controls; }

  bindExternalForm(name: string, form: FormGroup) {
    console.log('bind');
    this.artistForm.setControl(name, form);
    this.formReady.emit(this.artistForm);
  }
  //#endregion

  //#region API

  saveArtistApi(): void {
    this.isWorking = true;
    this.prepareDataToSend();
    console.log(this.artist);
    this.apiService.save(EEndpoints.Artist, this.artist).subscribe(
      (response: ResponseApi<number>) => {
        if (response.code == 100) {
          this.artist.id = response.result;
          this.person.id = response.result;
          this.saveMusicalGenres();
          this.deleteAgentApi();
          this.toaster.showToaster(this.translate.instant('messages.dataSaved'));
        } else {
          console.log(response.message);
          this.toaster.showToaster(this.translate.instant('messages.savedArtistFailed'));
        }
        this.isWorking = false;
      }, (err) => this._responseError(err)
    );
  }

  saveBuyerApi(): void {
    this.isWorking = true;
    this.prepareDataToSend();
    this.artist.personRelationId = 0;
    this.apiService.save(EEndpoints.Buyer, this.artist).subscribe(
      (response: ResponseApi<IArtist>) => {
        if (response.code == 100) {
          this.artist.id = response.result.id;
          this.person.id = response.result.id;
          this.saveMusicalGenres();
          this.deleteAgentApi();
          this.toaster.showToaster(this.translate.instant('messages.dataSaved'));
          // this.onNoClick(response.result);
        } else {
          console.log(response.message);
          this.toaster.showToaster(this.translate.instant('messages.savedArtistFailed'));
        }
        this.isWorking = false;
      }, (err) => this._responseError(err)
    );
  }

  updateArtistApi(): void {
    console.log('actualizar');
    this.prepareDataToSend();
    this.deleteAgentApi();
    this.apiService.update(EEndpoints.Artist, this.artist).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.dataEdited'));
          this.saveMusicalGenres();
        } else {
          console.log(response.message);
          this.toaster.showToaster(this.translate.instant('errors.dataEditedFailed'));
        }
      }, err => this._responseError(err)
    );
  }

  updateBuyerApi(): void {
    this.prepareDataToSend();
    this.apiService.update(EEndpoints.Buyer, this.artist).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.toaster.showToaster(this.translate.instant('messages.dataEdited'));
          this.saveMusicalGenres();
          this.deleteAgentApi();
        } else {
          console.log(response.message);
          this.toaster.showToaster(this.translate.instant('errors.dataEditedFailed'));
        }
      }, err => this._responseError(err)
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
      }, (err) => this._responseError(err)
    );
  }

  getArtistMusicalGenresApi(): void {
    this.apiService.get(EEndpoints.PersonMusicalGenres, { personId: this.artist.id }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.musicalGenresId = [];
          if (response.result.length > 0) {
            for (let i = 0; i < response.result.length; i++) {
              const element = response.result[i];
              this.musicalGenresId.push(element.musicalGenreId);
            }
          }

          this.artistForm.patchValue({ musicalGenreId: this.musicalGenresId });
        } else {
          console.log(response.message);
        }
      }, (err) => this._responseError(err)
    )
  }

  setMusicalGenresApi() {
    this.isWorking = true;
    const data = this.musicalGenresId.map(m => {
      return {
        personId: this.artist.id,
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
      }, err => this._responseError(err)
    );
  }

  deleteMusicalGenresApi() {
    this.isWorking = true;
    this.apiService.delete(EEndpoints.PersonMusicalGenres, { id: this.artist.id }).subscribe(
      (data: ResponseApi<any>) => {
        if (data.code == 100) {
          this.setMusicalGenresApi();
        } else {
          console.log(data.message);
        }
        this.isWorking = false;;
      }, err => this._responseError(err)
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
      }, err => this._responseError(err)
    )
  }

  saveAgentApi() {
    const params = {
      PersonArtistId: this.artist.id,
      PersonAgentId: this.artist.personRelationId
    };
    this.apiService.save(EEndpoints.ArtistAgent, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code != 100) {
          this.toaster.showToaster('Ocurrio un error asociando al agente del artista');
        }
      }, err => this._responseError(err)
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
        }, err => this._responseError(err)
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
    if (!this.artistForm.invalid) {
      console.log(this.artist.id);
      if (!this.artist.id) {
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

  private _manageFormStates(): void {
    if (this.isWorking)
      this.artistForm.disable();
    else
      this.artistForm.enable();
    this.formWorking.emit(this.isWorking);
  }

  prepareDataToSend(): void {
    this.artist = this.artistForm.value['generalData'];
    this.artist.pictureUrl = (this.artist.pictureUrl.indexOf('assets') >= 0)
      ? null : this.artist.pictureUrl;

    const values = this.artistForm.value;
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
    if (this.musicalGenres.length > 0 && this.artist.id > 0) {
      this.deleteMusicalGenresApi();
    }
  }

  private _responseError(err: any) {
    this.toaster.showTranslate('general.errors.serverError');
    this.isWorking = false;
  }

  outIsInternal($event) {
    this.isInternal = $event;
  }
  //#endregion
}
