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
import { Component, ViewChild, Inject, Optional } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { allLang } from '@app/core/i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { startWith, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { EPersonType } from '@enums/personType';
import { AddEditorComponent } from '@modules/general/components/editor/add-editor/add-editor.component';
import { AddContactComponent } from '@shared/components/add-contact/add-contact.component';
import { PersonFormComponent } from '@shared/components/person-form/person-form.component';
import { ToasterService } from '@services/toaster.service';
import { AddComposerComponent } from '../add-composer/add-composer.component';
import { AddArtistModalComponent } from '../add-artist-modal/add-artist-modal.component';
var AddAlbumReleaseComponent = /** @class */ (function () {
    function AddAlbumReleaseComponent(dialogRef, service, dialog, translate, formBuilder, _fuseTranslationLoaderService, data, toaster) {
        this.dialogRef = dialogRef;
        this.service = service;
        this.dialog = dialog;
        this.translate = translate;
        this.formBuilder = formBuilder;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.data = data;
        this.toaster = toaster;
        this.isWorking = false;
        this.projectId = 0;
        this.projectTypeId = 0;
        this.artistId = undefined;
        this.projectWorks = [];
        this.action = this.translate.instant('track.createTrack');
        this.displayedColumns = ['select', 'name', 'ISRC'];
        this.isDataAvailable = true;
        this.composers = [];
        this.composersList = [];
        this.details = true;
        this.add = false;
        this.addWork = false;
        this.newContact = false;
        this.isNewWorkExternal = false;
        this.selectTracks = [];
        this.userCtrl = new FormControl();
        this.selectable = true;
        this.removable = true;
        this.addOnBlur = true;
        this.separatorKeysCodes = [ENTER, COMMA];
        this.isEditData = false;
        this.modelProjectWork = {};
        this.isInternal = false;
        this.editorsList = [];
        this.editors = [];
        this.associations = [];
        this.productors = [];
        this.remixes = [];
        this.isInputDisabled = false;
        //SECTION TRACKS
        this.nameTrack = new FormControl({ value: '', required: true });
        this.hasWork = new FormControl();
        this.worksFC = new FormControl('');
        this.ISRC = new FormControl({ value: '' });
        this.numberTrack = new FormControl('');
        this.amountRevenue = new FormControl({ value: '' });
        this.UPC = new FormControl({ value: '' });
        this.time = new FormControl('' /*,Validators.pattern("^[0-9]{2}:[0-5]{1}\d{1}$")*/);
        this.isHasWork = false;
        this.listWorks = [];
        this.isTracksAvailable = false;
        this.tracksByWork = [];
        this.workIdSelected = 0;
        this.listTrackWork = [];
        this.existISRC = false;
        this.modelProjectWorkSelected = {};
        this.selectedComposers = [];
        this.percentagePending = 100;
        this.selectedArtists = [];
    }
    Object.defineProperty(AddAlbumReleaseComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddAlbumReleaseComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.project = this.data.project;
        this.projectId = this.data.projectId;
        this.projectTypeId = this.data.projectTypeId;
        this.projectWorks = this.data.projectWorks;
        this.artistId = this.data.artistId;
        this.isEditData = this.data.isEditData;
        //projectWorks: this.projectWorks
        this.getProjectType();
        this.getTracks();
        this.getTrackWork();
        this.dataSourceSelect = new MatTableDataSource([]);
        if (this.isEditData) {
            this.modelProjectWork = this.data.modelProjectWork;
            this.workId = this.data.workId;
            this.projectWorkId = this.data.projectWorkId;
            var percentageSum = 0;
            if (percentageSum >= 100) {
                this.isInputDisabled = true;
            }
            else {
                this.isInputDisabled = false;
            }
            this.action = this.translate.instant('track.editTrack');
        }
        //this.getWorks();
        //Work Detail
        this.getEditors();
        this.getProductors();
        this.getRemix();
        this.getAssociations();
        this.getWorks();
        this.configureForm();
    };
    AddAlbumReleaseComponent.prototype.configureForm = function () {
        console.log(this.modelProjectWork);
        this.addArtistForm = this.formBuilder.group({});
        this.form = this.formBuilder.group({
            name: [this.modelProjectWork.itemName, [Validators.required]],
            isInternal: [!this.modelProjectWork.isInternal, []],
            personProducerId: [this.modelProjectWork.personProducerId],
            personProducerName: [this.modelProjectWork.personProducerName],
            personComposerId: [this.modelProjectWork.personComposerId],
            editorId: [this.modelProjectWork.editorId],
            personRemixId: [this.modelProjectWork.personRemixId],
            personRemixName: [this.modelProjectWork.personRemixName],
            releaseDate: [this.modelProjectWork.trackReleaseDate],
            soundRecordingRegistration: [this.modelProjectWork.trackSoundRecordingRegistration],
            musicCopyright: [this.modelProjectWork.trackMusicCopyright],
            soundExchangeRegistration: [this.modelProjectWork.trackSoundExchangeRegistration],
            workForHireSound: [this.modelProjectWork.trackWorkForHireSound],
            workForHireVideo: [this.modelProjectWork.trackWorkForHireVideo],
        });
        if (this.modelProjectWork.workRecordings == null || this.modelProjectWork.workRecordings == undefined) {
            this.modelProjectWork.workRecordings = [];
        }
        this.selectedArtists = this.modelProjectWork.workRecordings;
        this.nameTrack.setValue(this.modelProjectWork.trackName);
        this.amountRevenue.setValue(this.modelProjectWork.amountRevenue);
        this.ISRC.setValue(this.modelProjectWork.trackWorkISRC);
        this.numberTrack.setValue(this.modelProjectWork.numberTrack);
        this.UPC.setValue(this.modelProjectWork.trackWorkUPC);
        this.time.setValue(this.modelProjectWork.trackTime);
        this.releaseDate = this.modelProjectWork.trackReleaseDate;
        this.soundRecordingRegistration = this.modelProjectWork.trackSoundRecordingRegistration;
        this.musicCopyright = this.modelProjectWork.trackMusicCopyright;
        this.soundExchangeRegistration = this.modelProjectWork.trackSoundExchangeRegistration;
        this.workForHireSound = this.modelProjectWork.trackWorkForHireSound;
        this.workForHireVideo = this.modelProjectWork.trackWorkForHireVideo;
        this.hasWork.setValue(this.modelProjectWork.workId > 0);
        this.isHasWork = this.hasWork.value;
        if (this.isHasWork) {
            this.worksFC = new FormControl({ value: '', disabled: false });
            this.getWorks(this.modelProjectWork.workId);
        }
        else {
            this.isTracksAvailable = false;
            this.worksFC = new FormControl('');
            this.ISRC = new FormControl('');
            this.listWorks = [];
            this.filteredOptions = null;
            this.f.editorId.patchValue(null);
            this.f.personProducerId.patchValue(null);
            this.f.personRemixId.patchValue(null);
        }
    };
    AddAlbumReleaseComponent.prototype.bindExternalForm = function (name, form) {
        this.addArtistForm.setControl(name, form);
    };
    AddAlbumReleaseComponent.prototype.displayFn = function (value) {
        return value ? value.viewValue : value;
    };
    AddAlbumReleaseComponent.prototype.onSelectionChanged = function (e) {
        this.f.personId.setValue(e.option.value.value);
    };
    AddAlbumReleaseComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    AddAlbumReleaseComponent.prototype.getProjectType = function () {
        var _this = this;
        var params = [];
        params['id'] = this.projectTypeId;
        this.service.get(EEndpoints.ProjectType, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectType = response.result;
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.getTracks = function () {
        var _this = this;
        console.log('Entró a getTracks: ', this.projectId);
        var params = [];
        params['projectId'] = this.projectId;
        this.service.get(EEndpoints.TracksByProject, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.listCollaborators = response.result;
                _this.dataSource = null;
                _this.isDataAvailable = (response.result.length > 0);
                _this.dataSource = new MatTableDataSource(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.getWorks = function (workId) {
        var _this = this;
        if (workId === void 0) { workId = 0; }
        console.log('getWorks: ');
        this.isWorking = true;
        this.service.get(EEndpoints.Works).subscribe(function (response) {
            console.log('response getWorks: ', response);
            if (response.code == 100) {
                _this.listWorks = response.result;
                _this.filteredOptions = _this.worksFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
                if (workId > 0) {
                    _this.work = _this.listWorks.find(function (x) { return x.id == workId; });
                    setTimeout(function () { return _this.worksFC.setValue(_this.work.name); });
                    var percentageSum_1 = 0;
                    _this.selectedComposers = _this.work.workCollaborator;
                    _this.selectedComposers.forEach(function (x) {
                        return percentageSum_1 = percentageSum_1 + x.percentageRevenue;
                    });
                    _this.percentagePending = _this.percentagePending - percentageSum_1;
                    _this.workIdSelected = workId;
                }
            }
            else {
                _this.toaster.showToaster('general.errors.requestError');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        var results = [];
        results = this.listWorks.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
        return results;
    };
    AddAlbumReleaseComponent.prototype.addData = function () {
        this.details = false;
        this.add = true;
    };
    AddAlbumReleaseComponent.prototype.addExternalWork = function () {
        this.addWork = true;
    };
    AddAlbumReleaseComponent.prototype.closedExternalWork = function () {
        this.addWork = false;
    };
    AddAlbumReleaseComponent.prototype.save = function () {
        var _this = this;
        var track = {};
        var trackWork = {};
        this.isWorking = true;
        this.form.value.isInternal = !this.form.value.isInternal;
        var model = this.form.value;
        this.modelWork = {
            id: this.workId,
            name: model.name,
            description: model.name,
            amountRevenue: this.amountRevenue.value,
            rating: 0.0,
            statusRecordId: 1,
            isExternal: this.form.value.isInternal
        };
        if (!this.isEditData) {
            if (!this.isHasWork) {
                this.saveWork(this.modelWork, this.selectedComposers);
            }
            else {
                var foundWork = this.listWorks.find(function (x) { return x.id === _this.workIdSelected; });
                if (foundWork != undefined && foundWork != null && foundWork.id > 0) {
                    this.saveProjectWorkTrack(foundWork);
                }
            }
        }
        else {
            if (!this.isHasWork) {
                this.updateWork(this.modelWork, this.selectedComposers);
            }
            else {
                var foundWork = this.listWorks.find(function (x) { return x.id === _this.workIdSelected; });
                console.log('foundWork: ', foundWork);
                if (foundWork != undefined && foundWork != null && foundWork.id > 0) {
                    console.log('entró al if: ');
                    this.updateProjectWorkTrack(foundWork);
                }
            }
        }
    };
    AddAlbumReleaseComponent.prototype.saveProjectWorkTrack = function (model) {
        var _this = this;
        var projectWork = {};
        projectWork = {
            id: 0,
            projectId: this.projectId,
            albumId: model.albumId,
            itemId: model.id,
            productionTypeId: this.projectTypeId,
            isInternal: !model.isExternal,
            albumName: '',
            itemName: model.name,
            productionTypeName: this.projectType.name,
            isrc: this.ISRC.value,
            personProducerId: this.f.personProducerId.value,
            isComposerInternal: false,
            personComposerId: this.f.personComposerId.value,
            editorId: this.f.editorId.value,
            personRemixId: this.f.personRemixId.value,
            personProducerName: this.f.personProducerName.value,
            personRemixName: this.f.personRemixName.value
        };
        this.service.save(EEndpoints.ProjectWork, projectWork).subscribe(function (response) {
            if (response.code === 100) {
                var track = void 0;
                track = {
                    id: 0,
                    workId: _this.workIdSelected,
                    projectId: _this.projectId,
                    name: _this.nameTrack.value,
                    numberTrack: _this.numberTrack.value,
                    time: _this.time.value,
                };
                _this.saveTrack(track);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.updateProjectWorkTrack = function (model) {
        var _this = this;
        var workCollaborators = [];
        var workRecordings = [];
        var composerId;
        //COMPOSERS
        this.selectedComposers.forEach(function (x) {
            workCollaborators.push({
                id: 0,
                workId: model.id,
                composerId: x.composerId,
                amountRevenue: x.amountRevenue,
                percentageRevenue: x.percentageRevenue,
                isCollaborator: false
            });
        });
        //ARTISTS
        this.selectedArtists.forEach(function (x) {
            workRecordings.push({
                id: 0,
                workId: model.id,
                artistId: x.artistId,
                amountRevenue: x.amountRevenue,
            });
        });
        if (workCollaborators.length > 0) {
            composerId = workCollaborators[0].composerId;
            this.updateWorkCollaborators(workCollaborators);
        }
        if (workRecordings.length > 0) {
            this.updateWorkRecordings(workRecordings);
        }
        //PROJECT WORK
        var projectWork = {};
        projectWork = {
            id: this.modelProjectWork.id,
            projectId: this.projectId,
            albumId: model.albumId,
            itemId: model.id,
            productionTypeId: this.projectTypeId,
            isInternal: !model.isExternal,
            albumName: '',
            itemName: model.name,
            productionTypeName: this.projectType.name,
            isrc: this.ISRC.value,
            personProducerId: this.f.personProducerId.value,
            isComposerInternal: false,
            personComposerId: this.f.personComposerId.value,
            editorId: this.f.editorId.value,
            personRemixId: this.f.personRemixId.value,
            personProducerName: this.f.personProducerName.value,
            personRemixName: this.f.personRemixName.value
        };
        console.log('projectWork: ', projectWork);
        this.service.update(EEndpoints.ProjectWork, projectWork).subscribe(function (response) {
            console.log('response ProjectWork: ', response);
            if (response.code === 100) {
                var track = void 0;
                track = {
                    id: _this.modelProjectWork.trackId,
                    workId: _this.workIdSelected,
                    projectId: _this.projectId,
                    name: _this.nameTrack.value,
                    numberTrack: _this.numberTrack.value,
                    time: _this.time.value,
                    releaseDate: _this.f.releaseDate.value,
                    soundRecordingRegistration: _this.f.soundRecordingRegistration.value,
                    musicCopyright: _this.f.musicCopyright.value,
                    soundExchangeRegistration: _this.f.soundExchangeRegistration.value,
                    workForHireSound: _this.f.workForHireSound.value,
                    workForHireVideo: _this.f.workForHireVideo.value
                };
                console.log('track: ', track);
                _this.updateTrack(track);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.saveWork = function (model, selectedComposers) {
        var _this = this;
        delete model.id;
        this.service.save(EEndpoints.Work, model)
            .subscribe(function (response) {
            if (response.code == 100) {
                var workCollaborators_1 = [];
                var workRecordings_1 = [];
                var composerId = void 0;
                //COMPOSERS
                selectedComposers.forEach(function (x) {
                    workCollaborators_1.push({
                        id: 0,
                        workId: parseInt(response.result.id),
                        composerId: x.composerId,
                        amountRevenue: x.amountRevenue,
                        percentageRevenue: x.percentageRevenue,
                        isCollaborator: false
                    });
                });
                //ARTISTS
                _this.selectedArtists.forEach(function (x) {
                    workRecordings_1.push({
                        id: 0,
                        workId: parseInt(response.result.id),
                        artistId: x.artistId,
                        amountRevenue: x.amountRevenue,
                    });
                });
                if (workCollaborators_1.length > 0) {
                    composerId = workCollaborators_1[0].composerId;
                    _this.saveWorkCollaborators(workCollaborators_1);
                }
                if (workRecordings_1.length > 0) {
                    _this.saveWorkRecordings(workRecordings_1);
                }
                _this.saveProjectWork(response.result.id, composerId, model.name, model.isExternal);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.saveWorkCollaborators = function (workCollaborators) {
        var _this = this;
        this.service.save(EEndpoints.WorkCollaborators, workCollaborators)
            .subscribe(function (response) {
            if (response.code == 100) {
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.saveWorkRecordings = function (workRecordings) {
        var _this = this;
        this.service.save(EEndpoints.WorkRecordings, workRecordings)
            .subscribe(function (response) {
            if (response.code == 100) {
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.saveTrack = function (model) {
        var _this = this;
        delete model.isrc;
        this.service.save(EEndpoints.Track, model)
            .subscribe(function (response) {
            if (response.code == 100) {
                var trackWork = void 0;
                trackWork = {
                    id: 0,
                    trackId: response.result.id,
                    isrc: _this.ISRC.value,
                    upc: _this.UPC.value,
                };
                _this.saveTrackWork(trackWork);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.saveTrackWork = function (model) {
        var _this = this;
        this.service.save(EEndpoints.TrackWork, model)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.isWorking = false;
                _this.onNoClick(true);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.updateTrack = function (model) {
        var _this = this;
        delete model.isrc;
        this.service.update(EEndpoints.Track, model)
            .subscribe(function (response) {
            console.log('response Track: ', response);
            if (response.code == 100) {
                var trackWork = void 0;
                trackWork = {
                    id: _this.modelProjectWork.trackWorkId,
                    trackId: _this.modelProjectWork.trackId,
                    isrc: _this.ISRC.value,
                    upc: _this.UPC.value,
                };
                console.log('trackWork: ', trackWork);
                _this.updateTrackWork(trackWork);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.updateTrackWork = function (model) {
        var _this = this;
        this.service.update(EEndpoints.TrackWork, model)
            .subscribe(function (response) {
            console.log('response TrackWork: ', response);
            if (response.code == 100) {
                _this.isWorking = false;
                _this.onNoClick(true);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.saveProjectWork = function (workId, composerId, nameWork, isExternal) {
        var _this = this;
        var model = this.form.value;
        var projectWork = {};
        projectWork = {
            id: 0,
            projectId: this.projectId,
            albumId: null,
            itemId: workId,
            productionTypeId: this.projectTypeId,
            isInternal: !isExternal,
            albumName: null,
            itemName: nameWork,
            productionTypeName: this.projectType.name,
            isrc: this.ISRC.value,
            personProducerId: model.personProducerId,
            isComposerInternal: false,
            personComposerId: composerId,
            editorId: model.editorId,
            personRemixId: model.personRemixId,
            personProducerName: null,
            personRemixName: model.personRemixName
        };
        this.service.save(EEndpoints.ProjectWork, projectWork).subscribe(function (response) {
            if (response.code === 100) {
                var track = void 0;
                track = {
                    id: 0,
                    workId: workId,
                    projectId: _this.projectId,
                    name: _this.nameTrack.value,
                    numberTrack: _this.numberTrack.value,
                    time: _this.time.value,
                    releaseDate: _this.f.releaseDate.value,
                    soundRecordingRegistration: _this.f.soundRecordingRegistration.value,
                    musicCopyright: _this.f.musicCopyright.value,
                    soundExchangeRegistration: _this.f.soundExchangeRegistration.value,
                    workForHireSound: _this.f.workForHireSound.value,
                    workForHireVideo: _this.f.workForHireVideo.value,
                };
                _this.saveTrack(track);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.updateWork = function (model, selectedComposers) {
        var _this = this;
        this.service.save(EEndpoints.Work, model)
            .subscribe(function (response) {
            if (response.code == 100) {
                var workCollaborators_2 = [];
                var workRecordings_2 = [];
                var composerId = void 0;
                //COMPOSERS
                selectedComposers.forEach(function (x) {
                    workCollaborators_2.push({
                        id: 0,
                        workId: model.id,
                        composerId: x.composerId,
                        amountRevenue: x.amountRevenue,
                        percentageRevenue: x.percentageRevenue,
                        isCollaborator: false
                    });
                });
                //ARTISTS
                _this.selectedArtists.forEach(function (x) {
                    workRecordings_2.push({
                        id: 0,
                        workId: model.id,
                        artistId: x.artistId,
                        amountRevenue: x.amountRevenue,
                    });
                });
                if (workCollaborators_2.length > 0) {
                    composerId = workCollaborators_2[0].composerId;
                    _this.updateWorkCollaborators(workCollaborators_2);
                }
                if (workRecordings_2.length > 0) {
                    _this.updateWorkRecordings(workRecordings_2);
                }
                _this.updateProjectWork(_this.workId, composerId, model.name);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.updateWorkCollaborators = function (workCollaborators) {
        var _this = this;
        this.service.update(EEndpoints.WorkCollaborators, workCollaborators)
            .subscribe(function (response) {
            if (response.code == 100) {
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.updateWorkRecordings = function (workRecordings) {
        var _this = this;
        this.service.update(EEndpoints.WorkRecordings, workRecordings)
            .subscribe(function (response) {
            if (response.code == 100) {
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.updateProjectWork = function (workId, composerId, nameWork) {
        var _this = this;
        var model = this.form.value;
        var projectWork = {};
        projectWork = {
            id: this.modelProjectWork.id,
            projectId: this.modelProjectWork.projectId,
            albumId: this.modelProjectWork.albumId,
            itemId: workId,
            productionTypeId: this.modelProjectWork.productionTypeId,
            isInternal: model.isInternal,
            albumName: this.modelProjectWork.albumName,
            itemName: nameWork,
            productionTypeName: this.modelProjectWork.productionTypeName,
            isrc: this.ISRC.value,
            personProducerId: model.personProducerId,
            isComposerInternal: false,
            personComposerId: composerId,
            editorId: model.editorId,
            personRemixId: model.personRemixId,
            personProducerName: null,
            personRemixName: model.personRemixName
        };
        this.service.update(EEndpoints.ProjectWork, projectWork).subscribe(function (response) {
            if (response.code === 100) {
                var track = void 0;
                track = {
                    id: _this.modelProjectWork.trackId,
                    workId: workId,
                    projectId: _this.projectId,
                    name: _this.nameTrack.value,
                    numberTrack: _this.numberTrack.value,
                    time: _this.time.value,
                    releaseDate: _this.f.releaseDate.value,
                    soundRecordingRegistration: _this.f.soundRecordingRegistration.value,
                    musicCopyright: _this.f.musicCopyright.value,
                    soundExchangeRegistration: _this.f.soundExchangeRegistration.value,
                    workForHireSound: _this.f.workForHireSound.value,
                    workForHireVideo: _this.f.workForHireVideo.value,
                };
                _this.updateTrack(track);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.confirmSave = function (model) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.saveQuestion', { field: model.name }),
                action: this.translate.instant('general.save'),
                icon: 'save_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.save();
            }
        });
    };
    AddAlbumReleaseComponent.prototype.confirmDelete = function (id) {
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
                var confirm_2 = result.confirm;
                if (confirm_2)
                    _this.delete(id);
            }
        });
    };
    AddAlbumReleaseComponent.prototype.select = function (row) {
        var find;
        var rowNew = _.cloneDeep(row);
        console.log(rowNew);
        find = this.selectTracks.findIndex(function (x) { return x.id === rowNew.id; });
        if (find !== -1) {
            if (this.selectTracks.length === 1) {
                this.selectTracks = [];
            }
            this.selectTracks.splice(find, 1);
            this.dataSourceSelect.data = this.selectTracks;
            return;
        }
        this.selectTracks.push(rowNew);
        this.dataSourceSelect.data = this.selectTracks;
    };
    AddAlbumReleaseComponent.prototype.setInitWork = function () {
        this.details = true;
        this.add = false;
    };
    AddAlbumReleaseComponent.prototype.addNewContact = function () {
        this.newContact = true;
    };
    AddAlbumReleaseComponent.prototype.closeNewContact = function () {
        this.newContact = false;
    };
    AddAlbumReleaseComponent.prototype.saveSelectWorks = function () {
        var _this = this;
        this.isWorking = true;
        var projectWorks = [];
        this.dataSourceSelect.data.forEach(function (x) {
            var work = _this.listWorks.find(function (y) { return y.id == x.workId; });
            projectWorks.push({
                id: 0,
                projectId: _this.projectId,
                albumId: work.albumId,
                itemId: x.workId,
                productionTypeId: _this.projectTypeId,
                isInternal: !work.isExternal,
                albumName: "",
                itemName: work.name,
                productionTypeName: _this.projectType.name,
                isrc: x.isrc,
                personProducerId: null,
                isComposerInternal: false,
                personComposerId: work.composerId,
                editorId: null,
                personRemixId: null,
                personProducerName: '',
                personRemixName: '',
                workRelatedId: null,
                foreignWorkRelatedId: null,
                isInternalRelated: null,
                trackName: x.name,
                numberTrack: x.numberTrack,
                trackWorkISRC: x.isrc
            });
        });
        this.service.save(EEndpoints.ProjectWorksTracks, projectWorks).subscribe(function (response) {
            if (response.code === 100) {
                _this.onNoClick(true);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.delete = function (id) {
        var find = this.selectTracks.findIndex(function (x) { return x.id === id; });
        if (find !== -1) {
            var work = this.selectTracks.find(function (x) { return x.id === id; });
            work.select = false;
            this.selectTracks.splice(find, 1);
            this.dataSourceSelect.data = this.selectTracks;
        }
    };
    AddAlbumReleaseComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = false; }
        this.dialogRef.close(status);
    };
    AddAlbumReleaseComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log(err);
        //this.toaster.showToaster('Error de comunicacion con el servidor');
        //this.changeIsWorking(false);
    };
    //Methods Additional Field Work
    AddAlbumReleaseComponent.prototype.getProductors = function () {
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
    AddAlbumReleaseComponent.prototype.getRemix = function () {
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
    AddAlbumReleaseComponent.prototype.getEditors = function () {
        var _this = this;
        var params = [];
        params['isInternal'] = this.isInternal;
        this.service.get(EEndpoints.EditorsByInternal, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.editorsList = response.result;
                _this.editors = response.result.map(function (s) { return ({
                    value: s.id,
                    viewValue: s.name
                }); });
                _this.associations = [];
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.getAssociations = function () {
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
    AddAlbumReleaseComponent.prototype.getTrackWork = function () {
        var _this = this;
        console.log('getTrackWork: ');
        this.service.get(EEndpoints.TrackWork)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.listTrackWork = response.result;
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.selectEditor = function (event) {
        this.associations = [];
        var find = this.editorsList.find(function (x) { return x.id === event.value; });
        this.associations.push({
            value: find.association.id,
            viewValue: find.association.name
        });
    };
    AddAlbumReleaseComponent.prototype.populateForm = function (data) {
        var _this = this;
        Object.keys(this.form.controls).forEach(function (name) {
            if (_this.form.controls[name]) {
                _this.form.controls[name].patchValue(data[name]);
            }
        });
        this.id = data.id;
    };
    AddAlbumReleaseComponent.prototype.set = function () {
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
            this.dialogRef.close(this.form.value);
        }
    };
    AddAlbumReleaseComponent.prototype.openDialogForAddEditor = function () {
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
    AddAlbumReleaseComponent.prototype.openDialogForAddRemix = function () {
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
    AddAlbumReleaseComponent.prototype.openDialogForAddProducer = function () {
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
    AddAlbumReleaseComponent.prototype.openDialogForAddComposer = function () {
        var _this = this;
        var dialogRef = this.dialog.open(PersonFormComponent, {
            width: '900px',
            data: {
                id: 0,
                isComposer: true
            },
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getProductors();
        });
    };
    //Methods Fix Add Tracks
    AddAlbumReleaseComponent.prototype.checkedHasWork = function (event) {
        //this.isHasWork = event.checked;
        //if(this.isHasWork){
        //  this.worksFC = new FormControl({value: '', disabled: false});
        //  this.getWorks();
        //}else{
        //  this.isTracksAvailable = false;
        //  this.worksFC = new FormControl({value: '', disabled: true});
        //  this.ISRC = new FormControl({value: '', disabled: false});
        //  this.filteredOptions = null;
        //  this.selectedComposers = [];
        //  this.f.editorId.patchValue(null);
        //  this.f.personProducerId.patchValue(null);
        //  this.f.personRemixId.patchValue(null);
        //}
    };
    AddAlbumReleaseComponent.prototype.enterWork = function (evt) {
        var _this = this;
        var found = this.listWorks.find(function (f) { return f.name == _this.worksFC.value; });
        if (found) {
            this.f.goalId.patchValue(found.id);
        }
    };
    AddAlbumReleaseComponent.prototype.enterNameTrack = function (evt) {
        this.f.name.patchValue(this.nameTrack.value);
    };
    AddAlbumReleaseComponent.prototype.enterISRC = function (evt) {
        var valueISRC = this.ISRC.value;
        var found = this.listTrackWork.find(function (f) { return f.isrc == valueISRC; });
        if (found != null && found != undefined && found.id > 0 && found.isrc != this.modelProjectWork.trackWorkISRC) {
            this.existISRC = true;
        }
        else {
            this.existISRC = false;
        }
    };
    AddAlbumReleaseComponent.prototype.autocompleteOptionSelected = function ($event) {
        this.workIdSelected = parseInt($event.option.id);
        this.getWorks(this.workIdSelected);
        this.getTracksByWork(this.workIdSelected);
    };
    AddAlbumReleaseComponent.prototype.selectTrack = function (track) {
        this.ISRC = new FormControl({ value: track.isrc, disabled: true });
        this.getProjectWorkByISRC(this.ISRC.value);
    };
    AddAlbumReleaseComponent.prototype.getTracksByWork = function (workId) {
        var _this = this;
        var params = [];
        params['workId'] = workId;
        this.service.get(EEndpoints.TracksByWork, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                console.log(response);
                _this.tracksByWork = response.result;
                _this.isTracksAvailable = true;
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.getProjectWorkByISRC = function (ISRC) {
        var _this = this;
        var params = [];
        params['ISRC'] = ISRC;
        this.service.get(EEndpoints.ProjectWorkByISRC, params)
            .subscribe(function (response) {
            if (response.code == 100) {
                _this.modelProjectWorkSelected = response.result;
                _this.f.editorId.patchValue(_this.modelProjectWorkSelected.editorId);
                _this.f.personProducerId.patchValue(_this.modelProjectWorkSelected.personProducerId);
                _this.f.personRemixId.patchValue(_this.modelProjectWorkSelected.personRemixId);
                // this.form = this.formBuilder.group({
                //   personProducerId: [this.modelProjectWorkSelected.personProducerId],
                //   editorId: [this.modelProjectWorkSelected.editorId],
                //   personRemixId: [this.modelProjectWorkSelected.personRemixId],
                // });
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddAlbumReleaseComponent.prototype.showComposer = function (composer, isEdit) {
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
                itemName: 'Work',
                percentagePending: this.percentagePending,
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result != undefined) {
                //Setee temporalmente si es o no una edicion en la variable isInternal
                if (result.composer.isInternal) {
                    if (result.composer.personTypeId !== result.composerId) {
                        _this.selectedComposers = _this.selectedComposers.filter(function (x) { return x.composerId !== result.composer.personTypeId; });
                    }
                    else {
                        _this.selectedComposers = _this.selectedComposers.filter(function (x) { return x.composerId !== result.composerId; });
                    }
                }
                else {
                    var composer_1 = _this.selectedComposers.filter(function (x) { return x.composerId == result.composerId; })[0];
                    if (_this.selectedComposers.length > 0 && composer_1 !== undefined && composer_1.composerId > 0) {
                        _this.selectedComposers = _this.selectedComposers.filter(function (x) { return x.composerId !== result.composerId; });
                        result.percentageRevenue = result.percentageRevenue + composer_1.percentageRevenue;
                    }
                }
                _this.selectedComposers.push(result);
            }
            else {
                if (isEdit) {
                    _this.percentagePending = _this.percentagePending - composer.percentageRevenue;
                }
            }
            var percentageSum = 0;
            _this.selectedComposers.forEach(function (x) { return percentageSum = percentageSum + x.percentageRevenue; });
            _this.percentagePending = 100 - percentageSum;
            if (_this.percentagePending.toString().indexOf('-') >= 0) {
                _this.percentagePending = 0;
            }
        });
        this.isWorking = false;
    };
    AddAlbumReleaseComponent.prototype.showArtist = function (artist, isEdit) {
        var _this = this;
        if (artist === void 0) { artist = {}; }
        if (isEdit === void 0) { isEdit = false; }
        this.isWorking = true;
        var component = AddArtistModalComponent;
        var dialogRef = this.dialog.open(component, {
            width: '1000px',
            data: {
                isAddArtist: true,
                isEditArtist: isEdit,
                idArtistEdit: artist.artistId,
                workRecording: artist,
                itemName: 'Artist',
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result != undefined) {
                //Setee temporalmente si es o no una edicion en la variable isInternal
                if (result.isEdit) {
                    if (result.artistId !== result.idEdit) {
                        _this.selectedArtists = _this.selectedArtists.filter(function (x) { return x.artistId !== result.idEdit; });
                    }
                    else {
                        _this.selectedArtists = _this.selectedArtists.filter(function (x) { return x.artistId !== result.artistId; });
                    }
                }
                else {
                    var artist_1 = _this.selectedArtists.filter(function (x) { return x.artistId == result.artistId; })[0];
                    if (_this.selectedArtists.length > 0 && artist_1 !== undefined && artist_1.artistId > 0) {
                        _this.selectedArtists = _this.selectedArtists.filter(function (x) { return x.artistId !== result.artistId; });
                    }
                }
                _this.selectedArtists.push(result);
            }
        });
        this.isWorking = false;
    };
    AddAlbumReleaseComponent.prototype.confirmDeleteComposer = function (composer) {
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
                var confirm_3 = result.confirm;
                if (confirm_3)
                    _this.deleteComposer(composer);
            }
        });
    };
    AddAlbumReleaseComponent.prototype.deleteComposer = function (composer) {
        this.selectedComposers = this.selectedComposers.filter(function (x) { return x.composerId !== composer.composerId; });
        this.percentagePending = this.percentagePending + composer.percentageRevenue;
    };
    AddAlbumReleaseComponent.prototype.confirmDeleteArtist = function (artist) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: 'Artist' }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_4 = result.confirm;
                if (confirm_4)
                    _this.deleteArtist(artist);
            }
        });
    };
    AddAlbumReleaseComponent.prototype.deleteArtist = function (artist) {
        this.selectedArtists = this.selectedArtists.filter(function (x) { return x.artistId !== artist.artistId; });
    };
    AddAlbumReleaseComponent.prototype.validForm = function () {
        if (this.nameTrack.value) {
            return true;
        }
        return false;
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], AddAlbumReleaseComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], AddAlbumReleaseComponent.prototype, "sort", void 0);
    AddAlbumReleaseComponent = __decorate([
        Component({
            selector: 'app-add-album-release',
            templateUrl: './add-album-release.component.html',
            styleUrls: ['./add-album-release.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ApiService,
            MatDialog,
            TranslateService,
            FormBuilder,
            FuseTranslationLoaderService, Object, ToasterService])
    ], AddAlbumReleaseComponent);
    return AddAlbumReleaseComponent;
}());
export { AddAlbumReleaseComponent };
//# sourceMappingURL=add-album-release.component.js.map