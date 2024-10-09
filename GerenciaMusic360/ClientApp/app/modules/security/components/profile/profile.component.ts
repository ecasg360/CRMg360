import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { IConfigurationImage, IConfigurationImageCss } from '@shared/models/configurationImage';
import { AccountService } from '@services/account.service';
import { IUser } from '@shared/models/user';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ResponseApi } from '@models/response-api';
import { MatDialog } from '@angular/material';
import { ComponentsComunicationService } from '@services/components-comunication.service';
import { SelectOption } from '@models/select-option.models';
import { IConfigurationImageUser } from '@models/configurationImageUser';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    isWorking: boolean = false;

    profileForm: FormGroup;
    configurationImages: IConfigurationImageCss[] = [];
    currentUser: IUser;
    genders: SelectOption[];
    cssClass = "mat-elevation-z3";

    constructor(
        private service: ApiService,
        private accountService: AccountService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private toaster: ToasterService,
        private dialog: MatDialog,
        private componentComunication: ComponentsComunicationService,
    ) { }

    ngOnInit() {
        this.currentUser = this.accountService.getLocalUserProfile();
        this.genders = [
            { value: 'F', viewValue: 'general.female' },
            { value: 'M', viewValue: 'general.male' }
        ];
        this.initForm();
        this.getConfigurationImages();
    }

    initForm() {
        const birthdate = this.currentUser.birthdate
            ? (new Date(this.currentUser.birthdate)).toISOString()
            : null;

        this.profileForm = this.formBuilder.group({
            Id: [this.currentUser.id, [Validators.required]],
            pictureUrl: [this.currentUser.pictureUrl, []],
            name: [this.currentUser.name, [Validators.required]],
            lastName: [this.currentUser.lastName, [Validators.required]],
            secondLastName: [this.currentUser.secondLastName, []],
            phoneOne: [this.currentUser.phoneOne, []],
            birthdate: [birthdate, []],
            gender: [this.currentUser.gender, [Validators.required]],
        });
    }

    get f() { return this.profileForm.controls; }

    selectImage(item: IConfigurationImageCss) {
        this.configurationImages.forEach((value) => {
            value.cssClass = (value.id == item.id) ? this.cssClass : '';
        })
    }

    selectAvatarImage($event:any) {
        this.f.pictureUrl.patchValue($event);
    }

    saveDefaultImage() {
        const found = this.configurationImages.find(f => f.cssClass != '' && f.cssClass != undefined && f.cssClass != null);
        console.log(found);
        if (found) {
            const params = <IConfigurationImageUser>{
                configurationImageId: found.id,
                userId: this.currentUser.id
            }
            this.updateConfigurationImageUser(params);
            this.toaster.showTranslate('messages.itemSaved');
        }
    }

    confirmUpdateProfile(): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('general.informationsaved?'),
                action: this.translate.instant('general.save'),
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm)
                    this.updateProfile();
            }
        });
    }

    showBackgroundList() {
        this.getConfigurationImages();
    }

    private _responseError(error: any): void {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    }

    //#region API
    getConfigurationImages(): void {
        this.service.get(EEndpoints.ConfigurationImages).subscribe(
            (response: ResponseApi<IConfigurationImage[]>) => {
                if (response.code == 100) {
                    if (response.result && response.result.length > 0) {
                        this.configurationImages = <IConfigurationImageCss[]>response.result.map((m) => {
                            m.isDefault = false;
                            return m;
                        });
                        this.getConfigurationImageUser();
                    } else {
                        this.configurationImages = [];
                        this.accountService.clearDefaultImage();
                    }                                            
                }
            }, err => this._responseError(err));
    }

    getConfigurationImageUser(): void {
        const params = { userId: this.currentUser.id };
        this.service.get(EEndpoints.ConfigurationImagesByUser, params).subscribe(
            (response: ResponseApi<IConfigurationImage>) => {
                if (response.code == 100) {
                    const found = this.configurationImages.findIndex(f => f.id == response.result.id);
                    if (found >= 0 && this.configurationImages.length > 0) {
                        this.configurationImages[found].cssClass = this.cssClass;
                        this.configurationImages[found].isDefault = true;
                        this.accountService.setDefaultImage(this.configurationImages[found].pictureUrl);
                    }
                }
            }, err => this._responseError(err)
        );
    }

    updateConfigurationImageUser(params: IConfigurationImageUser): void {
        this.service.save(EEndpoints.ConfigurationImageUser, params).subscribe(
            (response: ResponseApi<boolean>) => {
                if (response.code !== 100)
                    this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
                else {
                    const found = this.configurationImages.find(f => f.cssClass != '' && f.cssClass != undefined && f.cssClass != null);
                    if (found) {
                        console.log(found);
                        this.accountService.setDefaultImage(found.pictureUrl);
                    }
                }
            }, err => this._responseError(err)
        );
    }

    deleteImage(id: number) {
        this.isWorking = true;
        this.service.delete(EEndpoints.ConfigurationImage, {id}).subscribe(
            (response: ResponseApi<boolean>) => {
                if (response.code !== 100)
                    this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
                else
                    this.getConfigurationImages();
                this.isWorking = false;
            }, err => this._responseError(err)
        );
    }

    updateProfile(): void {
        this.service.save(EEndpoints.UpdateProfile, this.profileForm.value).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.accountService.updateLocalStorage(response.result);
                    this.currentUser = this.accountService.getLocalUserProfile();
                    this.toaster.showToaster(this.translate.instant('general.informationsaved'));
                    this.componentComunication.sendProfileChangeNotification(true);
                }
                else
                    this.toaster.showToaster(response.message);
            }, err => this._responseError(err)
        );
    }
    //#endregion
}
