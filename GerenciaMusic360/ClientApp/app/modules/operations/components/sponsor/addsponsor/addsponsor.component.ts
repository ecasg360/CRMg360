import { Component, OnInit, Optional, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToasterService } from "@services/toaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CutImageComponent } from "@shared/components/cut-image/cut-image.component";
import { CropImage } from "@models/crop-image.model";
import { SelectOption } from "@models/select-option.models";
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@enums/endpoints';

@Component({
  selector: "app-addsponsor",
  templateUrl: "./addsponsor.component.html"
})
export class AddsponsorComponent implements OnInit {
  addSponsorForm: FormGroup;
  cropImage: CropImage;
  croppedImage: any = "";
  id: number = 0;
  actionBtn: string = "create";
  actionLabel: string = "Add";
  contactssponsors: SelectOption[] = [];
  addviewcontactssponsors = true;
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddsponsorComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toasterService: ToasterService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.actionBtn = this.actionData.action;
    if (this.actionBtn === "update") {
      this.getSponsor(this.actionData.id);
      {
        this.actionLabel = "Editar";
      }
    }
    this.addSponsorForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", []],
      webSite: ["", []],
      officePhone: ["", []],
      idContactsSponsor: ["", [Validators.required]]
    });
    this.getContacsSponsors();
  }
  get f() {
    return this.addSponsorForm.controls;
  }

  setSponsor() {
    if (!this.addSponsorForm.invalid) {
      this.spinner.show();
      this.addSponsorForm.value.pictureUrl = this.croppedImage;
      this.apiService.save(EEndpoints.sponsor, this.addSponsorForm.value).subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick();
            setTimeout(() => {
              this.toasterService.showToaster(
                "Se agreg� un nuevo genero musical correctamente."
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
  updateSponsor(id) {
    if (!this.addSponsorForm.invalid) {
      this.spinner.show();
      this.addSponsorForm.value.id = id;
      this.apiService.update(EEndpoints.sponsor, this.addSponsorForm.value).subscribe(
        data => {
          if (data.code == 100) {
            this.onNoClick();
            setTimeout(() => {
              this.toasterService.showToaster(
                "Se edit� el genero musical correctamente."
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

  getSponsor(id) {
    this.apiService.get(EEndpoints.sponsor, { id: id }).subscribe(
      data => {
        if (data.code == 100) {
          Object.keys(this.addSponsorForm.controls).forEach(name => {
            if (this.addSponsorForm.controls[name]) {
              this.addSponsorForm.controls[name].patchValue(data.result[name]);
            }
          });
          this.id = data.result.id;
        } else {
          setTimeout(() => {
            this.toasterService.showToaster(data.message);
          }, 300);
        }
      },
      err => console.error("Failed! " + err)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
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
  removeImage() {
    this.croppedImage = "";
  }
  getContacsSponsors() {
    this.apiService.get(EEndpoints.contactssponsors).subscribe(
      data => {
        if (data.code == 100) {
          this.contactssponsors = data.result.map(s => ({
            value: s.id,
            viewValue: s.name
          }));
        }
      },
      err => console.error("Failed! " + err)
    );
  }

  addContactssponsor() {
    this.addviewcontactssponsors = !this.addviewcontactssponsors;
  }

  cancel() {
    if (this.addviewcontactssponsors) {
      this.addviewcontactssponsors = !this.addviewcontactssponsors;
    } else {
      this.onNoClick();
    }
  }
}
