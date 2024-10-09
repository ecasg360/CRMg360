import { Component, OnInit, Optional, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from "@services/toaster.service";
import { TranslateService } from "@ngx-translate/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { allLang } from "@i18n/allLang";
import { MusicalGenre } from "@shared/models/musical-genre";
import { ResponseApi } from '@models/response-api';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";


@Component({
    selector: 'app-add-musical-genre',
    templateUrl: './add-musical-genre.component.html',
})
export class AddMusicalGenreComponent implements OnInit {

    musicalGenreForm: FormGroup;
    musicalGenre: MusicalGenre = new MusicalGenre();
    id: number = 0;
    action: string;
    isWorking: boolean;
    musicalGenresList: MusicalGenre[] = [];

    constructor(
        public dialogRef: MatDialogRef<AddMusicalGenreComponent>,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) { }

    ngOnInit() {

        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.id = (this.actionData.id) ? this.actionData.id : 0;
        this.musicalGenresList = this.actionData.data;
        if (this.id == 0) {
            this.isWorking = false;
            this.action = this.translate.instant('general.save');
        } else {
            this.action = this.translate.instant('general.save');
            this.musicalGenre = this.musicalGenresList.find(f => f.id == this.id);
        }
        this.configureForm();
    }

    get f() { return this.musicalGenreForm.controls; }

    configureForm(): void {
        this.musicalGenreForm = this.formBuilder.group({
            name: [this.musicalGenre.name, [
                Validators.required
            ]],
            description: [this.musicalGenre.description, []]
        });
    }

    //#region api

    saveMusicalGenreApi() {
        this.apiService.save(EEndpoints.MusicalGenre, this.musicalGenreForm.value).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toasterService.showTranslate('messages.itemSaved');
                } else {
                    this.toasterService.showToaster(response.message);
                }
                this.onNoClick(true);
                this.isWorking = false;
            }, (err) => this.reponseError(err)
        );
    }

    updateMusicalGenreApi(id: number) {
        this.isWorking = true;
        this.musicalGenreForm.value.id = id;
        this.apiService.update(EEndpoints.MusicalGenre, this.musicalGenreForm.value).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.onNoClick(true);
                    this.toasterService.showTranslate('messages.itemUpdated');
                } else {
                    this.toasterService.showToaster(response.message);
                }
                this.isWorking = false;
            }, (err) => this.reponseError(err)
        );
    }

    //#endregion

    setMusicalGenre() {
        if (!this.musicalGenreForm.invalid) {
            const musicalGenre = <MusicalGenre>this.musicalGenreForm.value;

            if (this.id == 0) {
                const found = this.musicalGenresList.find(f => f.name == musicalGenre.name);
                if (found) {
                    this.toasterService.showToaster('no puede repetir el nombre');
                    return;
                }
                this.saveMusicalGenreApi();
            } else {
                const found = this.musicalGenresList.filter(f => f.name == musicalGenre.name);
                if (found.length > 1) {
                    this.toasterService.showToaster('no puede repetir el nombre');
                    return;
                }
                this.updateMusicalGenreApi(this.id);
            }
        }
    }

    onNoClick(status = undefined): void {
        this.dialogRef.close(status);
    }

    private reponseError(error: any): void {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        console.log(error);
        this.isWorking = false;
    }

}
