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
var AddRPersonPreferenceComponent = /** @class */ (function () {
    function AddRPersonPreferenceComponent(dialog, service, dialogRef, formBuilder, toasterService, actionData, spinner, translate) {
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
        this.preferencesTypes = [];
        this.role = '';
    }
    AddRPersonPreferenceComponent.prototype.ngOnInit = function () {
        this.data = this.actionData.data;
        this.personId = this.actionData.personId;
        this.getPreferenceSubTypes();
        this.configureForm();
    };
    Object.defineProperty(AddRPersonPreferenceComponent.prototype, "f", {
        get: function () { return this.addPreferenceSubtypeForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddRPersonPreferenceComponent.prototype.configureForm = function () {
        this.addPreferenceSubtypeForm = this.formBuilder.group({
            subTypeId: ['', [
                    Validators.required
                ]]
        });
    };
    AddRPersonPreferenceComponent.prototype.getPreferenceSubTypes = function () {
        var _this = this;
        var params = [];
        params['typeId'] = this.data.preferenceTypeId;
        this.service.get(EEndpoints.PreferencesByType, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                if (_this.personId) {
                    var p_1 = [];
                    response.result.forEach(function (x) {
                        var i = _this.data.preferences.findIndex(function (s) { return s.preferenceId === x.id; });
                        if (i === -1) {
                            p_1.push(x);
                        }
                    });
                    _this.preferencesTypes = p_1.map(function (s) { return ({
                        value: s.id,
                        viewValue: s.name
                    }); });
                }
                else {
                    _this.preferencesTypes = response.result.map(function (s) { return ({
                        value: s.id,
                        viewValue: s.name
                    }); });
                }
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddRPersonPreferenceComponent.prototype.setPersonPreference = function () {
        var _this = this;
        if (this.addPreferenceSubtypeForm.valid) {
            var form = this.addPreferenceSubtypeForm.value;
            var values_1 = [];
            form.subTypeId.forEach(function (x) {
                var name = _this.preferencesTypes.find(function (v) { return v.value == x; });
                values_1.push({
                    id: 0,
                    preferenceId: x,
                    personId: _this.personId,
                    name: name.viewValue
                });
            });
            this.dialogRef.close(values_1);
        }
    };
    AddRPersonPreferenceComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddRPersonPreferenceComponent.prototype.responseError = function (err) {
        console.log('http error', err);
    };
    AddRPersonPreferenceComponent = __decorate([
        Component({
            selector: 'app-add-person-preference',
            templateUrl: './add-person-preference.component.html'
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialog,
            ApiService,
            MatDialogRef,
            FormBuilder,
            ToasterService, Object, NgxSpinnerService,
            TranslateService])
    ], AddRPersonPreferenceComponent);
    return AddRPersonPreferenceComponent;
}());
export { AddRPersonPreferenceComponent };
//# sourceMappingURL=add-person-preference.component.js.map