var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "@environments/environment";
import { RoleStorageService } from "@services/role-storage.service";
var AuthGuard = /** @class */ (function () {
    function AuthGuard(router, security) {
        this.router = router;
        this.security = security;
    }
    AuthGuard.prototype.canActivate = function (next, state) {
        if (localStorage.getItem(environment.currentUser) && localStorage.getItem(environment.userProfile)) {
            return true;
        }
        if (state.url == "/") {
            this.router.navigate(["/auth/login"]);
        }
        else {
            this.router.navigate(["/auth/login"], {
                queryParams: { backUrl: state.url }
            });
        }
        return false;
    };
    AuthGuard = __decorate([
        Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [Router, RoleStorageService])
    ], AuthGuard);
    return AuthGuard;
}());
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map