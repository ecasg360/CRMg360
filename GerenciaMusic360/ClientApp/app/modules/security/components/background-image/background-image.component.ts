import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';

@Component({
  selector: 'app-background-image',
  templateUrl: './background-image.component.html',
  styleUrls: ['./background-image.component.scss']
})
export class BackgroundImageComponent implements OnInit {

  imageForm: FormGroup;
  isWorking: boolean = false;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService,
  ) { }

  ngOnInit() {
    this.configureForm();
  }

  get f() { return this.imageForm.controls; }

  configureForm() {
    this.imageForm = this.formBuilder.group({
      id: [0],
      configurationId: [1],
      pictureUrl: ['', [Validators.required]],
      isDefault: [false],
      name: ['', [Validators.required]]
    });
  }

  selectImage($event): any {
    this.f.pictureUrl.patchValue($event);
  }

  private _responseError(error: any): void {
    this.toaster.showTranslate('general.errors.serverError');
    this.isWorking = false;
  }

  setImage() {
    this.isWorking = true;
    console.log(this.imageForm.value);
    this.apiService.save(EEndpoints.ConfigurationImage, this.imageForm.value).subscribe(
      (response: ResponseApi<boolean>) => {
        if (response.code == 100) {
          this.configureForm();
          this.toaster.showTranslate('messages.itemSaved');
        }
        this.isWorking = false;
      }, err => this._responseError(err)
    )
  }

}
