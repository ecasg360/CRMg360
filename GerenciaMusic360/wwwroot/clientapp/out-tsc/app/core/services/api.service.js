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
import { HttpClient, HttpParams } from '@angular/common/http';
var ApiService = /** @class */ (function () {
    function ApiService(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    ApiService.prototype.get = function (endpoint, params) {
        var httpParams = new HttpParams();
        if (params) {
            for (var k in params) {
                if (params.hasOwnProperty(k)) {
                    httpParams = httpParams.append(k, params[k]);
                }
            }
        }
        return this.http.get("" + this.baseUrl + endpoint, { params: httpParams });
    };
    ApiService.prototype.delete = function (endpoint, params) {
        var httpParams = new HttpParams();
        if (params) {
            for (var k in params) {
                if (params.hasOwnProperty(k)) {
                    httpParams = httpParams.append(k, params[k]);
                }
            }
        }
        return this.http.delete("" + this.baseUrl + endpoint, { params: httpParams });
    };
    ApiService.prototype.save = function (endpoint, model) {
        return this.http.post("" + this.baseUrl + endpoint, model);
    };
    ApiService.prototype.update = function (endpoint, model) {
        return this.http.put("" + this.baseUrl + endpoint, model);
    };
    ApiService.prototype.download = function (endpoint, params) {
        var httpParams = new HttpParams();
        if (params) {
            for (var k in params) {
                if (params.hasOwnProperty(k)) {
                    httpParams = httpParams.append(k, params[k]);
                }
            }
        }
        return this.http.get("" + this.baseUrl + endpoint, { params: httpParams, responseType: 'blob' });
    };
    ApiService.prototype.downloadPost = function (endpoint, params) {
        var httpParams = new HttpParams();
        if (params) {
            for (var k in params) {
                if (params.hasOwnProperty(k)) {
                    httpParams = httpParams.append(k, params[k]);
                }
            }
        }
        return this.http.post("" + this.baseUrl + endpoint, { params: httpParams, responseType: 'blob' });
    };
    ApiService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], ApiService);
    return ApiService;
}());
export { ApiService };
//# sourceMappingURL=api.service.js.map