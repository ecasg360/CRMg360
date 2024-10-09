import { Component, OnInit, Optional, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from "@services/api.service";
import { IProjectType } from "@shared/models/project-type";
import { EEndpoints } from "@app/core/enums/endpoints";
import { ResponseApi } from "@shared/models/response-api";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ICountry } from "@shared/models/country";
import { ResponseSelect } from "@shared/models/select-response";
import { SelectOption } from "@shared/models/select-option.models";

@Component({
    selector: 'app-add-currency',
    templateUrl: './add-currency.component.html'
})
export class AddCurrencyComponent implements OnInit {
    form: FormGroup;
    id: number = 0;
    titleAction: string;
    action: string;  
    isWorking: boolean = true; 
    countries: SelectOption[] = [];

    constructor(
        public dialogRef: MatDialogRef<AddCurrencyComponent>,
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
        this.getCountries();
        if (this.id == 0) {
            this.isWorking = false;
            this.titleAction = this.translate.instant('settings.currency.saveTitle');
            this.action = this.translate.instant('general.save');
        } else {
            this.titleAction = this.translate.instant('settings.currency.editTitle');
            this.action = this.translate.instant('general.save');
            this.getCurrency();
        }
    }

    getCountries() {
      this.service.get(EEndpoints.Countries).subscribe(
        (response: ResponseApi<any>) => {
          if (response.code == 100) {
            this.countries = response.result.map((s: ResponseSelect) => ({
              value: s.id,
              viewValue: s.name
            }));
          }        
        }, (err) => this.reponseError(err)
      )
    }

    getCurrency() {
        this.isWorking = true;
        const params = [];
        params['id'] = this.id;
        this.service.get(EEndpoints.Currency, params).subscribe(
            (data: ResponseApi<IProjectType>) => {
                if (data.code == 100) {
                    this.populateForm(data.result);
                } else {
                    this.toasterService.showToaster(data.message);
                }
            this.isWorking = false;
            }, (err) => this.reponseError(err)
        )
    }

    get f() { return this.form.controls; }

    private configureForm(): void {
        this.form = this.formBuilder.group({
        code: ['', [
            Validators.required,
            Validators.maxLength(5),
            Validators.minLength(1),
        ]],
        description: ['', [
            Validators.maxLength(50)
        ]],
        countryId: ['', [Validators.required]]
        });
    }

    private populateForm(data: IProjectType): void {
        Object.keys(this.form.controls).forEach(name => {
            if (this.form.controls[name]) {
                this.form.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
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
        this.service.save(EEndpoints.Currency, this.form.value)
          .subscribe(
            data => {
              if (data.code == 100) {
                this.onNoClick(true);
                  this.toasterService.showToaster(this.translate.instant('messages.itemSaved'));
              } else {
                this.toasterService.showToaster(data.message);
              }
              this.isWorking = false;
            }, (err) => this.reponseError(err)
          );
    }
    
    update(): void {
        this.form.value.id = this.id;
        this.service.update(EEndpoints.Currency, this.form.value)
          .subscribe(data => {
            if (data.code == 100) {
              this.onNoClick(true);
                this.toasterService.showToaster(this.translate.instant('messages.itemUpdated'));
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