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
import { Component, Optional, Inject } from "@angular/core";
import { ApiService } from "@services/api.service";
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { EEndpoints } from "@app/core/enums/endpoints";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
var AddMarkerComponent = /** @class */ (function () {
    function AddMarkerComponent(dialogRef, formBuilder, ApiService, toasterService, actionData, translate, _fuseTranslationLoaderService) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.id = 0;
        this.isWorking = true;
        this.templateContractDocumentId = 0;
    }
    AddMarkerComponent.prototype.ngOnInit = function () {
        this.titleAction = this.translate.instant('settings.addmarker.title');
        this.id = this.actionData.id;
        this.templateContractDocumentId = this.actionData.templateContractDocumentId;
        this.configureForm();
        if (this.id == 0) {
            this.isWorking = false;
            this.titleAction = this.translate.instant('settings.addmarker.saveTitle');
            this.action = this.translate.instant('general.save');
        }
        else {
            this.titleAction = this.translate.instant('settings.addmarker.editTitle');
            this.action = this.translate.instant('general.save');
            //this.getContractType();
        }
    };
    Object.defineProperty(AddMarkerComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddMarkerComponent.prototype.configureForm = function () {
        this.form = this.formBuilder.group({
            templateContractDocumentId: [this.templateContractDocumentId, [
                    Validators.required
                ]],
            marker: ['', [Validators.required]]
        });
    };
    AddMarkerComponent.prototype.set = function () {
        if (this.form.valid) {
            this.isWorking = true;
            if (this.id == 0) {
                this.save();
            }
            else {
                this.update();
            }
        }
    };
    AddMarkerComponent.prototype.save = function () {
        var _this = this;
        this.ApiService.save(EEndpoints.ContractType, this.form.value)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('settings.addmarker.messages.saved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddMarkerComponent.prototype.update = function () {
        var _this = this;
        this.form.value.id = this.id;
        this.ApiService.update(EEndpoints.ContractType, this.form.value)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.onNoClick(true);
                _this.toasterService.showToaster(_this.translate.instant('settings.contractType.messages.saved'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddMarkerComponent.prototype.populateForm = function (data) {
        var _this = this;
        Object.keys(this.form.controls).forEach(function (name) {
            if (_this.form.controls[name]) {
                _this.form.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
    };
    AddMarkerComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddMarkerComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    AddMarkerComponent = __decorate([
        Component({
            selector: 'app-add-marker',
            templateUrl: './add-marker.component.html',
            styleUrls: ['./add-marker.component.scss']
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddMarkerComponent);
    return AddMarkerComponent;
}());
export { AddMarkerComponent };
//# sourceMappingURL=add-marker.component.js.map