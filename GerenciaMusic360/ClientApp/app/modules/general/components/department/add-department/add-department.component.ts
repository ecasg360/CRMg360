import { Component, OnInit, Optional, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@app/core/enums/endpoints";
import { ResponseApi } from "@shared/models/response-api";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ResponseSelect } from "@shared/models/select-response";
import { SelectOption } from "@shared/models/select-option.models";
import { IDepartment } from "@shared/models/department";

@Component({
    selector: 'app-add-department',
    templateUrl: './add-department.component.html'
})
export class AddDepartmentComponent implements OnInit {
    form: FormGroup;
    id: number = 0;
    titleAction: string;
    action: string;  
    isWorking: boolean = true; 

    constructor(
        public dialogRef: MatDialogRef<AddDepartmentComponent>,
        private formBuilder: FormBuilder,
        private service: ApiService,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) { }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.id = this.actionData.id;
        this.configureForm();
        if (this.id == 0) {
            this.isWorking = false;
            this.titleAction = this.translate.instant('settings.department.saveTitle');
            this.action = this.translate.instant('general.save');
        } else {
            this.titleAction = this.translate.instant('settings.department.editTitle');
            this.action = this.translate.instant('general.save');
            this.getDeparment();
        }
    }

    get f() { return this.form.controls; }

    private configureForm(): void {
        this.form = this.formBuilder.group({
        name: ['', [
            Validators.required,
            Validators.maxLength(5),
            Validators.minLength(1),
        ]],
        description: ['', [
            Validators.maxLength(50)
        ]]
        });
    }

    private populateForm(data: IDepartment): void {
        Object.keys(this.form.controls).forEach(name => {
            if (this.form.controls[name]) {
                this.form.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
    }

    getDeparment(): void {
      const params = [];
      params['id'] = this.id;
      this.service.get(EEndpoints.Department, params)
          .subscribe(
            data => {
              if (data.code == 100) {
                this.populateForm(data.result);
              }
              this.isWorking = false;
            }, (err) => this.reponseError(err)
          );
    }

    set(): void {
        if (this.form.valid) {
          this.isWorking = true;
          if (this.id == 0) {
            this.save();
          } else {
            this.update();
          }
        }
    }
    
    save(): void {
        this.service.save(EEndpoints.Department, this.form.value)
          .subscribe(
            data => {
              if (data.code == 100) {
                this.onNoClick(true);
                this.toasterService.showToaster(this.translate.instant('settings.department.messages.saved'));
              } else {
                this.toasterService.showToaster(data.message);
              }
              this.isWorking = false;
            }, (err) => this.reponseError(err)
          );
    }
    
    update(): void {
        this.form.value.id = this.id;
        this.service.update(EEndpoints.Department, this.form.value)
          .subscribe(data => {
            if (data.code == 100) {
              this.onNoClick(true);
              this.toasterService.showToaster(this.translate.instant('settings.department.messages.saved'));
            } else {
              this.toasterService.showToaster(data.message);
            }
            this.isWorking = false;
          }, (err) => this.reponseError(err)
          )
    }

    private reponseError(error: any): void {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    }

    onNoClick(status = undefined): void {
        this.dialogRef.close(status);
    }
}