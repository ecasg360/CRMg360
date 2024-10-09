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
import { AccountService } from 'ClientApp/app/core/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { MatDialog } from '@angular/material';
import { MetasReplyComponent } from '../metas-reply/metas-reply.component';
var MetasAddComponent = /** @class */ (function () {
    function MetasAddComponent(accountService, spinner, toasterService, formBuilder, dialogRef, apiService, translate, actionData, dialog) {
        this.accountService = accountService;
        this.spinner = spinner;
        this.toasterService = toasterService;
        this.formBuilder = formBuilder;
        this.dialogRef = dialogRef;
        this.apiService = apiService;
        this.translate = translate;
        this.actionData = actionData;
        this.dialog = dialog;
        this.users = [];
        this.metas = [];
        this.isWorking = false;
        this.theDate = new Date();
        this.metasAdded = [];
        this.descriptionEdit = '';
        this.isMeasurable = false;
        this.isMeasurableEdit = false;
    }
    MetasAddComponent.prototype.ngOnInit = function () {
        this.isEmojiPickerVisible = false;
        this.theDate = this.actionData.theDate ? this.actionData.theDate : new Date();
        this.model = this.actionData.model ? this.actionData.model : {};
        this.getUsers();
        this.configureForm();
    };
    MetasAddComponent.prototype.configureForm = function () {
        this.metasForm = this.formBuilder.group({
            userId: [null, Validators.required],
            meta: [''],
            theDate: [this.theDate, Validators.required],
            isMeasurable: ['', Validators.required]
        });
    };
    MetasAddComponent.prototype.getUsers = function () {
        var _this = this;
        this.spinner.show();
        this.accountService.getUsers().subscribe(function (data) {
            if (data.code == 100) {
                console.log(data);
                data.result.forEach(function (f) {
                    f.isActive = f.status === 1 ? true : false;
                });
                _this.users = data.result;
                _this.users.forEach(function (user) {
                    if (user.id == parseInt(_this.model.userId)) {
                        _this.metasForm.controls.userId.setValue(user.id);
                        _this.getMetas();
                    }
                });
                _this.spinner.hide();
            }
            else {
                _this.spinner.hide();
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    MetasAddComponent.prototype.getMetas = function () {
        var _this = this;
        var params = {
            userId: this.model.userId,
            InitialDate: this.formatDate(this.theDate)
        };
        this.apiService.get(EEndpoints.MetasByUserAndDate, params).subscribe(function (result) {
            //this.metasAdded = result.result;
            result.result.forEach(function (element) {
                element.editing = false;
            });
            _this.metasAdded = result.result;
        });
    };
    MetasAddComponent.prototype.setMeta = function () {
        var meta = this.metasForm.controls.meta.value;
        if (meta != '') {
            this.metas.push({
                description: this.metasForm.controls.meta.value,
                isMeasurable: this.isMeasurable
            });
            this.metasForm.controls.meta.setValue('');
            this.isMeasurable = false;
        }
    };
    MetasAddComponent.prototype.saveMetas = function () {
        var _this = this;
        this.metas.forEach(function (element) {
            var params = {
                userId: _this.metasForm.controls.userId.value,
                GoalDescription: element.description,
                InitialDate: _this.metasForm.controls.theDate.value,
                isMeasurable: element.isMeasurable ? 1 : 0
            };
            _this.apiService.save(EEndpoints.Metas, params).subscribe(function (response) {
                if (response.code == 100) {
                    _this.toasterService.showToaster(_this.translate.instant('messages.itemSaved'));
                }
                else {
                    _this.toasterService.showToaster(_this.translate.instant('messages.savedArtistFailed'));
                }
            }, function (err) { return _this.responseError(err); });
        });
        this.dialogRef.close({ msg: 'success' });
    };
    MetasAddComponent.prototype.responseError = function (err) {
        console.log('http error', err);
        this.isWorking = false;
    };
    MetasAddComponent.prototype.formatDate = function (theDate) {
        theDate = theDate.getFullYear() + '-' + (theDate.getMonth() + 1) + '-' + theDate.getDate();
        return theDate;
    };
    MetasAddComponent.prototype.editMetaAdded = function (meta) {
        console.log('meta editMetaAdded: ', meta);
        meta.editing = true;
        this.descriptionEdit = meta.goalDescription;
        this.isMeasurableEdit = meta.isMeasurable;
        this.metaToEdit = meta;
    };
    MetasAddComponent.prototype.deleteMetaAdded = function (meta) {
        this.confirmDelete(meta.id, meta.goalDescription);
    };
    MetasAddComponent.prototype.editMeta = function (meta) {
        console.log('meta editMeta: ', meta);
        meta.editing = true;
        this.descriptionEdit = meta.description;
        this.isMeasurableEdit = meta.isMeasurable;
        this.metaToEdit = meta;
    };
    MetasAddComponent.prototype.deleteMeta = function (meta) {
        this.confirmDelete(0, meta);
    };
    MetasAddComponent.prototype.confirmDelete = function (id, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1) {
                    if (id == 0) {
                        _this.metas.forEach(function (meta, index) {
                            if (meta == name) {
                                _this.metas.splice(index, 1);
                            }
                        });
                    }
                    else {
                        _this.apiService.delete(EEndpoints.Metas, { id: id })
                            .subscribe(function (data) {
                            if (data.code == 100) {
                                _this.getMetas();
                                _this.toasterService.showTranslate('messages.itemDeleted');
                            }
                            else {
                                _this.toasterService.showTranslate('errors.errorDeletingItem');
                            }
                        }, function (err) { return _this.responseError(err); });
                    }
                }
            }
        });
    };
    MetasAddComponent.prototype.saveMeta = function (meta) {
        console.log('meta saveMeta: ', meta);
        meta.description = this.descriptionEdit;
        meta.isMeasurable = this.isMeasurableEdit;
        meta.editing = false;
    };
    MetasAddComponent.prototype.saveMetaAdded = function () {
        var _this = this;
        this.metaToEdit.goalDescription = this.descriptionEdit;
        this.metaToEdit.isMeasurable = this.isMeasurableEdit ? 1 : 0;
        this.apiService.update(EEndpoints.Metas, this.metaToEdit)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getMetas();
                _this.toasterService.showTranslate('messages.itemSaved');
            }
            else {
                _this.toasterService.showTranslate('errors.errorSavingItem');
            }
        }, function (err) { return _this.responseError(err); });
    };
    MetasAddComponent.prototype.reply = function (row) {
        var dialogRef = this.dialog.open(MetasReplyComponent, {
            width: '700px',
            data: {
                model: row
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                //this.metas = [];
                //          this.getRecords();
            }
        });
    };
    MetasAddComponent.prototype.addEmoji = function (event) {
        //this.textArea = `${this.textArea}${event.emoji.native}`;
        console.log('event.emoji.native: ', event.emoji.native);
        this.metasForm.controls.meta.setValue("" + this.metasForm.controls.meta.value + event.emoji.native);
        //this.isEmojiPickerVisible = false;
    };
    MetasAddComponent.prototype.closeEmojis = function () {
        this.isEmojiPickerVisible = false;
    };
    MetasAddComponent.prototype.updateIsMeasurable = function () {
        console.log('Entró al updateIsMeasurable: ', this.isMeasurable);
        this.isMeasurable = !this.isMeasurable;
        this.metasForm.controls.isMeasurable.setValue(this.isMeasurable);
        console.log('this.metasForm.controls.isMeasurable.value: ', this.metasForm.controls.isMeasurable.value);
    };
    MetasAddComponent.prototype.updateIsMeasurableEdit = function (isMeasurable) {
        console.log('Entró al updateIsMeasurable: ', this.isMeasurable);
        this.isMeasurableEdit = !isMeasurable;
    };
    Object.defineProperty(MetasAddComponent.prototype, "f", {
        get: function () { return this.metasForm.controls; },
        enumerable: false,
        configurable: true
    });
    MetasAddComponent = __decorate([
        Component({
            selector: 'app-metas-add',
            templateUrl: './metas-add.component.html',
            styleUrls: ['./metas-add.component.css']
        }),
        __param(7, Optional()),
        __param(7, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [AccountService,
            NgxSpinnerService,
            ToasterService,
            FormBuilder,
            MatDialogRef,
            ApiService,
            TranslateService, Object, MatDialog])
    ], MetasAddComponent);
    return MetasAddComponent;
}());
export { MetasAddComponent };
//# sourceMappingURL=metas-add.component.js.map