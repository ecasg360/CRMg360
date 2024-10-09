import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MemberFormComponent } from '../member-form/member-form.component';
import { IMember } from '@models/member';
import { MatDialog } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ToasterService } from '@services/toaster.service';
import { ResponseApi } from '@models/response-api';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';

@Component({
    selector: 'app-member-manager',
    templateUrl: './member-manager.component.html',
    styleUrls: ['./member-manager.component.scss']
})

export class MemberManagerComponent implements OnInit, OnChanges, OnDestroy {

    @Output() emitMemberData = new EventEmitter<IMember[]>();
    @Input() personId: number;

    isWorking: boolean = false;
    isDataAvailable: boolean = true;
    membersList: IMember[] = [];
    uniqueId: any = (new Date()).getMilliseconds();
    @Output() selectImage: EventEmitter<any> = new EventEmitter();

    //#region Lifetime Cycle

    constructor(
        public dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private translate: TranslateService,
        private apiService: ApiService,
        private toaster: ToasterService,
    ) { }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const personId = changes.personId;
        if (personId.currentValue > 0) {
            this.triggerMembersQueue();
            if (!personId.firstChange) {
                this.getMembersApi();
            }
        }
    }

    ngOnDestroy(): void {
        this.emitMemberData.complete();
    }

    //#endregion

    //#region members API
    saveMembersApi(): void {
        if (this.membersList.length > 0) {
            const model = [];
            for (let index = 0; index < this.membersList.length; index++) {
                let element = this.membersList[index];
                this.saveMemberApi(element);
            }
            this.getMembersApi();
        }
    }

    saveMemberApi(member: IMember) {
        const instruments = member.musicalsInstruments;
        const memberAddresses = member.addressList;
        delete member.id;
        delete member.musicalsInstruments;
        delete member.addressList;
        member.personRelationId = this.personId;

        this.apiService.save(EEndpoints.ArtistMember, member).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.memberSaved'));
                    const member = response.result;
                    this.deletePersonMusicalInstrumentsApi(member.id, instruments);
                    this.saveAddressesApi(member.id, memberAddresses);
                    this.getMembersApi();
                } else {
                    this.toaster.showToaster(this.translate.instant('errors.memberSavedfailed'));
                    console.log(response.message);
                }
            }, err => this.responseError(err)
        )
    }

    getMembersApi() {
        this.apiService.get(EEndpoints.ArtistMembers, { personId: this.personId }).subscribe(
            (response: ResponseApi<IMember[]>) => {
                if (response.code == 100) {
                    this.membersList = response.result;
                } else {
                    console.log(response.message);
                }
            }, err => this.responseError(err)
        )
    }

    updateMemberApi(member: IMember) {
        if (member.pictureUrl) {
            const img = document.getElementById(member.id.toString()) as HTMLImageElement;
            if (img.src.indexOf('assets') >= 0) {
                this.convertToBase64Image(img);
                member.pictureUrl = img.src;
            }
        }
        const instruments = member.musicalsInstruments;
        delete member.musicalsInstruments;
        delete member.addressList;
        delete member.birthDate;
        member.personRelationId = this.personId;

        this.apiService.update(EEndpoints.ArtistMember, member).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.memberEdited'));
                    this.deletePersonMusicalInstrumentsApi(member.id, instruments);
                    this.getMembersApi();
                } else {
                    this.toaster.showToaster(this.translate.instant('errors.memberEditedFailed'));
                    console.log(response.message);
                }
            }, err => this.responseError(err)
        )
    }

    deleteMemberApi(id: number) {
        this.apiService.delete(EEndpoints.ArtistMember, { id: id }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.toaster.showToaster(this.translate.instant('messages.memberDeleted'));
                    this.getMembersApi();
                } else {
                    this.toaster.showToaster(this.translate.instant('errors.memberDeletedFailed'));
                    console.log(response.message);
                }
            }, err => this.responseError(err)
        )
    }

    //#endregion

    //#region musical instruments API
    savePersonMusicalInstrumentsApi(memberId: number, instruments: number[]) {
        if (instruments.length > 0) {
            const model = instruments.map(m => {
                return {
                    PersonId: memberId,
                    MusicalInstrumentId: m
                }
            });
            this.apiService.save(EEndpoints.PersonMusicalInstruments, model).subscribe(
                (response: ResponseApi<any>) => {
                    if (response.code == 100) {
                        this.toaster.showToaster(this.translate.instant('messages.musicalsInstrumentsSaved'));
                    } else {
                        this.toaster.showToaster(this.translate.instant('errors.musicalInstrumentSavedFailed'));
                        console.log(response.message);
                    }
                }, err => this.responseError(err)
            )
        }
    }

    deletePersonMusicalInstrumentsApi(memberId: number, instruments: number[]) {
        this.apiService.delete(EEndpoints.PersonMusicalInstruments, { personId: memberId }).subscribe(
            (response: ResponseApi<any>) => {
                this.savePersonMusicalInstrumentsApi(memberId, instruments);
            }, err => this.responseError(err)
        )
    }
    //#endregion

    //#region Address
    saveAddressesApi(memberId: number, addressList: any[]): void {
        if (memberId > 0 && addressList.length > 0) {
            const params = [];
            for (let index = 0; index < addressList.length; index++) {
                let element = addressList[index];
                delete element.id;
                delete element.country;
                delete element.state;
                delete element.city;
                delete element.addressType;
                element.personId = memberId;
                params.push(element);
            }
            this.apiService.save(EEndpoints.Addresses, params).subscribe(
                (response: ResponseApi<any>) => {
                    if (response.code == 100) {
                        this.toaster.showToaster(this.translate.instant('messages.addressesSaved'));
                    } else {
                        this.toaster.showToaster(this.translate.instant('errors.savedAddressesFailed'));
                        console.log(response.message);
                    }
                }, err => this.responseError(err)
            );
        }
    }
    //#endregion

    //#region general Methods
    triggerMembersQueue() {
        if (this.membersList.length > 0) {
            const found = this.membersList.filter(f => f.id < 0);
            if (found.length > 0) {
                this.saveMembersApi();
            }
        } else {
            this.getMembersApi();
        }
    }

    showModalForm(id: number = 0): void {
        this.isWorking = true;
        let member = <IMember>this.membersList.find(f => f.id == id);
        const dialogRef = this.dialog.open(MemberFormComponent, {
            width: '950px',
            data: {
                id: id,
                model: member
            }
        });
        dialogRef.afterClosed().subscribe((member: IMember) => {
            if (member !== undefined) {
                console.log(member);
                if (member.id == 0) {
                    member.id = (new Date()).getMilliseconds() * -1;
                }
                this.manageMembersEvent(member);
            }
        });
        this.isWorking = false;
    }

    manageMembersEvent(member: IMember) {
        if (member.id > 0) {
            this.updateMemberApi(member);
        } else {
            if (this.personId > 0) {
                this.saveMemberApi(member);
            } else {
                this.membersList = this.membersList.filter(f => f.id !== member.id);
                this.membersList.push(member);
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
                    this.deleteMemberEvent(id);
            }
        });
    }

    deleteMemberEvent(id: number) {
        if (id > 0) {
            this.deleteMemberApi(id);
        } else {
            this.membersList = this.membersList.filter(f => f.id !== id);
            this.getMembersApi();
        }
    }

    private responseError(err: any) {
        this.isWorking = false;
        console.log('http error', err);
    }

    convertToBase64Image(img: HTMLImageElement) {
        var canvas = document.createElement('canvas');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        var ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var base64String = canvas.toDataURL();
        img.src = base64String;
        if (base64String != 'data:,') {
            this.selectImage.emit(base64String);
        }
    }
    //#endregion
}
