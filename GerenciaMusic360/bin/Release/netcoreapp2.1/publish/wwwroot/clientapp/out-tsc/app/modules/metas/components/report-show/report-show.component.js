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
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { MatDialog } from '@angular/material';
import { MetasReplyComponent } from '../metas-reply/metas-reply.component';
var ReportShowComponent = /** @class */ (function () {
    function ReportShowComponent(accountService, spinner, toasterService, formBuilder, dialogRef, apiService, translate, actionData, dialog) {
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
        this.report = '';
        this.isWorking = false;
        this.theDate = new Date();
        this.reportsAdded = [];
    }
    ReportShowComponent.prototype.ngOnInit = function () {
        this.theDate = this.actionData.theDate ? this.actionData.theDate : new Date();
        this.model = this.actionData.model ? this.actionData.model : {};
        this.getUsers();
    };
    ReportShowComponent.prototype.getUsers = function () {
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
    ReportShowComponent.prototype.getReports = function (usrId) {
        var _this = this;
        var params = {
            userId: usrId,
            source: 'somos'
        };
        console.log(params);
        this.apiService.get(EEndpoints.ReportsByUser, params).subscribe(function (result) {
            //this.metasAdded = result.result;
            //result.result.forEach(element => {
            //  element.editing = false;
            //});
            _this.reportsAdded = result.result;
            console.log(_this.reportsAdded);
        });
    };
    ReportShowComponent.prototype.responseError = function (err) {
        console.log('http error', err);
        this.isWorking = false;
    };
    ReportShowComponent.prototype.formatDate = function (theDate) {
        theDate = theDate.getFullYear() + '-' + (theDate.getMonth() + 1) + '-' + theDate.getDate();
        return theDate;
    };
    /*
    
    
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
    
    
    
      */
    ReportShowComponent.prototype.reply = function (row) {
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
    ReportShowComponent = __decorate([
        Component({
            selector: 'app-report-show',
            templateUrl: './report-show.component.html',
            styleUrls: ['./report-show.component.css']
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
    ], ReportShowComponent);
    return ReportShowComponent;
}());
export { ReportShowComponent };
//# sourceMappingURL=report-show.component.js.map