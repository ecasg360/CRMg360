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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@enums/endpoints';
var AddPermissionComponent = /** @class */ (function () {
    function AddPermissionComponent(dialogRef, formBuilder, apiService, actionData, translate, _fuseTranslationLoaderService) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.actionData = actionData;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
    }
    AddPermissionComponent.prototype.ngOnInit = function () {
        this._permission = this.actionData;
        this.configureForm();
    };
    AddPermissionComponent.prototype.configureForm = function () {
        this.form = this.formBuilder.group({
            id: ['', []],
            controllerName: ['', []],
            actionName: ['', []],
            name: [this._permission.name, []],
            description: [this._permission.description, []],
        });
    };
    Object.defineProperty(AddPermissionComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddPermissionComponent.prototype.set = function () {
        this._permission['name'] = this.form.value.name;
        this.form.controls['controllerName'].patchValue(this._permission.controllerName);
        this.form.controls["actionName"].patchValue(this._permission.actionName);
        this.form.controls["id"].patchValue(this._permission.id);
        if (!this.form.invalid) {
            this.save(this.form.value);
        }
    };
    AddPermissionComponent.prototype.save = function (permission) {
        var _this = this;
        this.apiService.update(EEndpoints.Permission, permission).subscribe(function (response) {
            if (response.code = "100") {
                _this.dialogRef.close(status);
            }
        }, function (erro) {
            console.log(erro);
        });
    };
    AddPermissionComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddPermissionComponent = __decorate([
        Component({
            selector: 'app-add-permission',
            templateUrl: './add-permission.component.html',
            styleUrls: ['./add-permission.component.css']
        }),
        __param(3, Optional()),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService, Object, TranslateService,
            FuseTranslationLoaderService])
    ], AddPermissionComponent);
    return AddPermissionComponent;
}());
export { AddPermissionComponent };
//# sourceMappingURL=add-permission.component.js.map