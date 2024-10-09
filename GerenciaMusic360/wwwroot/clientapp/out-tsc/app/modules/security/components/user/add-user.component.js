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
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { AccountService } from '@services/account.service';
import { CutImageComponent } from '@shared/components/cut-image/cut-image.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var AddUserComponent = /** @class */ (function () {
    function AddUserComponent(dialog, dialogRef, formBuilder, accountService, apiService, toasterService, actionData) {
        this.dialog = dialog;
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.accountService = accountService;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.id = 0;
        this.actionBtn = 'create';
        this.actionLabel = 'Agregar';
        this.croppedImage = '';
        this.birthdate = '';
        this.roles = [];
        this.departments = [];
        this.fieldMaxLength = 50;
        this.fieldMinLength = 6;
        this.isWorking = false;
        this.genders = [
            { value: 'F', viewValue: 'Femenino' },
            { value: 'M', viewValue: 'Masculino' }
        ];
    }
    AddUserComponent.prototype.openCutDialog = function (event) {
        var _this = this;
        this.cropImage = { event: event, numberImage: 0, imageSRC: '' };
        var dialogRef = this.dialog.open(CutImageComponent, {
            width: '500px',
            data: this.cropImage
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.croppedImage = result.imageSRC;
        });
    };
    AddUserComponent.prototype.ngOnInit = function () {
        this.actionBtn = this.actionData.action;
        if (this.actionBtn === 'update') {
            this.actionLabel = 'Editar';
            this.addUserForm = this.formBuilder.group({
                name: ['', [
                        Validators.required
                    ]],
                lastName: ['', [
                        Validators.required
                    ]],
                secondLastName: ['', []],
                phoneOne: ['', []],
                birthdate: ['', [
                        Validators.required
                    ]],
                roleId: ['', [
                        Validators.required
                    ]],
                departmentId: ['', [
                        Validators.required
                    ]],
                gender: ['', [
                        Validators.required
                    ]],
                email: ['', [
                        Validators.required,
                        Validators.email
                    ]]
            });
            this.getRoles();
            this.getDepartments();
            this.getUser(this.actionData.id);
        }
        else
            this.addUserForm = this.formBuilder.group({
                name: ['', [
                        Validators.required
                    ]],
                lastName: ['', [
                        Validators.required
                    ]],
                secondLastName: ['', []],
                phoneOne: ['', []],
                birthdate: ['', [
                        Validators.required
                    ]],
                roleId: ['', [
                        Validators.required
                    ]],
                departmentId: ['', [
                        Validators.required
                    ]],
                gender: ['', [
                        Validators.required
                    ]],
                email: ['', [
                        Validators.required,
                        Validators.email
                    ]],
                password: ['', [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(50)
                    ]],
                confirmPassword: ['', []],
            }, { validator: this.checkPasswords });
        this.getRoles();
        this.getDepartments();
    };
    Object.defineProperty(AddUserComponent.prototype, "f", {
        get: function () { return this.addUserForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddUserComponent.prototype.removeImage = function () {
        this.croppedImage = '';
    };
    AddUserComponent.prototype.fileChangeEvent = function (event) {
        this.openCutDialog(event);
    };
    AddUserComponent.prototype.checkPasswords = function (group) {
        var pass = group.controls.password.value;
        var confirmPass = group.controls.confirmPassword.value;
        return pass === confirmPass ? null : { notSame: true };
    };
    AddUserComponent.prototype.setUser = function () {
        var _this = this;
        if (!this.addUserForm.invalid) {
            this.addUserForm.value.pictureUrl = this.croppedImage;
            this.accountService.setUser(this.addUserForm.value)
                .subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick(true);
                    setTimeout(function () {
                        _this.toasterService.showToaster('Se agregó el usuario correctamente.');
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
    AddUserComponent.prototype.updateUser = function (id) {
        var _this = this;
        if (!this.addUserForm.invalid) {
            this.addUserForm.value.id = id;
            this.addUserForm.value.pictureUrl = this.croppedImage;
            this.accountService.updateUser(this.addUserForm.value)
                .subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick(true);
                    setTimeout(function () {
                        _this.toasterService.showToaster('Se editó el usuario correctamente.');
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
    AddUserComponent.prototype.getUser = function (id) {
        var _this = this;
        this.accountService.getUser(id).subscribe(function (data) {
            if (data.code == 100) {
                Object.keys(_this.addUserForm.controls).forEach(function (name) {
                    if (_this.addUserForm.controls[name]) {
                        if (name === 'birthdate')
                            _this.addUserForm.controls[name].patchValue(new Date(data.result.birthdate));
                        else
                            _this.addUserForm.controls[name].patchValue(data.result[name]);
                    }
                });
                _this.id = data.result.id;
                _this.croppedImage = data.result.pictureUrl !== null ? '' + data.result.pictureUrl : '';
            }
            else {
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddUserComponent.prototype.getRoles = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Roles)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.roles = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddUserComponent.prototype.getDepartments = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Departments)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.departments = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    AddUserComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddUserComponent = __decorate([
        Component({
            selector: 'app-add-user',
            templateUrl: './add-user.component.html'
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialog,
            MatDialogRef,
            FormBuilder,
            AccountService,
            ApiService,
            ToasterService, Object])
    ], AddUserComponent);
    return AddUserComponent;
}());
export { AddUserComponent };
//# sourceMappingURL=add-user.component.js.map