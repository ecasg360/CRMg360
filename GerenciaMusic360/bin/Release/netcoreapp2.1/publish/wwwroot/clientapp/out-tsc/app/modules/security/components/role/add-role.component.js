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
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var AddRoleComponent = /** @class */ (function () {
    function AddRoleComponent(dialogRef, formBuilder, apiService, toasterService, actionData) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.id = 0;
        this.actionBtn = 'create';
        this.actionLabel = 'Agregar';
    }
    AddRoleComponent.prototype.ngOnInit = function () {
        this.actionBtn = this.actionData.action;
        if (this.actionBtn === 'update') {
            this.getRole(this.actionData.id);
            {
                this.actionLabel = 'Editar';
            }
        }
        this.addRoleForm = this.formBuilder.group({
            name: ['', [
                    Validators.required
                ]],
            description: ['', []]
        });
    };
    Object.defineProperty(AddRoleComponent.prototype, "f", {
        get: function () { return this.addRoleForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddRoleComponent.prototype.setRole = function () {
        var _this = this;
        if (!this.addRoleForm.invalid) {
            this.apiService.save(EEndpoints.Role, this.addRoleForm.value).subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick(true);
                    setTimeout(function () {
                        _this.toasterService.showToaster('Se agregó el rol correctamente.');
                    }, 300);
                }
                else {
                    setTimeout(function () {
                        _this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, function (err) { return console.error('Failed! ' + err); });
        }
    };
    AddRoleComponent.prototype.updateRole = function (id) {
        var _this = this;
        if (!this.addRoleForm.invalid) {
            this.addRoleForm.value.id = id;
            this.apiService.update(EEndpoints.Role, this.addRoleForm.value).subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick(true);
                    setTimeout(function () {
                        _this.toasterService.showToaster('Se editó el rol correctamente.');
                    }, 300);
                }
                else {
                    setTimeout(function () {
                        _this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, function (err) { return console.error('Failed! ' + err); });
        }
    };
    AddRoleComponent.prototype.getRole = function (id) {
        var _this = this;
        this.apiService.get(EEndpoints.Role, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                Object.keys(_this.addRoleForm.controls).forEach(function (name) {
                    if (_this.addRoleForm.controls[name]) {
                        _this.addRoleForm.controls[name].patchValue(data.result[name]);
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
    AddRoleComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddRoleComponent = __decorate([
        Component({
            selector: 'app-add-role',
            templateUrl: './add-role.component.html'
        }),
        __param(4, Optional()),
        __param(4, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object])
    ], AddRoleComponent);
    return AddRoleComponent;
}());
export { AddRoleComponent };
//# sourceMappingURL=add-role.component.js.map