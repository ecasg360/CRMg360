import { Component, OnInit } from '@angular/core';
import { SelectOption } from '@models/select-option.models';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IArtist } from '@models/artist';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  artistsList: SelectOption[] = [];
  isAdmin: boolean = true;
  personId: number;

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    //TODO: crear condicion mostrar o no el select, se deberia toomar el id de artista cuando el rol sea ese
    this.getArtists();
  }

  //#region API
  getArtists() {
    this.apiService.get(EEndpoints.Artists).subscribe(
      (response: ResponseApi<IArtist[]>) => {
        if (response.code == 100) {
          this.artistsList = response.result.map((artist: IArtist) => {
            return {
              value: artist.id,
              viewValue: `${artist.name} ${artist.lastName} ${artist.secondLastName}`
            }
          });
        } else {
          this.toaster.showToaster('Error obtenido listado de artistas');
        }
      }, err => console.log('http', err)
    )
  }
  //#endregion

}
