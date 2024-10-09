import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';

@Component({
    selector: 'app-addgroup',
    templateUrl: './addgroup.component.html',
})
export class AddGroupComponent implements OnInit {
    addGroupForm: FormGroup;

    id: number = 0;
    actionBtn: string = 'create';
    actionLabel: string = 'Agregar';
    constructor(
        public dialogRef: MatDialogRef<AddGroupComponent>,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.actionBtn = this.actionData.action;
        if (this.actionBtn === 'update') {
            this.getGroup(this.actionData.id); {
                this.actionLabel = 'Editar';
            }
        }
        this.addGroupForm = this.formBuilder.group({
            name: ['', [
                Validators.required
            ]],
            biography: ['', [

            ]],
            description: ['', []]
        });
    }
    get f() { return this.addGroupForm.controls; }

    setGroup() {
        if (!this.addGroupForm.invalid) {
            this.spinner.show();
            this.apiService.save(EEndpoints.group, this.addGroupForm.value)
                .subscribe(data => {
                    if (data.code == 100) {
                        this.onNoClick();
                        setTimeout(() => {
                            this.toasterService.showToaster('Se agreg� un nuevo genero musical correctamente.');
                        }, 300);
                    } else {
                        this.spinner.hide();
                        setTimeout(() => {
                            this.toasterService.showToaster(data.message);
                        }, 300);
                    }
                }, (err) => console.error('Failed! ' + err));
        }
    }

    updateGroup(id) {
        if (!this.addGroupForm.invalid) {
            this.spinner.show();
            this.addGroupForm.value.id = id;
            this.apiService.update(EEndpoints.group, this.addGroupForm.value)
                .subscribe(data => {
                    if (data.code == 100) {
                        this.onNoClick();
                        setTimeout(() => {
                            this.toasterService.showToaster('Se edit� el genero musical correctamente.');
                        }, 300);
                    } else {
                        this.spinner.hide();
                        setTimeout(() => {
                            this.toasterService.showToaster(data.message);
                        }, 300);
                    }
                }, (err) => console.error('Failed! ' + err));
        }
    }

    getGroup(id) {
        this.apiService.get(EEndpoints.group, { id: id }).subscribe(data => {
            if (data.code == 100) {
                Object.keys(this.addGroupForm.controls).forEach(name => {
                    if (this.addGroupForm.controls[name]) {
                        this.addGroupForm.controls[name].patchValue(data.result[name]);
                    }
                });
                this.id = data.result.id;
            } else {
                setTimeout(() => {
                    this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, (err) => console.error('Failed! ' + err));
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}