import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from "@models/response-api";
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from "@environments/environment";
import { IUser } from '@shared/models/user';
import { AccountService } from 'ClientApp/app/core/services/account.service';

@Component({
  selector: 'app-metas-reply',
  templateUrl: './metas-reply.component.html',
  styleUrls: ['./metas-reply.component.css']
})
export class MetasReplyComponent implements OnInit {

  model: any;
  metasForm: FormGroup;
  metaDescription = '';
  profile: IUser;
  replies = [];
  isEmojiPickerVisible: boolean;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<MetasReplyComponent>,
    private accountService: AccountService,
  ) {}

  ngOnInit() {
    this.model = this.actionData.model ? this.actionData.model : {};
    console.log('this.model: ', this.model);
    this.metaDescription = this.model.goalDescription;
    this.profile = JSON.parse(localStorage.getItem(environment.currentUser));
    console.log('this.profile: ', this.profile);
    this.configureForm();
    this.getReplies();
  }

  private configureForm(): void {
    this.metasForm = this.formBuilder.group({
      id: [this.model.id, Validators.required],
      goalDescription: [this.model.goalDescription, Validators.required],
      goalReply: ['', Validators.required]
    });
  }

  sendReply() {
    if (this.metasForm.valid) {
      console.log('Enviar los datos a guardar: ', this.metasForm.controls);
      const params = {
        metaId: this.model.id,
        goalMessage: this.metasForm.controls.goalReply.value,
        userId: this.profile.userId
      };
      this.apiService.save(EEndpoints.MetasComments, params).subscribe(
        (response: ResponseApi<number>) => {
          if (response.code == 100) {
            console.log('response del save metas comments: ', response);
            this.toasterService.showToaster(this.translate.instant('messages.itemSaved'));
            //this.dialogRef.close({msg: 'success'});
            this.metasForm.controls.goalReply.setValue('');
            this.getReplies();
          } else {
            this.toasterService.showToaster(this.translate.instant('messages.savedArtistFailed'));
          }
        }, (err) => this.responseError(err)
      );
    }
  }

  responseError(err: any) {
    console.log('http error', err);
  }

  getReplies() {
    this.apiService.get(EEndpoints.MetasComments, {metaId: this.model.id}).subscribe(
      response => {
        if (response.code == 100) {
          console.log('response del get metas comments: ', response);
          this.replies = response.result;
          console.log('this.replies: ', this.replies);
        } else {
          this.toasterService.showToaster(this.translate.instant('messages.savedArtistFailed'));
        }
      }, (err) => this.responseError(err)
    );
  }

  addEmoji(event) {
    //this.textArea = `${this.textArea}${event.emoji.native}`;
    console.log('event.emoji.native: ', event.emoji.native);
    this.metasForm.controls.goalReply.setValue(
      `${this.metasForm.controls.goalReply.value}${event.emoji.native}`
    );
    //this.isEmojiPickerVisible = false;
  }

  closeEmojis() {
    this.isEmojiPickerVisible = false;
  }

  updateCompleted() {
    console.log('model en el updatecompleted: ', this.model);
    let params = this.model;
    params.isCompleted = !this.model.isCompleted ? 1 : 0;
    this.apiService.update(EEndpoints.MetasCompleted, params).subscribe(
      response => {
        if (response.code == 100) {
          console.log('response del get metas comments: ', response);
          this.replies = response.result;
          console.log('this.replies: ', this.replies);
        } else {
          this.toasterService.showToaster(this.translate.instant('messages.savedArtistFailed'));
        }
      }, (err) => this.responseError(err)
    );
  }

  get f() { return this.metasForm.controls; }

}
