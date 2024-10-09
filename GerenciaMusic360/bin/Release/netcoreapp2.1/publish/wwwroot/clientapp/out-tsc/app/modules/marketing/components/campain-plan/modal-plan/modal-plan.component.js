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
import { Component, Optional, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatAutocomplete } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { EEndpoints } from '@enums/endpoints';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { startWith, map } from 'rxjs/operators';
var ModalPlanComponent = /** @class */ (function () {
    function ModalPlanComponent(fb, dialogRef, translationLoaderService, data, translate, dialog, apiService, toaster) {
        this.fb = fb;
        this.dialogRef = dialogRef;
        this.translationLoaderService = translationLoaderService;
        this.data = data;
        this.translate = translate;
        this.dialog = dialog;
        this.apiService = apiService;
        this.toaster = toaster;
        this.model = {};
        this.isWorking = false;
        this.initDate = new Date(2000, 0, 1);
        this.endDate = new Date(2120, 0, 1);
        //chip autocomplete
        this.visible = true;
        this.selectable = true;
        this.removable = true;
        this.addOnBlur = true;
        this.userCtrl = new FormControl();
        this.separatorKeysCodes = [ENTER, COMMA];
        this.userList = [];
        this.selectableUserList = [];
        this.selectedUsersList = [];
    }
    ModalPlanComponent.prototype.ngOnInit = function () {
        var _a;
        var _this = this;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.model = this.data.model;
        this.initDate = (this.initDate) ? new Date(this.data.minDate) : this.initDate;
        this.endDate = (this.data.maxDate) ? new Date(this.data.maxDate) : this.endDate;
        this.action = this.data.action;
        this._getUsersApi();
        this.filteredUsers = this.userCtrl.valueChanges.pipe(startWith(null), map(function (member) { return member ? _this._filter(member) : _this.selectableUserList.slice(); }));
        this.initForm();
    };
    ModalPlanComponent.prototype.initForm = function () {
        var date = (this.model.estimatedDateVerificationString) ?
            (new Date(this.model.estimatedDateVerificationString)).toISOString() : null;
        this.campainPlanForm = this.fb.group({
            id: [this.model.id, []],
            marketingId: [this.model.marketingId, []],
            position: [this.model.position, []],
            name: [this.model.name, [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(255)
                ]],
            notes: [this.model.notes, [
                    Validators.minLength(3),
                    Validators.maxLength(255)
                ]],
            required: [this.model.required, [Validators.required]],
            estimatedDateVerificationString: [date, [Validators.required]],
            taskDocumentDetailId: [this.model.taskDocumentDetailId, []],
            selectedUsers: [null, [Validators.required]],
        });
    };
    Object.defineProperty(ModalPlanComponent.prototype, "f", {
        get: function () { return this.campainPlanForm.controls; },
        enumerable: false,
        configurable: true
    });
    ModalPlanComponent.prototype.remove = function (userId) {
        var index = this.selectedUsersList.findIndex(function (fi) { return fi.id == userId; });
        if (index >= 0)
            this.selectedUsersList.splice(index, 1);
        if (this.selectedUsersList.length == 0) {
            this.f['selectedUsers'].patchValue(null);
            this.campainPlanForm.markAsDirty();
        }
        var found = this.userList.find(function (f) { return f.id == userId; });
        if (found)
            this.selectableUserList.push(found);
    };
    ModalPlanComponent.prototype.selected = function (event) {
        var userId = parseInt(event.option.id);
        var found = this.selectableUserList.find(function (f) { return f.id == userId; });
        if (found) {
            this.selectedUsersList.push(found);
            this.f['selectedUsers'].patchValue(this.selectedUsersList);
            this.selectableUserList = this.selectableUserList.filter(function (f) { return f.id !== found.id; });
            this.selectableUserList.slice();
        }
        this.userCtrl.patchValue('');
        this.usersInput.nativeElement.value = '';
    };
    ModalPlanComponent.prototype.setTaskData = function () {
        this.isWorking = true;
        this.model = this.campainPlanForm.value;
        if (!this.model.notes)
            this.model.notes = '';
        this.confirmSave(this.model);
    };
    ModalPlanComponent.prototype.onNoClick = function (task) {
        if (task === void 0) { task = undefined; }
        this.dialogRef.close(task);
    };
    ModalPlanComponent.prototype.confirmSave = function (task) {
        var _this = this;
        this.isWorking = true;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '500px',
            data: {
                text: this.translate.instant('messages.saveQuestion', { field: task.name }),
                action: this.translate.instant('general.save'),
                icon: 'save'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.onNoClick(task);
            }
            else
                _this.isWorking = false;
        });
    };
    ModalPlanComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        return this.selectableUserList.filter(function (user) { return user.fullName.toLowerCase().indexOf(filterValue) === 0; });
    };
    ModalPlanComponent.prototype._responseError = function (err) {
        console.log(err);
        this.isWorking = false;
    };
    //#region API
    ModalPlanComponent.prototype._getUsersApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Users).subscribe(function (response) {
            if (response.code == 100) {
                var users = response.result.map(function (m) {
                    var user = m;
                    user.fullName = m.name + " " + m.lastName;
                    return user;
                });
                _this.userList = users;
                _this.selectableUserList = users;
                _this._getMarketingPlanUsers(_this.model.id);
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.requestError'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ModalPlanComponent.prototype._getMarketingPlanUsers = function (marketingPlanId) {
        var _this = this;
        this.apiService.get(EEndpoints.MarketingPlanAutorizes, { marketingPlanId: marketingPlanId }).subscribe(function (response) {
            if (response.code == 100 && response.result.length > 0) {
                var users_1 = response.result;
                _this.selectableUserList = [];
                _this.selectedUsersList = [];
                _this.userList.forEach(function (value, index) {
                    var found = users_1.find(function (f) { return f.userVerificationId == value.id; });
                    if (found)
                        _this.selectedUsersList.push(value);
                    else
                        _this.selectableUserList.push(value);
                });
                _this.f['selectedUsers'].patchValue(_this.selectedUsersList);
                _this.selectableUserList.slice();
            }
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild('usersInput', { static: false }),
        __metadata("design:type", ElementRef)
    ], ModalPlanComponent.prototype, "usersInput", void 0);
    __decorate([
        ViewChild('auto', { static: false }),
        __metadata("design:type", MatAutocomplete)
    ], ModalPlanComponent.prototype, "matAutocomplete", void 0);
    ModalPlanComponent = __decorate([
        Component({
            selector: 'app-modal-plan',
            templateUrl: './modal-plan.component.html',
            styleUrls: ['./modal-plan.component.scss']
        }),
        __param(3, Optional()),
        __param(3, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [FormBuilder,
            MatDialogRef,
            FuseTranslationLoaderService, Object, TranslateService,
            MatDialog,
            ApiService,
            ToasterService])
    ], ModalPlanComponent);
    return ModalPlanComponent;
}());
export { ModalPlanComponent };
//# sourceMappingURL=modal-plan.component.js.map