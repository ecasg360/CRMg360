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
import { RoleStorageService } from "@services/role-storage.service";
var ModuleGuard = /** @class */ (function () {
    function ModuleGuard(router, security) {
        this.router = router;
        this.security = security;
    }
    ModuleGuard.prototype.canActivate = function (next, state) {
        console.log('Entrpo al guard module');
        this.perm = this.getAccess(next.data);
        next.data = this.perm;
        if (Object.keys(this.perm).length > 0)
            return true;
        else {
            this.router.navigate(["/"]);
            return false;
        }
    };
    ModuleGuard.prototype.getAccess = function (data) {
        console.log('entró al getAccess: ', data.access);
        var tokenData = this.security.getSessionData();
        var perm = {};
        if (tokenData && data.access != undefined) {
            var slices = data.access.split(',');
            if (slices.length > 0) {
                for (var index = 0; index < slices.length; index++) {
                    var element = slices[index];
                    var access = this.formatAccess(tokenData[element]);
                    if (Object.keys(access).length > 0)
                        perm[element] = access;
                }
            }
        }
        console.log('perm to return: ', perm);
        return perm;
    };
    ModuleGuard.prototype.formatAccess = function (moduleAccess) {
        console.log('entró al formatAccess: ', moduleAccess);
        var access = {};
        if (moduleAccess != undefined) {
            var slices = moduleAccess.split(',');
            if (slices.length > 0) {
                for (var index = 0; index < slices.length; index++) {
                    var element = slices[index];
                    access[element] = element;
                }
            }
        }
        return access;
    };
    ModuleGuard = __decorate([
        Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [Router, RoleStorageService])
    ], ModuleGuard);
    return ModuleGuard;
}());
export { ModuleGuard };
//# sourceMappingURL=module.guard.js.map