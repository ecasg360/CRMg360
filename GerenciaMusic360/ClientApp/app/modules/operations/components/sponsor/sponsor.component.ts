import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog
} from "@angular/material";
import { ToasterService } from "@services/toaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { AddsponsorComponent } from "./addsponsor/addsponsor.component";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-sponsor",
  templateUrl: "./sponsor.component.html"
})

export class SponsorComponent implements OnInit {
  displayedColumns: string[] = ["id", "name", "description", "edit", "delete"];
  dataSource: MatTableDataSource<any>;
  perm:any = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
    this.getSponsors();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getSponsors() {
    this.apiService.get(EEndpoints.sponsors).subscribe(
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

  addSponsor(): void {
    let action: string = "create";
    const dialogRef = this.dialog.open(AddsponsorComponent, {
      width: "800px",
      data: {
        action: action,
        id: 0
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getSponsors();
    });
  }

  updateSponsor(id): void {
    let action: string = "update";
    const dialogRef = this.dialog.open(AddsponsorComponent, {
      width: "700px",
      data: {
        action: action,
        id: id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getSponsors();
    });
  }

  confirmDelete(id): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: "400px",
      data: {
        text: "�Do you whant to delete this record" + id,
        action: '<i class="fas fa-trash fa-lg"></i> Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm) this.deleteArtistType(id);
      }
    });
  }

  deleteArtistType(id) {
    this.spinner.show();
    this.apiService.delete(EEndpoints.sponsor, { id: id }).subscribe(
      data => {
        if (data.code == 100) {
          this.getSponsors();
          setTimeout(() => {
            this.toasterService.showToaster("This record has been deleted.");
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
