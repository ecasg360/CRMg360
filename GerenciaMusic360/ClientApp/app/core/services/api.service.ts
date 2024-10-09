import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EEndpoints } from '../enums/endpoints';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    get(endpoint: EEndpoints, params?: any): Observable<any> {
        let httpParams = new HttpParams();
        if (params) {
            for (const k in params) {
                if ((params as object).hasOwnProperty(k)) {
                    httpParams = httpParams.append(k, params[k]);
                }
            }
        }
        return this.http.get(`${this.baseUrl}${endpoint}`, { params: httpParams });
    }

    delete(endpoint: EEndpoints, params?: any): Observable<any> {
        let httpParams = new HttpParams();
        if (params) {
            for (const k in params) {
                if ((params as object).hasOwnProperty(k)) {
                    httpParams = httpParams.append(k, params[k]);
                }
            }
        }
        return this.http.delete(`${this.baseUrl}${endpoint}`, { params: httpParams });
    }

    save(endpoint: EEndpoints, model: any): Observable<any> {
        return this.http.post(`${this.baseUrl}${endpoint}`, model);
    }

    update(endpoint: EEndpoints, model: any): Observable<any> {
        return this.http.put(`${this.baseUrl}${endpoint}`, model);
    }

    download(endpoint: EEndpoints, params?: any): Observable<any> {
        let httpParams = new HttpParams();
        if (params) {
            for (const k in params) {
                if ((params as object).hasOwnProperty(k)) {
                    httpParams = httpParams.append(k, params[k]);
                }
            }
        }
        return this.http.get(`${this.baseUrl}${endpoint}`, { params: httpParams, responseType: 'blob' as 'blob' });
    }

    downloadPost(endpoint: EEndpoints, params?: any): Observable<any> {
        let httpParams = new HttpParams();
        if (params) {
            for (const k in params) {
                if ((params as object).hasOwnProperty(k)) {
                    httpParams = httpParams.append(k, params[k]);
                }
            }
        }
        return this.http.post(`${this.baseUrl}${endpoint}`, { params: httpParams, responseType: 'blob' as 'blob' });
    }
}
