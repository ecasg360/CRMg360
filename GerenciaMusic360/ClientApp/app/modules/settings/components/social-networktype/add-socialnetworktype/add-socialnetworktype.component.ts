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
import { SocialNetworkType } from '@models/socialNetworkType';
@Component({
    selector: 'app-add-socialnetworktype',
    templateUrl: './add-socialnetworktype.component.html',
    styleUrls: ['./add-socialnetworktype.component.css']
})
export class AddSocialnetworktypeComponent implements OnInit {

    formSocialNetworkType: FormGroup;
    titleAction: string;
    action: string;
    croppedImage: any = "";
    isWorking: boolean = false;
    model: SocialNetworkType = <SocialNetworkType>{};

    constructor(
        public dialogRef: MatDialogRef<AddSocialnetworktypeComponent>,
        private formBuilder: FormBuilder,
        private service: ApiService,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) { }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.model = <SocialNetworkType>this.actionData.model;
        this.configureForm();
        if (!this.model.id) {
            this.titleAction = this.translate.instant('settings.preferences.saveTitle');
            this.action = this.translate.instant('general.save');
        } else {
            this.titleAction = this.translate.instant('settings.preferences.editTitle');
            this.action = this.translate.instant('general.save');
        }
    }
    get f() { return this.formSocialNetworkType.controls; }

    private configureForm(): void {
        this.formSocialNetworkType = this.formBuilder.group({
            id: [this.model.id, []],
            name: [this.model.name, [
                Validators.required,
                Validators.maxLength(50),
                Validators.minLength(3),
            ]],
            description: [this.model.description, [Validators.maxLength(150)]],
        });
        this.croppedImage = this.model.pictureUrl;
    }


    setSocialNetworkType(): void {
        if (!this.formSocialNetworkType.invalid) {
            this.isWorking = true;
            this.model = <SocialNetworkType>this.formSocialNetworkType.value;
            this.model.pictureUrl = this.croppedImage;
            if (!this.model.id) {
                delete this.model.id;
                this.saveSocialNetworkType();
            } else
                this.updateSocialNetworkType();
        }
    }

    saveSocialNetworkType(): void {
        this.service.save(EEndpoints.SocialNetworkType, this.model).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.onNoClick(true);
                    this.toasterService.showTranslate('messages.itemSaved');
                } else
                    this.toasterService.showTranslate('errors.errorSavingItem');
                this.isWorking = false;
            }, err => this.reponseError(err)
        );
    }

    updateSocialNetworkType(): void {
        this.service.update(EEndpoints.SocialNetworkType, this.model).subscribe(
            (data:ResponseApi<any>) => {
                if (data.code == 100) {
                    this.onNoClick(true);
                    this.toasterService.showTranslate('messages.itemUpdated');
                } else {
                    this.toasterService.showTranslate('errors.errorEditingItem');
                }
                this.isWorking = false;
            }, err => this.reponseError(err)
        );
    }

    onNoClick(status = undefined): void {
        this.dialogRef.close(status);
    }

    private reponseError(error: any): void {
        this.toasterService.showTranslate('general.errors.serverError');
        this.isWorking = false;
    }

    selectImage($event: any): void {
        this.croppedImage = $event;
    }
}
