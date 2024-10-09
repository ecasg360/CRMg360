import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@enums/endpoints';

@Component({
    selector: 'app-add-permission',
    templateUrl: './add-permission.component.html',
    styleUrls: ['./add-permission.component.css']
})
export class AddPermissionComponent implements OnInit {
    form: FormGroup;
    isWorking: boolean;
    _permission: any;
    id: number;
    constructor(
        public dialogRef: MatDialogRef<AddPermissionComponent>,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) { }

    ngOnInit() {
        this._permission = this.actionData;
        this.configureForm();
    }
    configureForm(): void {
        this.form = this.formBuilder.group(
            {
                id: ['', []],
                controllerName: ['', []],
                actionName: ['', []],
                name: [this._permission.name, []],
                description: [this._permission.description, []],
            }
        )
    }
    get f() { return this.form.controls; }

    set(): void {
        this._permission['name'] = this.form.value.name;
        this.form.controls['controllerName'].patchValue(this._permission.controllerName);
        this.form.controls["actionName"].patchValue(this._permission.actionName);
        this.form.controls["id"].patchValue(this._permission.id);
        if (!this.form.invalid) {
            this.save(this.form.value);
        }
    }
    save(permission:any):void {
        this.apiService.update(EEndpoints.Permission, permission).subscribe(response => {
            if (response.code = "100") {
                this.dialogRef.close(status);
            }
        }, erro => {
            console.log(erro);
        });
    }
    onNoClick(status = undefined): void {
        this.dialogRef.close(status);
    }
}
