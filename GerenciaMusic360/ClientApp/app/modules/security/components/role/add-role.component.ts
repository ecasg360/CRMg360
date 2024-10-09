import { OnInit, Optional, Inject, Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';

@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html'
})

export class AddRoleComponent implements OnInit {

    addRoleForm: FormGroup;

    id: number = 0;
    actionBtn: string = 'create';
    actionLabel: string = 'Agregar';

    constructor(
        public dialogRef: MatDialogRef<AddRoleComponent>,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    ) {
    }

    ngOnInit() {
        this.actionBtn = this.actionData.action;
        if (this.actionBtn === 'update') {
            this.getRole(this.actionData.id); {
                this.actionLabel = 'Editar';
            }
        }
        this.addRoleForm = this.formBuilder.group({
            name: ['', [
                Validators.required
            ]],
            description: ['', []]
        });
    }
    get f() { return this.addRoleForm.controls; }

    setRole() {
        if (!this.addRoleForm.invalid) {
            this.apiService.save(EEndpoints.Role, this.addRoleForm.value).subscribe(
                data => {
                    if (data.code == 100) {
                        this.onNoClick(true);
                        setTimeout(() => {
                            this.toasterService.showToaster('Se agregó el rol correctamente.');
                        }, 300);
                    } else {
                        setTimeout(() => {
                            this.toasterService.showToaster(data.message);
                        }, 300);
                    }
                }, (err) => console.error('Failed! ' + err));
        }
    }

    updateRole(id) {
        if (!this.addRoleForm.invalid) {
            this.addRoleForm.value.id = id;
            this.apiService.update(EEndpoints.Role, this.addRoleForm.value).subscribe(
                data => {
                    if (data.code == 100) {
                        this.onNoClick(true);
                        setTimeout(() => {
                            this.toasterService.showToaster('Se editó el rol correctamente.');
                        }, 300);
                    } else {
                        setTimeout(() => {
                            this.toasterService.showToaster(data.message);
                        }, 300);
                    }
                }, (err) => console.error('Failed! ' + err));
        }
    }

    getRole(id) {
        this.apiService.get(EEndpoints.Role, { id: id }).subscribe(
            data => {
                if (data.code == 100) {
                    Object.keys(this.addRoleForm.controls).forEach(name => {
                        if (this.addRoleForm.controls[name]) {
                            this.addRoleForm.controls[name].patchValue(data.result[name]);
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

    onNoClick(status = undefined): void {
        this.dialogRef.close(status);
    }
}