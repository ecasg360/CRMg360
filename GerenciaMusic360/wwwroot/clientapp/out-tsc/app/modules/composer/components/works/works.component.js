var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from '@angular/router';
var WorksComponent = /** @class */ (function () {
    function WorksComponent(apiService, route) {
        this.apiService = apiService;
        this.route = route;
        this.composersList = [];
        this.isAdmin = true;
        this.personId = 0;
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    WorksComponent.prototype.ngOnInit = function () {
        this.getComposers();
    };
    WorksComponent.prototype.getComposers = function () {
        var _this = this;
        return this.apiService.get(EEndpoints.Composers).subscribe(function (response) {
            if (response.code == 100) {
                _this.composersList = response.result;
            }
        }, function (err) { return console.log('http error', err); });
    };
    WorksComponent = __decorate([
        Component({
            selector: 'app-works',
            templateUrl: './works.component.html',
            styleUrls: ['./works.component.scss']
        }),
        __metadata("design:paramtypes", [ApiService,
            ActivatedRoute])
    ], WorksComponent);
    return WorksComponent;
}());
export { WorksComponent };
//# sourceMappingURL=works.component.js.map