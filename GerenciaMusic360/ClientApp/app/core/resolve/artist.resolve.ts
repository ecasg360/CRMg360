import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ApiService } from "@services/api.service";
import { Observable } from "rxjs";
import { EEndpoints } from '@app/core/enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IArtist } from "@models/artist";

@Injectable()

export class ArtistResolve implements Resolve<ResponseApi<IArtist>> {

  constructor(private apiService: ApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResponseApi<IArtist>> {
    return this.apiService.get(EEndpoints.Artist, { id: route.params.artistId });
  }

}