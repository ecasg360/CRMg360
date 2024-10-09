import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { AccountService } from '@services/account.service';
import { CutImageComponent } from '@shared/components/cut-image/cut-image.component';
import { CropImage } from '@models/crop-image.model';
import { SelectOption } from '@models/select-option.models';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';


@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html'
})

export class AddUserComponent implements OnInit {
    addUserForm: FormGroup;

    id: number = 0;
    actionBtn: string = 'create';
    actionLabel: string = 'Agregar';
    croppedImage: any = '';
    cropImage: CropImage;
    birthdate: any = '';
    roles: SelectOption[] = [];
    departments: SelectOption[] = [];
    fieldMaxLength: number = 50;
    fieldMinLength: number = 6;
    isWorking: boolean = false;

    openCutDialog(event: any): void {
        this.cropImage = { event: event, numberImage: 0, imageSRC: '' };
        const dialogRef = this.dialog.open(CutImageComponent, {
            width: '500px',
            data: this.cropImage
        });
        dialogRef.afterClosed().subscribe(result => {
            this.croppedImage = result.imageSRC;
        });
    }

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<AddUserComponent>,
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private apiService: ApiService,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    ) {

    }
    ngOnInit() {
        this.actionBtn = this.actionData.action;
        if (this.actionBtn === 'update') {
            this.actionLabel = 'Editar';
            this.addUserForm = this.formBuilder.group({
                name: ['', [
                    Validators.required
                ]],
                lastName: ['', [
                    Validators.required
                ]],
                secondLastName: ['', [
                ]],
                phoneOne: ['', []],
                birthdate: ['', [
                    Validators.required
                ]],
                roleId: ['', [
                    Validators.required
                ]],
                departmentId: ['', [
                    Validators.required
                ]],
                gender: ['', [
                    Validators.required
                ]],
                email: ['', [
                    Validators.required,
                    Validators.email
                ]]
            });
            this.getRoles();
            this.getDepartments();
            this.getUser(this.actionData.id);
        } else
            this.addUserForm = this.formBuilder.group({
                name: ['', [
                    Validators.required
                ]],
                lastName: ['', [
                    Validators.required
                ]],
                secondLastName: ['', [
                ]],
                phoneOne: ['', []],
                birthdate: ['', [
                    Validators.required
                ]],
                roleId: ['', [
                    Validators.required
                ]],
                departmentId: ['', [
                    Validators.required
                ]],
                gender: ['', [
                    Validators.required
                ]],
                email: ['', [
                    Validators.required,
                    Validators.email
                ]],
                password: ['', [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(50)
                ]],
                confirmPassword: ['', []],
            }, { validator: this.checkPasswords });

        this.getRoles();
        this.getDepartments();
    }
    get f() { return this.addUserForm.controls; }

    removeImage() {
        this.croppedImage = '';
    }

    fileChangeEvent(event: any): void {
        this.openCutDialog(event);
    }

    checkPasswords(group: FormGroup) {
        let pass = group.controls.password.value;
        let confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true }
    }

    setUser() {
        if (!this.addUserForm.invalid) {
            this.addUserForm.value.pictureUrl = this.croppedImage;
            this.accountService.setUser(this.addUserForm.value)
                .subscribe(data => {
                    if (data.code == 100) {
                        this.onNoClick(true);
                        setTimeout(() => {
                            this.toasterService.showToaster('Se agregó el usuario correctamente.');
                        }, 300);
                    } else {
                        setTimeout(() => {
                            this.toasterService.showToaster(data.message);
                        }, 300);
                    }
                }, (err) => console.error('Failed! ' + err));
        }
    }

    updateUser(id) {
        if (!this.addUserForm.invalid) {
            this.addUserForm.value.id = id;
            this.addUserForm.value.pictureUrl = this.croppedImage;
            this.accountService.updateUser(this.addUserForm.value)
                .subscribe(data => {
                    if (data.code == 100) {
                        this.onNoClick(true);
                        setTimeout(() => {
                            this.toasterService.showToaster('Se editó el usuario correctamente.');
                        }, 300);
                    } else {
                        setTimeout(() => {
                            this.toasterService.showToaster(data.message);
                        }, 300);
                    }
                }, (err) => console.error('Failed! ' + err));
        }
    }

    getUser(id) {
        this.accountService.getUser(id).subscribe(data => {
            if (data.code == 100) {
                Object.keys(this.addUserForm.controls).forEach(name => {
                    if (this.addUserForm.controls[name]) {
                        if (name === 'birthdate')
                            this.addUserForm.controls[name].patchValue(new Date(data.result.birthdate));
                        else
                            this.addUserForm.controls[name].patchValue(data.result[name]);
                    }
                });
                this.id = data.result.id;
                this.croppedImage = data.result.pictureUrl !== null ? '' + data.result.pictureUrl : '';
            } else {
                setTimeout(() => {
                    this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, (err) => console.error('Failed! ' + err));
    }

    getRoles() {
        this.apiService.get(EEndpoints.Roles)
            .subscribe(data => {
                if (data.code == 100) {
                    this.roles = data.result.map(s => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                }
            }, (err) => console.error('Failed! ' + err));
    }

    getDepartments() {
        this.apiService.get(EEndpoints.Departments)
            .subscribe(data => {
                if (data.code == 100) {
                    this.departments = data.result.map(s => ({
                        value: s.id,
                        viewValue: s.name
                    }));
                }
            }, (err) => console.error('Failed! ' + err));
    }

    onNoClick(status = undefined): void {
        this.dialogRef.close(status);
    }

    genders: SelectOption[] = [
        { value: 'F', viewValue: 'Femenino' },
        { value: 'M', viewValue: 'Masculino' }
    ];
}