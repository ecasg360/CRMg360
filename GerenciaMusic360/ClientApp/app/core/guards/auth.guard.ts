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

export class AuthGuard implements CanActivate {

  perm: any;

  constructor(private router: Router, private security: RoleStorageService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    if (localStorage.getItem(environment.currentUser) && localStorage.getItem(environment.userProfile)) {
      return true;
    }
    if (state.url == "/") {
      this.router.navigate(["/auth/login"]);
    } else {
      this.router.navigate(["/auth/login"], {
        queryParams: { backUrl: state.url }
      });
    }
    return false;
  }
}

