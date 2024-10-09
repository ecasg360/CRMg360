var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var ProjectMembersImageComponent = /** @class */ (function () {
    function ProjectMembersImageComponent(apiService) {
        this.apiService = apiService;
        this.selectedMembersList = [];
    }
    ProjectMembersImageComponent.prototype.ngOnInit = function () {
        this.getMembersProjectApi();
    };
    ProjectMembersImageComponent.prototype._responseError = function (err) {
        console.log(err);
    };
    //#region API
    ProjectMembersImageComponent.prototype.getMembersProjectApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.ProjectMembersByProject, { projectId: this.projectId }).subscribe(function (response) {
            if (response.code == 100)
                _this.selectedMembersList = response.result;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ProjectMembersImageComponent.prototype, "projectId", void 0);
    ProjectMembersImageComponent = __decorate([
        Component({
            selector: 'app-project-members-image',
            templateUrl: './project-members-image.component.html',
            styleUrls: ['./project-members-image.component.scss']
        }),
        __metadata("design:paramtypes", [ApiService])
    ], ProjectMembersImageComponent);
    return ProjectMembersImageComponent;
}());
export { ProjectMembersImageComponent };
//# sourceMappingURL=project-members-image.component.js.map