import { Component, OnInit } from '@angular/core';
import { IArtist } from '@models/artist';
import { EEndpoints } from '@enums/endpoints';
import { SelectOption } from '@models/select-option.models';
import { ResponseApi } from '@models/response-api';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-albumes',
  templateUrl: './albumes.component.html',
  styleUrls: ['./albumes.component.scss']
})
export class AlbumesComponent implements OnInit {

  artistsList: SelectOption[] = [];
  isAdmin: boolean = true;
  personId: number;

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService
  ) { }

  ngOnInit() {
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
