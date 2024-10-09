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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { size } from 'lodash';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-report-add',
  templateUrl: './report-add.component.html',
  styleUrls: ['./report-add.component.css']
})
export class ReportAddComponent implements OnInit {

  users = [];
  metasForm: FormGroup;
  reportForm: FormGroup;
  metas = [];
  report ='' ;
  isWorking = false;
  theDate = new Date();
  model: any;
  userSelected: number;
  metasAdded = [];
  reportsAdded = [];
  reportResult = [];
  descriptionEdit = '';
  metaToEdit: any;
  isEmojiPickerVisible: boolean;

  

  constructor(
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ReportAddComponent>,
    private apiService: ApiService,
    private translate: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    public dialog: MatDialog,

  ) {
   }

  ngOnInit() {
    this.isEmojiPickerVisible = false;
    this.theDate = this.actionData.theDate ? this.actionData.theDate : new Date();
    this.model = this.actionData.model ? this.actionData.model : {};
    this.getUsers();
    this.configureForm();
//    this.downloadPDF();
  }

  private configureForm(): void {
    this.reportForm = this.formBuilder.group({
      userId: [null, Validators.required],
      report: [''],
      theDate: ['', Validators.required],

    });
  } 
  public downloadPDF(dateReport): void {
    let mydate =new Date(dateReport).toISOString().substring(0, 10);
    const params = {
      InitialDate:mydate,
      UserId: this.model.userId
    };
    this.apiService.get(EEndpoints.ReportByUserAndDate, params).subscribe(result => {
      this.reportResult = result.result;
      console.log(this.reportResult )

    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFontSize(24);
    doc.text('Daily Report ', 20, 20);
    doc.setFontSize(20);
    doc.text(this.model.userName, 20, 40);
    doc.setFontSize(14);
    doc.text(mydate, 100, 40);
    const lines = doc.splitTextToSize(this.reportResult[0]['description'],(210-15-15));
      
    doc.text(15,60,lines);
     //verticalOffset += (lines.lenght + 0.5)*14/72;
    doc.save('Daily Report '+this.model.userName+mydate+'.pdf');
    });
  }
  getUsers() {
    this.spinner.show();
    this.accountService.getUsers().subscribe(data => {
        if (data.code == 100) {
            //console.log(data);
            data.result.forEach(f => {
                f.isActive = f.status === 1 ? true : false
            });
            this.users = data.result;
            //console.log('user id'+ this.model.userId);
            
            this.users.forEach(user => {
              if (user.id == parseInt(this.model.userId)) {
                this.reportForm.controls.userId.setValue(user.id);
               //console.log('user '+user.id);
                this.getReports(user.id);
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

  getReports(usrId) {
    const params = {
      userId: usrId//this.model.userId

      
    };
    console.log(params);
    this.apiService.get(EEndpoints.ReportsByUser, params).subscribe(result => {
      //this.metasAdded = result.result;
     //result.result.forEach(element => {
     //  element.editing = false;
     //});
      this.reportsAdded = result.result;
      console.log(this.reportsAdded);
      console.log(this.model.userName);
    });
    
  }
  getReport(dateReport) {
    let mydate =new Date(dateReport).toISOString().substring(0, 10);
    
    const params = {
      InitialDate:mydate,
      UserId: this.model.userId
    };
    
    
    this.apiService.get(EEndpoints.ReportByUserAndDate, params).subscribe(result => {
      
      this.reportResult = result.result;
      console.log(this.reportResult )
    
      //this.openModalSingleReport(this.reportsAdded);
      //
      //
      //
      const dialogRef = this.dialog.open(ConfirmComponent, {
        width: '600px',
        data: {
            text: this.reportResult[0]['description'],
            icon: 'close'
        }
    });

    dialogRef.afterClosed().subscribe(result => {
        
    });
      
    });
    
  }
  saveReport(){
    let params = {
      userId: this.reportForm.controls.userId.value,
      Description:this.reportForm.controls.report.value,
      InitialDate: this.formatDate(this.reportForm.controls.theDate.value),
    };
    console.log(params);
   this.apiService.save(EEndpoints.DayliReport, params).subscribe(
      (response: ResponseApi<number>) => {
        if (response.code == 100) {
          this.toasterService.showToaster(this.translate.instant('messages.itemSaved'));
          this.getReports(params.userId);
        } else {
          this.toasterService.showToaster(this.translate.instant('messages.savedArtistFailed'));
        }
      }, (err) => this.responseError(err)
    );
  }


  responseError(err: any) {
    console.log('http error', err);
    this.isWorking = false;
  }

  formatDate(theDate) {
    theDate =  theDate.getFullYear() + '-' + (theDate.getMonth() + 1) + '-' + theDate.getDate();
    return theDate;
  }
/*
  editMetaAdded(meta) {
    console.log('meta editMetaAdded: ', meta);
    meta.editing = true;
    this.descriptionEdit = meta.goalDescription;
    this.metaToEdit = meta;
  }

  deleteMetaAdded(meta) {
    this.confirmDelete(meta.id, meta.goalDescription);
  }

  editMeta(meta) {
    console.log('meta editMeta: ', meta);
    meta.editing = true;
    this.descriptionEdit = meta.description;
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
    
    meta.editing = false;
  }

  saveMetaAdded() {
    this.metaToEdit.goalDescription = this.descriptionEdit;
    
    this.apiService.update(EEndpoints.Metas, this.metaToEdit)
        .subscribe(data => {
            if (data.code == 100) {
                this.getMetas();
                this.toasterService.showTranslate('messages.itemSaved');
            } else {
                this.toasterService.showTranslate('errors.errorSavingItem');
            }
        }, err => this.responseError(err));
  }*/


  addEmoji(event) {
    //this.textArea = `${this.textArea}${event.emoji.native}`;
    console.log('event.emoji.native: ', event.emoji.native);
    this.reportForm.controls.report.setValue(
      `${this.reportForm.controls.report.value}${event.emoji.native}`
    );
    //this.isEmojiPickerVisible = false;
  }

  closeEmojis() {
    this.isEmojiPickerVisible = false;
  }


  get f() { return this.reportForm.controls; }

  //MODAL


openModalSingleReport(row: any): void {
  let action = this.translate.instant(!row ? 'save': 'update');
  const dialogRef = this.dialog.open(ReportAddComponent, {
      width: '700px',
      data: {
          action: action,
          model: row
          
      }
  });
  dialogRef.afterClosed().subscribe(result => {
});
}

}
