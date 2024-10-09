import { Component, OnInit, Optional, Inject } from "@angular/core";
import { CropImage } from "ClientApp/app/shared/models/crop-image.model";
import { SelectOption } from "ClientApp/app/shared/models/select-option.models";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CutImageComponent } from "ClientApp/app/shared/components/cut-image/cut-image.component";
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@enums/endpoints';

@Component({
  selector: "app-addcontactssponsor",
  templateUrl: "./addcontactssponsor.component.html"
})
export class AddcontactssponsorComponent implements OnInit {
  addContactssponsorForm: FormGroup;
  id: number = 0;

  actionBtn: string = "create";
  actionLabel: string = "Agregar";
  croppedImage: any = "";
  cropImage: CropImage;
  countries: SelectOption[] = [];
  states: SelectOption[] = [];
  cities: SelectOption[] = [];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddcontactssponsorComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toasterService: ToasterService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.addContactssponsorForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      secondLastName: ["", []],
      birthDateString: ["", []],
      gender: ["", [Validators.required]],
      email: ["", []],
      phoneOne: ["", []],
      phoneTwo: ["", []],
      biography: ["", []],
      countryId: ["", []],
      stateId: ["", []],
      cityId: ["", []],
      municipality: ["", []],
      neighborhood: ["", []],
      street: ["", []],
      exteriorNumber: ["", []],
      interiorNumber: ["", []],
      postalCode: ["", []],
      reference: ["", []]
    });

    this.getCountries();

    this.actionBtn = this.actionData.action;
    if (this.actionBtn === "update") {
      this.getContactssponsor(this.actionData.id);
      {
        this.actionLabel = "Editar";
      }
    }
  }

  get f() {
    return this.addContactssponsorForm.controls;
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

  removeImage() {
    this.croppedImage = "";
  }

  fileChangeEvent(event: any): void {
    this.openCutDialog(event);
  }

  setContactssponsor() {
    if (!this.addContactssponsorForm.invalid) {
      this.spinner.show();

      this.addContactssponsorForm.value.pictureUrl = this.croppedImage;
      this.apiService.save(EEndpoints.contactssponsor, this.addContactssponsorForm.value).subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick(true);
            setTimeout(() => {
              this.toasterService.showToaster(
                "The contact was added correctly."
              );
            }, 300);
          } else {
            this.spinner.hide();
            setTimeout(() => {
              this.toasterService.showToaster(data.message);
            }, 300);
          }
        },
        err => console.error("Failed! " + err)
      );
    }
  }

  updateContactssponsor(id) {
    if (!this.addContactssponsorForm.invalid) {
      this.spinner.show();
      this.addContactssponsorForm.value.pictureUrl = this.croppedImage;
      this.addContactssponsorForm.value.id = id;
      this.apiService.update(EEndpoints.contactssponsor, this.addContactssponsorForm.value).subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick(true);
            setTimeout(() => {
              this.toasterService.showToaster("This record has been updated.");
            }, 300);
          } else {
            this.spinner.hide();
            setTimeout(() => {
              this.toasterService.showToaster(data.message);
            }, 300);
          }
        },
        err => console.error("Failed! " + err)
      );
    }
  }

  getContactssponsor(id) {
    this.apiService.get(EEndpoints.contactssponsor, { id: id }).subscribe(
      data => {
        if (data.code == 100) {
          Object.keys(this.addContactssponsorForm.controls).forEach(name => {
            if (this.addContactssponsorForm.controls[name]) {
              if (name === "birthDateString")
                this.addContactssponsorForm.controls[name].patchValue(
                  new Date(data.result.birthDateString)
                );
              else
                this.addContactssponsorForm.controls[name].patchValue(
                  data.result[name]
                );
            }
          });

          this.id = data.result.id;
          this.croppedImage =
            data.result.pictureUrl !== null
              ? "data:image/jpg;base64," + data.result.pictureUrl
              : "";
          if (data.result.countryId !== null)
            this.getStates(data.result.countryId, data.result.stateId);
          if (data.result.stateId !== null)
            this.getCities(data.result.stateId, data.result.cityId);
        } else {
          setTimeout(() => {
            this.toasterService.showToaster(data.message);
          }, 300);
        }
      },
      err => console.error("Failed! " + err)
    );
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

  getCountries() {
    this.apiService.get(EEndpoints.Countries).subscribe(
      data => {
        if (data.code == 100) {
          this.countries = data.result.map(s => ({
            value: s.id,
            viewValue: s.name
          }));
          this.addContactssponsorForm.value.stateId = undefined;
          this.addContactssponsorForm.value.cityId = undefined;
        }
      },
      err => console.error("Failed! " + err)
    );
  }

  getStates(id, stateId = undefined) {
    this.apiService.get(EEndpoints.StatesByCountry, { StatesByCountry: id }).subscribe(
      data => {
        if (data.code == 100) {
          this.states = data.result.map(s => ({
            value: s.id,
            viewValue: s.name
          }));
          this.addContactssponsorForm.value.cityId = undefined;

          if (stateId !== undefined)
            this.addContactssponsorForm.controls["stateId"].patchValue(stateId);
        }
      },
      err => console.error("Failed! " + err)
    );
  }

  getCities(id, cityId = undefined) {
    this.apiService.get(EEndpoints.CitiesByState, { stateId: id }).subscribe(
      data => {
        if (data.code == 100) {
          this.cities = data.result.map(s => ({
            value: s.id,
            viewValue: s.name
          }));

          if (cityId !== undefined)
            this.addContactssponsorForm.controls["cityId"].patchValue(cityId);
        }
      },
      err => console.error("Failed! " + err)
    );
  }

  genders: SelectOption[] = [
    { value: "F", viewValue: "Femenino" },
    { value: "M", viewValue: "Masculino" }
  ];
  cancel() { }
}
