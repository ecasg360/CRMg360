import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddMembersgroupComponent } from './addmembersgroup/addmembersgroup.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-membersgroup',
    templateUrl: './membersgroup.component.html',
})
export class MembersgroupComponent implements OnInit {

    displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email', 'mainactivity', 'birthdate', 'entrydate', 'edit', 'delete'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    perm: any = {};

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
        this.getMenbersgroups();
    }
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    getMenbersgroups() {
        this.apiService.get(EEndpoints.membersgroups).subscribe(data => {
            if (data.code == 100) {
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
        }, (err) => console.log('Failed' + err));
    }
    addUser(): void {
        let action: string = 'create';
        const dialogRef = this.dialog.open(AddMembersgroupComponent, {
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getMenbersgroups();
        });
    }
    updateUser(id): void {
        let action: string = 'update';
        const dialogRef = this.dialog.open(AddMembersgroupComponent, {
            width: '700px',
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getMenbersgroups();
        });
    }
    confirmDelete(id): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: '�Esta seguro que desea eliminar el usuario id ' + id,
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
        this.apiService.delete(EEndpoints.membersgroup, { id: id }).subscribe(data => {
            if (data.code == 100) {
                this.getMenbersgroups();
                setTimeout(() => {
                    this.toasterService.showToaster('Se ha eliminado el usuario correctamente.');
                }, 300);
            } else {
                setTimeout(() => {
                    this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, (err) => console.error('Failed! ' + err));
    }
    updateStatus(id, status) {
        this.spinner.show();
        let statusId = status ? 2 : 1;
        this.apiService.save(EEndpoints.membersgroup, { id: id, status: statusId }).subscribe(data => {
            if (data.code == 100) {
                this.getMenbersgroups();
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
