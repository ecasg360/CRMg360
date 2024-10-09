var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
import { Component, Input } from '@angular/core';
import { allLang } from '@i18n/allLang';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ETypeName } from '@enums/type-name';
import { ePersonType } from '@enums/person-type';
import { startWith, map } from 'rxjs/operators';
import { ELabelCopyType } from '@enums/types';
import { MatDialog } from '@angular/material';
import { AddTypeComponent } from '@shared/components/add-type/add-type.component';
import { AddContactComponent } from '@shared/components/add-contact/add-contact.component';
import { isNullOrUndefined } from 'util';
import { ProjectLabelCopyModalComponent } from './project-label-copy-modal/project-label-copy-modal.component';
var ProjectLabelCopyComponent = /** @class */ (function () {
    function ProjectLabelCopyComponent(toaster, translate, translationLoader, fb, apiService, dialog) {
        this.toaster = toaster;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.fb = fb;
        this.apiService = apiService;
        this.dialog = dialog;
        this.project = {};
        this.perm = {};
        this.labelCopyType = ELabelCopyType;
        //forms controls
        this.producerExecutiveFC = new FormControl();
        this.studioFC = new FormControl();
        this.distributorFC = new FormControl();
        this.recordingEngineerFC = new FormControl({ value: '', disabled: true });
        this.mixAndMasterFC = new FormControl();
        this.locationFC = new FormControl();
        this.labelCopy = {};
        this.isWorking = false;
        this.productorsList = [];
        this.studiosList = [];
        this.distributorsList = [];
        this.enginnerList = [];
        this.mixMastersList = [];
        this.personTypeList = [];
        this.typeNames = [];
        this.personsRecordingEngineerIds = [];
        this.question = "";
        this._getTypeNames();
    }
    ProjectLabelCopyComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        this.configureForm();
        this._getDistributorApi();
        this._getStudioApi();
        this._getProductorApi();
        this._getEnginnerApi();
        this._getMixMasterApi();
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
        //this.recordLabel = 'LDV';
    };
    ProjectLabelCopyComponent.prototype.ngOnChanges = function (changes) {
        var project = changes.project;
        if (project.currentValue.id)
            this._getLabelCopyByProjectApi();
    };
    Object.defineProperty(ProjectLabelCopyComponent.prototype, "f", {
        //#region form
        get: function () { return this.formLabelCopy.controls; },
        enumerable: false,
        configurable: true
    });
    ProjectLabelCopyComponent.prototype.configureForm = function () {
        var _this = this;
        this.formLabelCopy = this.fb.group({
            id: [this.labelCopy.id, []],
            projectId: [this.project.id, []],
            personProducerExecutiveId: [this.labelCopy.personProducerExecutiveId, [Validators.required]],
            personRecordingEngineerId: [this.labelCopy.personRecordingEngineerId, []],
            studioId: [this.labelCopy.distributorId, [Validators.required]],
            distributorId: [this.labelCopy.distributorId, [Validators.required]],
            personMixMasterId: [this.labelCopy.personMixMasterId, [Validators.required]],
            dateLastUpdate: [this.labelCopy.dateLastUpdate, []],
            location: [this.labelCopy.location, [Validators.required]],
            recordLabel: [
                this.labelCopy.recordLabel
                    ? this.labelCopy.recordLabel
                    : 'GM360',
                [Validators.required]
            ],
            producerList: [this.labelCopy.producerList, [Validators.required]]
        });
        if (this.labelCopy.producers) {
            var producers = this.labelCopy.producers.split(';');
            producers.forEach(function (producer) {
                _this.addPersonProducer(parseInt(producer));
            });
        }
        else {
            if (this.labelCopy && this.labelCopy.personRecordingEngineerId) {
                this.addPersonProducer(this.labelCopy.personRecordingEngineerId);
            }
        }
        this.recordLabel = this.labelCopy.recordLabel
            ? this.labelCopy.recordLabel
            : 'GM360';
    };
    //#endregion
    ProjectLabelCopyComponent.prototype.saveLabel = function () {
        this.labelCopy = this.formLabelCopy.value;
        if (!this.labelCopy.projectId) {
            this.labelCopy.projectId = this.project.id;
        }
        var labelCopy = Object.assign({}, this.labelCopy);
        if (this.labelCopy.id)
            this._updateLabelCopy(labelCopy);
        else
            this._createLabelCopy(labelCopy);
    };
    ProjectLabelCopyComponent.prototype.autocompleteOptionSelected = function ($event, type) {
        if ($event.option.id != '0') {
            this._setFormValue($event.option.id, type);
        }
        else {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            this._modalManage(type, newItem);
        }
    };
    ProjectLabelCopyComponent.prototype.enter = function (type) {
        var value = '';
        if (type == ELabelCopyType.studio) {
            value = this.studioFC.value;
        }
        else if (type == ELabelCopyType.distributor) {
            value = this.distributorFC.value;
        }
        else if (type == ELabelCopyType.recordingEngineer) {
            value = this.recordingEngineerFC.value;
        }
        else if (type == ELabelCopyType.mixAndMaster) {
            value = this.mixAndMasterFC.value;
        }
        else if (type == ELabelCopyType.productor) {
            value = this.producerExecutiveFC.value;
        }
        else if (type == ELabelCopyType.location) {
            value = this.locationFC.value;
        }
        this._modalManage(type, value);
    };
    ProjectLabelCopyComponent.prototype._populateLabelCopy = function (configuration) {
        this.labelCopy = {
            id: null,
            projectId: this.project.id,
            personProducerExecutiveId: configuration.personProducerExecutiveDefaultId,
            personRecordingEngineerId: configuration.personRecordingEngineerDefaultId,
            studioId: configuration.studioDefaultId,
            distributorId: configuration.distributorDefaultId,
            personMixMasterId: configuration.personMixMasterDefaultId,
            dateLastUpdate: null,
        };
        this.configureForm();
    };
    ProjectLabelCopyComponent.prototype._populateAutocompleteFC = function () {
        var _this = this;
        if (!isNullOrUndefined(this.labelCopy)) {
            if (this.studiosList.length > 0 && !this.studioFC.value) {
                var found = this.studiosList.find(function (f) { return f.value == _this.labelCopy.studioId; });
                if (found)
                    this.studioFC.patchValue(found.viewValue);
            }
            if (this.productorsList.length > 0 && !this.producerExecutiveFC.value) {
                var found = this.productorsList.find(function (f) { return f.value == _this.labelCopy.personProducerExecutiveId; });
                if (found)
                    this.producerExecutiveFC.patchValue(found.viewValue);
            }
            if (this.enginnerList.length > 0 && !this.recordingEngineerFC.value) {
                var found = this.enginnerList.find(function (f) { return f.value == _this.labelCopy.personRecordingEngineerId; });
                if (found)
                    this.recordingEngineerFC.patchValue(found.viewValue);
            }
            if (this.distributorsList.length > 0 && !this.distributorFC.value) {
                var found = this.distributorsList.find(function (f) { return f.value == _this.labelCopy.distributorId; });
                if (found)
                    this.distributorFC.patchValue(found.viewValue);
            }
            if (this.mixMastersList.length > 0 && !this.mixAndMasterFC.value) {
                var found = this.mixMastersList.find(function (f) { return f.value == _this.labelCopy.personMixMasterId; });
                if (found)
                    this.mixAndMasterFC.patchValue(found.viewValue);
            }
        }
    };
    ProjectLabelCopyComponent.prototype._responseError = function (err) {
        console.log(err);
        this.isWorking = false;
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    };
    ProjectLabelCopyComponent.prototype._filter = function (value, list) {
        var filterValue = value.toLowerCase();
        var result = list.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (result.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + value.trim() + "\"?"
                }]
            : result;
    };
    ProjectLabelCopyComponent.prototype._setFormValue = function (id, type) {
        if (type == ELabelCopyType.productor) {
            this.f.personProducerExecutiveId.patchValue(id);
        }
        else if (type == ELabelCopyType.studio) {
            this.f.studioId.patchValue(id);
        }
        else if (type == ELabelCopyType.distributor) {
            this.f.distributorId.patchValue(id);
        }
        else if (type == ELabelCopyType.recordingEngineer) {
            this.f.personRecordingEngineerId.patchValue(id);
        }
        else if (type == ELabelCopyType.mixAndMaster) {
            this.f.personMixMasterId.patchValue(id);
        }
    };
    //#region modal section
    ProjectLabelCopyComponent.prototype._modalManage = function (type, value) {
        if (type == ELabelCopyType.studio) {
            var model = this.typeNames.find(function (f) { return f.name == 'Studio'; });
            this._typeModal(model, value, type);
        }
        else if (type == ELabelCopyType.distributor) {
            var model = this.typeNames.find(function (f) { return f.name == 'Distributor'; });
            this._typeModal(model, value, type);
        }
        else if (type == ELabelCopyType.recordingEngineer) {
            this._contactModal(value, ePersonType.IngenieroGrabacion, type);
        }
        else if (type == ELabelCopyType.mixAndMaster) {
            this._contactModal(value, ePersonType.MixMaster, type);
        }
        else if (type == ELabelCopyType.productor) {
            this._contactModal(value, ePersonType.ProductorEjecutivo, type);
        }
    };
    ProjectLabelCopyComponent.prototype._typeModal = function (model, value, type) {
        var _this = this;
        if (!model)
            return;
        var dialogRef = this.dialog.open(AddTypeComponent, {
            width: '500px',
            data: {
                id: 0,
                name: value,
                typeId: model.id,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (type == ELabelCopyType.studio) {
                if (result != undefined) {
                    _this.studiosList.push({
                        value: result.id,
                        viewValue: result.name,
                    });
                    _this.f.studioId.patchValue(result.id);
                    setTimeout(function () { return _this.studioFC.setValue(result.name); });
                }
                else
                    _this.studioFC.patchValue('');
            }
            else {
                if (result != undefined) {
                    _this.distributorsList.push({
                        value: result.id,
                        viewValue: result.name,
                    });
                    _this.f.distributorId.patchValue(result.id);
                    setTimeout(function () { return _this.distributorFC.setValue(result.name); });
                }
                else
                    _this.distributorFC.patchValue('');
            }
        });
    };
    ProjectLabelCopyComponent.prototype._contactModal = function (value, contactType, type) {
        var _this = this;
        var model = {
            name: value
        };
        var dialogRef = this.dialog.open(AddContactComponent, {
            width: '1000px',
            data: {
                id: 0,
                model: model,
                projectId: this.project.id,
                personTypeId: contactType,
                showSelectType: false,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (type == ELabelCopyType.recordingEngineer) {
                if (result != undefined) {
                    _this.enginnerList.push({ value: result.id, viewValue: result.name + " " + result.lastName });
                    _this.personsRecordingEngineerIds.push({ value: result.id, viewValue: result.name + " " + result.lastName });
                    _this.f.personRecordingEngineerId.patchValue(result.id);
                    setTimeout(function () { return _this.recordingEngineerFC.setValue(result.name + " " + result.lastName); });
                }
                else
                    _this.recordingEngineerFC.patchValue('');
            }
            else if (type == ELabelCopyType.mixAndMaster) {
                if (result != undefined) {
                    _this.mixMastersList.push({ value: result.id, viewValue: result.name + " " + result.lastName });
                    _this.f.personMixMasterId.patchValue(result.id);
                    setTimeout(function () { return _this.mixAndMasterFC.setValue(result.name + " " + result.lastName); });
                }
                else
                    _this.mixAndMasterFC.patchValue('');
            }
            else if (type == ELabelCopyType.productor) {
                if (result != undefined) {
                    _this.productorsList.push({ value: result.id, viewValue: result.name + " " + result.lastName });
                    _this.f.personProducerExecutiveId.patchValue(result.id);
                    setTimeout(function () { return _this.producerExecutiveFC.setValue(result.name + " " + result.lastName); });
                }
                else
                    _this.producerExecutiveFC.patchValue('');
            }
        });
    };
    //#endregion
    //#region API
    ProjectLabelCopyComponent.prototype._getLabelCopyByProjectApi = function () {
        var _this = this;
        if (!this.project.id)
            return;
        this.isWorking = true;
        this.apiService.get(EEndpoints.LabelCopyByProject, { projectId: this.project.id }).subscribe(function (response) {
            if (response.code == 100) {
                if (response.result) {
                    _this.labelCopy = response.result;
                    _this.configureForm();
                    _this._populateAutocompleteFC();
                } //else
                //  this._getConfigurationLabelApi();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.serverError'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectLabelCopyComponent.prototype._getDistributorApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Types, { typeId: ETypeName.Distributor }).subscribe(function (response) {
            if (response.code == 100) {
                _this.distributorsList = response.result.map(function (m) { return ({ value: m.id, viewValue: m.name }); });
                _this.distributorFiltered = _this.distributorFC.valueChanges
                    .pipe(startWith(''), map(function (distributor) { return _this._filter(distributor, _this.distributorsList); }));
                _this._populateAutocompleteFC();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.serverError'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectLabelCopyComponent.prototype._getStudioApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Types, { typeId: ETypeName.Studio }).subscribe(function (response) {
            if (response.code == 100) {
                _this.studiosList = response.result.map(function (m) { return ({ value: m.id, viewValue: m.name }); });
                _this.studioFiltered = _this.studioFC.valueChanges
                    .pipe(startWith(''), map(function (studio) { return _this._filter(studio, _this.studiosList); }));
                _this._populateAutocompleteFC();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.serverError'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectLabelCopyComponent.prototype._getProductorApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectContactsByType, { personTypeId: ePersonType.ProductorEjecutivo }).subscribe(function (response) {
            if (response.code == 100) {
                _this.productorsList = response.result.map(function (m) { return ({ value: m.id, viewValue: m.name + " " + m.lastName }); });
                _this.producerExecutiveFiltered = _this.producerExecutiveFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter(value, _this.productorsList); }));
                _this._populateAutocompleteFC();
            }
            else
                _this.toaster.showTranslate('general.errors.serverError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectLabelCopyComponent.prototype._getEnginnerApi = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.isWorking = true;
                this.apiService.get(EEndpoints.ProjectContactsByType, { personTypeId: ePersonType.IngenieroGrabacion }).subscribe(function (response) {
                    if (response.code == 100) {
                        _this.enginnerList = response.result.map(function (m) { return ({ value: m.id, viewValue: m.name + " " + m.lastName }); });
                        _this.recordingEngineerFiltered = _this.recordingEngineerFC.valueChanges
                            .pipe(startWith(''), map(function (value) { return _this._filter(value, _this.enginnerList); }));
                        _this._populateAutocompleteFC();
                    }
                    else
                        _this.toaster.showToaster(_this.translate.instant('general.errors.serverError'));
                    _this.isWorking = false;
                }, function (err) { return _this._responseError(err); });
                return [2 /*return*/];
            });
        });
    };
    ProjectLabelCopyComponent.prototype._getMixMasterApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.ProjectContactsByType, { personTypeId: ePersonType.MixMaster }).subscribe(function (response) {
            if (response.code == 100) {
                _this.mixMastersList = response.result.map(function (m) { return ({ value: m.id, viewValue: m.name + " " + m.lastName }); });
                _this.mixAndMasterFiltered = _this.mixAndMasterFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter(value, _this.mixMastersList); }));
                _this._populateAutocompleteFC();
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.serverError'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectLabelCopyComponent.prototype._getConfigurationLabelApi = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.LabelCopyConfiguration, { projectId: this.project.id }).subscribe(function (response) {
            if (response.code == 100) {
                if (response.result) {
                    _this._populateLabelCopy(response.result);
                    _this._populateAutocompleteFC();
                }
            }
            else
                _this.toaster.showToaster(_this.translate.instant('general.errors.serverError'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectLabelCopyComponent.prototype._createLabelCopy = function (labelCopy) {
        var _this = this;
        this.isWorking = true;
        delete labelCopy.id;
        delete labelCopy.dateLastUpdate;
        this.apiService.save(EEndpoints.LabelCopy, labelCopy).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemSaved'));
                _this.labelCopy = response.result;
                _this.f.id.patchValue(_this.labelCopy.id);
                _this.f.dateLastUpdate.patchValue(_this.labelCopy.dateLastUpdate);
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorSavingItem'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectLabelCopyComponent.prototype._updateLabelCopy = function (labelCopy) {
        var _this = this;
        this.isWorking = true;
        delete labelCopy.dateLastUpdate;
        this.apiService.update(EEndpoints.LabelCopy, labelCopy).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showToaster(_this.translate.instant('messages.itemUpdated'));
            }
            else
                _this.toaster.showToaster(_this.translate.instant('errors.errorEditingItem'));
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectLabelCopyComponent.prototype._getTypeNames = function () {
        var _this = this;
        this.isWorking = false;
        this.apiService.get(EEndpoints.TypeNames)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.typeNames = response.result;
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ProjectLabelCopyComponent.prototype.changeFilter = function (radioButton) {
        var id = radioButton.id;
        this.formLabelCopy.controls.recordLabel.setValue(id);
    };
    ProjectLabelCopyComponent.prototype.showModalAddProducer = function () {
        var _this = this;
        this.isWorking = true;
        var dialogRef = this.dialog.open(ProjectLabelCopyModalComponent, {
            width: '500px',
            data: {
                producers: this.labelCopy.personRecordingEngineerId,
                projectId: this.project.id,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!result) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._getEnginnerApi()];
                    case 1:
                        _a.sent();
                        this.addPersonProducer(result);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        this.isWorking = false;
    };
    ProjectLabelCopyComponent.prototype.addPersonProducer = function (personId) {
        var _this = this;
        console.log('addPersonProducer personId: ', personId);
        console.log('addPersonProducer this.enginnerList: ', this.enginnerList);
        var exists = false;
        var persons = this.enginnerList;
        this.personsRecordingEngineerIds.forEach(function (person) {
            if (parseInt(person.value) === personId || person.value === personId) {
                exists = true;
            }
        });
        if (this.formLabelCopy.controls.personRecordingEngineerId.value === null) {
            this.formLabelCopy.controls.personRecordingEngineerId.setValue(personId);
        }
        console.log('addPersonProducer exists: ', exists);
        if (!exists) {
            persons.forEach(function (element) {
                var item = element;
                if (parseInt(item.value) === personId || item.value === personId) {
                    _this.personsRecordingEngineerIds.push(item);
                    var personsArray_1 = [];
                    _this.personsRecordingEngineerIds.forEach(function (element) {
                        personsArray_1.push(element.value);
                    });
                    _this.formLabelCopy.controls.producerList.setValue(personsArray_1);
                }
            });
        }
    };
    ProjectLabelCopyComponent.prototype.deleteProducer = function (producer) {
        var persons = [];
        var theIndex = 0;
        this.personsRecordingEngineerIds.forEach(function (person, index) {
            if (producer.value !== person.value) {
                persons.push(person.value);
            }
            else {
                theIndex = index;
            }
        });
        this.personsRecordingEngineerIds.splice(theIndex, 1);
        this.formLabelCopy.controls.producerList.setValue(persons);
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectLabelCopyComponent.prototype, "project", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProjectLabelCopyComponent.prototype, "perm", void 0);
    ProjectLabelCopyComponent = __decorate([
        Component({
            selector: 'app-project-label-copy',
            templateUrl: './project-label-copy.component.html',
            styleUrls: ['./project-label-copy.component.scss']
        }),
        __metadata("design:paramtypes", [ToasterService,
            TranslateService,
            FuseTranslationLoaderService,
            FormBuilder,
            ApiService,
            MatDialog])
    ], ProjectLabelCopyComponent);
    return ProjectLabelCopyComponent;
}());
export { ProjectLabelCopyComponent };
//# sourceMappingURL=project-label-copy.component.js.map