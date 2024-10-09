import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "@environments/environment";
import { RoleStorageService } from "@services/role-storage.service";

@Injectable({
  providedIn: "root"
})

export class ModuleGuard implements CanActivate {

  perm: any;

  constructor(private router: Router, private security: RoleStorageService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('Entrpo al guard module');
    this.perm = this.getAccess(next.data);
    next.data = this.perm;
      
    if(Object.keys(this.perm).length > 0)
      return true;
    else {
      this.router.navigate(["/"]);
      return false;
    }
  }

  private getAccess(data): any {
    console.log('entró al getAccess: ', data.access);
    const tokenData = this.security.getSessionData();
    let perm = {};
    if (tokenData && data.access != undefined) {
      const slices = data.access.split(',');
      if (slices.length > 0) {
        for (let index = 0; index < slices.length; index++) {
          const element = slices[index];
          const access = this.formatAccess(tokenData[element]);
          if (Object.keys(access).length > 0)
            perm[element] = access;
        }
      }
    }
    console.log('perm to return: ', perm);
    return perm;
  }

  formatAccess(moduleAccess){
    console.log('entró al formatAccess: ', moduleAccess);
    let access = {};
    if (moduleAccess != undefined) {
        const slices = moduleAccess.split(',');
        if (slices.length > 0) {
          for (let index = 0; index < slices.length; index++) {
            const element = slices[index];
            access[element] = element;
          }
        }
    }    
    return access;
  }
}

