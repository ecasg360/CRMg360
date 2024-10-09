import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ApiService } from "@services/api.service";
import { Observable } from "rxjs";
import { EEndpoints } from '@app/core/enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IContract } from "@models/contract";

@Injectable()

export class ContractResolve implements Resolve<ResponseApi<IContract>> {

  constructor(private apiService: ApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResponseApi<IContract>> {
    return this.apiService.get(EEndpoints.Contract, { id: route.params.contractId });
  }

}