import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CropImage } from '@models/crop-image.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { MusicalInstrument } from '@models/MusicalInstrument';
import { ResponseApi } from '@models/Response-api';
import { CutImageComponent } from '@shared/components/cut-image/cut-image.component';
import { AddArtistTypeComponent } from '../../type/add-artist-type.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';

@Component({
    selector: 'app-add-musical-instrument',
    templateUrl: './add-musical-instrument.component.html',
    styleUrls: ['./add-musical-instrument.component.scss']
})
export class AddMusicalInstrumentComponent implements OnInit {

    formMusicalInstrument: FormGroup;

    id: number = 0;
    titleAction: string;
    action: string;
    croppedImage: any = "";
    cropImage: CropImage;
    isWorking: boolean = true;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<AddArtistTypeComponent>,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
    }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.id = this.actionData.id;
        this.configureForm();
        if (this.id == 0) {
            this.isWorking = false;
            this.titleAction = this.translate.instant('settings.formMusicalInstrument.saveTitle');
            this.action = this.translate.instant('general.save');
        } else {
            this.titleAction = this.translate.instant('settings.formMusicalInstrument.editTitle');
            this.action = this.translate.instant('general.save');
            this.getAll();
        }

    }
    get f() { return this.formMusicalInstrument.controls; }

    private configureForm() {
        this.formMusicalInstrument = this.formBuilder.group({
            name: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.minLength(3),
            ]],
        });
    }

    private populateForm(data: MusicalInstrument) {

        Object.keys(this.formMusicalInstrument.controls).forEach(name => {
            if (this.formMusicalInstrument.controls[name]) {
                this.formMusicalInstrument.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
        this.croppedImage =
            data.pictureUrl !== null
                ? "" + data.pictureUrl
                : "";
    }

    set(): void {
        if (!this.formMusicalInstrument.invalid) {
            this.isWorking = true;
            if (this.id == 0) {
                this.save();
            } else {
                this.update();
            }
        }
    }

    save(): void {
        this.formMusicalInstrument.value.pictureUrl = this.croppedImage;
        this.apiService.save(EEndpoints.MusicalInstrument, this.formMusicalInstrument.value).subscribe(
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

    update() {
        this.isWorking = true;
        if (!this.formMusicalInstrument.invalid) {
            this.formMusicalInstrument.value.id = this.id;
            this.formMusicalInstrument.value.pictureUrl = this.croppedImage;
            this.apiService.update(EEndpoints.MusicalInstrument, this.formMusicalInstrument.value)
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

    getAll() {
        this.isWorking = true;
        this.apiService.get(EEndpoints.MusicalInstrument, { id: this.id }).subscribe(
            (data: ResponseApi<MusicalInstrument>) => {
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

    private reponseError(error: any) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    }

    removeImage() {
        this.croppedImage = "";
    }

    uploadIconClick(evt) {
        document.getElementById('filetoupload').click();
    }

    fileChangeEvent(event: any): void {
        this.openCutDialog(event);
    }

    openCutDialog(event: any): void {
        this.cropImage = { event: event, numberImage: 0, imageSRC: "" };
        const dialogRef = this.dialog.open(CutImageComponent, {
            width: "500px",
            data: this.cropImage
        });
        dialogRef.afterClosed().subscribe(result => {
            this.croppedImage = result.imageSRC;
        });
    }
}
