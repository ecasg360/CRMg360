var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MemberFormComponent } from '../member-form/member-form.component';
import { MatDialog } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var MemberManagerComponent = /** @class */ (function () {
    //#region Lifetime Cycle
    function MemberManagerComponent(dialog, _fuseTranslationLoaderService, translate, apiService, toaster) {
        this.dialog = dialog;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.translate = translate;
        this.apiService = apiService;
        this.toaster = toaster;
        this.emitMemberData = new EventEmitter();
        this.isWorking = false;
        this.isDataAvailable = true;
        this.membersList = [];
        this.uniqueId = (new Date()).getMilliseconds();
        this.selectImage = new EventEmitter();
    }
    MemberManagerComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    };
    MemberManagerComponent.prototype.ngOnChanges = function (changes) {
        var personId = changes.personId;
        if (personId.currentValue > 0) {
            this.triggerMembersQueue();
            if (!personId.firstChange) {
                this.getMembersApi();
            }
        }
    };
    MemberManagerComponent.prototype.ngOnDestroy = function () {
        this.emitMemberData.complete();
    };
    //#endregion
    //#region members API
    MemberManagerComponent.prototype.saveMembersApi = function () {
        if (this.membersList.length > 0) {
            var model = [];
            for (var index = 0; index < this.membersList.length; index++) {
                var element = this.membersList[index];
                this.saveMemberApi(element);
            }
            this.getMembersApi();
        }
    };
    MemberManagerComponent.prototype.saveMemberApi = function (member) {
        var _this = this;
        var instruments = member.musicalsInstruments;
        var memberAddresses = member.addressList;
        delete member.id;
        delete member.musicalsInstruments;
        delete member.addressList;
        member.personRelationId = this.personId;
        this.apiService.save(EEndpoints.ArtistMember, member).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.memberSaved'));
                var member_1 = response.result;
                _this.deletePersonMusicalInstrumentsApi(member_1.id, instruments);
                _this.saveAddressesApi(member_1.id, memberAddresses);
                _this.getMembersApi();
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.memberSavedfailed'));
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    MemberManagerComponent.prototype.getMembersApi = function () {
        var _this = this;
        this.apiService.get(EEndpoints.ArtistMembers, { personId: this.personId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.membersList = response.result;
            }
            else {
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    MemberManagerComponent.prototype.updateMemberApi = function (member) {
        var _this = this;
        if (member.pictureUrl) {
            var img = document.getElementById(member.id.toString());
            if (img.src.indexOf('assets') >= 0) {
                this.convertToBase64Image(img);
                member.pictureUrl = img.src;
            }
        }
        var instruments = member.musicalsInstruments;
        delete member.musicalsInstruments;
        delete member.addressList;
        delete member.birthDate;
        member.personRelationId = this.personId;
        this.apiService.update(EEndpoints.ArtistMember, member).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.memberEdited'));
                _this.deletePersonMusicalInstrumentsApi(member.id, instruments);
                _this.getMembersApi();
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.memberEditedFailed'));
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    MemberManagerComponent.prototype.deleteMemberApi = function (id) {
        var _this = this;
        this.apiService.delete(EEndpoints.ArtistMember, { id: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.memberDeleted'));
                _this.getMembersApi();
            }
            else {
                _this.toaster.showToaster(_this.translate.instant('errors.memberDeletedFailed'));
                console.log(response.message);
            }
        }, function (err) { return _this.responseError(err); });
    };
    //#endregion
    //#region musical instruments API
    MemberManagerComponent.prototype.savePersonMusicalInstrumentsApi = function (memberId, instruments) {
        var _this = this;
        if (instruments.length > 0) {
            var model = instruments.map(function (m) {
                return {
                    PersonId: memberId,
                    MusicalInstrumentId: m
                };
            });
            this.apiService.save(EEndpoints.PersonMusicalInstruments, model).subscribe(function (response) {
                if (response.code == 100) {
                    _this.toaster.showToaster(_this.translate.instant('messages.musicalsInstrumentsSaved'));
                }
                else {
                    _this.toaster.showToaster(_this.translate.instant('errors.musicalInstrumentSavedFailed'));
                    console.log(response.message);
                }
            }, function (err) { return _this.responseError(err); });
        }
    };
    MemberManagerComponent.prototype.deletePersonMusicalInstrumentsApi = function (memberId, instruments) {
        var _this = this;
        this.apiService.delete(EEndpoints.PersonMusicalInstruments, { personId: memberId }).subscribe(function (response) {
            _this.savePersonMusicalInstrumentsApi(memberId, instruments);
        }, function (err) { return _this.responseError(err); });
    };
    //#endregion
    //#region Address
    MemberManagerComponent.prototype.saveAddressesApi = function (memberId, addressList) {
        var _this = this;
        if (memberId > 0 && addressList.length > 0) {
            var params = [];
            for (var index = 0; index < addressList.length; index++) {
                var element = addressList[index];
                delete element.id;
                delete element.country;
                delete element.state;
                delete element.city;
                delete element.addressType;
                element.personId = memberId;
                params.push(element);
            }
            this.apiService.save(EEndpoints.Addresses, params).subscribe(function (response) {
                if (response.code == 100) {
                    _this.toaster.showToaster(_this.translate.instant('messages.addressesSaved'));
                }
                else {
                    _this.toaster.showToaster(_this.translate.instant('errors.savedAddressesFailed'));
                    console.log(response.message);
                }
            }, function (err) { return _this.responseError(err); });
        }
    };
    //#endregion
    //#region general Methods
    MemberManagerComponent.prototype.triggerMembersQueue = function () {
        if (this.membersList.length > 0) {
            var found = this.membersList.filter(function (f) { return f.id < 0; });
            if (found.length > 0) {
                this.saveMembersApi();
            }
        }
        else {
            this.getMembersApi();
        }
    };
    MemberManagerComponent.prototype.showModalForm = function (id) {
        var _this = this;
        if (id === void 0) { id = 0; }
        this.isWorking = true;
        var member = this.membersList.find(function (f) { return f.id == id; });
        var dialogRef = this.dialog.open(MemberFormComponent, {
            width: '950px',
            data: {
                id: id,
                model: member
            }
        });
        dialogRef.afterClosed().subscribe(function (member) {
            if (member !== undefined) {
                console.log(member);
                if (member.id == 0) {
                    member.id = (new Date()).getMilliseconds() * -1;
                }
                _this.manageMembersEvent(member);
            }
        });
        this.isWorking = false;
    };
    MemberManagerComponent.prototype.manageMembersEvent = function (member) {
        if (member.id > 0) {
            this.updateMemberApi(member);
        }
        else {
            if (this.personId > 0) {
                this.saveMemberApi(member);
            }
            else {
                this.membersList = this.membersList.filter(function (f) { return f.id !== member.id; });
                this.membersList.push(member);
            }
        }
    };
    MemberManagerComponent.prototype.confirmDelete = function (id, name) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteMemberEvent(id);
            }
        });
    };
    MemberManagerComponent.prototype.deleteMemberEvent = function (id) {
        if (id > 0) {
            this.deleteMemberApi(id);
        }
        else {
            this.membersList = this.membersList.filter(function (f) { return f.id !== id; });
            this.getMembersApi();
        }
    };
    MemberManagerComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log('http error', err);
    };
    MemberManagerComponent.prototype.convertToBase64Image = function (img) {
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
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MemberManagerComponent.prototype, "emitMemberData", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], MemberManagerComponent.prototype, "personId", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MemberManagerComponent.prototype, "selectImage", void 0);
    MemberManagerComponent = __decorate([
        Component({
            selector: 'app-member-manager',
            templateUrl: './member-manager.component.html',
            styleUrls: ['./member-manager.component.scss']
        }),
        __metadata("design:paramtypes", [MatDialog,
            FuseTranslationLoaderService,
            TranslateService,
            ApiService,
            ToasterService])
    ], MemberManagerComponent);
    return MemberManagerComponent;
}());
export { MemberManagerComponent };
//# sourceMappingURL=member-manager.component.js.map