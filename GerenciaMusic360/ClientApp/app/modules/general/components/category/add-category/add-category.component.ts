import { Component, OnInit, Optional, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from "@models/response-api";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ResponseSelect } from "@models/select-response";
import { SelectOption } from "@models/select-option.models";
import { ICategory } from "@models/category";


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  form: FormGroup;
  id: number = 0;
  action: string;
  isWorking: boolean = true;
  modules: SelectOption[] = [];
    projectTypes: SelectOption[] = [];
    croppedImage: any;

  constructor(
    public dialogRef: MatDialogRef<AddCategoryComponent>,
    private formBuilder: FormBuilder,
    private service: ApiService,
    public dialog: MatDialog,
    private toasterService: ToasterService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService, ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.id = this.actionData.id;
    this.configureForm();
    this.getModules();
    this.getProjectTypes();

    if (this.id == 0) {
      this.isWorking = false;
      this.action = this.translate.instant('general.save');
    } else {
      this.action = this.translate.instant('general.save');
      this.getCategory();
    }
  }

  getCategory() {
    this.isWorking = true;
    const params = [];
    params['id'] = this.id;
    this.service.get(EEndpoints.Category, params).subscribe(
      (data: ResponseApi<ICategory>) => {
        if (data.code == 100) {
            this.populateForm(data.result);
            this.croppedImage = data.result.pictureUrl;
        } else {
          this.toasterService.showToaster(data.message);
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
    )
  }

  getModules() {
    this.service.get(EEndpoints.Modules).subscribe(
      (data: ResponseApi<any>) => {
        if (data.code == 100) {
          this.modules = data.result.map((s: ResponseSelect) => ({
            value: s.id,
            viewValue: s.name
          }));
        }
        this.isWorking = false;
      }, (err) => this.responseError(err)
    )
  }

  getProjectTypes(): void {
    this.service.get(EEndpoints.ProjectTypes).subscribe(
      (data: ResponseApi<any>) => {
        if (data.code == 100) {
          this.projectTypes = data.result.map((s: ResponseSelect) => ({
            value: s.id,
            viewValue: s.name
          }));
        }
        this.isWorking = false;
      }, (err) => this.responseError(err));
  }

  get f() { return this.form.controls; }

  private configureForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [
        Validators.required
      ]],
      description: ['', [Validators.maxLength(250)]],
      pictureUrl: [''],
      moduleId: ['', [Validators.required]],
      projectTypeId: [''],
      key: ['']
    });
  }

  private populateForm(data: ICategory): void {
    Object.keys(this.form.controls).forEach(name => {
      if (this.form.controls[name]) {
        this.form.controls[name].patchValue(data[name]);
      }
    });
    this.id = data.id;
  }

  set(): void {
    if (this.form.valid) {
      if (this.f.moduleId.value !== 1) {
        this.f.projectTypeId.setValue('');
      }
        this.isWorking = true;
        const params = this.form.value;
        params.key = (params.key) ? params.key : 0;
        params.description = (params.description) ? params.description : '';
        params.projectTypeId = (params.projectTypeId) ? params.projectTypeId : 0;
      if (this.id == 0) {
        this.save(params);
      } else {
          this.update(params);
      }
    }
  }

  save(params: any): void {
    this.service.save(EEndpoints.Category, params)
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

  update(params): void {
    params.id = this.id;
    this.service.update(EEndpoints.Category, params)
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

  selectImage(image: any) {
    this.f.pictureUrl.setValue(image);
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

}
