import { OnInit, ViewChild, Component } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { AddRoleComponent } from "./add-role.component";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
})

export class RoleComponent implements OnInit {

    displayedColumns: string[] = [ 'name', 'status', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private toasterService: ToasterService,
        private apiService: ApiService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.getRoles();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getRoles() {
        this.apiService.get(EEndpoints.Roles).subscribe(data => {
            if (data.code == 100) {
                data.result.forEach(f => {
                    f.isActive = f.statusRecordId === 1 ? true : false
                });

                this.dataSource = new MatTableDataSource(data.result);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            } else {
                setTimeout(() => {
                    this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, (err) => console.error('Failed! ' + err));
    }

    addRole(): void {
        let action: string = 'create';
        const dialogRef = this.dialog.open(AddRoleComponent, {
            width: '700px',
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined)
                this.getRoles();
        });
    }

    updateRole(id): void {
        let action: string = 'update';
        const dialogRef = this.dialog.open(AddRoleComponent, {
            width: '700px',
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined)
                this.getRoles();
        });
    }

    confirmDelete(id): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: '¿Esta seguro que desea eliminar el rol id ' + id,
                action: 'Eliminar'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm)
                    this.deleteRole(id);
            }
        });
    }

    deleteRole(id) {
        this.apiService.delete(EEndpoints.Role, { id: id }).subscribe(
            data => {
                if (data.code == 100) {
                    this.getRoles();
                    setTimeout(() => {
                        this.toasterService.showToaster('Se ha eliminado el rol correctamente.');
                    }, 300);
                } else {
                    setTimeout(() => {
                        this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, (err) => console.error('Failed! ' + err));
    }

    updateStatus(id, status) {
        let statusId = status ? 2 : 1;

        this.apiService.update(EEndpoints.RoleStatus, { id: id, status: statusId })
            .subscribe(data => {
                if (data.code == 100) {
                    this.getRoles();
                    setTimeout(() => {
                        this.toasterService.showToaster('Se ha cambiado el estatus del rol correctamente.');
                    }, 300);
                } else {
                    setTimeout(() => {
                        this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, (err) => console.error('Failed! ' + err));
    }
}