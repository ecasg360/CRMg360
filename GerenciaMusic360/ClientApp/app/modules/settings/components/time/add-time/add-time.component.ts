import { Component, OnInit, Optional, Inject } from "@angular/core";
import { ApiService } from "@services/api.service";
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from "@models/response-api";
import { SelectOption } from "@models/select-option.models";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatCheckboxChange } from '@angular/material';
import { ITime } from "@models/time";
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { IModule } from "@models/module";

@Component({
  selector: 'app-add-time',
  templateUrl: './add-time.component.html'
})
export class AddTimeComponent implements OnInit {
  id: number = 0;
  titleAction: string;
  action: string;
  form: FormGroup;
  timeTypes: SelectOption[] = [];
  modules: SelectOption[] = [];
  isWorking: boolean = true;
  isRange: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddTimeComponent>,
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
    this.getTimeTypes();
    this.getModules();
    if (this.id == 0) {
      this.isWorking = false;
      this.titleAction = this.translate.instant('settings.time.saveTitle');
      this.action = this.translate.instant('general.save');
    } else {
      this.titleAction = this.translate.instant('settings.time.editTitle');
      this.action = this.translate.instant('general.save');
      this.getTime();
    }
  }

  private configureForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(30),
      ]],
      timeTypeId: ['', [Validators.required]],
      withRange: [false, []],
      initialValue: ['', [Validators.required]],
      finalValue: ['', []],
      moduleId: ['', [Validators.required]],
    });
  }

  getTimeTypes() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.Types, { typeId: 10 }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.timeTypes = response.result.map(m => {
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

  getTime() {
    this.isWorking = true;
    const params = [];
    params['id'] = this.id;
    this.ApiService.get(EEndpoints.Time, { id: this.id }).subscribe(
      (data: ResponseApi<ITime>) => {
        if (data.code == 100) {
          this.populateForm(data.result);
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
    )
  }

  getModules() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.Modules).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.modules = response.result.map(m => {
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
        const params = this.form.value;
        params.finalValue = (params.finalValue) ? params.finalValue : 0;
        this.ApiService.save(EEndpoints.Time, params)
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
      const params = this.form.value;
      params.finalValue = (params.finalValue) ? params.finalValue : 0;
    this.ApiService.update(EEndpoints.Time, params)
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

  private populateForm(data: ITime): void {
    Object.keys(this.form.controls).forEach(name => {
      if (this.form.controls[name]) {
        this.form.controls[name].patchValue(data[name]);
      }
    });
    this.isRange = data.withRange == 1 ? true : false;
    this.id = data.id;
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  showInputRange(event: MatCheckboxChange) {
    this.isRange = event.checked;
    if (event.checked) {
      this.form.controls.finalValue.setValue('');
      this.form.controls.finalValue.setValidators(Validators.required);
    } else {
      this.form.controls.finalValue.setValue(this.form.controls.initialValue.value);
      this.form.controls.finalValue.setValidators(Validators.nullValidator);
    }
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

}
