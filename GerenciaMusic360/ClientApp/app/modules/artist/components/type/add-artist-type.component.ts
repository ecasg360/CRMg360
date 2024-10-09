import { Component, OnInit, Optional, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "@services/toaster.service";
import { IPersonType } from '@models/person-type';
import { ApiService } from '@services/api.service';
import { TranslateService } from "@ngx-translate/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
import { ResponseApi } from "@models/response-api";
import { EEndpoints } from '@enums/endpoints';
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'app-add-artist-type',
    templateUrl: './add-artist-type.component.html'
})

export class AddArtistTypeComponent implements OnInit {

    addArtistTypeForm: FormGroup;
    model: IPersonType;
    action: string;
    isWorking: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<AddArtistTypeComponent>,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toaster: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private translate: TranslateService,
        private translationLoaderService: FuseTranslationLoaderService,
    ) {
    }

    ngOnInit() {
        this.translationLoaderService.loadTranslationsList(allLang);
        this.model = this.actionData.model;
        this.action = (this.model.id)
            ? this.translate.instant('general.save')
            : this.translate.instant('general.save');

        this.addArtistTypeForm = this.formBuilder.group({
            id: [this.model.id, []],
            name: [this.model.name, [Validators.required]],
            entityId: [this.model.entityId, []],
            description: [this.model.description, []],
        });
    }
    get f() { return this.addArtistTypeForm.controls; }

    setArtistType() {
        this.model = <IPersonType>this.addArtistTypeForm.value;
        if (this.model.id)
            this._updateArtistTypeApi(this.model);
        else
            this._createArtistTypeApi(this.model);

    }

    onNoClick(status = undefined): void {
        this.dialogRef.close(status);
    }

    private _reponseError(error: HttpErrorResponse): void {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        console.error(error);
        this.isWorking = false;
    }

    //#region API

    private _createArtistTypeApi(params: IPersonType) {
        this.isWorking = true;
        delete params.id;
        this.apiService.save(EEndpoints.PersonType, params).subscribe(
            (response: ResponseApi<boolean>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.itemSaved'));
                    this.onNoClick(this.model);
                } else {
                    this.toaster.showToaster(this.translate.instant('messages.errorSavingItem'));
                    this.onNoClick();
                }
                this.isWorking = false;
            }, (err) => this._reponseError(err)
        );

    }

    private _updateArtistTypeApi(params: IPersonType) {
        this.isWorking = true;
        this.apiService.update(EEndpoints.PersonType, params).subscribe(
            (response: ResponseApi<boolean>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.itemUpdated'));
                    this.onNoClick(this.model);
                } else {
                    this.toaster.showToaster(this.translate.instant('messages.errorEditingItem'));
                    this.onNoClick();
                }
                this.isWorking = false;
            }, (err) => this._reponseError(err)
        );
    }

    //#endregion
}