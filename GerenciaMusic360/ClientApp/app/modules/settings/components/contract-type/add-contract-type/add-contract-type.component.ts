import { Component, OnInit, Optional, Inject } from "@angular/core";
import { ApiService } from "@services/api.service";
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { EEndpoints } from "@app/core/enums/endpoints";
import { ResponseApi } from "@shared/models/response-api";
import { SelectOption } from "@shared/models/select-option.models";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatCheckboxChange } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { IContractType } from "@models/contractType";

@Component({
  selector: 'app-add-contract-type',
  templateUrl: './add-contract-type.component.html',
})
export class AddContractTypeComponent implements OnInit {
  id: number = 0;
  titleAction: string;
  action: string;  
  form: FormGroup;
  localCompanies: SelectOption[] = [];
  isWorking: boolean = true; 
  croppedImage: string;

  constructor(
    public dialogRef: MatDialogRef<AddContractTypeComponent>,
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this.titleAction = this.translate.instant('settings.time.title');
    this.id = this.actionData.id;
    this.configureForm();
    this.getLocalCompanies();
    if (this.id == 0) {
        this.isWorking = false;
        this.titleAction = this.translate.instant('settings.contractType.saveTitle');
        this.action = this.translate.instant('general.save');
    } else {
        this.titleAction = this.translate.instant('settings.contractType.editTitle');
        this.action = this.translate.instant('general.save');
        this.getContractType();
    }
  }

  get f() { return this.form.controls; }
  
  private configureForm(): void {
      this.form = this.formBuilder.group({
        name: ['', [
            Validators.required,
            Validators.maxLength(50),
        ]],
        localCompanyId: ['', [Validators.required]],
        pictureUrl: ['']
      });
  }

  getLocalCompanies() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.LocalCompanies).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.localCompanies = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  getContractType() {
    this.isWorking = true;
    const params = [];
    params['id'] = this.id;
    this.ApiService.get(EEndpoints.ContractType, {id: this.id}).subscribe(
        (data: ResponseApi<IContractType>) => {
            if (data.code == 100) {
                this.populateForm(data.result);
            } else {
                this.toasterService.showToaster(data.message);
            }
        this.isWorking = false;
        }, (err) => this.responseError(err)
    )
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
    this.ApiService.save(EEndpoints.ContractType, this.form.value)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick(true);
              this.toasterService.showToaster(this.translate.instant('messages.itemSaved'));
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
      );
  }

  update(): void {
      this.form.value.id = this.id;
      this.ApiService.update(EEndpoints.ContractType, this.form.value)
        .subscribe(data => {
          if (data.code == 100) {
            this.onNoClick(true);
              this.toasterService.showToaster(this.translate.instant('messages.itemUpdated'));
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.responseError(err)
        )
  }

  private populateForm(data: IContractType): void {
    Object.keys(this.form.controls).forEach(name => {
        if (this.form.controls[name]) {
            this.form.controls[name].patchValue(data[name]);
        }
    });
      this.id = data.id;
      this.croppedImage = data.pictureUrl;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  selectImage($event: any): void {
    this.croppedImage = $event;
    this.f.pictureUrl.setValue(this.croppedImage);
  }
}
