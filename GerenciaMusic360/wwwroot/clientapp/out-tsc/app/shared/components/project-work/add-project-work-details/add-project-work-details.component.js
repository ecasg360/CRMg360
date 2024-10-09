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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component, Optional, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@enums/endpoints';
import { EPersonType } from '@enums/personType';
import { allLang } from '@i18n/allLang';
import { AddEditorComponent } from '@modules/general/components/editor/add-editor/add-editor.component';
import { AddContactComponent } from '@shared/components/add-contact/add-contact.component';
import { PersonFormComponent } from '@shared/components/person-form/person-form.component';
import { ToasterService } from '@services/toaster.service';
import { AddPublisherComponent } from "../../../../modules/general/components/worksmanage/add-publisher/add-publisher.component";
var AddProjectWorkDetailsComponent = /** @class */ (function () {
    function AddProjectWorkDetailsComponent(dialogRef, service, dialog, translate, formBuilder, _fuseTranslationLoaderService, data, toaster) {
        this.dialogRef = dialogRef;
        this.service = service;
        this.dialog = dialog;
        this.translate = translate;
        this.formBuilder = formBuilder;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.data = data;
        this.toaster = toaster;
        this.isWorking = false;
        this.isInternal = false;
        this.editorsList = [];
        this.editors = [];
        this.associations = [];
        this.composers = [];
        this.productors = [];
        this.remixes = [];
        this.publishers = [];
        this.composersList = [];
        this.composersOriginal = [];
        this.publishersList = [];
        this.publishersOriginal = [];
    }
    AddProjectWorkDetailsComponent.prototype.ngOnInit = function () {
        var _a;
        var _this = this;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.row = this.data.data;
        console.log('this.row en work details: ', this.row);
        console.log('this.row en work details publishers: ', this.row.workPublisher);
        this.title = (this.row.name) ? this.row.name : this.row.itemName;
        if (this.row.foreignWorkPerson) {
            this.isInternal = this.row.foreignWorkPerson[0].person.isInternal;
            this.composers.push({
                value: this.row.foreignWorkPerson[0].person.id,
                viewValue: this.row.foreignWorkPerson[0].person.name + ' ' + this.row.foreignWorkPerson[0].person.lastName
            });
        }
        else {
            if (this.row.workCollaborator) {
                this.row.workCollaborator.forEach(function (colaborator) {
                    _this.composersList.push({
                        id: colaborator.composer.id,
                        name: colaborator.composer.name,
                        lastname: colaborator.composer.lastName
                    });
                });
            }
            else {
                this.isInternal = this.data.isInternal ? this.data.isInternal : !this.data.isExternal;
                this.getComposers();
            }
            if (this.row.workPublisher) {
                this.row.workPublisher.forEach(function (publisher) {
                    console.log('publisher: ', publisher);
                    _this.publishersList.push({
                        id: publisher.publisher.id,
                        name: publisher.publisher.name
                    });
                });
            }
            else {
                this.isInternal = this.data.isInternal ? this.data.isInternal : !this.data.isExternal;
                this.getPublishers();
            }
        }
        this.getComposers();
        this.getPublishers();
        this.getEditors();
        this.getProductors();
        this.getRemix();
        this.configureForm();
        if (this.row.ISRC) {
            this.populateForm(this.row);
        }
        if (this.row.isrc) {
            this.row.ISRC = this.row.isrc;
            this.populateForm(this.row);
        }
    };
    AddProjectWorkDetailsComponent.prototype.configureForm = function () {
        this.form = this.formBuilder.group({
            ISRC: ['', Validators.required],
            personProducerId: [''],
            personProducerName: [''],
            isComposerInternal: [this.isInternal],
            personComposerId: [''],
            editorId: [''],
            associationId: [''],
            personRemixId: [''],
            personRemixName: [''],
            composersList: [[]],
            publisherId: [''],
            publishersList: [],
            personPublisherId: []
        });
    };
    Object.defineProperty(AddProjectWorkDetailsComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddProjectWorkDetailsComponent.prototype.getProductors = function () {
        var _this = this;
        var params = [];
        params['personTypeId'] = EPersonType.Producer;
        this.service.get(EEndpoints.PersonByPersonType, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.productors = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name + ' ' + s.lastName
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkDetailsComponent.prototype.getRemix = function () {
        var _this = this;
        var params = [];
        params['personTypeId'] = EPersonType.Remix;
        this.service.get(EEndpoints.PersonByPersonType, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.remixes = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name + ' ' + s.lastName
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkDetailsComponent.prototype.getComposers = function () {
        var _this = this;
        this.service.get(EEndpoints.Composers)
            .subscribe(function (response) {
            if (response.code == 100 && response.result) {
                _this.composersOriginal = response.result;
                _this.composers = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name + ' ' + s.lastName
                }); });
            }
            /*
            if (this.row.workCollaborator) {
              this.composers.forEach(comp => {
                if (comp.value === this.row.workCollaborator[0].composer.id) {
                  this.form.controls.personComposerId.setValue(comp.value);
                }
              });
            }
            */
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkDetailsComponent.prototype.getPublishers = function () {
        var _this = this;
        this.service.get(EEndpoints.publisher)
            .subscribe(function (response) {
            if (response.code == 100 && response.result) {
                console.log('response.result: ', response.result);
                _this.publishersOriginal = response.result;
                _this.publishers = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
            if (_this.row.workPublisher) {
                _this.publishers.forEach(function (pub) {
                    console.log('pub: ', pub);
                    if (pub.value === _this.row.workPublisher[0].publisher.id) {
                        _this.form.controls.personPublisherId.setValue(pub.value);
                    }
                });
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkDetailsComponent.prototype.getEditors = function () {
        var _this = this;
        var params = [];
        params['isInternal'] = this.isInternal ? this.isInternal : true;
        this.service.get(EEndpoints.EditorsByInternal, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.editorsList = response.result;
                _this.editors = [];
                _this.editorsList.forEach(function (element) {
                    _this.editors.push({
                        value: element.id,
                        viewValue: element.dba
                    });
                });
                _this.associations = [];
                if (_this.row.workPublisher) {
                    _this.editors.forEach(function (editor) {
                        if (editor.value === _this.row.workPublisher[0].publisher.id) {
                            _this.form.controls.editorId.setValue(editor.value);
                            _this.selectEditor(editor);
                        }
                    });
                }
                if (_this.row.ISRC) {
                    var find = _this.editors.find(function (x) { return x.value === _this.row.editorId; });
                    _this.selectEditor(find);
                }
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkDetailsComponent.prototype.getAssociations = function () {
        var _this = this;
        this.service.get(EEndpoints.Associations)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.associations = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkDetailsComponent.prototype.selectEditor = function (event) {
        this.associations = [];
        var find = this.editorsList.find(function (x) { return x.id === event.value; });
        this.associations.push({
            value: find.association.id,
            viewValue: find.association.name
        });
    };
    AddProjectWorkDetailsComponent.prototype.changePublisher = function (event) {
        this.associations = [];
        console.log('this.publishersOriginal: ', this.publishersOriginal);
        console.log('event: ', event);
        var find = this.publishersOriginal.find(function (x) { return x.id === event.value; });
        console.log('find: ', find);
        if (find && find.association) {
            this.associations.push({
                value: find.association.id,
                viewValue: find.association.name
            });
            this.form.controls.associationId.setValue(find.association.id);
        }
        else {
            this.getAssociations();
        }
    };
    AddProjectWorkDetailsComponent.prototype.populateForm = function (data) {
        var _this = this;
        Object.keys(this.form.controls).forEach(function (name) {
            if (_this.form.controls[name]) {
                _this.form.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
    };
    AddProjectWorkDetailsComponent.prototype.set = function () {
        var _this = this;
        if (this.form.valid) {
            var find = void 0;
            if (this.f.personProducerId.value) {
                var find_1 = this.productors.find(function (x) { return x.value === _this.f.personProducerId.value; });
                this.f.personProducerName.setValue(find_1.viewValue);
            }
            if (this.f.personRemixId.value) {
                find = this.remixes.find(function (x) { return x.value === _this.f.personRemixId.value; });
                this.f.personRemixName.setValue(find.viewValue);
            }
            var theComposers_1 = '';
            this.composersList.forEach(function (element, index) {
                if (index === 0) {
                    theComposers_1 += element.id;
                }
                else {
                    theComposers_1 += ',' + element.id;
                }
            });
            this.form.controls.composersList.setValue(theComposers_1);
            this.form.controls.personComposerId.setValue(this.composersList[0].id);
            var thePublishers_1 = '';
            this.publishersList.forEach(function (element, index) {
                if (index === 0) {
                    thePublishers_1 += element.id;
                }
                else {
                    thePublishers_1 += ',' + element.id;
                }
            });
            this.form.controls.publishersList.setValue(thePublishers_1);
            this.form.controls.personPublisherId.setValue(this.publishersList[0].id);
            this.dialogRef.close(this.form.value);
        }
    };
    AddProjectWorkDetailsComponent.prototype.openDialogForAddEditor = function () {
        var _this = this;
        var editor = {};
        var dialogRef = this.dialog.open(AddEditorComponent, {
            width: '700px',
            data: { model: editor },
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result != undefined) {
                _this.getEditors();
            }
        });
    };
    AddProjectWorkDetailsComponent.prototype.openDialogForAddRemix = function () {
        var _this = this;
        var dialogRef = this.dialog.open(AddContactComponent, {
            width: '900px',
            data: {
                id: 0,
                personTypeId: EPersonType.Remix,
            },
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getRemix();
        });
    };
    AddProjectWorkDetailsComponent.prototype.openDialogForAddProducer = function () {
        var _this = this;
        var dialogRef = this.dialog.open(AddContactComponent, {
            width: '900px',
            data: {
                id: 0,
                personTypeId: EPersonType.Producer,
            },
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getProductors();
        });
    };
    AddProjectWorkDetailsComponent.prototype.openDialogForAddComposer = function () {
        var _this = this;
        var dialogRef = this.dialog.open(PersonFormComponent, {
            width: '900px',
            data: {
                id: 0,
                isComposer: true
            },
        });
        dialogRef.afterClosed().subscribe(function (result) {
            //this.getProductors();
            _this.getComposers();
        });
    };
    AddProjectWorkDetailsComponent.prototype.onNoClick = function () {
        this.dialogRef.close(undefined);
    };
    AddProjectWorkDetailsComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log(err);
        //this.toaster.showToaster('Error de comunicacion con el servidor');
        //this.changeIsWorking(false);
    };
    AddProjectWorkDetailsComponent.prototype.addComposer = function () {
        var _this = this;
        var exists = false;
        this.composersList.forEach(function (element) {
            if (element.id === _this.form.controls.personComposerId.value) {
                exists = true;
                _this.toaster.showToaster('Already exists');
            }
        });
        if (!exists) {
            this.composersOriginal.forEach(function (element) {
                if (element.id === _this.form.controls.personComposerId.value) {
                    _this.composersList.push({
                        id: element.id,
                        name: element.name,
                        lastname: element.lastName
                    });
                    _this.toaster.showToaster('Composer added');
                }
            });
        }
    };
    AddProjectWorkDetailsComponent.prototype.addPublisher = function () {
        var _this = this;
        this.isWorking = true;
        var dialogRef = this.dialog.open(AddPublisherComponent, {
            width: '1000px',
            data: {
                itemName: this.translate.instant('general.compositions'),
                percentagePending: 50,
                workPublisher: {}
            }
        });
        dialogRef.afterClosed().subscribe(function (result) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log('result: ', result);
                if (result != undefined) {
                    console.log('publishersList: ', this.publishersList);
                    if (this.publishersList.findIndex(function (f) { return f.id == result.publisherId; }) < 0) {
                        console.log('Entró al push');
                        this.publishersList.push({
                            id: result.id,
                            name: result.publisher.name
                        });
                        this.publishers.push({
                            value: result.publisherId,
                            viewValue: result.publisher.name
                        });
                        console.log('this.publishers: ', this.publishers);
                        this.publishers.forEach(function (element) {
                            console.log('element: ', element, result);
                            if (element.value == result.publisherId) {
                                _this.form.controls.personPublisherId.setValue(result.publisherId);
                            }
                        });
                    }
                }
                return [2 /*return*/];
            });
        }); });
        this.isWorking = false;
    };
    AddProjectWorkDetailsComponent.prototype.addPub = function () {
        var _this = this;
        var exists = false;
        console.log('this.publishersList: ', this.publishersList);
        console.log('this.publisherId: ', this.form.controls.personPublisherId.value);
        console.log('this.publishersOriginal: ', this.publishersOriginal);
        this.publishersList.forEach(function (element) {
            if (element.id === _this.form.controls.personPublisherId.value) {
                exists = true;
                _this.toaster.showToaster('Already exists');
            }
        });
        if (!exists) {
            this.publishersOriginal.forEach(function (element) {
                if (element.id === _this.form.controls.personPublisherId.value) {
                    _this.publishersList.push({
                        id: element.id,
                        name: element.name
                    });
                    _this.toaster.showToaster('Publisher added');
                }
            });
        }
    };
    AddProjectWorkDetailsComponent = __decorate([
        Component({
            selector: 'app-add-project-work-details',
            templateUrl: './add-project-work-details.component.html',
            styleUrls: ['./add-project-work-details.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ApiService,
            MatDialog,
            TranslateService,
            FormBuilder,
            FuseTranslationLoaderService, Object, ToasterService])
    ], AddProjectWorkDetailsComponent);
    return AddProjectWorkDetailsComponent;
}());
export { AddProjectWorkDetailsComponent };
//# sourceMappingURL=add-project-work-details.component.js.map