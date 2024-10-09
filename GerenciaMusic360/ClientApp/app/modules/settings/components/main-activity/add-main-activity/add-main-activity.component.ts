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
import { EEndpoints } from '@enums/endpoints';

@Component({
  selector: 'app-add-main-activity',
  templateUrl: './add-main-activity.component.html',
  styleUrls: ['./add-main-activity.component.scss']
})
export class AddMainActivityComponent implements OnInit {

  formMainActivity: FormGroup;

  id: number = 0;
  titleAction: string;
  action: string;
  croppedImage: any = "";
  isWorking: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<AddMainActivityComponent>,
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
    this.configureForm();
    if (this.id == 0) {
      this.isWorking = false;
      this.titleAction = this.translate.instant('settings.mainActivity.saveTitle');
      this.action = this.translate.instant('general.save');
    } else {
        this.titleAction = this.translate.instant('settings.mainActivity.saveTitle');
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
    this.croppedImage =
      data.pictureUrl !== null
        ? "data:image/jpg;base64," + data.pictureUrl
        : "";
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
    this.apiService.save(EEndpoints.MainActivity, this.formMainActivity.value).subscribe(
      data => {
        if (data.code == 100) {
          this.onNoClick(true);
          this.toasterService.showToaster(this.translate.instant('settings.mainActivity.messages.saved'));
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
      this.formMainActivity.value.pictureUrl = this.croppedImage;
      this.apiService.update(EEndpoints.MainActivity, this.formMainActivity.value).subscribe(data => {
        if (data.code == 100) {
          this.onNoClick(true);
          this.toasterService.showToaster(this.translate.instant('settings.mainActivity.messages.saved'));
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
    this.apiService.get(EEndpoints.MainActivity, { id: this.id }).subscribe(
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
