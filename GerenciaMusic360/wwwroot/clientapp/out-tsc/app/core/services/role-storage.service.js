var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
var RoleStorageService = /** @class */ (function () {
    function RoleStorageService() {
    }
    RoleStorageService.prototype.getSessionData = function () {
        var tokenData = JSON.parse(localStorage.getItem(environment.currentUser));
        if (tokenData) {
            var sliceToken = tokenData.authToken.split('.');
            if (sliceToken.length > 0) {
                var data = atob(sliceToken[1]);
                console.log('data dentro de getSessionData: ', data);
                if (data)
                    return JSON.parse(data);
            }
        }
        return null;
    };
    RoleStorageService.prototype.formatMenu = function (menu) {
        var formatMenu = {};
        this.tokenData = this.getSessionData();
        if (menu.length > 0) {
            console.log('menu esr dentro del service: ', menu);
            menu = this.formatChildren(menu);
            for (var index = 0; index < menu.length; index++) {
                menu[index].children = this.formatChildren(menu[index].children);
            }
            //se realiza nuevamente la iteracion porque si se elimina en la primera se reduce el arreglo y da error de longitud y objeto
            menu = menu.filter(function (m) { return m.children.length > 0; });
        }
        return menu;
    };
    RoleStorageService.prototype.formatChildren = function (children) {
        var newChildren = [];
        if (children.length > 0) {
            for (var index = 0; index < children.length; index++) {
                var element = children[index];
                if (element.roles != null) {
                    if (this.findRole(element.roles))
                        newChildren.push(element);
                }
                else
                    newChildren.push(element);
            }
        }
        return newChildren;
    };
    RoleStorageService.prototype.findRole = function (role) {
        var roles = Object.keys(this.tokenData);
        if (roles.length > 0) {
            var rol = roles.find(function (f) { return f == role; });
            return (rol != undefined);
        }
        return false;
    };
    RoleStorageService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], RoleStorageService);
    return RoleStorageService;
}());
export { RoleStorageService };
//# sourceMappingURL=role-storage.service.js.map