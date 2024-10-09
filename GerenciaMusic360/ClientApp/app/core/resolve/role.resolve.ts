import { Injectable } from "@angular/core";

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { ResponseApi } from "@models/response-api";

import { ApiService } from "@services/api.service";

import { Observable } from "rxjs";

@Injectable()

export class RoleResolve implements Resolve<ResponseApi<any>> {

  constructor(private apiService: ApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResponseApi<any>> {
      console.log('resolve', route.data);
    return null;
  }

}