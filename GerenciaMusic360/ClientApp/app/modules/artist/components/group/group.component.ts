import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmComponent } from 'ClientApp/app/shared/components/confirm/confirm.component';
import { AddGroupComponent } from './addgroup/addgroup.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
})
export class GroupComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'description', 'edit', 'delete'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    perm: any = {};

    constructor(private toasterService: ToasterService,
        private apiService: ApiService,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private spinner: NgxSpinnerService
    ) {
        this.perm = this.route.snapshot.data;
     }

    ngOnInit() {
        this.spinner.show();
        this.getGroups();
    }
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
            this.getGroups();
        }
    }

    getGroups() {
        this.apiService.get(EEndpoints.groups).subscribe(data => {
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

    addGroup(): void {
        let action: string = 'create';
        const dialogRef = this.dialog.open(AddGroupComponent, {
            width: (innerWidth).toString() + 'px',
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getGroups();
        });
    }

    updateGroup(id): void {
        let action: string = 'update';
        const dialogRef = this.dialog.open(AddGroupComponent, {
            width: (innerWidth).toString() + 'px',
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getGroups();
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
        this.apiService.delete(EEndpoints.group, { id: id }).subscribe(data => {
            if (data.code == 100) {
                this.getGroups();
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
