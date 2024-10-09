import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrippreferenceComponent } from '../trippreference.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';

@Component({
    selector: 'app-addtrippreferece',
    templateUrl: './addtrippreferece.component.html',
})
export class AddtripprefereceComponent implements OnInit {
    addTrippreferenceForm: FormGroup;

    id: number = 0;
    actionBtn: string = 'create';
    actionLabel: string = 'Agregar';
    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<TrippreferenceComponent>,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.actionBtn = this.actionData.action;
        if (this.actionBtn === 'update') {
            this.getTrippreference(this.actionData.id); {
                this.actionLabel = 'Editar';
            }
        }
        this.addTrippreferenceForm = this.formBuilder.group({
            name: ['', [
                Validators.required
            ]],
            description: ['', []]
        });
    }
    get f() { return this.addTrippreferenceForm.controls; }

    setTrippreference() {
        if (!this.addTrippreferenceForm.invalid) {
            this.spinner.show();
            this.apiService.save(EEndpoints.Trippreference, this.addTrippreferenceForm.value).subscribe(
                data => {
                    if (data.code == 100) {
                        this.onNoClick();
                        setTimeout(() => {
                            this.toasterService.showToaster('Se agregó un nuevo genero musical correctamente.');
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

    updateTrippreference(id) {
        if (!this.addTrippreferenceForm.invalid) {
            this.spinner.show();
            this.addTrippreferenceForm.value.id = id;
            this.apiService.update(EEndpoints.Trippreference, this.addTrippreferenceForm.value).subscribe(
                data => {
                    if (data.code == 100) {
                        this.onNoClick();
                        setTimeout(() => {
                            this.toasterService.showToaster('<div [innerHTML]="theHtmlString">Se editó el genero musical correctamente.</div>');
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

    getTrippreference(id) {
        this.apiService.get(EEndpoints.Trippreference, { id: id }).subscribe(data => {
            if (data.code == 100) {
                Object.keys(this.addTrippreferenceForm.controls).forEach(name => {
                    if (this.addTrippreferenceForm.controls[name]) {
                        this.addTrippreferenceForm.controls[name].patchValue(data.result[name]);
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
