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
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { EEndpoints } from '@enums/endpoints';
var BackgroundImageComponent = /** @class */ (function () {
    function BackgroundImageComponent(apiService, formBuilder, toaster) {
        this.apiService = apiService;
        this.formBuilder = formBuilder;
        this.toaster = toaster;
        this.isWorking = false;
    }
    BackgroundImageComponent.prototype.ngOnInit = function () {
        this.configureForm();
    };
    Object.defineProperty(BackgroundImageComponent.prototype, "f", {
        get: function () { return this.imageForm.controls; },
        enumerable: false,
        configurable: true
    });
    BackgroundImageComponent.prototype.configureForm = function () {
        this.imageForm = this.formBuilder.group({
            id: [0],
            configurationId: [1],
            pictureUrl: ['', [Validators.required]],
            isDefault: [false],
            name: ['', [Validators.required]]
        });
    };
    BackgroundImageComponent.prototype.selectImage = function ($event) {
        this.f.pictureUrl.patchValue($event);
    };
    BackgroundImageComponent.prototype._responseError = function (error) {
        this.toaster.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    BackgroundImageComponent.prototype.setImage = function () {
        var _this = this;
        this.isWorking = true;
        console.log(this.imageForm.value);
        this.apiService.save(EEndpoints.ConfigurationImage, this.imageForm.value).subscribe(function (response) {
            if (response.code == 100) {
                _this.configureForm();
                _this.toaster.showTranslate('messages.itemSaved');
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    BackgroundImageComponent = __decorate([
        Component({
            selector: 'app-background-image',
            templateUrl: './background-image.component.html',
            styleUrls: ['./background-image.component.scss']
        }),
        __metadata("design:paramtypes", [ApiService,
            FormBuilder,
            ToasterService])
    ], BackgroundImageComponent);
    return BackgroundImageComponent;
}());
export { BackgroundImageComponent };
//# sourceMappingURL=background-image.component.js.map