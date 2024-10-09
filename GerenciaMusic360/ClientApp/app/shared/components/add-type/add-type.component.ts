import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ResponseApi } from '@models/response-api';
import { CatalogType } from '@models/catalog-Type';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { IType } from '@models/type';

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.scss']
})
export class AddTypeComponent implements OnInit {
  formType: FormGroup;
  id: number = 0;
  typeId: number = 0;
  titleAction: string;
  action: string;
  isWorking: boolean = true;
  name: string;

  constructor(
    public dialogRef: MatDialogRef<AddTypeComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toasterService: ToasterService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.id = this.actionData.id;
    this.typeId = this.actionData.typeId;
    this.name = (this.actionData.name) ? this.actionData.name : '';
    this.configureForm();
    if (this.id == 0) {
      this.isWorking = false;
      this.titleAction = this.translate.instant('settings.catalogTypes.saveTitle');
      this.action = this.translate.instant('general.save');
    } else {
      this.titleAction = this.translate.instant('settings.catalogTypes.editTitle');
      this.action = this.translate.instant('general.save');
      this.getMaintenanceType();
    }

  }
  get f() { return this.formType.controls; }

  private configureForm(): void {
    this.formType = this.formBuilder.group({
      name: [this.name, [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
      ]],
      description: ['', [
        Validators.maxLength(150)
      ]]
    });
  }

  private populateForm(data: CatalogType): void {
    Object.keys(this.formType.controls).forEach(name => {
      if (this.formType.controls[name]) {
        this.formType.controls[name].patchValue(data[name]);
      }
    });
    this.id = data.id;
  }

  set(): void {
    if (!this.formType.invalid) {
      this.isWorking = true;
      this.formType.value.typeId = this.typeId;
      if (this.id == 0) {
        this.save();
      } else {
        this.update();
      }
    }
  }

  save(): void {
    this.apiService.save(EEndpoints.Type, this.formType.value).subscribe(
      data => {
        if (data.code == 100) {
          console.log(data.result);
          this.onNoClick(data.result);
            this.toasterService.showToaster(this.translate.instant('messages.itemSaved'));
        } else {
          this.toasterService.showToaster(data.message);
          this.onNoClick();
        }
        this.isWorking = false;
      }, (err) => this.reponseError(err)
    );
  }

  update(): void {
    this.formType.value.id = this.id;
    this.apiService.update(EEndpoints.Type, this.formType.value).subscribe(data => {
      if (data.code == 100) {
        this.onNoClick(this.formType.value);
          this.toasterService.showToaster(this.translate.instant('messages.itemUpdated'));
      } else {
        this.toasterService.showToaster(data.message);
        this.onNoClick();
      }
      this.isWorking = false;
    }, (err) => this.reponseError(err)
    )
  }

  getMaintenanceType(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Type, { id: this.id, typeId: this.typeId }).subscribe(
      (data: ResponseApi<CatalogType>) => {
        if (data.code == 100 && data.result) {
          this.populateForm(data.result);
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.reponseError(err)
    )
  }

  onNoClick(status:IType = undefined): void {
    this.dialogRef.close(status);
  }

  private reponseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }
}
