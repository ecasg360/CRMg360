var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { AccountService } from '@services/account.service';
import { EModules } from '@enums/modules';
import { ECommentType } from '@enums/modules-types';
import { ToasterService } from '@services/toaster.service';
import { EEndpoints } from '@enums/endpoints';
var CommentsManagerComponent = /** @class */ (function () {
    function CommentsManagerComponent(fb, apiService, accountService, toaster, translationLoaderService) {
        var _this = this;
        this.fb = fb;
        this.apiService = apiService;
        this.accountService = accountService;
        this.toaster = toaster;
        this.translationLoaderService = translationLoaderService;
        this.rowId = null;
        this.moduleId = null;
        this.UseScroll = true;
        this.isWorking = false;
        this.commentList = [];
        this.usersList = [];
        this.selectedUsers = [];
        this.commentCount = 0;
        this.isEdit = false;
        this.mentionItems = [
            {
                items: this.usersList,
                labelKey: "name",
                triggerChar: '@',
                mentionSelect: function (item) {
                    _this.mentionSelect(item, 'comment');
                    return "@" + item.name + " " + item.lastName;
                },
            }
        ];
        this.mentionItemsReply = [
            {
                items: this.usersList,
                labelKey: "name",
                triggerChar: '@',
                mentionSelect: function (item) {
                    _this.mentionSelect(item, 'reply');
                    return "@" + item.name + " " + item.lastName;
                },
            }
        ];
        console.log('Entró al constructor de comments manager');
        this._getUsersApi();
    }
    CommentsManagerComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.user = this.accountService.getLocalUserProfile();
        console.log('this.user en ngOnInit: ', this.user);
        var formConfig = {
            id: [null, []],
            comment: ['', [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(450)
                ]]
        };
        this.commentForm = this.fb.group(formConfig);
        this.commentReplyForm = this.fb.group(formConfig);
    };
    CommentsManagerComponent.prototype.ngOnChanges = function (changes) {
        this._manageGetComment();
    };
    Object.defineProperty(CommentsManagerComponent.prototype, "f", {
        get: function () { return this.commentForm.controls; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CommentsManagerComponent.prototype, "fReply", {
        get: function () { return this.commentReplyForm.controls; },
        enumerable: false,
        configurable: true
    });
    CommentsManagerComponent.prototype.trackFunc = function (index, item) {
        return (item.id) ? item.id : index;
    };
    CommentsManagerComponent.prototype.trackFuncReply = function (index, item) {
        return (item.id) ? item.id : index;
    };
    CommentsManagerComponent.prototype.sortComments = function (a, b) {
        var timeA = (new Date(a.created)).getTime();
        var timeB = (new Date(b.created)).getTime();
        if (timeA > timeB)
            return -1;
        if (timeA < timeB)
            return 1;
        return 0;
    };
    CommentsManagerComponent.prototype.replyAction = function (comment) {
        this.commentList.forEach(function (value, index) {
            if (value.id !== comment.id)
                value.replyActive = false;
        });
        this.fReply.comment.patchValue('');
        if (this.selectedUsers.length > 0) {
            this.selectedUsers = this.selectedUsers.filter(function (f) { return !f.reply; });
        }
        comment.replyActive = !comment.replyActive;
        this.commentReplyForm.controls.id.patchValue(null);
    };
    CommentsManagerComponent.prototype.editComment = function (type, item) {
        var _this = this;
        this.isEdit = true;
        this.commentForm.controls.id.patchValue(item.id);
        var comment = item.commentary.replace(/<span class="user-comment">/g, '').replace(/<\/span>/g, '');
        this.commentForm.controls.comment.patchValue(comment);
        this.editingCommentType = type;
        this.itemEdit = item;
        if (item.users && this.usersList.length > 0) {
            item.users.forEach(function (value) {
                var found = _this.usersList.find(function (f) { return f.id == value; });
                if (found) {
                    _this.selectedUsers.push({
                        id: found.id,
                        user: "@" + found.name + " " + found.lastName,
                        reply: (type == "reply"),
                    });
                }
            });
        }
    };
    CommentsManagerComponent.prototype.cancelEdit = function () {
        this.isEdit = false;
        this.commentForm.controls.id.patchValue(null);
        this.commentForm.controls.comment.patchValue(null);
        this.selectedUsers = [];
        this.editingCommentType = '';
        this.itemEdit = null;
    };
    CommentsManagerComponent.prototype.addComment = function (commentId) {
        if (commentId === void 0) { commentId = null; }
        this.isWorking = true;
        var dataFormatter = null;
        if (commentId)
            dataFormatter = this._formatUsersComment(true, this.commentReplyForm.value.comment);
        else
            dataFormatter = this._formatUsersComment(false, this.commentForm.value.comment);
        this.commentReplyForm.controls.comment.disable({ onlySelf: true, emitEvent: false });
        this.commentForm.controls.comment.disable({ onlySelf: true, emitEvent: false });
        var comment = {
            commentary: dataFormatter.comment,
            transmitterId: this.user.id,
            taskId: this.rowId,
            requestSourceId: commentId,
            moduleId: this.moduleId,
            users: dataFormatter.users,
        };
        this.isWorking = true;
        this._createComment(comment);
    };
    CommentsManagerComponent.prototype.saveEditComment = function () {
        console.log(this.commentForm, this.editingCommentType, this.selectedUsers);
        this.isWorking = true;
        this.commentReplyForm.controls.comment.disable({ onlySelf: true, emitEvent: false });
        this.commentForm.controls.comment.disable({ onlySelf: true, emitEvent: false });
        var dataFormatter = null;
        dataFormatter = this._formatUsersComment(this.editingCommentType == 'reply', this.commentForm.value.comment);
        var comment = {
            id: this.commentForm.controls.id.value,
            commentary: dataFormatter.comment,
            transmitterId: this.user.id,
            taskId: this.rowId,
            requestSourceId: this.itemEdit.requestSourceId,
            moduleId: this.moduleId,
            users: dataFormatter.users,
        };
        this.isWorking = true;
        this._updateComment(comment);
    };
    CommentsManagerComponent.prototype.mentionSelect = function (item, commentType) {
        if (commentType === void 0) { commentType = "comment"; }
        var user = "@" + item.name + " " + item.lastName;
        var found = (this.selectedUsers.length > 0) ? this.selectedUsers.find(function (f) { return f == user; }) : null;
        if (!found) {
            this.selectedUsers.push({
                commentId: 0,
                id: item.id,
                user: user,
                reply: (commentType == "reply"),
            });
        }
    };
    CommentsManagerComponent.prototype._responseError = function (err) {
        console.log(err);
        this.toaster.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    CommentsManagerComponent.prototype._manageGetComment = function () {
        if (this.CommentType == ECommentType.module) {
            this._getComments(EEndpoints.RequestsByModule, { moduleId: this.moduleId });
        }
        else if (this.CommentType == ECommentType.task) {
            this._getComments(EEndpoints.RequestsByTask, { TaskId: this.rowId });
        }
        else if (this.CommentType == ECommentType.marketing) {
            this._getComments(EEndpoints.RequestsByModuleTask, { TaskId: this.rowId, moduleId: this.moduleId });
        }
        else {
            this._getComments(EEndpoints.Requests);
        }
    };
    CommentsManagerComponent.prototype._formatComments = function (comments) {
        var _this = this;
        this.commentList = comments.filter(function (f) { return f.requestSourceId == null; });
        this.commentList.forEach(function (value, index) {
            value.replyList = comments.filter(function (f) { return f.requestSourceId == value.id; }).sort(_this.sortComments);
        });
    };
    CommentsManagerComponent.prototype._formatUsersComment = function (isReply, message) {
        var found = [];
        if (this.selectedUsers.length > 0 && message.length > 0) {
            var users = this.selectedUsers.filter(function (f) { return f.reply == isReply; });
            if (users.length > 0) {
                users.forEach(function (value, index) {
                    if (message.indexOf(value.user) >= 0) {
                        found.push(value.id);
                        message = message.replace(value.user, "<span class=\"user-comment\">" + value.user + "</span>");
                    }
                });
            }
        }
        return {
            users: found,
            comment: message,
        };
    };
    //#region API
    CommentsManagerComponent.prototype._getComments = function (route, params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(route, params).subscribe(function (response) {
            if (response.code == 100) {
                var commentList = response.result.map(function (m) {
                    m.replyActive = false;
                    return m;
                }).sort(_this.sortComments);
                _this.commentCount = commentList.length;
                _this._formatComments(commentList);
            }
            else
                _this.toaster.showTranslate('general.errors.serverError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    CommentsManagerComponent.prototype._createComment = function (comment) {
        var _this = this;
        this.apiService.save(EEndpoints.Request, comment).subscribe(function (response) {
            if (response.code == 100) {
                comment.id = response.result;
                _this.f.comment.patchValue('');
                _this.fReply.comment.patchValue('');
                _this.commentCount++;
                _this._manageGetComment();
            }
            else {
                _this.isWorking = false;
                _this.toaster.showTranslate('general.errors.serverError');
            }
            _this.commentForm.controls.comment.enable({ onlySelf: true, emitEvent: false });
            _this.commentReplyForm.controls.comment.enable({ onlySelf: true, emitEvent: false });
        }, function (err) { return _this._responseError(err); });
    };
    CommentsManagerComponent.prototype._updateComment = function (comment) {
        var _this = this;
        this.apiService.update(EEndpoints.Request, comment).subscribe(function (response) {
            if (response.code == 100) {
                _this._manageGetComment();
            }
            else {
                _this.isWorking = false;
                _this.toaster.showTranslate('general.errors.serverError');
            }
            _this.commentForm.controls.comment.enable({ onlySelf: true, emitEvent: false });
            _this.commentReplyForm.controls.comment.enable({ onlySelf: true, emitEvent: false });
            _this.cancelEdit();
        }, function (err) { return _this._responseError(err); });
    };
    CommentsManagerComponent.prototype._getUsersApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Users).subscribe(function (response) {
            if (response.code == 100) {
                _this.usersList = response.result;
                _this.mentionItems[0].items = response.result;
                _this.mentionItemsReply[0].items = response.result;
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CommentsManagerComponent.prototype, "rowId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CommentsManagerComponent.prototype, "moduleId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CommentsManagerComponent.prototype, "CommentType", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], CommentsManagerComponent.prototype, "UseScroll", void 0);
    CommentsManagerComponent = __decorate([
        Component({
            selector: 'app-comments-manager',
            templateUrl: './comments-manager.component.html',
            styleUrls: ['./comments-manager.component.scss'],
            encapsulation: ViewEncapsulation.None,
            animations: fuseAnimations
        }),
        __metadata("design:paramtypes", [FormBuilder,
            ApiService,
            AccountService,
            ToasterService,
            FuseTranslationLoaderService])
    ], CommentsManagerComponent);
    return CommentsManagerComponent;
}());
export { CommentsManagerComponent };
//# sourceMappingURL=comments-manager.component.js.map