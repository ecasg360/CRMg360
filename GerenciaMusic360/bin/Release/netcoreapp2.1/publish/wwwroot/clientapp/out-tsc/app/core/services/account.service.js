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
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "@environments/environment";
var AccountService = /** @class */ (function () {
    function AccountService(http, router) {
        this.http = http;
        this.router = router;
        this.baseUrl = environment.baseUrl;
    }
    AccountService.prototype.login = function (model) {
        var body = JSON.stringify(model);
        return this.http.post(this.baseUrl + "Login", body);
    };
    AccountService.prototype.logout = function () {
        var profile;
        profile = JSON.parse(localStorage.getItem(environment.currentUser));
        localStorage.removeItem(environment.currentUser);
        localStorage.removeItem(environment.userProfile);
        localStorage.removeItem(environment.menu);
        var aux = localStorage.getItem(profile.userId);
        if (aux != null) {
            localStorage.getItem(profile.userId);
        }
        this.router.navigate(["/auth/login"]);
    };
    AccountService.prototype.setUser = function (model) {
        var body = JSON.stringify(model);
        return this.http.post(this.baseUrl + "User", body);
    };
    AccountService.prototype.activate = function (code) {
        var body = JSON.stringify(code);
        return this.http.post(this.baseUrl + "Activate", body);
    };
    AccountService.prototype.getUsers = function () {
        return this.http.get(this.baseUrl + "Users");
    };
    AccountService.prototype.getUser = function (id) {
        var params = new HttpParams().set("id", id);
        return this.http.get(this.baseUrl + "User", {
            params: params
        });
    };
    AccountService.prototype.updateUser = function (model) {
        var body = JSON.stringify(model);
        return this.http.put(this.baseUrl + "User", body);
    };
    AccountService.prototype.deleteUser = function (id) {
        var params = new HttpParams().set("id", id);
        return this.http.delete(this.baseUrl + "User", {
            params: params
        });
    };
    AccountService.prototype.updateStatus = function (model) {
        var body = JSON.stringify(model);
        return this.http.post(this.baseUrl + "UserStatus", body);
    };
    AccountService.prototype.getUserProfile = function (userId) {
        var params = new HttpParams().set("id", userId.toString());
        return this.http.get(this.baseUrl + "User", {
            params: params
        });
    };
    AccountService.prototype.getLocalUserProfile = function () {
        return JSON.parse(localStorage.getItem(environment.userProfile));
    };
    AccountService.prototype.sendLink = function (email) {
        return this.http.post(this.baseUrl + "PasswordRecover" + "?email=" + email, null);
    };
    AccountService.prototype.sendChangePassword = function (model) {
        var body = JSON.stringify(model);
        return this.http.post(this.baseUrl + "PasswordRecoverReset", model);
    };
    AccountService.prototype.verifyCode = function (code) {
        var params = new HttpParams().set("code", code);
        return this.http.get(this.baseUrl + "PasswordRecover", {
            params: params
        });
    };
    AccountService.prototype.updateLocalStorage = function (currentUser) {
        var profile;
        profile = JSON.parse(localStorage.getItem(environment.userProfile));
        localStorage.removeItem(environment.userProfile);
        localStorage.setItem(environment.userProfile, JSON.stringify(currentUser));
    };
    AccountService.prototype.setDefaultImage = function (image) {
        localStorage.removeItem('defaultImage');
        localStorage.setItem('defaultImage', image);
    };
    AccountService.prototype.clearDefaultImage = function () {
        localStorage.removeItem('defaultImage');
    };
    AccountService = __decorate([
        Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [HttpClient, Router])
    ], AccountService);
    return AccountService;
}());
export { AccountService };
//# sourceMappingURL=account.service.js.map