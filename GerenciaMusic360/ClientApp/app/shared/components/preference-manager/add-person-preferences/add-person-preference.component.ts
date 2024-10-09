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
import { IPersonPreferenceEnt } from "@shared/models/personPreferenceEnt";

@Component({
    selector: 'app-add-person-preference',
    templateUrl: './add-person-preference.component.html'
})

export class AddRPersonPreferenceComponent implements OnInit {
    addPreferenceSubtypeForm: FormGroup;
    id: number = 0;
    data: IPersonPreference;
    personId: number = 0;
    name: string;
    preferencesTypes: SelectOption[] = [];
    role: string = '';

    constructor(
        private dialog: MatDialog,
        private service: ApiService,
        public dialogRef: MatDialogRef<AddRPersonPreferenceComponent>,
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
        this.getPreferenceSubTypes();
        this.configureForm();
    }

    get f() { return this.addPreferenceSubtypeForm.controls; }

    private configureForm(): void {
        this.addPreferenceSubtypeForm = this.formBuilder.group({
            subTypeId: ['', [
                Validators.required
            ]]
        });
    }

    getPreferenceSubTypes() {
        const params = [];
        params['typeId'] = this.data.preferenceTypeId;
        this.service.get(EEndpoints.PreferencesByType, params)
            .subscribe((response: ResponseApi<any>) => {
                if (response.code == 100) {
                    if (this.personId) {
                        const p = [];
                        response.result.forEach((x) => {
                            const i = this.data.preferences.findIndex((s) => s.preferenceId === x.id);
                            if (i === -1) {
                                p.push(x);
                            }
                        });
                        this.preferencesTypes = p.map((s: ResponseSelect) => ({
                            value: s.id,
                            viewValue: s.name
                        }));
                    } else {
                        this.preferencesTypes = response.result.map((s: ResponseSelect) => ({
                            value: s.id,
                            viewValue: s.name
                        }));
                    }
                }
        }, (err) => this.responseError(err));
    }

    setPersonPreference() {
        if (this.addPreferenceSubtypeForm.valid) {
            const form = this.addPreferenceSubtypeForm.value;
            const values: IPersonPreferenceEnt[] = [];
            form.subTypeId.forEach((x) => {
                const name = this.preferencesTypes.find(v => v.value == x);
                values.push({
                    id: 0,
                    preferenceId: x,
                    personId: this.personId,
                    name: name.viewValue
                })
            });
            this.dialogRef.close(values);
        }
    }

    onNoClick(status = undefined): void {
        this.dialogRef.close(status);
    }

    private responseError(err: any) {
        console.log('http error', err);
    }
}