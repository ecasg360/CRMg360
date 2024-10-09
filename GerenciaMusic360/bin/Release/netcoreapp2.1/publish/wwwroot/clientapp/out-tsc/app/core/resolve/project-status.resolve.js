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
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@app/core/enums/endpoints';
var ProjectStatusResolve = /** @class */ (function () {
    function ProjectStatusResolve(apiService) {
        this.apiService = apiService;
    }
    ProjectStatusResolve.prototype.resolve = function (route, state) {
        return this.apiService.get(EEndpoints.StatusProjects);
    };
    ProjectStatusResolve = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [ApiService])
    ], ProjectStatusResolve);
    return ProjectStatusResolve;
}());
export { ProjectStatusResolve };
//# sourceMappingURL=project-status.resolve.js.map