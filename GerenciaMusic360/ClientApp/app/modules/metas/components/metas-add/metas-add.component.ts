import { Component, OnInit, Optional, Inject } from '@angular/core';
import { AccountService } from 'ClientApp/app/core/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from "@services/api.service";
import { ResponseApi } from "@models/response-api";
import { EEndpoints } from "@enums/endpoints";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { MatDialog, MatTableDataSource, MatPaginatorIntl, MatPaginator, MatSort } from '@angular/material';
import { MetasReplyComponent } from '../metas-reply/metas-reply.component';

@Component({
  selector: 'app-metas-add',
  templateUrl: './metas-add.component.html',
  styleUrls: ['./metas-add.component.css']
})
export class MetasAddComponent implements OnInit {

  users = [];
  metasForm: FormGroup;
  metas = [];
  isWorking = false;
  theDate = new Date();
  model: any;
  userSelected: number;
  metasAdded = [];
  descriptionEdit = '';
  metaToEdit: any;
  isEmojiPickerVisible: boolean;
  isMeasurable = false;
  isMeasurableEdit = false;
  

  constructor(
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MetasAddComponent>,
    private apiService: ApiService,
    private translate: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isEmojiPickerVisible = false;
    this.theDate = this.actionData.theDate ? this.actionData.theDate : new Date();
    this.model = this.actionData.model ? this.actionData.model : {};
    this.getUsers();
    this.configureForm();
  }

  private configureForm(): void {
    this.metasForm = this.formBuilder.group({
      userId: [null, Validators.required],
      meta: [''],
      theDate: [this.theDate, Validators.required],
      isMeasurable: ['', Validators.required]
    });
  }

  getUsers() {
    this.spinner.show();
    this.accountService.getUsers().subscribe(data => {
        if (data.code == 100) {
            console.log(data);
            data.result.forEach(f => {
                f.isActive = f.status === 1 ? true : false
            });
            this.users = data.result;
            this.users.forEach(user => {
              if (user.id == parseInt(this.model.userId)) {
                this.metasForm.controls.userId.setValue(user.id);
                this.getMetas();
              }
            });
            this.spinner.hide();
        } else {
            this.spinner.hide();
            setTimeout(() => {
                this.toasterService.showToaster(data.message);
            }, 300);
        }
    }, (err) => console.error('Failed! ' + err));
  }

  getMetas() {
    const params = {
      userId: this.model.userId,
      InitialDate: this.formatDate(this.theDate)
    };
    this.apiService.get(EEndpoints.MetasByUserAndDate, params).subscribe(result => {
      //this.metasAdded = result.result;
      result.result.forEach(element => {
        element.editing = false;
      });
      this.metasAdded = result.result;
    });
    
  }

  setMeta() {
    let meta = this.metasForm.controls.meta.value;
    if (meta != '') {
      this.metas.push(
        {
          description: this.metasForm.controls.meta.value,
          isMeasurable: this.isMeasurable
        }
      );
      this.metasForm.controls.meta.setValue('');
      this.isMeasurable = false;
    }
  }

  saveMetas() {
    this.metas.forEach(element => {
      let params = {
        userId: this.metasForm.controls.userId.value,
        GoalDescription: element.description,
        InitialDate: this.metasForm.controls.theDate.value,
        isMeasurable: element.isMeasurable ? 1 : 0
      };
      this.apiService.save(EEndpoints.Metas, params).subscribe(
        (response: ResponseApi<number>) => {
          if (response.code == 100) {
            this.toasterService.showToaster(this.translate.instant('messages.itemSaved'));
          } else {
            this.toasterService.showToaster(this.translate.instant('messages.savedArtistFailed'));
          }
        }, (err) => this.responseError(err)
      );
    });
    this.dialogRef.close({msg: 'success'});
  }

  responseError(err: any) {
    console.log('http error', err);
    this.isWorking = false;
  }

  formatDate(theDate) {
    theDate =  theDate.getFullYear() + '-' + (theDate.getMonth() + 1) + '-' + theDate.getDate();
    return theDate;
  }

  editMetaAdded(meta) {
    console.log('meta editMetaAdded: ', meta);
    meta.editing = true;
    this.descriptionEdit = meta.goalDescription;
    this.isMeasurableEdit = meta.isMeasurable;
    this.metaToEdit = meta;
  }

  deleteMetaAdded(meta) {
    this.confirmDelete(meta.id, meta.goalDescription);
  }

  editMeta(meta) {
    console.log('meta editMeta: ', meta);
    meta.editing = true;
    this.descriptionEdit = meta.description;
    this.isMeasurableEdit = meta.isMeasurable;
    this.metaToEdit = meta;
  }

  deleteMeta(meta) {
    this.confirmDelete(0, meta);
  }

  confirmDelete(id: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
        width: '400px',
        data: {
            text: this.translate.instant('messages.deleteQuestion', { field: name }),
            action: this.translate.instant('general.delete'),
            icon: 'delete_outline'
        }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
            let confirm = result.confirm;
            if (confirm) {
              if (id == 0) {
                this.metas.forEach((meta, index) => {
                  if (meta == name) {
                    this.metas.splice(index, 1);
                  }
                });
              } else {
                this.apiService.delete(EEndpoints.Metas, { id: id })
                  .subscribe(data => {
                      if (data.code == 100) {
                          this.getMetas();
                          this.toasterService.showTranslate('messages.itemDeleted');
                      } else {
                          this.toasterService.showTranslate('errors.errorDeletingItem');
                      }
                  }, err => this.responseError(err));
              }
            }
        }
    });
  }

  saveMeta(meta) {
    console.log('meta saveMeta: ', meta);
    meta.description = this.descriptionEdit;
    meta.isMeasurable = this.isMeasurableEdit;
    meta.editing = false;
  }

  saveMetaAdded() {
    this.metaToEdit.goalDescription = this.descriptionEdit;
    this.metaToEdit.isMeasurable = this.isMeasurableEdit ? 1 : 0;
    this.apiService.update(EEndpoints.Metas, this.metaToEdit)
        .subscribe(data => {
            if (data.code == 100) {
                this.getMetas();
                this.toasterService.showTranslate('messages.itemSaved');
            } else {
                this.toasterService.showTranslate('errors.errorSavingItem');
            }
        }, err => this.responseError(err));
  }

  reply(row) {
    const dialogRef = this.dialog.open(MetasReplyComponent, {
      width: '700px',
      data: {
          model: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          //this.metas = [];
//          this.getRecords();
        }
    });
  }

  addEmoji(event) {
    //this.textArea = `${this.textArea}${event.emoji.native}`;
    console.log('event.emoji.native: ', event.emoji.native);
    this.metasForm.controls.meta.setValue(
      `${this.metasForm.controls.meta.value}${event.emoji.native}`
    );
    //this.isEmojiPickerVisible = false;
  }

  closeEmojis() {
    this.isEmojiPickerVisible = false;
  }

  updateIsMeasurable() {
    console.log('Entró al updateIsMeasurable: ', this.isMeasurable);
    this.isMeasurable = !this.isMeasurable;
    this.metasForm.controls.isMeasurable.setValue(this.isMeasurable);
    console.log('this.metasForm.controls.isMeasurable.value: ', this.metasForm.controls.isMeasurable.value);
  }

  updateIsMeasurableEdit(isMeasurable) {
    console.log('Entró al updateIsMeasurable: ', this.isMeasurable);
    this.isMeasurableEdit = !isMeasurable;
  }

  get f() { return this.metasForm.controls; }

}
