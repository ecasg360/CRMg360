import { OnInit, Optional, Inject, Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { SelectOption } from "@models/select-option.models";
import { ResponseApi } from "@models/response-api";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from '@services/api.service';
import { EEndpoints } from "@enums/endpoints";

@Component({
    selector: 'app-add-role-notification',
    templateUrl: './add-role-notification.component.html'
})

export class AddRoleNotificationComponent implements OnInit {

    addRoleNotificationForm: FormGroup;
    notifications: SelectOption[] = [];
    role: string = '';

    constructor(
        private apiService: ApiService,
        public dialogRef: MatDialogRef<AddRoleNotificationComponent>,
        private formBuilder: FormBuilder,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.configureForm();
        this.getRoleNotification();
        this.role = this.actionData.role;
    }

    get f() { return this.addRoleNotificationForm.controls; }

    private configureForm(): void {
        this.addRoleNotificationForm = this.formBuilder.group({
            notificationIds: ['', [
                Validators.required
            ]]
        });
    }

    setRoleNotification() {
        let roleNotifications: any[] = [];
        let notifications = this.addRoleNotificationForm.value.notificationIds;
        notifications.forEach(item => {
            roleNotifications.push({
                notificationId: item,
                roleProfileId: this.actionData.id
            });
        });

        this.apiService.save(EEndpoints.RoleNotifications, roleNotifications).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.onNoClick(true);
                    this.toasterService.showToaster(this.translate.instant('settings.roleNotification.messages.saved'));
                } else {
                    //TODO: translate
                    this.toasterService.showToaster(response.message);
                }
            }, (err) => this.responseError(err)
        );
    }

    getRoleNotification() {
        this.apiService.get(EEndpoints.RoleNotification, { roleProfileId: this.actionData.id }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.getNotifications(response.result);
                } else {
                    //TODO: translate
                    this.toasterService.showToaster(response.message);
                }
            }, (err) => this.responseError(err)
        );
    }

    private getNotifications(roleNotifications) {
        this.apiService.get(EEndpoints.Notifications).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    response.result.forEach(item => {
                        let contains = roleNotifications.some(e => e.notificationId === item.id);
                        if (!contains)
                            this.notifications.push({
                                value: item.id,
                                viewValue: item.name
                            });
                    });

                } else {
                    //TODO: translate
                    this.toasterService.showToaster(response.message);
                }
            }, (err) => this.responseError(err)
        );
    }

    onNoClick(status = undefined): void {
        this.dialogRef.close(status);
    }

    private responseError(err: any) {
        console.log('http error', err);
    }
}