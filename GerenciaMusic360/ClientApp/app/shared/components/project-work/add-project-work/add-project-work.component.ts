import { Component, OnInit, Optional, Inject, ViewChild } from '@angular/core';

import { IProjectType} from '@shared/models/project-type';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatTabGroup } from '@angular/material';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { ResponseApi} from '@shared/models/response-api';
import { Work} from '@shared/models/work';
import { FormBuilder} from '@angular/forms';
import { IProjectWork} from '@shared/models/project-work';
import { ConfirmComponent} from '@shared/components/confirm/confirm.component';
import { TranslateService} from '@ngx-translate/core';
import { allLang} from '@app/core/i18n/allLang';
import { Album} from '@shared/models/album';
import { IVideo} from '@shared/models/video';
import { IPerson} from '@shared/models/person';
import { AddProjectWorkDetailsComponent} from '../add-project-work-details/add-project-work-details.component';
import * as _ from 'lodash';
import { AddRelationVideoworkComponent } from '../add-relation-videowork/add-relation-videowork.component';
import { ITrack } from '@models/track';
import { ITrackWork } from '@models/track-work';

@Component({
  selector: 'app-add-project-work',
  templateUrl: './add-project-work.component.html',
  styleUrls: ['./add-project-work.component.scss']
})

export class AddProjectWorkComponent implements OnInit {
  isWorking: boolean = false;
  projectId: number = 0;
  projectType: IProjectType;
  projectTypeId: number = 0;
  projectWorks: IProjectWork[] = [];
  rowDetails: any;
  isEdit = false;
 

  albums: Album[] = [];
  videos: IVideo[] = [];

  works: Work[] = [];
  worksSelected: any[] = [];

  persons: IPerson[] = [];
  personsSelected: IPerson[] = [];

  displayedColumns: string[] = [];
  displayedColumnsSelect: string[] = ['id', 'name', 'ISRC', 'producerRemix', 'action'];
  displayedColumnsVideoSelect: string[] = ['id', 'name', 'work', 'ISRC', 'producerRemix', 'action'];
  dataSource: MatTableDataSource < any > ;
  dataSourceSelect: MatTableDataSource < any > ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  innerWidth: any;
  isDataAvailable: boolean = true;

  projectWorksVideo: IProjectWork[] = [];

  constructor(public dialogRef: MatDialogRef < AddProjectWorkComponent > ,
    private service: ApiService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, ) {}

  ngOnInit() {
    console.log('Constructor de add-project-work');
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.projectId = this.data.projectId;
    this.projectTypeId = this.data.projectTypeId;
    this.projectWorks = this.data.projectWorks;
    this.isEdit = this.data.isEditData;
    this.getProjectType();
  }

  init(): void {
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
  }

  getProjectType(): void {
    const params = [];
    params['id'] = this.projectTypeId;
    this.service.get(EEndpoints.ProjectType, params).subscribe((response: ResponseApi < IProjectType > ) => {
      if (response.code == 100) {
        this.projectType = response.result;
        this.init();
      }
    }, (err) => this.responseError(err));
  }

  getAlbums(): void {
    this.service.get(EEndpoints.Albums).subscribe((response: ResponseApi < Album[] > ) => {
      if (response.code == 100) {
        this.albums = response.result;
        this.dataSource = new MatTableDataSource(this.albums);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
      }
    }, (err) => this.responseError(err));
  }

  getAlbumWork(id: number): void {
    const params = [];
    params['albumId'] = id;
    this.service.get(EEndpoints.AlbumWorks, params).subscribe((response: ResponseApi < Album > ) => {
      if (response.code == 100) {
        response.result.works.forEach((item) => {
          const find = this.worksSelected.findIndex((x) => x.id === item.id);
          if (find !== -1) {
            if (this.worksSelected.length === 1) {
              this.worksSelected = [];
            }
            this.worksSelected.splice(find, 1);
            this.dataSourceSelect.data = this.worksSelected;
            return;
          }
          this.worksSelected.push(item);
          this.dataSourceSelect.data = this.worksSelected;
        });
      }
    }, (err) => this.responseError(err));
  }

