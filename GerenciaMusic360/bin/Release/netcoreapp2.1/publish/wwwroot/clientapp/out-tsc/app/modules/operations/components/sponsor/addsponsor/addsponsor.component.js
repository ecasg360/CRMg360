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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, Validators } from "@angular/forms";
import { ToasterService } from "@services/toaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CutImageComponent } from "@shared/components/cut-image/cut-image.component";
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@enums/endpoints';
var AddsponsorComponent = /** @class */ (function () {
    function AddsponsorComponent(dialog, dialogRef, formBuilder, apiService, toasterService, actionData, spinner) {
        this.dialog = dialog;
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this.spinner = spinner;
        this.croppedImage = "";
        this.id = 0;
        this.actionBtn = "create";
        this.actionLabel = "Add";
        this.contactssponsors = [];
        this.addviewcontactssponsors = true;
    }
    AddsponsorComponent.prototype.ngOnInit = function () {
        this.actionBtn = this.actionData.action;
        if (this.actionBtn === "update") {
            this.getSponsor(this.actionData.id);
            {
                this.actionLabel = "Editar";
            }
        }
        this.addSponsorForm = this.formBuilder.group({
            name: ["", [Validators.required]],
            description: ["", []],
            webSite: ["", []],
            officePhone: ["", []],
            idContactsSponsor: ["", [Validators.required]]
        });
        this.getContacsSponsors();
    };
    Object.defineProperty(AddsponsorComponent.prototype, "f", {
        get: function () {
            return this.addSponsorForm.controls;
        },
        enumerable: false,
        configurable: true
    });
    AddsponsorComponent.prototype.setSponsor = function () {
        var _this = this;
        if (!this.addSponsorForm.invalid) {
            this.spinner.show();
            this.addSponsorForm.value.pictureUrl = this.croppedImage;
            this.apiService.save(EEndpoints.sponsor, this.addSponsorForm.value).subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick();
                    setTimeout(function () {
                        _this.toasterService.showToaster("Se agreg� un nuevo genero musical correctamente.");
                    }, 300);
                }
                else {
                    _this.spinner.hide();
                    setTimeout(function () {
                        _this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, function (err) { return console.error("Failed! " + err); });
        }
    };
    AddsponsorComponent.prototype.updateSponsor = function (id) {
        var _this = this;
        if (!this.addSponsorForm.invalid) {
            this.spinner.show();
            this.addSponsorForm.value.id = id;
            this.apiService.update(EEndpoints.sponsor, this.addSponsorForm.value).subscribe(function (data) {
                if (data.code == 100) {
                    _this.onNoClick();
                    setTimeout(function () {
                        _this.toasterService.showToaster("Se edit� el genero musical correctamente.");
                    }, 300);
                }
                else {
                    _this.spinner.hide();
                    setTimeout(function () {
                        _this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, function (err) { return console.error("Failed! " + err); });
        }
    };
    AddsponsorComponent.prototype.getSponsor = function (id) {
        var _this = this;
        this.apiService.get(EEndpoints.sponsor, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                Object.keys(_this.addSponsorForm.controls).forEach(function (name) {
                    if (_this.addSponsorForm.controls[name]) {
                        _this.addSponsorForm.controls[name].patchValue(data.result[name]);
                    }
                });
                _this.id = data.result.id;
            }
            else {
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error("Failed! " + err); });
    };
    AddsponsorComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    AddsponsorComponent.prototype.fileChangeEvent = function (event) {
        this.openCutDialog(event);
    };
    AddsponsorComponent.prototype.openCutDialog = function (event) {
        var _this = this;
        this.cropImage = { event: event, numberImage: 0, imageSRC: "" };
        var dialogRef = this.dialog.open(CutImageComponent, {
            width: "500px",
            data: this.cropImage
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.croppedImage = result.imageSRC;
        });
    };
    AddsponsorComponent.prototype.removeImage = function () {
        this.croppedImage = "";
    };
    AddsponsorComponent.prototype.getContacsSponsors = function () {
        var _this = this;
        this.apiService.get(EEndpoints.contactssponsors).subscribe(function (data) {
            if (data.code == 100) {
                _this.contactssponsors = data.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return console.error("Failed! " + err); });
    };
    AddsponsorComponent.prototype.addContactssponsor = function () {
        this.addviewcontactssponsors = !this.addviewcontactssponsors;
    };
    AddsponsorComponent.prototype.cancel = function () {
        if (this.addviewcontactssponsors) {
            this.addviewcontactssponsors = !this.addviewcontactssponsors;
        }
        else {
            this.onNoClick();
        }
    };
    AddsponsorComponent = __decorate([
        Component({
            selector: "app-addsponsor",
            templateUrl: "./addsponsor.component.html"
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialog,
            MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, NgxSpinnerService])
    ], AddsponsorComponent);
    return AddsponsorComponent;
}());
export { AddsponsorComponent };
//# sourceMappingURL=addsponsor.component.js.map