import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { AddPermissionComponent } from './add-permission/add-permission.component';

@Component({
    selector: 'app-permission',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.css']
})

export class PermissionComponent implements OnInit {

    displayedColumns: string[] = ['modulo', 'description', 'controller', 'actions', 'action'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isWorking: boolean = true;
    constructor(
        private toasterService: ToasterService,
        private apiService: ApiService,
        public dialog: MatDialog,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.spinner.show();
        this.getPermissions();

    }
    getPermissions(): any {
        this.apiService.get(EEndpoints.Permissions).subscribe(response => {
            this.dataSource = new MatTableDataSource(response.result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.isWorking = false;
        }, erro => {
            console.log(erro);
        });

    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    showModalForm(permission: any): void {
        const modal = this.dialog.open(AddPermissionComponent, {
            width: "600px",
            data: permission
        });
        modal.afterClosed().subscribe(res => {
            this.getPermissions();
        });
    }

}
