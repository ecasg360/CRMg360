import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "@environments/environment";
import { IUser } from '@shared/models/user';


@Injectable({
    providedIn: "root"
})
export class AccountService {

    private baseUrl = environment.baseUrl;

    constructor(private http: HttpClient, private router: Router) { }

    login(model): Observable<any> {
        const body = JSON.stringify(model);
        return this.http.post(`${this.baseUrl}Login`, body);
    }

    logout() {
        let profile: IUser;
        profile = JSON.parse(localStorage.getItem(environment.currentUser));
        
        localStorage.removeItem(environment.currentUser);
        localStorage.removeItem(environment.userProfile);
        localStorage.removeItem(environment.menu);
        let aux = localStorage.getItem(profile.userId);
        if (aux != null) {
            localStorage.getItem(profile.userId);
        }
        this.router.navigate(["/auth/login"]);
    }

    setUser(model): Observable<any> {
        const body = JSON.stringify(model);
        return this.http.post(`${this.baseUrl}User`, body);
    }

    activate(code): Observable<any> {
        const body = JSON.stringify(code);
        return this.http.post(`${this.baseUrl}Activate`, body);
    }

    getUsers(): Observable<any> {
        return this.http.get(`${this.baseUrl}Users`);
    }

    getUser(id): Observable<any> {
        let params = new HttpParams().set("id", id);
        return this.http.get(`${this.baseUrl}User`, {
            params: params
        });
    }

    updateUser(model): Observable<any> {
        const body = JSON.stringify(model);
        return this.http.put(`${this.baseUrl}User`, body);
    }

    deleteUser(id): Observable<any> {
        let params = new HttpParams().set("id", id);
        return this.http.delete(`${this.baseUrl}User`, {
            params: params
        });
    }

    updateStatus(model): Observable<any> {
        const body = JSON.stringify(model);
        return this.http.post(`${this.baseUrl}UserStatus`, body);
    }

    getUserProfile(userId: number) {
        let params = new HttpParams().set("id", userId.toString());
        return this.http.get(`${this.baseUrl}User`, {
            params: params
        });
    }

    getLocalUserProfile(): IUser {
        return JSON.parse(localStorage.getItem(environment.userProfile));
    }
    sendLink(email): Observable<any> {
        return this.http.post(`${this.baseUrl}PasswordRecover` + "?email=" + email, null);
    }
    sendChangePassword(model): Observable<any> {
        const body = JSON.stringify(model);
        return this.http.post(`${this.baseUrl}PasswordRecoverReset`, model);
    }
    verifyCode(code): Observable<any> {
        let params = new HttpParams().set("code", code);
        return this.http.get(`${this.baseUrl}PasswordRecover`, {
            params: params
        });
    }
    updateLocalStorage(currentUser): void {
        let profile: IUser;
        profile = JSON.parse(localStorage.getItem(environment.userProfile));
        localStorage.removeItem(environment.userProfile);
        localStorage.setItem(environment.userProfile,JSON.stringify(currentUser));
    }

    setDefaultImage(image: string) {
        localStorage.removeItem('defaultImage');
        localStorage.setItem('defaultImage', image);
    }

    clearDefaultImage() {
        localStorage.removeItem('defaultImage');
    }
}
