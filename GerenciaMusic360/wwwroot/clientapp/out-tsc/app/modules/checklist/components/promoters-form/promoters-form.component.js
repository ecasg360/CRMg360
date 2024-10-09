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
import { Component, Optional, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FuseTranslationLoaderService } from "../../../../../@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from "@services/toaster.service";
var PromotersFormComponent = /** @class */ (function () {
    function PromotersFormComponent(formBuilder, actionData, _fuseTranslationLoaderService, dialogRef, apiService, translate, toaster) {
        var _a;
        this.formBuilder = formBuilder;
        this.actionData = actionData;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.dialogRef = dialogRef;
        this.apiService = apiService;
        this.translate = translate;
        this.toaster = toaster;
        this.isWorking = false;
        this.dateContact = new Date(2120, 0, 1);
        this.contactType = 'llamada';
        this.callChecked = true;
        this.action = '';
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    }
    PromotersFormComponent.prototype.ngOnInit = function () {
        this.model = this.actionData.model ? this.actionData.model : {};
        this.action = this.actionData.action;
        this.buildForm();
        if (this.model && this.model.contactType) {
            if (this.model.contactType === 'llamada') {
                this.callChecked = true;
            }
            else {
                this.callChecked = false;
            }
            this.checklistForm.controls.contactType.setValue(this.model.contactType);
        }
        else {
            this.checklistForm.controls.contactType.setValue('llamada');
        }
    };
    PromotersFormComponent.prototype.buildForm = function () {
        this.checklistForm = this.formBuilder.group({
            id: [
                this.model.id
            ],
            name: [
                this.model.name,
                [
                    Validators.required
                ]
            ],
            lastName: [
                this.model.lastname,
                [
                    Validators.required
                ]
            ],
            phone: [
                this.model.phone,
                [
                    Validators.required
                ]
            ],
            email: [
                this.model.email,
                [
                    Validators.required
                ]
            ],
            terms: [
                this.model.terms,
                [
                    Validators.required
                ]
            ],
            contactType: [
                this.model.contactType
                    ? this.model.contactType
                    : 'llamada',
                [
                    Validators.required
                ]
            ],
            deal: [
                this.model.deal
            ],
            dateContact: [
                this.model.dateContact, [
                    Validators.required,
                    Validators.maxLength(150),
                    Validators.minLength(3),
                ]
            ],
            by: [
                this.model.by,
                [
                    Validators.required
                ]
            ]
        });
    };
    PromotersFormComponent.prototype.save = function () {
        if (!this.checklistForm.invalid) {
            this.model.name = this.f.name.value;
            this.model.lastName = this.f.lastName.value;
            this.model.phone = this.f.phone.value;
            this.model.email = this.f.email.value;
            this.model.terms = this.f.terms.value;
            this.model.contactType = this.f.contactType.value;
            this.model.deal = this.f.deal.value ? 1 : 0;
            this.model.dateContact = this.f.dateContact.value;
            this.model.by = this.f.by.value;
            if (!this.model.id) {
                this.saveApi();
            }
            else {
                this.updateApi();
            }
        }
    };
    PromotersFormComponent.prototype.saveApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.Checklist, this.model).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemSaved'));
                _this.dialogRef.close(response.result);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('messages.savedArtistFailed'));
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    PromotersFormComponent.prototype.updateApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.Checklist, this.model).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemUpdated'));
                _this.dialogRef.close(response.result);
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('messages.savedChecklistFailed'));
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    PromotersFormComponent.prototype.changeFilter = function (option) {
        var id = option.id;
        this.checklistForm.controls.contactType.setValue(id);
    };
    PromotersFormComponent.prototype.dateChangeEvent = function (event) {
        this.f.dateContact.patchValue(event.value);
    };
    PromotersFormComponent.prototype.responseError = function (err) {
        this.isWorking = false;
    };
    Object.defineProperty(PromotersFormComponent.prototype, "f", {
        get: function () { return this.checklistForm.controls; },
        enumerable: false,
        configurable: true
    });
    PromotersFormComponent = __decorate([
        Component({
            selector: 'app-promoters-form',
            templateUrl: './promoters-form.component.html',
            styleUrls: ['./promoters-form.component.scss']
        }),
        __param(1, Optional()),
        __param(1, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder, Object, FuseTranslationLoaderService,
            MatDialogRef,
            ApiService,
            TranslateService,
            ToasterService])
    ], PromotersFormComponent);
    return PromotersFormComponent;
}());
export { PromotersFormComponent };
//# sourceMappingURL=promoters-form.component.js.map