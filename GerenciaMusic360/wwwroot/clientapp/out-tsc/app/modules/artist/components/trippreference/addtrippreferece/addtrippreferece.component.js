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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var AddtripprefereceComponent = /** @class */ (function () {
    function AddtripprefereceComponent(dialog, dialogRef, formBuilder, apiService, toasterService, actionData, spinner) {
        this.dialog = dialog;
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
    AddtripprefereceComponent.prototype.ngOnInit = function () {
        this.actionBtn = this.actionData.action;
        if (this.actionBtn === 'update') {
            this.getTrippreference(this.actionData.id);
            {
                this.actionLabel = 'Editar';
            }
        }
        this.addTrippreferenceForm = this.formBuilder.group({
            name: ['', [
                    Validators.required
                ]],
            description: ['', []]
        });
    };
    Object.defineProperty(AddtripprefereceComponent.prototype, "f", {
        get: function () { return this.addTrippreferenceForm.controls; },
        enumerable: false,
        configurable: true
    });
    AddtripprefereceComponent.prototype.setTrippreference = function () {
        var _this = this;
        if (!this.addTrippreferenceForm.invalid) {
            this.spinner.show();
            this.apiService.save(EEndpoints.Trippreference, this.addTrippreferenceForm.value).subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick();
                    setTimeout(function () {
                        _this.toasterService.showToaster('Se agregó un nuevo genero musical correctamente.');
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
    AddtripprefereceComponent.prototype.updateTrippreference = function (id) {
        var _this = this;
        if (!this.addTrippreferenceForm.invalid) {
            this.spinner.show();
            this.addTrippreferenceForm.value.id = id;
            this.apiService.update(EEndpoints.Trippreference, this.addTrippreferenceForm.value).subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick();
                    setTimeout(function () {
                        _this.toasterService.showToaster('<div [innerHTML]="theHtmlString">Se editó el genero musical correctamente.</div>');
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
    AddtripprefereceComponent.prototype.getTrippreference = function (id) {
        var _this = this;
        this.apiService.get(EEndpoints.Trippreference, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                Object.keys(_this.addTrippreferenceForm.controls).forEach(function (name) {
                    if (_this.addTrippreferenceForm.controls[name]) {
                        _this.addTrippreferenceForm.controls[name].patchValue(data.result[name]);
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
    AddtripprefereceComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    AddtripprefereceComponent = __decorate([
        Component({
            selector: 'app-addtrippreferece',
            templateUrl: './addtrippreferece.component.html',
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialog,
            MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, NgxSpinnerService])
    ], AddtripprefereceComponent);
    return AddtripprefereceComponent;
}());
export { AddtripprefereceComponent };
//# sourceMappingURL=addtrippreferece.component.js.map