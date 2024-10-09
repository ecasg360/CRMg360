import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { AddPromoterComponent } from "./add-promoter.component";
import { ConfirmComponent } from "ClientApp/app/shared/components/confirm/confirm.component";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-promoter',
    templateUrl: './promoter.component.html',
})
export class PromoterComponent implements OnInit {

    innerWidth: any;
    displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'status', 'edit', 'delete'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    perm:any = {};

    constructor(
        private toasterService: ToasterService,
        public dialog: MatDialog,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService
    ) {
        this.perm = this.route.snapshot.data;
    }

    ngOnInit() {
        this.spinner.show();
        this.getPromoters();
        this.innerWidth = window.innerWidth;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getPromoters() {
        this.apiService.get(EEndpoints.Promoters).subscribe(data => {
            if (data.code == 100) {
                data.result.forEach(f => {
                    f.isActive = f.statusRecordId === 1 ? true : false
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
        }, (err) => console.error('Failed! ' + err));
    }

    addPromoter(): void {
        let action: string = 'create';
        const dialogRef = this.dialog.open(AddPromoterComponent, {
            width: (innerWidth).toString() + 'px',
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined)
                this.getPromoters();
        });
    }

    updatePromoter(id): void {
        let action: string = 'update';
        const dialogRef = this.dialog.open(AddPromoterComponent, {
            width: (innerWidth).toString() + 'px',
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined)
                this.getPromoters();
        });
    }

    confirmDelete(id): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: '¿Esta seguro que desea eliminar el promotor id ' + id,
                action: '<i class="fas fa-trash fa-lg"></i> Eliminar'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm)
                    this.deletePromoter(id);
            }
        });
    }

    deletePromoter(id) {
        this.apiService.delete(EEndpoints.Promoter, { id: id }).subscribe(data => {
            if (data.code == 100) {
                this.getPromoters();
                setTimeout(() => {
                    this.toasterService.showToaster('Se ha eliminado el promotor correctamente.');
                }, 300);
            } else {
                this.toasterService.showToaster(data.message);
            }
        }, (err) => console.error('Failed! ' + err));
    }

    updateStatus(id, status) {
        this.spinner.show();
        let statusId = status ? 2 : 1;

        this.apiService.save(EEndpoints.PromoterStatus, { id: id, status: statusId }).subscribe(data => {
            if (data.code == 100) {
                this.getPromoters();
                setTimeout(() => {
                    this.toasterService.showToaster('Se ha cambiado el estatus del promotor correctamente.');
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