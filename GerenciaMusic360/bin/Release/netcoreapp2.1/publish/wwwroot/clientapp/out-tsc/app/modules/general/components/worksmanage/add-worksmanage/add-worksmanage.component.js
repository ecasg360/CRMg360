var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Optional, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@enums/endpoints';
import { allLang } from "@i18n/allLang";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
import { ECategoriesModules } from "@enums/categories-modules";
import { AddComposerComponent } from "@shared/components/project-work/add-composer/add-composer.component";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { AddPublisherComponent } from "../add-publisher/add-publisher.component";
var AddWorksmanageComponent = /** @class */ (function () {
    function AddWorksmanageComponent(dialog, dialogRef, formBuilder, ApiService, toasterService, actionData, _fuseTranslationLoaderService, translate) {
        this.dialog = dialog;
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.actionData = actionData;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.translate = translate;
        this.isWorking = false;
        this.modelWork = {};
        this.albums = [];
        this.musicalGenres = [];
        this.status = [];
        this.composers = [];
        this.selectedComposers = [];
        this.selectedPublisher = [];
        this.percentagePending = 100;
        this.onlyView = false;
    }
    AddWorksmanageComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.modelWork = this.actionData.model;
        this.getStatus();
        this.configureForm();
        console.log('this.actionData: ', this.actionData);
        if (this.actionData.onlyView) {
            this.onlyView = true;
        }
    };
    AddWorksmanageComponent.prototype.configureForm = function () {
        if (this.modelWork.id > 0) {
            var percentageSum_1 = 0;
            this.selectedComposers = this.modelWork.workCollaborator;
            this.selectedPublisher = this.modelWork.workPublisher;
            this.selectedComposers.forEach(function (x) {
                return percentageSum_1 = percentageSum_1 + x.percentageRevenue;
            });
            this.percentagePending = this.percentagePending - percentageSum_1;
        }
        this.form = this.formBuilder.group({
            id: [this.modelWork.id, []],
            name: [this.modelWork.name, [Validators.required]],
            description: [this.modelWork.description, []],
            albumId: [this.modelWork.albumId, []],
            musicalGenreId: [this.modelWork.musicalGenreId, []],
            amountRevenue: [this.modelWork.amountRevenue, []],
            rating: [this.modelWork.rating || 0, []],
            pictureUrl: [this.modelWork.pictureUrl, []],
            registeredWork: [this.modelWork.registeredWork || false, []],
            registerNum: [this.modelWork.registerNum, []],
            certifiedWork: [this.modelWork.certifiedWork || false, []],
            licenseNum: [this.modelWork.licenseNum, []],
            statusId: [this.modelWork.statusId || 1],
            isExternal: [this.modelWork.isExternal || false],
            songId: [this.modelWork.songId],
            aka: [this.modelWork.aka],
            adminPercentage: [this.modelWork.adminPercentage],
            musicCopyrightDate: [this.modelWork.musicCopyrightDate],
            copyrightNum: [this.modelWork.copyrightNum],
            coedition: [this.modelWork.coedition],
            territoryControlled: [this.modelWork.territoryControlled],
            agreementDate: [this.modelWork.agreementDate],
            ldvRelease: [this.modelWork.ldvRelease]
        });
    };
    Object.defineProperty(AddWorksmanageComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddWorksmanageComponent.prototype.save = function () {
        if (this.form.valid) {
            this.isWorking = true;
            var model_1 = this.form.value;
            model_1.workPublisher = this.selectedPublisher.map(function (m) {
                return {
                    amountRevenue: m.amountRevenue,
                    associationId: m.associationId,
                    id: 0,
                    percentageRevenue: m.percentageRevenue,
                    publisherId: m.publisherId,
                    workId: model_1.id | 0
                };
            });
            model_1.workCollaborator = this.selectedComposers.map(function (m) {
                console.log('The m of workCollaborator: ', m);
                return {
                    id: 0,
                    workId: model_1.id | 0,
                    composerId: m.composerId,
                    amountRevenue: m.amountRevenue,
                    percentageRevenue: m.percentageRevenue,
                    isCollaborator: false,
                    associationId: m.associationId
                };
            });
            console.log("Composers, publishers: ", this.selectedComposers, this.selectedPublisher);
            if (model_1.id == 0 || model_1.id == null) {
                delete model_1.id;
                this.saveWork(model_1);
            }
            else {
                this.updateWork(model_1);
            }
        }
    };
    //#region API
    AddWorksmanageComponent.prototype.saveWork = function (model) {
        var _this = this;
        this.ApiService.save(EEndpoints.Work, model).subscribe(function (data) {
            if (data.code == 100) {
                _this.toasterService.showTranslate('work.messages.saved');
                _this.onNoClick(true);
            }
            else
                _this.toasterService.showTranslate('errors.errorSavingItem');
        }, function (err) { return _this.responseError(err); });
    };
    AddWorksmanageComponent.prototype.updateWork = function (model) {
        var _this = this;
        console.log('model to update: ', model);
        this.ApiService.update(EEndpoints.Work, model).subscribe(function (data) {
            if (data.code == 100) {
                _this.toasterService.showTranslate('messages.itemUpdated');
                _this.onNoClick(true);
            }
            else
                _this.toasterService.showTranslate('errors.errorEditingItem');
        }, function (err) { return _this.responseError(err); });
    };
    AddWorksmanageComponent.prototype.getAlbums = function () {
        var _this = this;
        this.isWorking = true;
        this.ApiService.get(EEndpoints.Albums).subscribe(function (response) {
            if (response.code == 100) {
                _this.albums = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddWorksmanageComponent.prototype.getStatus = function () {
        var _this = this;
        this.isWorking = true;
        var params = { moduleId: ECategoriesModules.Work };
        this.ApiService.get(EEndpoints.StatusByModule, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.status = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    //#endregion
    AddWorksmanageComponent.prototype.showComposer = function (composer, isEdit) {
        var _this = this;
        if (composer === void 0) { composer = {}; }
        if (isEdit === void 0) { isEdit = false; }
        this.isWorking = true;
        var component = AddComposerComponent;
        var dialogRef = this.dialog.open(component, {
            width: '1000px',
            data: {
                isAddComposer: true,
                isEditComposer: isEdit,
                idComposerEdit: composer.composerId,
                workCollaborator: composer,
                itemName: this.translate.instant('general.compositions'),
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result != undefined) {
                if (_this.selectedComposers.findIndex(function (f) { return f.composerId == result.composer.id; }) < 0) {
                    _this.selectedComposers.push(result);
                }
            }
        });
        this.isWorking = false;
    };
    AddWorksmanageComponent.prototype.showPublisher = function () {
        var _this = this;
        this.isWorking = true;
        var dialogRef = this.dialog.open(AddPublisherComponent, {
            width: '1000px',
            data: {
                itemName: this.translate.instant('general.compositions'),
                percentagePending: this.percentagePending,
                workPublisher: {}
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result != undefined) {
                if (_this.selectedPublisher.findIndex(function (f) { return f.publisherId == result.publisherId; }) < 0) {
                    _this.selectedPublisher.push(result);
                }
            }
        });
        this.isWorking = false;
    };
    AddWorksmanageComponent.prototype.confirmDeleteComposer = function (composer) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: 'Composer' }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteComposer(composer);
            }
        });
    };
    AddWorksmanageComponent.prototype.confirmDeletePublisher = function (publisher) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: 'Publisher' }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_2 = result.confirm;
                if (confirm_2) {
                    _this.selectedPublisher = _this.selectedPublisher.filter(function (x) { return x.publisherId != publisher.publisherId; });
                }
            }
        });
    };
    AddWorksmanageComponent.prototype.deleteComposer = function (composer) {
        this.selectedComposers = this.selectedComposers.filter(function (x) { return x.composerId !== composer.composerId; });
        this.percentagePending = this.percentagePending + composer.percentageRevenue;
    };
    AddWorksmanageComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = undefined; }
        this.dialogRef.close(status);
    };
    AddWorksmanageComponent.prototype.responseError = function (error) {
        this.toasterService.showTranslate('general.errors.serverError');
        this.isWorking = false;
    };
    AddWorksmanageComponent = __decorate([
        Component({
            selector: 'app-add-worksmanage',
            templateUrl: './add-worksmanage.component.html',
            styleUrls: ['./add-worksmanage.component.scss']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialog,
            MatDialogRef,
            FormBuilder,
            ApiService,
            ToasterService, Object, FuseTranslationLoaderService,
            TranslateService])
    ], AddWorksmanageComponent);
    return AddWorksmanageComponent;
}());
export { AddWorksmanageComponent };
//# sourceMappingURL=add-worksmanage.component.js.map