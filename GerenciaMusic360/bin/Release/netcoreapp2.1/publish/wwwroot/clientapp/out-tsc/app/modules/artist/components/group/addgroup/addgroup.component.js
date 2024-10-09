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
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var AddGroupComponent = /** @class */ (function () {
    function AddGroupComponent(dialogRef, formBuilder, apiService, toasterService, actionData, spinner) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.spinner = spinner;
        this.id = 0;
        this.actionBtn = 'create';
        this.actionLabel = 'Agregar';
    }
    AddGroupComponent.prototype.ngOnInit = function () {
        this.actionBtn = this.actionData.action;
        if (this.actionBtn === 'update') {
            this.getGroup(this.actionData.id);
            {
                this.actionLabel = 'Editar';
            }
        }
        this.addGroupForm = this.formBuilder.group({
            name: ['', [
                    Validators.required
                ]],
            biography: ['', []],
            description: ['', []]
        });
    };
    Object.defineProperty(AddGroupComponent.prototype, "f", {
        get: function () { return this.addGroupForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddGroupComponent.prototype.setGroup = function () {
        var _this = this;
        if (!this.addGroupForm.invalid) {
            this.spinner.show();
            this.apiService.save(EEndpoints.group, this.addGroupForm.value)
                .subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick();
                    setTimeout(function () {
                        _this.toasterService.showToaster('Se agreg� un nuevo genero musical correctamente.');
                    }, 300);
                }
                else {
                    _this.spinner.hide();
                    setTimeout(function () {
                        _this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, function (err) { return console.error('Failed! ' + err); });
        }
    };
    AddGroupComponent.prototype.updateGroup = function (id) {
        var _this = this;
        if (!this.addGroupForm.invalid) {
            this.spinner.show();
            this.addGroupForm.value.id = id;
            this.apiService.update(EEndpoints.group, this.addGroupForm.value)
                .subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick();
                    setTimeout(function () {
                        _this.toasterService.showToaster('Se edit� el genero musical correctamente.');
                    }, 300);
                }
                else {
                    _this.spinner.hide();
                    setTimeout(function () {
                        _this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, function (err) { return console.error('Failed! ' + err); });
        }
    };
    AddGroupComponent.prototype.getGroup = function (id) {
        var _this = this;
        this.apiService.get(EEndpoints.group, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                Object.keys(_this.addGroupForm.controls).forEach(function (name) {
                    if (_this.addGroupForm.controls[name]) {
                        _this.addGroupForm.controls[name].patchValue(data.result[name]);
                    }
                });
                _this.id = data.result.id;
            }
            else {
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddGroupComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    AddGroupComponent = __decorate([
        Component({
            selector: 'app-addgroup',
            templateUrl: './addgroup.component.html',
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, NgxSpinnerService])
    ], AddGroupComponent);
    return AddGroupComponent;
}());
export { AddGroupComponent };
//# sourceMappingURL=addgroup.component.js.map