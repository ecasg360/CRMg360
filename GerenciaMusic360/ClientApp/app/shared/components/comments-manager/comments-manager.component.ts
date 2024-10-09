import { Component, OnInit, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { AccountService } from '@services/account.service';
import { IUser } from '@models/user';
import { IComment, ICommentExtend } from '@models/comment';
import { EModules } from '@enums/modules';
import { ECommentType } from '@enums/modules-types';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '@services/toaster.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { MentionItem } from 'fvi-angular-mentions';

@Component({
  selector: 'app-comments-manager',
  templateUrl: './comments-manager.component.html',
  styleUrls: ['./comments-manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class CommentsManagerComponent implements OnInit, OnChanges {

  @Input() rowId: number = null;
  @Input() moduleId: EModules = null;
  @Input() CommentType: ECommentType;
  @Input() UseScroll: boolean = true;

  user: IUser;
  commentForm: FormGroup;
  commentReplyForm: FormGroup;
  isWorking: boolean = false;
  commentList: ICommentExtend[] = [];
  usersList: IUser[] = [];
  selectedUsers: any[] = [];
  commentCount: number = 0;
  isEdit: boolean = false;
  editingCommentType: string;
  itemEdit: ICommentExtend;
  mentionItems: Array<MentionItem> = [
    {
      items: this.usersList,
      labelKey: "name",
      triggerChar: '@',
      mentionSelect: (item: any) => {
        this.mentionSelect(item, 'comment');
        return `@${item.name} ${item.lastName}`;
      },
    }
  ];

  mentionItemsReply: Array<MentionItem> = [
    {
      items: this.usersList,
      labelKey: "name",
      triggerChar: '@',
      mentionSelect: (item: any) => {
        this.mentionSelect(item, 'reply');
        return `@${item.name} ${item.lastName}`;
      },
    }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private accountService: AccountService,
    private toaster: ToasterService,
    private translationLoaderService: FuseTranslationLoaderService,
  ) {
    console.log('Entró al constructor de comments manager');
    this._getUsersApi();
  }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
    this.user = this.accountService.getLocalUserProfile();
    console.log('this.user en ngOnInit: ', this.user);
    let formConfig = {
      id: [null, []],
      comment: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(450)
      ]]
    };

    this.commentForm = this.fb.group(formConfig);
    this.commentReplyForm = this.fb.group(formConfig);
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this._manageGetComment();
  }

  get f() { return this.commentForm.controls; }

  get fReply() { return this.commentReplyForm.controls; }

  trackFunc(index, item) {
    return (item.id) ? item.id : index;
  }

  trackFuncReply(index, item) {
    return (item.id) ? item.id : index;
  }

  sortComments(a: ICommentExtend, b: ICommentExtend) {
    const timeA = (new Date(a.created)).getTime();
    const timeB = (new Date(b.created)).getTime();
    if (timeA > timeB) return -1;
    if (timeA < timeB) return 1;
    return 0;
  }

  replyAction(comment: ICommentExtend) {
    this.commentList.forEach((value: ICommentExtend, index: number) => {
      if (value.id !== comment.id)
        value.replyActive = false;
    });
    this.fReply.comment.patchValue('');
    if (this.selectedUsers.length > 0) {
      this.selectedUsers = this.selectedUsers.filter(f => !f.reply);
    }
    comment.replyActive = !comment.replyActive;
    this.commentReplyForm.controls.id.patchValue(null);
  }

  editComment(type: string, item: ICommentExtend) {
    this.isEdit = true;
    this.commentForm.controls.id.patchValue(item.id);
    let comment = item.commentary.replace(/<span class="user-comment">/g, '').replace(/<\/span>/g, '');
    this.commentForm.controls.comment.patchValue(comment);
    this.editingCommentType = type;
    this.itemEdit = item;
    if (item.users && this.usersList.length > 0) {
      item.users.forEach((value: number) => {
        const found = this.usersList.find(f => f.id == value);
        if (found) {
          this.selectedUsers.push({
            id: found.id,
            user: `@${found.name} ${found.lastName}`,
            reply: (type == "reply"),
          });
        }
      });
    }
  }

  cancelEdit() {
    this.isEdit = false;
    this.commentForm.controls.id.patchValue(null);
    this.commentForm.controls.comment.patchValue(null);
    this.selectedUsers = [];
    this.editingCommentType = '';
    this.itemEdit = null;
  }

  addComment(commentId: number = null): void {
    this.isWorking = true;
    let dataFormatter = null;
    if (commentId)
      dataFormatter = this._formatUsersComment(true, this.commentReplyForm.value.comment);
    else
      dataFormatter = this._formatUsersComment(false, this.commentForm.value.comment);

    this.commentReplyForm.controls.comment.disable({ onlySelf: true, emitEvent: false });
    this.commentForm.controls.comment.disable({ onlySelf: true, emitEvent: false });

    let comment = <IComment>{
      commentary: dataFormatter.comment,
      transmitterId: this.user.id,
      taskId: this.rowId,
      requestSourceId: commentId,
      moduleId: this.moduleId,
      users: dataFormatter.users,
    }
    this.isWorking = true;
    this._createComment(comment);
  }

  saveEditComment() {
    console.log(this.commentForm, this.editingCommentType, this.selectedUsers);
    this.isWorking = true;
    this.commentReplyForm.controls.comment.disable({ onlySelf: true, emitEvent: false });
    this.commentForm.controls.comment.disable({ onlySelf: true, emitEvent: false });
    let dataFormatter = null;
    dataFormatter = this._formatUsersComment(this.editingCommentType == 'reply', this.commentForm.value.comment);

    let comment = <IComment>{
      id: this.commentForm.controls.id.value,
      commentary: dataFormatter.comment,
      transmitterId: this.user.id,
      taskId: this.rowId,
      requestSourceId: this.itemEdit.requestSourceId,
      moduleId: this.moduleId,
      users: dataFormatter.users,
    }
    this.isWorking = true;
    this._updateComment(comment);
  }

  mentionSelect(item: any, commentType = "comment") {
    const user = `@${item.name} ${item.lastName}`;
    const found = (this.selectedUsers.length > 0) ? this.selectedUsers.find(f => f == user) : null;
    if (!found) {
      this.selectedUsers.push({
        commentId: 0,
        id: item.id,
        user: user,
        reply: (commentType == "reply"),
      });
    }
  }

  private _responseError(err: HttpErrorResponse) {
    console.log(err);
    this.toaster.showTranslate('general.errors.serverError');
    this.isWorking = false;
  }

  private _manageGetComment() {

    if (this.CommentType == ECommentType.module) {
      this._getComments(EEndpoints.RequestsByModule, { moduleId: this.moduleId });
    } else if (this.CommentType == ECommentType.task) {
      this._getComments(EEndpoints.RequestsByTask, { TaskId: this.rowId });
    } else if (this.CommentType == ECommentType.marketing) {
      this._getComments(EEndpoints.RequestsByModuleTask, { TaskId: this.rowId, moduleId: this.moduleId });

    } else {
      this._getComments(EEndpoints.Requests);
    }
  }

  private _formatComments(comments: ICommentExtend[]) {
    this.commentList = comments.filter((f: ICommentExtend) => f.requestSourceId == null);

    this.commentList.forEach((value: ICommentExtend, index: number) => {
      value.replyList = comments.filter((f: ICommentExtend) => f.requestSourceId == value.id).sort(this.sortComments);
    });
  }

  private _formatUsersComment(isReply: boolean, message: string): any {
    const found = [];
    if (this.selectedUsers.length > 0 && message.length > 0) {
      const users = this.selectedUsers.filter(f => f.reply == isReply);
      if (users.length > 0) {
        users.forEach((value, index) => {
          if (message.indexOf(value.user) >= 0) {
            found.push(value.id);
            message = message.replace(value.user, `<span class="user-comment">${value.user}</span>`);
          }
        });
      }
    }
    return {
      users: found,
      comment: message,
    };
  }

  //#region API

  private _getComments(route: EEndpoints, params?: any): void {
    this.isWorking = true;
    this.apiService.get(route, params).subscribe(
      (response: ResponseApi<ICommentExtend[]>) => {
        if (response.code == 100) {
          let commentList = response.result.map(m => {
            m.replyActive = false;
            return m;
          }).sort(this.sortComments);
          this.commentCount = commentList.length;
          this._formatComments(commentList);
        } else
          this.toaster.showTranslate('general.errors.serverError');
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }

  private _createComment(comment: IComment): void {
    this.apiService.save(EEndpoints.Request, comment).subscribe(
      (response: ResponseApi<number>) => {
        if (response.code == 100) {
          comment.id = response.result;
          this.f.comment.patchValue('');
          this.fReply.comment.patchValue('');
          this.commentCount++;
          this._manageGetComment();
        } else {
          this.isWorking = false;
          this.toaster.showTranslate('general.errors.serverError');
        }
        this.commentForm.controls.comment.enable({ onlySelf: true, emitEvent: false });
        this.commentReplyForm.controls.comment.enable({ onlySelf: true, emitEvent: false });
      },
      err => this._responseError(err)
    )
  }

  private _updateComment(comment: IComment): void {
    this.apiService.update(EEndpoints.Request, comment).subscribe(
      (response: ResponseApi<number>) => {
        if (response.code == 100) {
          this._manageGetComment();
        } else {
          this.isWorking = false;
          this.toaster.showTranslate('general.errors.serverError');
        }
        this.commentForm.controls.comment.enable({ onlySelf: true, emitEvent: false });
        this.commentReplyForm.controls.comment.enable({ onlySelf: true, emitEvent: false });
        this.cancelEdit();
      },
      err => this._responseError(err)
    )
  }

  private _getUsersApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Users).subscribe(
      (response: ResponseApi<IUser[]>) => {
        if (response.code == 100) {
          this.usersList = response.result;
          this.mentionItems[0].items = response.result;
          this.mentionItemsReply[0].items = response.result;
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    );
  }
  //#endregion
}
