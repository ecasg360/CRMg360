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
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from "@environments/environment";
import { AccountService } from 'ClientApp/app/core/services/account.service';
var MetasReplyComponent = /** @class */ (function () {
    function MetasReplyComponent(actionData, formBuilder, apiService, toasterService, translate, dialogRef, accountService) {
        this.actionData = actionData;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.accountService = accountService;
        this.metaDescription = '';
        this.replies = [];
    }
    MetasReplyComponent.prototype.ngOnInit = function () {
        this.model = this.actionData.model ? this.actionData.model : {};
        console.log('this.model: ', this.model);
        this.metaDescription = this.model.goalDescription;
        this.profile = JSON.parse(localStorage.getItem(environment.currentUser));
        console.log('this.profile: ', this.profile);
        this.configureForm();
        this.getReplies();
    };
    MetasReplyComponent.prototype.configureForm = function () {
        this.metasForm = this.formBuilder.group({
            id: [this.model.id, Validators.required],
            goalDescription: [this.model.goalDescription, Validators.required],
            goalReply: ['', Validators.required]
        });
    };
    MetasReplyComponent.prototype.sendReply = function () {
        var _this = this;
        if (this.metasForm.valid) {
            console.log('Enviar los datos a guardar: ', this.metasForm.controls);
            var params = {
                metaId: this.model.id,
                goalMessage: this.metasForm.controls.goalReply.value,
                userId: this.profile.userId
            };
            this.apiService.save(EEndpoints.MetasComments, params).subscribe(function (response) {
                if (response.code == 100) {
                    console.log('response del save metas comments: ', response);
                    _this.toasterService.showToaster(_this.translate.instant('messages.itemSaved'));
                    //this.dialogRef.close({msg: 'success'});
                    _this.metasForm.controls.goalReply.setValue('');
                    _this.getReplies();
                }
                else {
                    _this.toasterService.showToaster(_this.translate.instant('messages.savedArtistFailed'));
                }
            }, function (err) { return _this.responseError(err); });
        }
    };
    MetasReplyComponent.prototype.responseError = function (err) {
        console.log('http error', err);
    };
    MetasReplyComponent.prototype.getReplies = function () {
        var _this = this;
        this.apiService.get(EEndpoints.MetasComments, { metaId: this.model.id }).subscribe(function (response) {
            if (response.code == 100) {
                console.log('response del get metas comments: ', response);
                _this.replies = response.result;
                console.log('this.replies: ', _this.replies);
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('messages.savedArtistFailed'));
            }
        }, function (err) { return _this.responseError(err); });
    };
    MetasReplyComponent.prototype.addEmoji = function (event) {
        //this.textArea = `${this.textArea}${event.emoji.native}`;
        console.log('event.emoji.native: ', event.emoji.native);
        this.metasForm.controls.goalReply.setValue("" + this.metasForm.controls.goalReply.value + event.emoji.native);
        //this.isEmojiPickerVisible = false;
    };
    MetasReplyComponent.prototype.closeEmojis = function () {
        this.isEmojiPickerVisible = false;
    };
    MetasReplyComponent.prototype.updateCompleted = function () {
        var _this = this;
        console.log('model en el updatecompleted: ', this.model);
        var params = this.model;
        params.isCompleted = !this.model.isCompleted ? 1 : 0;
        this.apiService.update(EEndpoints.MetasCompleted, params).subscribe(function (response) {
            if (response.code == 100) {
                console.log('response del get metas comments: ', response);
                _this.replies = response.result;
                console.log('this.replies: ', _this.replies);
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('messages.savedArtistFailed'));
            }
        }, function (err) { return _this.responseError(err); });
    };
    Object.defineProperty(MetasReplyComponent.prototype, "f", {
        get: function () { return this.metasForm.controls; },
        enumerable: false,
        configurable: true
    });
    MetasReplyComponent = __decorate([
        Component({
            selector: 'app-metas-reply',
            templateUrl: './metas-reply.component.html',
            styleUrls: ['./metas-reply.component.css']
        }),
        __param(0, Optional()),
        __param(0, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, FormBuilder,
            ApiService,
            ToasterService,
            TranslateService,
            MatDialogRef,
            AccountService])
    ], MetasReplyComponent);
    return MetasReplyComponent;
}());
export { MetasReplyComponent };
//# sourceMappingURL=metas-reply.component.js.map