  getVideos(videoTypeId: number): void {
    const params = [];
    params['videoTypeId'] = videoTypeId;
    this.service.get(EEndpoints.VideosByVideoTypeId, params).subscribe((response: ResponseApi < IVideo[] > ) => {
      if (response.code == 100) {
        this.videos = response.result;
        this.dataSource = new MatTableDataSource(this.videos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
      }
    }, (err) => this.responseError(err));
  }

  relationVideoToWork(): void {

  }

  getWorks(): void {
    this.service.get(EEndpoints.Works).subscribe((response: ResponseApi < Work[] > ) => {
      if (response.code == 100) {
        this.works = response.result;
        this.dataSource = new MatTableDataSource(this.works);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.isEdit && this.projectWorks.length > 0) {
          this.select(this.projectWorks[0].work);
        } else {
          this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
        }
      }
    }, (err) => this.responseError(err));
  }

  getForeignWork(): void {
    this.service.get(EEndpoints.ForeignWork).subscribe((response: ResponseApi < Work[] > ) => {
      if (response.code == 100) {
        // this.works = response.result;
        // this.dataSource = new MatTableDataSource(this.works);
        //             this.dataSource.paginator = this.paginator;
        //             this.dataSource.sort = this.sort;
        // this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
      }
    }, (err) => this.responseError(err));
  }

  getForeignWorkPerson(): void {
    this.service.get(EEndpoints.ForeignWorkPerson).subscribe((response: ResponseApi < Work[] > ) => {
      if (response.code == 100) {
        // this.works = response.result;
        // this.dataSource = new MatTableDataSource(this.works);
        //             this.dataSource.paginator = this.paginator;
        //             this.dataSource.sort = this.sort;
        // this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
      }
    }, (err) => this.responseError(err));
  }

  getPersons(): void {
    this.service.get(EEndpoints.Artists).subscribe((response: ResponseApi < IPerson[] > ) => {
      if (response.code == 100) {
        this.persons = response.result;
        this.dataSource = new MatTableDataSource(this.persons);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSourceSelect = new MatTableDataSource(this.personsSelected);
      }
    }, (err) => this.responseError(err));
  }

