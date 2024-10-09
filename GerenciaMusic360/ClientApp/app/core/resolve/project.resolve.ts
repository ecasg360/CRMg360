import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ResponseApi } from "@models/response-api";
import { IProject } from "@models/project";
import { ApiService } from "@services/api.service";
import { Observable } from "rxjs";
import { EEndpoints } from "@enums/endpoints";


@Injectable()

export class ProjectResolve implements Resolve<ResponseApi<IProject>> {

  constructor(private apiService: ApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResponseApi<IProject>> {
    return this.apiService.get(EEndpoints.Project, { id: route.params.projectId });
  }

}