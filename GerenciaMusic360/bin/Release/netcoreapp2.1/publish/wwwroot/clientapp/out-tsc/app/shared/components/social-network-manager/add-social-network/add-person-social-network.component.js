var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Optional, Inject, Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@app/core/enums/endpoints";
import { isNullOrUndefined } from "util";
var AddPersonSocialNetworkComponent = /** @class */ (function () {
    function AddPersonSocialNetworkComponent(dialog, service, dialogRef, formBuilder, toasterService, actionData, spinner, translate) {
        this.dialog = dialog;
        this.service = service;
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.spinner = spinner;
        this.translate = translate;
        this.id = 0;
        this.personId = 0;
        this.socialNetworkTypes = [];
        this.role = '';
    }
    AddPersonSocialNetworkComponent.prototype.ngOnInit = function () {
        this.data = this.actionData.data;
        this.personId = this.actionData.personId;
        this.pictureUrl = (this.data == null) ? '' : this.data.pictureUrl;
        this.configureForm();
        this.getSocialNetworkTypes();
    };
    Object.defineProperty(AddPersonSocialNetworkComponent.prototype, "f", {
        get: function () { return this.personsocialNetworkForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddPersonSocialNetworkComponent.prototype.configureForm = function () {
        if (isNullOrUndefined(this.data)) {
            this.personsocialNetworkForm = this.formBuilder.group({
                id: [0],
                personId: [this.personId],
                socialNetworkTypeId: ['', [
                        Validators.required
                    ]],
                link: ['', [
                        Validators.required
                    ]],
                pictureUrl: ['']
            });
            return;
        }
        this.personsocialNetworkForm = this.formBuilder.group({
            id: [this.data.id],
            personId: [this.personId],
            socialNetworkTypeId: [this.data.socialNetworkTypeId, [
                    Validators.required
                ]],
            link: [this.data.link, [
                    Validators.required
                ]],
            pictureUrl: [this.data.pictureUrl]
        });
    };
    AddPersonSocialNetworkComponent.prototype.getSocialNetworkTypes = function () {
        var _this = this;
        this.service.get(EEndpoints.SocialNetworkTypes)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.socialNetworkTypes = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddPersonSocialNetworkComponent.prototype.selectImage = function (image) {
        this.f.pictureUrl.setValue(image);
    };
    AddPersonSocialNetworkComponent.prototype.set = function () {
        if (this.personsocialNetworkForm.valid) {
            this.dialogRef.close(this.personsocialNetworkForm.value);
        }
    };
    AddPersonSocialNetworkComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddPersonSocialNetworkComponent.prototype.responseError = function (err) {
        console.log('http error', err);
    };
    AddPersonSocialNetworkComponent = __decorate([
        Component({
            selector: 'app-add-person-social-network',
            templateUrl: './add-person-social-network.component.html'
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialog,
            ApiService,
            MatDialogRef,
            FormBuilder,
            ToasterService, Object, NgxSpinnerService,
            TranslateService])
    ], AddPersonSocialNetworkComponent);
    return AddPersonSocialNetworkComponent;
}());
export { AddPersonSocialNetworkComponent };
//# sourceMappingURL=add-person-social-network.component.js.map