  select(row: any): void {   
    const find = this.worksSelected.findIndex((x) => x.id === row.id);
    let rowNew: any;
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
                } else {
                    rowNew.foreignWorkPerson = rowNew.workCollaborator;
                    rowNew.foreignWorkPerson[0].person = rowNew.foreignWorkPerson[0].composer;
                    rowNew.foreignWorkPerson[0].composer = undefined;
                    //rowNew.workCollaborator = [];
                    // find = this.selectWorks.findIndex((x) => x.id === rowNew.id && x.foreignWorkPerson[0].person.isInternal === true);
                }
            } else {
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
  }

  confirmDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '700px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', {
          field: name
        }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this.delete(id);
      }
    });
  }

  delete(id: number) {
    const find = this.worksSelected.findIndex((x) => x.id === id);
    if (find !== -1) {
      const work = this.works.find((x) => x.id === id);
      work.select = false;
      this.worksSelected.splice(find, 1);
      this.dataSourceSelect.data = this.worksSelected;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setWorks(): void {
    console.log('ESR setWorks: ', this.worksSelected);
    const projectWorks: IProjectWork[] = [];
    this.worksSelected.forEach((x) => {
      console.log('the x: ', x);
        projectWorks.push(<IProjectWork>{
        id: this.isEdit ? this.data.modelProjectWork.id : 0,
        projectId: this.projectId,
        albumId: x.albumId,
        itemId: x.id,
        productionTypeId: this.projectTypeId,
        isInternal: true,
        albumName: '',
        itemName: x.name,
        productionTypeName: this.projectType.name,
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
      this.service.save(EEndpoints.ProjectWorks, projectWorks).subscribe((response: ResponseApi < any > ) => {
        if (response.code === 100) {
          this.worksSelected.forEach((x, index) => {
            let track:ITrack;
            track = {
              id: 0,
              workId: x.id,
              projectId: this.projectId,
              name: x.name,
              numberTrack: index + 1,
              time: null,
              isrc: x.isrc
            }
            this.saveTrack(track);
          });
        }
      }, (err) => this.responseError(err));
    } else {
      this.service.update(EEndpoints.ProjectWorks, projectWorks).subscribe((response: ResponseApi < any > ) => {
        if (response.code === 100) {
          this.worksSelected.forEach((x, index) => {
            if (this.data.projectTypeId === 2 && this.isEdit) {
              this.service.get(
                EEndpoints.TracksByProjectAndWork,
                {
                  projectId: this.projectId,
                  workId: x.id
                }).subscribe((response: ResponseApi<any>) => {
                  let track:ITrack;
                    track = {
                      id: response.result.id,
                      workId: x.id,
                      projectId: this.projectId,
                      name: x.name,
                      numberTrack: index + 1,
                      time: null,
                      isrc: x.isrc
                    }
                    this.saveTrack(track);
                });
            } else {
              let track:ITrack;
              track = {
                id: 0,
                workId: x.id,
                projectId: this.projectId,
                name: x.name,
                numberTrack: index + 1,
                time: null,
                isrc: x.isrc
              }
              this.saveTrack(track);
            }
          });
          
          this.onNoClick(true);
        }
      }, (err) => this.responseError(err));
    }
  }

  saveTrack(model: ITrack): void {
    const isrc = model.isrc ? model.isrc : '';
    delete model.isrc;

    if (!this.isEdit) {
      this.service.save(EEndpoints.Track, model)
      .subscribe((response: ResponseApi<ITrack>) => {
          if (response.code == 100) {
  
            let trackWork: ITrackWork;
            if (this.data.projectTypeId === 2 && this.isEdit) {
              trackWork = {
                id: model.id,
                trackId: response.result.id,
                isrc: isrc,
                upc: '',
              };
            } else {
              trackWork = {
                id: 0,
                trackId: response.result.id,
                isrc: isrc,
                upc: '',
              };
            }
            this.saveTrackWork(trackWork);
          }
      }, (err) => this.responseError(err));
    } else {
      this.service.update(EEndpoints.Track, model)
      .subscribe((response: ResponseApi<ITrack>) => {
          if (response.code == 100) {
            let trackWork: ITrackWork;
            trackWork = {
              id: model.id,
              trackId: response.result.id,
              isrc: isrc,
              upc: '',
            };
            this.saveTrackWork(trackWork);
          }
      }, (err) => this.responseError(err));
    }
    
  }

  saveTrackWork(model: ITrackWork): void {
    if (!this.isEdit) {
      this.service.save(EEndpoints.TrackWork, model)
      .subscribe((response: ResponseApi<ITrackWork>) => {
          if (response.code == 100) {
            this.isWorking = false;
          }
          this.isWorking = false;
          this.onNoClick(true);
      }, (err) => this.responseError(err));
    } else {
      this.service.update(EEndpoints.TrackWork, model)
      .subscribe((response: ResponseApi<ITrackWork>) => {
          if (response.code == 100) {
            this.isWorking = false;
          }
          this.isWorking = false;
          this.onNoClick(true);
      }, (err) => this.responseError(err));
      }
    
  }

  openDetails(row: any): void {
    //this.rowDetails = row;              
    const dialogRef = this.dialog.open(AddProjectWorkDetailsComponent, {
      width: '700px',
      data: {
        action: this.translate.instant('general.save'),
        icon: 'save_outline',
        data: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result afterClosed: ', result);
      if (result !== undefined) {
        const data = result;
        //const find = this.worksSelected.find((x) => x.id === this.rowDetails.id && x.foreignWorkPerson[0].person.isInternal === this.rowDetails.foreignWorkPerson[0].person.isInternal);
        const find = this.worksSelected.find((x) => x.id === this.rowDetails.id);
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
        const index = this.worksSelected.findIndex((x) => x.id === this.rowDetails.id);
        this.worksSelected[index] = find;


        this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
        this.dataSourceSelect.paginator = this.paginator;
        this.dataSourceSelect.sort = this.sort;
      }
    });
  }

  openRelationVideoWork(row: any): void {
    this.rowDetails = row;              
    const dialogRef = this.dialog.open(AddRelationVideoworkComponent, {
      width: '700px',
      data: {
        action: this.translate.instant('general.save'),
        icon: 'save_outline',
        data: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const data = result;

        if(!data.isrc) {
          const find = this.worksSelected.find((x) => x.id === this.rowDetails.id);
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
          } else {
            find.foreignWorkRelatedId = data.itemId;
          }
          const index = this.worksSelected.findIndex((x) => x.id === this.rowDetails.id);
          this.worksSelected[index] = find;
        }else {
          const index = this.worksSelected.findIndex((x) => x.id === this.rowDetails.id);
          this.worksSelected[index] = data;
        }       

        this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
        this.dataSourceSelect.paginator = this.paginator;
        this.dataSourceSelect.sort = this.sort;
      }
    });
  }

  onNoClick(status: boolean = false): void {
    this.dialogRef.close(status);
  }

  changeIsWorking(value: boolean): void {
    //this.isWorking = value;
  }

  responseError(err: any) {
    console.log(err);
    //this.toaster.showToaster('Error de comunicacion con el servidor');
    this.changeIsWorking(false);
  }

}