import { OnInit, Optional, Inject, Component, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { SelectOption } from "@models/select-option.models";
import { ResponseApi } from "@models/response-api";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@app/core/enums/endpoints";
import { ResponseSelect } from "@shared/models/select-response";
import { IPersonPreference } from "@shared/models/personPreference";
import { isNullOrUndefined } from "util";

@Component({
    selector: 'app-add-person-social-network',
    templateUrl: './add-person-social-network.component.html'
})

export class AddPersonSocialNetworkComponent implements OnInit {
    personsocialNetworkForm: FormGroup;
    id: number = 0;
    data: any;
    personId: number = 0;
    socialNetworkTypes: SelectOption[] = [];
    role: string = '';
    pictureUrl: string;

    constructor(
        private dialog: MatDialog,
        private service: ApiService,
        public dialogRef: MatDialogRef<AddPersonSocialNetworkComponent>,
        private formBuilder: FormBuilder,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private spinner: NgxSpinnerService,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
        
        this.data = this.actionData.data;
        this.personId = this.actionData.personId;
        this.pictureUrl = (this.data == null)? '' : this.data.pictureUrl;
        this.configureForm();
        this.getSocialNetworkTypes();
    }

    get f() { return this.personsocialNetworkForm.controls; }

    private configureForm(): void {
        if (isNullOrUndefined(this.data)) {
            this.personsocialNetworkForm = this.formBuilder.group({
                id: [0],
                personId: [this.personId],
                socialNetworkTypeId: ['', [
                    Validators.required
                ]],
                link: ['', [
                    Validators.required
                ]],
                pictureUrl: ['']
            });
            return;
        }
        this.personsocialNetworkForm = this.formBuilder.group({
            id: [this.data.id],
            personId: [this.personId],
            socialNetworkTypeId: [this.data.socialNetworkTypeId, [
                Validators.required
            ]],
            link: [this.data.link, [
                Validators.required
            ]],
            pictureUrl: [this.data.pictureUrl]
        });
    }

    getSocialNetworkTypes() {
        this.service.get(EEndpoints.SocialNetworkTypes)
          .subscribe((response: ResponseApi<any>) => {
            if (response.code == 100) {
              this.socialNetworkTypes = response.result.map((s: ResponseSelect) => ({
                value: s.id,
                viewValue: s.name
              }));
            }
          }, (err) => this.responseError(err));
    }

    selectImage(image: any): void {
        this.f.pictureUrl.setValue(image);
    }

    set() {
        if (this.personsocialNetworkForm.valid) {
            this.dialogRef.close(this.personsocialNetworkForm.value);
        }
    }

    onNoClick(status = undefined): void {
        this.dialogRef.close(status);
    }

    private responseError(err: any) {
        console.log('http error', err);
    }
}