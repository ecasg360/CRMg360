import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog
} from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmComponent } from "ClientApp/app/shared/components/confirm/confirm.component";
import { AddcontactssponsorComponent } from "./addcontactssponsor/addcontactssponsor.component";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-contactssponsor",
  templateUrl: "./contactssponsor.component.html"
})
export class ContactssponsorComponent implements OnInit {
  innerWidth: any;
  displayedColumns: string[] = [
    "id",
    "name",
    "email",
    "phone",
    "status",
    "edit",
    "delete"
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  perm:any = {};

  constructor(
    private toasterService: ToasterService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.perm = this.route.snapshot.data;
  }

  ngOnInit() {
    this.spinner.show();
    this.getContactssponsors();
    this.innerWidth = window.innerWidth;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getContactssponsors() {
    this.apiService.get(EEndpoints.contactssponsors).subscribe(
      data => {
        if (data.code == 100) {
          data.result.forEach(f => {
            f.isActive = f.statusRecordId === 1 ? true : false;
          });

          this.dataSource = new MatTableDataSource(data.result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinner.hide();
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

  addContactssponsor(): void {
    let action: string = "create";
    const dialogRef = this.dialog.open(AddcontactssponsorComponent, {
      width: innerWidth.toString() + "px",
      data: {
        action: action,
        id: 0
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) this.getContactssponsors();
    });
  }

  updateContactssponsor(id): void {
    let action: string = "update";
    const dialogRef = this.dialog.open(AddcontactssponsorComponent, {
      width: innerWidth.toString() + "px",
      data: {
        action: action,
        id: id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) this.getContactssponsors();
    });
  }

  confirmDelete(id): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: "400px",
      data: {
        text: "�Esta seguro que desea eliminar el compositor id " + id,
        action: '<i class="fas fa-trash fa-lg"></i> Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm) this.deleteContactssponsor(id);
      }
    });
  }

  deleteContactssponsor(id) {
    this.spinner.show();
    this.apiService.delete(EEndpoints.contactssponsor, {id:id}).subscribe(
      data => {
        if (data.code == 100) {
          this.getContactssponsors();
          setTimeout(() => {
            this.toasterService.showToaster(
              "Se ha eliminado el compositor correctamente."
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
