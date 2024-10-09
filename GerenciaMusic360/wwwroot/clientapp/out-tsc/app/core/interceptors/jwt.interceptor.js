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
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '@services/account.service';
import { Router } from '@angular/router';
var JwtInterceptor = /** @class */ (function () {
    function JwtInterceptor(router, accountService) {
        this.router = router;
        this.accountService = accountService;
    }
    JwtInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        var headers = {
            'Content-Type': 'application/json',
            Authorization: ''
        };
        if (currentUser && currentUser.authToken) {
            headers.Authorization = "Bearer " + currentUser.authToken;
            request = request.clone({
                setHeaders: headers
            });
            return next.handle(request).pipe(catchError(function (err) {
                if (err.status === 401 || err.status === 403) {
                    _this.accountService.logout();
                }
                if (err.status == 500) {
                    _this.router.navigate(['/500']);
                }
                return throwError(err);
            }));
        }
        else {
            request = request.clone({
                setHeaders: headers
            });
            return next.handle(request);
        }
    };
    JwtInterceptor = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Router,
            AccountService])
    ], JwtInterceptor);
    return JwtInterceptor;
}());
export { JwtInterceptor };
//# sourceMappingURL=jwt.interceptor.js.map