import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ResponseApi } from '@shared/models/response-api';
import { MainActivity } from '@models/main-activity';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';

@Component({
  selector: 'app-add-preference',
  templateUrl: './add-preference.component.html',
  styleUrls: ['./add-preference.component.scss']
})
export class AddPreferenceComponent implements OnInit {

  formMainActivity: FormGroup;

  id: number = 0;
  typeId: number = 0;
  titleAction: string;
  action: string;
  croppedImage: any = "";
  isWorking: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<AddPreferenceComponent>,
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
    this.typeId = this.actionData.typeId;
    this.configureForm();
    if (this.id == 0) {
      this.isWorking = false;
      this.titleAction = this.translate.instant('settings.preferences.saveTitle');
      this.action = this.translate.instant('general.save');
    } else {
      this.titleAction = this.translate.instant('settings.preferences.editTitle');
      this.action = this.translate.instant('general.save');
      this.getMainActivity();
    }
  }
  get f() { return this.formMainActivity.controls; }

  private configureForm(): void {
    this.formMainActivity = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
      ]],
      description: ['', [
        Validators.maxLength(150)
      ]]
    });
  }

  private populateForm(data: MainActivity): void {
    Object.keys(this.formMainActivity.controls).forEach(name => {
      if (this.formMainActivity.controls[name]) {
        this.formMainActivity.controls[name].patchValue(data[name]);
      }
    });
    this.id = data.id;
    if(!data.pictureUrl) {
      this.croppedImage =
      data.pictureUrl !== null
        ? "data:image/jpg;base64," + data.pictureUrl
        : "";
    } else {
      this.croppedImage = data.pictureUrl;
    }
    
  }

  setMainActivity(): void {
    if (!this.formMainActivity.invalid) {
      this.isWorking = true;
      if (this.id == 0) {
        this.saveMainActivity();
      } else {
        this.updateMainActivity();
      }
    }
  }

  saveMainActivity(): void {
    this.formMainActivity.value.pictureUrl = this.croppedImage;
    this.formMainActivity.value.preferenceTypeId = this.typeId;
    this.service.save(EEndpoints.Preference, this.formMainActivity.value)
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

  updateMainActivity(): void {
    this.isWorking = true;
    if (!this.formMainActivity.invalid) {
      this.formMainActivity.value.id = this.id;
      this.formMainActivity.value.preferenceTypeId = this.typeId;
      this.formMainActivity.value.pictureUrl = this.croppedImage;
      this.service.update(EEndpoints.Preference, this.formMainActivity.value)
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
  }

  getMainActivity(): void {
    this.isWorking = true;
    const params = [];
    params['typeId'] = this.typeId;
    params['id'] = this.id;    
    this.service.get(EEndpoints.Preference, params)
    .subscribe(
      (data: ResponseApi<MainActivity>) => {
        if (data.code == 100) {
          this.populateForm(data.result);
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.reponseError(err)
    )
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

  private reponseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  selectImage($event: any): void {
    this.croppedImage = $event;
  }
}
