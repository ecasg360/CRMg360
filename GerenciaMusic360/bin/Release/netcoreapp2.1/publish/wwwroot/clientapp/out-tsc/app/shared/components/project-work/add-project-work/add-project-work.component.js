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
import { Component, Optional, Inject, ViewChild } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { FormBuilder } from '@angular/forms';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@app/core/i18n/allLang';
import { AddProjectWorkDetailsComponent } from '../add-project-work-details/add-project-work-details.component';
import * as _ from 'lodash';
import { AddRelationVideoworkComponent } from '../add-relation-videowork/add-relation-videowork.component';
var AddProjectWorkComponent = /** @class */ (function () {
    function AddProjectWorkComponent(dialogRef, service, dialog, translate, formBuilder, _fuseTranslationLoaderService, data) {
        this.dialogRef = dialogRef;
        this.service = service;
        this.dialog = dialog;
        this.translate = translate;
        this.formBuilder = formBuilder;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.data = data;
        this.isWorking = false;
        this.projectId = 0;
        this.projectTypeId = 0;
        this.projectWorks = [];
        this.isEdit = false;
        this.albums = [];
        this.videos = [];
        this.works = [];
        this.worksSelected = [];
        this.persons = [];
        this.personsSelected = [];
        this.displayedColumns = [];
        this.displayedColumnsSelect = ['id', 'name', 'ISRC', 'producerRemix', 'action'];
        this.displayedColumnsVideoSelect = ['id', 'name', 'work', 'ISRC', 'producerRemix', 'action'];
        this.isDataAvailable = true;
        this.projectWorksVideo = [];
    }
    AddProjectWorkComponent.prototype.ngOnInit = function () {
        var _a;
        console.log('Constructor de add-project-work');
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.projectId = this.data.projectId;
        this.projectTypeId = this.data.projectTypeId;
        this.projectWorks = this.data.projectWorks;
        this.isEdit = this.data.isEditData;
        this.getProjectType();
    };
    AddProjectWorkComponent.prototype.init = function () {
        switch (this.projectType.id) {
            case 2:
                this.displayedColumns = ['select', 'id', 'name', 'description'];
                this.getWorks();
                break;
            case 1:
                this.displayedColumns = ['select', 'id', 'name', 'description'];
                this.getAlbums();
                break;
            case 3:
                this.displayedColumns = ['select', 'id', 'name'];
                this.getVideos(1);
                break;
            case 4:
                this.displayedColumns = ['select', 'id', 'name'];
                this.getVideos(2);
                break;
            case 5:
                this.displayedColumns = ['select', 'id', 'name', 'description'];
                this.getWorks();
                //this.getPersons();
                break;
        }
    };
    AddProjectWorkComponent.prototype.getProjectType = function () {
        var _this = this;
        var params = [];
        params['id'] = this.projectTypeId;
        this.service.get(EEndpoints.ProjectType, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectType = response.result;
                _this.init();
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkComponent.prototype.getAlbums = function () {
        var _this = this;
        this.service.get(EEndpoints.Albums).subscribe(function (response) {
            if (response.code == 100) {
                _this.albums = response.result;
                _this.dataSource = new MatTableDataSource(_this.albums);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
                _this.dataSourceSelect = new MatTableDataSource(_this.worksSelected);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkComponent.prototype.getAlbumWork = function (id) {
        var _this = this;
        var params = [];
        params['albumId'] = id;
        this.service.get(EEndpoints.AlbumWorks, params).subscribe(function (response) {
            if (response.code == 100) {
                response.result.works.forEach(function (item) {
                    var find = _this.worksSelected.findIndex(function (x) { return x.id === item.id; });
                    if (find !== -1) {
                        if (_this.worksSelected.length === 1) {
                            _this.worksSelected = [];
                        }
                        _this.worksSelected.splice(find, 1);
                        _this.dataSourceSelect.data = _this.worksSelected;
                        return;
                    }
                    _this.worksSelected.push(item);
                    _this.dataSourceSelect.data = _this.worksSelected;
                });
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkComponent.prototype.getVideos = function (videoTypeId) {
        var _this = this;
        var params = [];
        params['videoTypeId'] = videoTypeId;
        this.service.get(EEndpoints.VideosByVideoTypeId, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.videos = response.result;
                _this.dataSource = new MatTableDataSource(_this.videos);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
                _this.dataSourceSelect = new MatTableDataSource(_this.worksSelected);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkComponent.prototype.relationVideoToWork = function () {
    };
    AddProjectWorkComponent.prototype.getWorks = function () {
        var _this = this;
        this.service.get(EEndpoints.Works).subscribe(function (response) {
            if (response.code == 100) {
                _this.works = response.result;
                _this.dataSource = new MatTableDataSource(_this.works);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
                if (_this.isEdit && _this.projectWorks.length > 0) {
                    _this.select(_this.projectWorks[0].work);
                }
                else {
                    _this.dataSourceSelect = new MatTableDataSource(_this.worksSelected);
                }
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkComponent.prototype.getForeignWork = function () {
        var _this = this;
        this.service.get(EEndpoints.ForeignWork).subscribe(function (response) {
            if (response.code == 100) {
                // this.works = response.result;
                // this.dataSource = new MatTableDataSource(this.works);
                //             this.dataSource.paginator = this.paginator;
                //             this.dataSource.sort = this.sort;
                // this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkComponent.prototype.getForeignWorkPerson = function () {
        var _this = this;
        this.service.get(EEndpoints.ForeignWorkPerson).subscribe(function (response) {
            if (response.code == 100) {
                // this.works = response.result;
                // this.dataSource = new MatTableDataSource(this.works);
                //             this.dataSource.paginator = this.paginator;
                //             this.dataSource.sort = this.sort;
                // this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkComponent.prototype.getPersons = function () {
        var _this = this;
        this.service.get(EEndpoints.Artists).subscribe(function (response) {
            if (response.code == 100) {
                _this.persons = response.result;
                _this.dataSource = new MatTableDataSource(_this.persons);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
                _this.dataSourceSelect = new MatTableDataSource(_this.personsSelected);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddProjectWorkComponent.prototype.select = function (row) {
        var find = this.worksSelected.findIndex(function (x) { return x.id === row.id; });
        var rowNew;
        switch (this.projectType.id) {
            case 2:
                if (find !== -1) {
                    if (this.worksSelected.length === 1) {
                        this.worksSelected = [];
                    }
                    this.worksSelected.splice(find, 1);
                    this.dataSourceSelect.data = this.worksSelected;
                    return;
                }
                // this.dataSourceSelect.data = this.worksSelected;
                rowNew = _.cloneDeep(row);
                if (rowNew.workCollaborator.length > 0) {
                    if (this.isEdit && this.data.projectTypeId === 2) {
                        rowNew.isrc = this.data.modelProjectWork.isrc
                            ? this.data.modelProjectWork.isrc
                            : '';
                        rowNew.personProducerName = rowNew.workCollaborator[0].composer
                            ? rowNew.workCollaborator[0].composer.name + ' ' + rowNew.workCollaborator[0].composer.lastName
                            : '';
                        rowNew.personRemixName = this.data.modelProjectWork.mixMaster
                            ? this.data.modelProjectWork.mixMaster.name + ' ' + this.data.modelProjectWork.mixMaster.lastName
                            : '';
                        rowNew.personProducerId = this.data.modelProjectWork.personProducerId
                            ? this.data.modelProjectWork.personProducerId
                            : 0;
                        rowNew.editorId = this.data.modelProjectWork.editorId
                            ? this.data.modelProjectWork.editorId
                            : 0;
                        rowNew.associationId = this.data.modelProjectWork.associationId
                            ? this.data.modelProjectWork.associationId
                            : 0;
                        rowNew.personRemixId = this.data.modelProjectWork.personRemixId
                            ? this.data.modelProjectWork.personRemixId
                            : 0;
                        rowNew.personComposerId = this.data.modelProjectWork.personComposerId
                            ? this.data.modelProjectWork.personComposerId
                            : 0;
                    }
                    if (!rowNew.workCollaborator[0].composer.isInternal) {
                        //  find = this.selectWorks.findIndex((x) => x.id === rowNew.id && x.foreignWorkPerson[0].person.isInternal === false);
                    }
                    else {
                        rowNew.foreignWorkPerson = rowNew.workCollaborator;
                        rowNew.foreignWorkPerson[0].person = rowNew.foreignWorkPerson[0].composer;
                        rowNew.foreignWorkPerson[0].composer = undefined;
                        //rowNew.workCollaborator = [];
                        // find = this.selectWorks.findIndex((x) => x.id === rowNew.id && x.foreignWorkPerson[0].person.isInternal === true);
                    }
                }
                else {
                    rowNew.foreignWorkPerson = undefined;
                    rowNew.foreignWorkPerson[0].person = undefined;
                    rowNew.foreignWorkPerson[0].composer = undefined;
                    rowNew.workCollaborator = [];
                }
                this.worksSelected.push(rowNew);
                this.rowDetails = rowNew;
                this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
                this.dataSourceSelect.paginator = this.paginator;
                this.dataSourceSelect.sort = this.sort;
                //this.openDetails(rowNew);
                break;
            case 1:
                this.getAlbumWork(row.id);
                break;
            case 3:
            case 4:
                if (find !== -1) {
                    if (this.worksSelected.length === 1) {
                        this.worksSelected = [];
                    }
                    this.worksSelected.splice(find, 1);
                    this.dataSourceSelect.data = this.worksSelected;
                    return;
                }
                // this.dataSourceSelect.data = this.worksSelected;
                rowNew = _.cloneDeep(row);
                // if (!rowNew.workCollaborator[0].composer.isInternal) {
                //   //  find = this.selectWorks.findIndex((x) => x.id === rowNew.id && x.foreignWorkPerson[0].person.isInternal === false);
                // } else {
                //   rowNew.foreignWorkPerson = rowNew.workCollaborator;
                //   rowNew.foreignWorkPerson[0].person = rowNew.foreignWorkPerson[0].composer;
                //   rowNew.foreignWorkPerson[0].composer = undefined;
                //   rowNew.workCollaborator = [];
                //   // find = this.selectWorks.findIndex((x) => x.id === rowNew.id && x.foreignWorkPerson[0].person.isInternal === true);
                // }
                this.worksSelected.push(rowNew);
                this.rowDetails = rowNew;
                this.openRelationVideoWork(rowNew);
                // if (find !== -1) {
                // if (this.worksSelected.length === 1){
                //   this.worksSelected = [];
                // }
                // this.worksSelected.splice(find, 1);
                // this.dataSourceSelect.data = this.worksSelected;
                // return;
                // }
                // this.worksSelected.push(row);
                // this.dataSourceSelect.data = this.worksSelected;
                break;
            case 5:
                if (find !== -1) {
                    if (this.worksSelected.length === 1) {
                        this.worksSelected = [];
                    }
                    this.worksSelected.splice(find, 1);
                    this.dataSourceSelect.data = this.worksSelected;
                    return;
                }
                rowNew = _.cloneDeep(row);
                this.worksSelected.push(rowNew);
                this.rowDetails = rowNew;
                this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
                this.dataSourceSelect.paginator = this.paginator;
                this.dataSourceSelect.sort = this.sort;
                break;
        }
    };
    AddProjectWorkComponent.prototype.confirmDelete = function (id) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '700px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', {
                    field: name
                }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.delete(id);
            }
        });
    };
    AddProjectWorkComponent.prototype.delete = function (id) {
        var find = this.worksSelected.findIndex(function (x) { return x.id === id; });
        if (find !== -1) {
            var work = this.works.find(function (x) { return x.id === id; });
            work.select = false;
            this.worksSelected.splice(find, 1);
            this.dataSourceSelect.data = this.worksSelected;
        }
    };
    AddProjectWorkComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    AddProjectWorkComponent.prototype.setWorks = function () {
        var _this = this;
        console.log('ESR setWorks: ', this.worksSelected);
        var projectWorks = [];
        this.worksSelected.forEach(function (x) {
            console.log('the x: ', x);
            projectWorks.push({
                id: _this.isEdit ? _this.data.modelProjectWork.id : 0,
                projectId: _this.projectId,
                albumId: x.albumId,
                itemId: x.id,
                productionTypeId: _this.projectTypeId,
                isInternal: true,
                albumName: '',
                itemName: x.name,
                productionTypeName: _this.projectType.name,
                isrc: x.isrc ? x.isrc : '',
                personProducerId: x.personProducerId,
                isComposerInternal: x.isComposerInternal ? x.isComposerInternal : false,
                personComposerId: x.personComposerId,
                editorId: x.editorId,
                associationId: x.associationId,
                personRemixId: x.personRemixId,
                personProducerName: x.personProducerName,
                personRemixName: x.personRemixName,
                workRelatedId: x.workRelatedId,
                foreignWorkRelatedId: x.foreignWorkRelatedId,
                isInternalRelated: x.isInternalRelated,
                composersList: x.composersList,
                publishersList: x.publishersList,
                personPublisherId: x.personPublisherId
            });
        });
        if (!this.isEdit) {
            this.service.save(EEndpoints.ProjectWorks, projectWorks).subscribe(function (response) {
                if (response.code === 100) {
                    _this.worksSelected.forEach(function (x, index) {
                        var track;
                        track = {
                            id: 0,
                            workId: x.id,
                            projectId: _this.projectId,
                            name: x.name,
                            numberTrack: index + 1,
                            time: null,
                            isrc: x.isrc
                        };
                        _this.saveTrack(track);
                    });
                }
            }, function (err) { return _this.responseError(err); });
        }
        else {
            this.service.update(EEndpoints.ProjectWorks, projectWorks).subscribe(function (response) {
                if (response.code === 100) {
                    _this.worksSelected.forEach(function (x, index) {
                        if (_this.data.projectTypeId === 2 && _this.isEdit) {
                            _this.service.get(EEndpoints.TracksByProjectAndWork, {
                                projectId: _this.projectId,
                                workId: x.id
                            }).subscribe(function (response) {
                                var track;
                                track = {
                                    id: response.result.id,
                                    workId: x.id,
                                    projectId: _this.projectId,
                                    name: x.name,
                                    numberTrack: index + 1,
                                    time: null,
                                    isrc: x.isrc
                                };
                                _this.saveTrack(track);
                            });
                        }
                        else {
                            var track = void 0;
                            track = {
                                id: 0,
                                workId: x.id,
                                projectId: _this.projectId,
                                name: x.name,
                                numberTrack: index + 1,
                                time: null,
                                isrc: x.isrc
                            };
                            _this.saveTrack(track);
                        }
                    });
                    _this.onNoClick(true);
                }
            }, function (err) { return _this.responseError(err); });
        }
    };
    AddProjectWorkComponent.prototype.saveTrack = function (model) {
        var _this = this;
        var isrc = model.isrc ? model.isrc : '';
        delete model.isrc;
        if (!this.isEdit) {
            this.service.save(EEndpoints.Track, model)
                .subscribe(function (response) {
                if (response.code == 100) {
                    var trackWork = void 0;
                    if (_this.data.projectTypeId === 2 && _this.isEdit) {
                        trackWork = {
                            id: model.id,
                            trackId: response.result.id,
                            isrc: isrc,
                            upc: '',
                        };
                    }
                    else {
                        trackWork = {
                            id: 0,
                            trackId: response.result.id,
                            isrc: isrc,
                            upc: '',
                        };
                    }
                    _this.saveTrackWork(trackWork);
                }
            }, function (err) { return _this.responseError(err); });
        }
        else {
            this.service.update(EEndpoints.Track, model)
                .subscribe(function (response) {
                if (response.code == 100) {
                    var trackWork = void 0;
                    trackWork = {
                        id: model.id,
                        trackId: response.result.id,
                        isrc: isrc,
                        upc: '',
                    };
                    _this.saveTrackWork(trackWork);
                }
            }, function (err) { return _this.responseError(err); });
        }
    };
    AddProjectWorkComponent.prototype.saveTrackWork = function (model) {
        var _this = this;
        if (!this.isEdit) {
            this.service.save(EEndpoints.TrackWork, model)
                .subscribe(function (response) {
                if (response.code == 100) {
                    _this.isWorking = false;
                }
                _this.isWorking = false;
                _this.onNoClick(true);
            }, function (err) { return _this.responseError(err); });
        }
        else {
            this.service.update(EEndpoints.TrackWork, model)
                .subscribe(function (response) {
                if (response.code == 100) {
                    _this.isWorking = false;
                }
                _this.isWorking = false;
                _this.onNoClick(true);
            }, function (err) { return _this.responseError(err); });
        }
    };
    AddProjectWorkComponent.prototype.openDetails = function (row) {
        var _this = this;
        //this.rowDetails = row;              
        var dialogRef = this.dialog.open(AddProjectWorkDetailsComponent, {
            width: '700px',
            data: {
                action: this.translate.instant('general.save'),
                icon: 'save_outline',
                data: row
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('result afterClosed: ', result);
            if (result !== undefined) {
                var data = result;
                //const find = this.worksSelected.find((x) => x.id === this.rowDetails.id && x.foreignWorkPerson[0].person.isInternal === this.rowDetails.foreignWorkPerson[0].person.isInternal);
                var find = _this.worksSelected.find(function (x) { return x.id === _this.rowDetails.id; });
                find.isrc = data.isrc ? data.isrc : data.ISRC;
                find.personProducerId = data.personProducerId;
                find.isComposerInternal = data.isComposerInternal;
                find.personComposerId = data.personComposerId;
                find.editorId = data.editorId;
                find.associationId = data.associationId;
                find.personRemixId = data.personRemixId;
                find.personRemixName = data.personRemixName;
                find.personProducerName = data.personProducerName;
                find.composersList = data.composersList;
                find.publishersList = data.publishersList;
                find.personPublisherId = data.personPublisherId;
                //const index = this.worksSelected.findIndex((x) => x.id === this.rowDetails.id && x.foreignWorkPerson[0].person.isInternal === this.rowDetails.foreignWorkPerson[0].person.isInternal);
                var index = _this.worksSelected.findIndex(function (x) { return x.id === _this.rowDetails.id; });
                _this.worksSelected[index] = find;
                _this.dataSourceSelect = new MatTableDataSource(_this.worksSelected);
                _this.dataSourceSelect.paginator = _this.paginator;
                _this.dataSourceSelect.sort = _this.sort;
            }
        });
    };
    AddProjectWorkComponent.prototype.openRelationVideoWork = function (row) {
        var _this = this;
        this.rowDetails = row;
        var dialogRef = this.dialog.open(AddRelationVideoworkComponent, {
            width: '700px',
            data: {
                action: this.translate.instant('general.save'),
                icon: 'save_outline',
                data: row
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var data = result;
                if (!data.isrc) {
                    var find = _this.worksSelected.find(function (x) { return x.id === _this.rowDetails.id; });
                    find.isrc = data.isrc;
                    find.personProducerId = data.personProducerId;
                    find.isComposerInternal = data.isComposerInternal;
                    find.personComposerId = data.personComposerId;
                    find.editorId = data.editorId;
                    find.associationId = data.associationId;
                    find.personRemixId = data.personRemixId;
                    find.personRemixName = data.personRemixName;
                    find.personProducerName = data.personProducerName;
                    find.isInternalRelated = data.isInternal;
                    find.workName = data.itemName;
                    if (data.isInternal) {
                        find.workRelatedId = data.itemId;
                    }
                    else {
                        find.foreignWorkRelatedId = data.itemId;
                    }
                    var index = _this.worksSelected.findIndex(function (x) { return x.id === _this.rowDetails.id; });
                    _this.worksSelected[index] = find;
                }
                else {
                    var index = _this.worksSelected.findIndex(function (x) { return x.id === _this.rowDetails.id; });
                    _this.worksSelected[index] = data;
                }
                _this.dataSourceSelect = new MatTableDataSource(_this.worksSelected);
                _this.dataSourceSelect.paginator = _this.paginator;
                _this.dataSourceSelect.sort = _this.sort;
            }
        });
    };
    AddProjectWorkComponent.prototype.onNoClick = function (status) {
        if (status === void 0) { status = false; }
        this.dialogRef.close(status);
    };
    AddProjectWorkComponent.prototype.changeIsWorking = function (value) {
        //this.isWorking = value;
    };
    AddProjectWorkComponent.prototype.responseError = function (err) {
        console.log(err);
        //this.toaster.showToaster('Error de comunicacion con el servidor');
        this.changeIsWorking(false);
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], AddProjectWorkComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], AddProjectWorkComponent.prototype, "sort", void 0);
    AddProjectWorkComponent = __decorate([
        Component({
            selector: 'app-add-project-work',
            templateUrl: './add-project-work.component.html',
            styleUrls: ['./add-project-work.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ApiService,
            MatDialog,
            TranslateService,
            FormBuilder,
            FuseTranslationLoaderService, Object])
    ], AddProjectWorkComponent);
    return AddProjectWorkComponent;
}());
export { AddProjectWorkComponent };
//# sourceMappingURL=add-project-work.component.js.map