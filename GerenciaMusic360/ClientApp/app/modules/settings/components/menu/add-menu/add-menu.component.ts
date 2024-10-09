import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ResponseApi } from '@shared/models/response-api';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { IMenu } from '@shared/models/menu';
import { EMenuType } from '@app/core/enums/MenuType';
import { ResponseSelect } from '@shared/models/select-response';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit {
  form: FormGroup;
  id: number = 0;
  titleAction: string;
  action: string;
  croppedImage: any = "";
  isWorking: boolean = true;
  parents: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddMenuComponent>,
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
    this.getMenuByType(EMenuType.collapsable);
    this.configureForm();
    if (this.id == 0) {
      this.isWorking = false;
      this.titleAction = this.translate.instant('settings.menu.saveTitle');
      this.action = this.translate.instant('general.save');
    } else {
      this.titleAction = this.translate.instant('settings.menu.editTitle');
      this.action = this.translate.instant('general.save');
      this.getMenu();
    }
  }
  get f() { return this.form.controls; }

  private configureForm(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      translate: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      url: ['', [Validators.required]],
      parentId: ['', [Validators.required]],
      menuOrder: ['', []],
      type: ['', [Validators.required]]
    });
  }

  private populateForm(data: IMenu): void {
    Object.keys(this.form.controls).forEach(name => {
      if (this.form.controls[name]) {
        this.form.controls[name].patchValue(data[name]);
      }
    });
    this.id = data.id;
  }

  getMenuByType(menuType: EMenuType): void {
    const params = [];
    params['type'] = menuType;
    this.service.get(EEndpoints.Menus)
      .subscribe((data) => {
          if (data.code == 100) {
            this.parents = data.result.map((s: any) => ({
              value: s.id,
              viewValue: s.title
            }));
          }
        }, (err) => this.reponseError(err)
      );
  }

  set(): void {
    if (!this.form.invalid) {
      this.isWorking = true;
      if (this.id == 0) {
        this.save();
      } else {
        this.update();
      }
    }
  }

  save(): void {
    this.form.value.id = this.f.title.value;
    this.service.save(EEndpoints.Menu, this.form.value)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick(true);
            this.toasterService.showToaster(this.translate.instant('settings.preferences.messages.saved'));
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.reponseError(err)
      );
  }

  update(): void {
    this.isWorking = true;
    if (!this.form.invalid) {
      this.form.value.id = this.id;
      this.service.update(EEndpoints.Menu, this.form.value)
        .subscribe(data => {
          if (data.code == 100) {
            this.onNoClick(true);
            this.toasterService.showToaster(this.translate.instant('settings.preferences.messages.saved'));
          } else {
            this.toasterService.showToaster(data.message);
          }
          this.isWorking = false;
        }, (err) => this.reponseError(err)
        )
    }
  }

  getMenu(): void {
    this.isWorking = true;
    const params = [];
    params['id'] = this.id;
    this.service.get(EEndpoints.Menu, params)
    .subscribe(
      (data: ResponseApi<IMenu>) => {
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
}
