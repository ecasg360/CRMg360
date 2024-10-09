import { Component, OnInit, OnChanges, EventEmitter, Input, SimpleChanges } from "@angular/core";
import { ToasterService } from "@services/toaster.service";
import { allLang } from '@i18n/allLang';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ResponseApi } from "@models/response-api";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { IContact } from "@models/contact";
import { MatDialog, MatAutocompleteSelectedEvent } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { ProjectContactFormComponent } from './project-contact-form/project-contact-form.component';
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

@Component({
    selector: 'app-project-contact',
    templateUrl: './project-contact.component.html',
    styleUrls: ['./project-contact.component.scss']
})
export class ProjectContactComponent implements OnInit, OnChanges {
    @Input() projectId: number;
    @Input() listMode: boolean = false;
    @Input() perm:any = {};

    contactCtrl = new FormControl();
    isWorking: boolean = false;
    isDataAvailable: boolean = true;
    contactsList: IContact[] = [];
    projectContactsList: IContact[] = [];
    filteredOptions: Observable<IContact[]>;

    //#region Lifetime Cycle

    constructor(
        public dialog: MatDialog,
        private translationLoaderService: FuseTranslationLoaderService,
        private translate: TranslateService,
        private apiService: ApiService,
        private toaster: ToasterService,
    ) { }

    ngOnInit() {
        this.translationLoaderService.loadTranslations(...allLang);
        this.filteredOptions = this.contactCtrl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );
    }

    ngOnChanges(changes: SimpleChanges): void {
        const projectId = changes.projectId;
        if (projectId.currentValue != undefined && projectId.currentValue > 0) {
            this.getContactsApi();
            this.getProjectContactsApi();
        }
    }

    //#endregion

    //#region general Methods

    showModalForm(id: number = 0): void {
        this.isWorking = true;
        let contact = <IContact>this.contactsList.find(f => f.id == id);
        const dialogRef = this.dialog.open(ProjectContactFormComponent, {
            width: '950px',
            data: {
                id: id,
                model: contact,
                projectId: this.projectId
            }
        });
        dialogRef.afterClosed().subscribe((contact: IContact) => {
            if (contact !== undefined) {
                if (contact.id == 0) {
                    contact.id = (new Date()).getMilliseconds() * -1;
                }
                this.manageContactsEvent(contact);
            }
        });
        this.isWorking = false;
    }

    manageContactsEvent(contact: IContact) {
        if (contact.id > 0) {
            this.updateContactApi(contact);
        } else {
            if (this.projectId > 0) {
                this.saveContactApi(contact);
            } else {
                this.contactsList = this.contactsList.filter(f => f.id !== contact.id);
                this.contactsList.push(contact);
            }
        }
    }

    confirmDelete(id: number, name: string): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm)
                    this.deleteContactEvent(id);
            }
        });
    }

    deleteContactEvent(id: number) {
        if (id > 0) {
            this.deleteContactApi(id);
        } else {
            this.contactsList = this.contactsList.filter(f => f.id !== id);
        }
    }

    autoCompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
        this.contactCtrl.setValue('');
        const contactId = parseInt($event.option.id);
        const existUser = this.projectContactsList.find(f => f.id == contactId);
        if (!existUser) {
            const params = {
                personId: contactId,
                TypeId: 1,
                ProjectId: this.projectId
            };
            this.bindContactProjectApi(params);
        }
    }

    private _responseError(err: any) {
        this.isWorking = false;
        console.log('http error', err);
    }

    private _filter(value: string): IContact[] {
        const filterValue = value.toLowerCase();
        return this.contactsList.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    //#endregion

    //#region members API
    saveContactApi(contact: IContact) {
        this.isWorking = true;
        delete contact.id;
        contact.projectId = this.projectId;
        this.apiService.save(EEndpoints.ProjectContact, contact).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.contactSaved'));
                    this.getProjectContactsApi();
                    this.getContactsApi();
                } else
                    this.toaster.showToaster(this.translate.instant('errors.contactSavedfailed'));
                this.isWorking = false;
            }, err => this._responseError(err)
        )
    }

    bindContactProjectApi(params: any) {
        this.isWorking = true;
        this.apiService.save(EEndpoints.ProjectContactRelation, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.getProjectContactsApi();
                    this.getContactsApi();
                } else
                    this.toaster.showToaster('Error vinculando contacto');
                this.isWorking = false;
            }, (err) => this._responseError(err)
        );
    }

    getContactsApi() {
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectContacts).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100)
                    this.contactsList = response.result;
                this.isWorking = false;
            }, err => this._responseError(err)
        )
    }

    getProjectContactsApi(): void {
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectContactsByProject, { projectId: this.projectId }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100)
                    this.projectContactsList = response.result;
                else
                    this.toaster.showToaster('Error obteniendo contactos del proyecto');
                this.isWorking = false;
            }, err => this._responseError(err)
        )
    }

    updateContactApi(contact: IContact) {
        this.isWorking = true;
        delete contact.birthDate;
        contact.projectId = this.projectId;

        this.apiService.update(EEndpoints.ProjectContact, contact).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.contactEdited'));
                    this.getProjectContactsApi();
                } else
                    this.toaster.showToaster(this.translate.instant('errors.contactEditedFailed'));
                this.isWorking = false;
            }, err => this._responseError(err)
        )
    }

    deleteContactApi(id: number) {
        this.isWorking = true;
        const params = { projectId: this.projectId, personId: id };
        this.apiService.delete(EEndpoints.ProjectContactRelation, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.contactDeleted'));
                    this.getProjectContactsApi();
                } else
                    this.toaster.showToaster(this.translate.instant('errors.memberDeletedFailed'));
                this.isWorking = false;
            }, err => this._responseError(err)
        )
    }

    //#endregion

}
