import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { AddtripprefereceComponent } from './addtrippreferece/addtrippreferece.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-trippreference',
    templateUrl: './trippreference.component.html',
})
export class TrippreferenceComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'description', 'edit', 'delete'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    perm: any = {};

    constructor(private toasterService: ToasterService,
        private apiService: ApiService,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService
        ) {
            this.perm = this.route.snapshot.data;
        }

    ngOnInit() {
        this.spinner.show();
        this.getTripprefereces();
    }
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
            this.getTripprefereces();
        }
    }

    getTripprefereces() {
        this.apiService.get(EEndpoints.Trippreferences).subscribe(data => {
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

    addTrippreferece(): void {
        let action: string = 'create';
        const dialogRef = this.dialog.open(AddtripprefereceComponent, {
            width: '700px',
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getTripprefereces();
        });
    }

    updateTrippreferece(id): void {
        let action: string = 'update';
        const dialogRef = this.dialog.open(AddtripprefereceComponent, {
            width: '700px',
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getTripprefereces();
        });
    }

    confirmDelete(id): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                text: '¿Esta seguro que desea eliminar esta preferencia ' + id,
                action: '<i class="fas fa-trash fa-lg"></i> Eliminar'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm)
                    this.delete(id);
            }
        });
    }

    delete(id) {
        this.spinner.show();
        this.apiService.delete(EEndpoints.Trippreference, { id: id }).subscribe(
            data => {
                if (data.code == 100) {
                    this.getTripprefereces();
                    setTimeout(() => {
                        this.toasterService.showToaster('Se ha eliminado un tipo de preferencia.');
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
