import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ApiService } from "@services/api.service";
import { Observable } from "rxjs";
import { EEndpoints } from '@app/core/enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IStatusProject } from "@models/status-project";

@Injectable()

export class ProjectStatusResolve implements Resolve<ResponseApi<IStatusProject[]>> {

  constructor(private apiService: ApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResponseApi<IStatusProject[]>> {
    return this.apiService.get(EEndpoints.StatusProjects);
  }

}