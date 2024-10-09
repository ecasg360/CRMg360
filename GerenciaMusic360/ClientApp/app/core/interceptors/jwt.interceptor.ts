import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrentUser } from '@models/current-user.model';
import { AccountService } from '@services/account.service';
import { Router } from '@angular/router';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser: CurrentUser = JSON.parse(localStorage.getItem('currentUser'));
        const headers = {
            'Content-Type': 'application/json',
            Authorization: ''
        }

        if (currentUser && currentUser.authToken) {
            headers.Authorization = `Bearer ${currentUser.authToken}`;
            request = request.clone({
                setHeaders: headers
            });
            return next.handle(request).pipe(
                catchError(err => {
                    if (err.status === 401 || err.status === 403) {
                        this.accountService.logout();
                    }
                    if (err.status == 500) {
                        this.router.navigate(['/500']);
                    }
                    return throwError(err);
                })
            )
        } else {
            request = request.clone({
                setHeaders: headers
            });
            return next.handle(request);
        }
    }
}