import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { AddUserComponent } from './add-user.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from 'ClientApp/app/core/services/account.service';
import { ConfirmComponent } from 'ClientApp/app/shared/components/confirm/confirm.component';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {

    displayedColumns: string[] = ['picureURL', 'name', 'email', 'role', 'status', 'action'];
    dataSource: MatTableDataSource<any>;
    isWorking: boolean = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private toasterService: ToasterService,
        private accountService: AccountService,
        public dialog: MatDialog,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.spinner.show();
        this.getUsers();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getUsers() {
        this.accountService.getUsers().subscribe(data => {
            if (data.code == 100) {
                console.log(data);
                data.result.forEach(f => {
                    f.isActive = f.status === 1 ? true : false
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

    addUser(): void {
        let action: string = 'create';
        const dialogRef = this.dialog.open(AddUserComponent, {
            width: '700px',
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined)
                this.getUsers();
        });
    }

    updateUser(id): void {
        let action: string = 'update';
        const dialogRef = this.dialog.open(AddUserComponent, {
            width: '700px',
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined)
                this.getUsers();
        });
    }

    confirmDelete(id): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: '¿Esta seguro que desea eliminar el usuario id ' + id,
                action: 'Eliminar'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm)
                    this.deleteUser(id);
            }
        });
    }

    deleteUser(id) {
        this.spinner.show();
        this.accountService.deleteUser(id)
            .subscribe(data => {
                if (data.code == 100) {
                    this.getUsers();
                    setTimeout(() => {
                        this.toasterService.showToaster('Se ha eliminado el usuario correctamente.');
                    }, 300);
                } else {
                    this.spinner.hide();
                    setTimeout(() => {
                        this.toasterService.showToaster(data.message);
                    }, 300);
                }
            }, (err) => console.error('Failed! ' + err));
    }

    updateStatus(id, status) {
        this.spinner.show();
        let statusId = status ? 2 : 1;

        this.accountService.updateStatus({ id: id, status: statusId })
            .subscribe(data => {
                if (data.code == 100) {
                    this.getUsers();
                    setTimeout(() => {
                        this.toasterService.showToaster('Se ha cambiado el estatus del usuario correctamente.');
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
