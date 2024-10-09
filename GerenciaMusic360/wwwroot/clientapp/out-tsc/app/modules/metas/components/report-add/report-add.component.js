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
import jsPDF from 'jspdf';
var ReportAddComponent = /** @class */ (function () {
    function ReportAddComponent(accountService, spinner, toasterService, formBuilder, dialogRef, apiService, translate, actionData, dialog) {
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
        this.report = '';
        this.isWorking = false;
        this.theDate = new Date();
        this.metasAdded = [];
        this.reportsAdded = [];
        this.reportResult = [];
        this.descriptionEdit = '';
    }
    ReportAddComponent_1 = ReportAddComponent;
    ReportAddComponent.prototype.ngOnInit = function () {
        this.isEmojiPickerVisible = false;
        this.theDate = this.actionData.theDate ? this.actionData.theDate : new Date();
        this.model = this.actionData.model ? this.actionData.model : {};
        this.getUsers();
        this.configureForm();
        //    this.downloadPDF();
    };
    ReportAddComponent.prototype.configureForm = function () {
        this.reportForm = this.formBuilder.group({
            userId: [null, Validators.required],
            report: [''],
            theDate: ['', Validators.required],
        });
    };
    ReportAddComponent.prototype.downloadPDF = function (dateReport) {
        var _this = this;
        var mydate = new Date(dateReport).toISOString().substring(0, 10);
        var params = {
            InitialDate: mydate,
            UserId: this.model.userId
        };
        this.apiService.get(EEndpoints.ReportByUserAndDate, params).subscribe(function (result) {
            _this.reportResult = result.result;
            console.log(_this.reportResult);
            var doc = new jsPDF('p', 'mm', 'a4');
            doc.setFontSize(24);
            doc.text('Dayli Report ', 20, 20);
            doc.setFontSize(20);
            doc.text(_this.model.userName, 20, 40);
            doc.setFontSize(14);
            doc.text(mydate, 100, 40);
            var lines = doc.splitTextToSize(_this.reportResult[0]['description'], (210 - 15 - 15));
            doc.text(15, 60, lines);
            //verticalOffset += (lines.lenght + 0.5)*14/72;
            doc.save('Dayli Report ' + _this.model.userName + mydate + '.pdf');
        });
    };
    ReportAddComponent.prototype.getUsers = function () {
        var _this = this;
        this.spinner.show();
        this.accountService.getUsers().subscribe(function (data) {
            if (data.code == 100) {
                //console.log(data);
                data.result.forEach(function (f) {
                    f.isActive = f.status === 1 ? true : false;
                });
                _this.users = data.result;
                //console.log('user id'+ this.model.userId);
                _this.users.forEach(function (user) {
                    if (user.id == parseInt(_this.model.userId)) {
                        _this.reportForm.controls.userId.setValue(user.id);
                        //console.log('user '+user.id);
                        _this.getReports(user.id);
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
    ReportAddComponent.prototype.getReports = function (usrId) {
        var _this = this;
        var params = {
            userId: usrId //this.model.userId
        };
        console.log(params);
        this.apiService.get(EEndpoints.ReportsByUser, params).subscribe(function (result) {
            //this.metasAdded = result.result;
            //result.result.forEach(element => {
            //  element.editing = false;
            //});
            _this.reportsAdded = result.result;
            console.log(_this.reportsAdded);
            console.log(_this.model.userName);
        });
    };
    ReportAddComponent.prototype.getReport = function (dateReport) {
        var _this = this;
        var mydate = new Date(dateReport).toISOString().substring(0, 10);
        var params = {
            InitialDate: mydate,
            UserId: this.model.userId
        };
        this.apiService.get(EEndpoints.ReportByUserAndDate, params).subscribe(function (result) {
            _this.reportResult = result.result;
            console.log(_this.reportResult);
            //this.openModalSingleReport(this.reportsAdded);
            //
            //
            //
            var dialogRef = _this.dialog.open(ConfirmComponent, {
                width: '600px',
                data: {
                    text: _this.reportResult[0]['description'],
                    icon: 'close'
                }
            });
            dialogRef.afterClosed().subscribe(function (result) {
            });
        });
    };
    ReportAddComponent.prototype.saveReport = function () {
        var _this = this;
        var params = {
            userId: this.reportForm.controls.userId.value,
            Description: this.reportForm.controls.report.value,
            InitialDate: this.formatDate(this.reportForm.controls.theDate.value),
        };
        console.log(params);
        this.apiService.save(EEndpoints.DayliReport, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('messages.itemSaved'));
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('messages.savedArtistFailed'));
            }
        }, function (err) { return _this.responseError(err); });
    };
    ReportAddComponent.prototype.responseError = function (err) {
        console.log('http error', err);
        this.isWorking = false;
    };
    ReportAddComponent.prototype.formatDate = function (theDate) {
        theDate = theDate.getFullYear() + '-' + (theDate.getMonth() + 1) + '-' + theDate.getDate();
        return theDate;
    };
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
    ReportAddComponent.prototype.addEmoji = function (event) {
        //this.textArea = `${this.textArea}${event.emoji.native}`;
        console.log('event.emoji.native: ', event.emoji.native);
        this.reportForm.controls.report.setValue("" + this.reportForm.controls.report.value + event.emoji.native);
        //this.isEmojiPickerVisible = false;
    };
    ReportAddComponent.prototype.closeEmojis = function () {
        this.isEmojiPickerVisible = false;
    };
    Object.defineProperty(ReportAddComponent.prototype, "f", {
        get: function () { return this.reportForm.controls; },
        enumerable: false,
        configurable: true
    });
    //MODAL
    ReportAddComponent.prototype.openModalSingleReport = function (row) {
        var action = this.translate.instant(!row ? 'save' : 'update');
        var dialogRef = this.dialog.open(ReportAddComponent_1, {
            width: '700px',
            data: {
                action: action,
                model: row
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
        });
    };
    var ReportAddComponent_1;
    ReportAddComponent = ReportAddComponent_1 = __decorate([
        Component({
            selector: 'app-report-add',
            templateUrl: './report-add.component.html',
            styleUrls: ['./report-add.component.css']
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
    ], ReportAddComponent);
    return ReportAddComponent;
}());
export { ReportAddComponent };
//# sourceMappingURL=report-add.component.js.map