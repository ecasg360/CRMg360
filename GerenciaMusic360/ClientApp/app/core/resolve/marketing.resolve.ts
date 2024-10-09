import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { IMarketing } from "@models/marketing";
import { ApiService } from "@services/api.service";
import { Observable } from "rxjs";
import { EEndpoints } from '@app/core/enums/endpoints';
import { ResponseApi } from '@models/response-api';

@Injectable()

export class MarketingResolve implements Resolve<ResponseApi<IMarketing>> {

  constructor(private apiService: ApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResponseApi<IMarketing>> {
    return this.apiService.get(EEndpoints.Marketing, { id: route.params.marketingId });
  }

}