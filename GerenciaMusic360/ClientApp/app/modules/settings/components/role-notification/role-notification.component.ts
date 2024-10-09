import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { ToasterService } from "@services/toaster.service";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
import { ResponseApi } from "@models/response-api";
import { AddRoleNotificationComponent } from './add-role-notification/add-role-notification.component';
import { allLang } from "@i18n/allLang";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-role-notification',
    templateUrl: './role-notification.component.html',
    styleUrls: ['./role-notification.component.scss']
})
export class RoleNotificationComponent implements OnInit {

    displayedColumns: string[] = ['id', 'role', 'notifications', 'status', 'add'];
    dataSource: MatTableDataSource<any>;
    isWorking: boolean = true;
    roleNotifications: any[];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    perm: any ={};

    constructor(
        private apiService: ApiService,
        private translationLoaderService: FuseTranslationLoaderService,
        private translate: TranslateService,
        private toasterService: ToasterService,
        public dialog: MatDialog,
        private route: ActivatedRoute,
    ) {
        this.perm = this.route.snapshot.data;
    }

    ngOnInit() {
        this.getRoleNotifications();
        this.translationLoaderService.loadTranslations(...allLang);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getRoleNotifications() {
        this.apiService.get(EEndpoints.RoleNotifications).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.roleNotifications = response.result;
                    this.getRoles();
                } else {
                    //TODO: translate
                    this.toasterService.showToaster(response.message);
                }
                this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    getRoles() {
        this.isWorking = true;
        this.apiService.get(EEndpoints.Roles).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    let table = response.result.map(s => ({
                        id: s.id,
                        role: s.name,
                        notifications: this.roleNotifications.filter(w => w.roleProfileId == s.id),
                        status: s.statusRecordId == 1 ? true : false
                    }));

                    this.dataSource = new MatTableDataSource(table);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                } else {
                    //TODO: translate
                    this.toasterService.showToaster(response.message);
                }
                this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    addRoleNotification(id: number = 0, role: string): void {
        const dialogRef = this.dialog.open(AddRoleNotificationComponent, {
            width: '500px',
            data: {
                id: id,
                role: role
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.getRoleNotifications();
            }
        });
    }

    updateStatus(roleId: number, status: boolean) {
        let modelStatus = {
            id: roleId,
            status: status == true ? 1 : 2
        }
        this.apiService.save(EEndpoints.RoleNotificationStatus, modelStatus).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toasterService.showToaster(this.translate.instant('settings.roleNotification.messages.modified'));
                } else {
                    //TODO: translate
                    this.toasterService.showToaster(response.message);
                }
                this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    deleteNotification(roleId: number, id: number) {
        this.apiService.delete(EEndpoints.RoleNotification, { roleProfileId: roleId, id: id }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.getRoleNotifications();
                    this.toasterService.showToaster(this.translate.instant('settings.roleNotification.messages.deleted'));
                } else {
                    //TODO: translate
                    this.toasterService.showToaster(response.message);
                }
                this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    private responseError(err: any) {
        this.isWorking = false;
        console.log('http error', err);
    }
}