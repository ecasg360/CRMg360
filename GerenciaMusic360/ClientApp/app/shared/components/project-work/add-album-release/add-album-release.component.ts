import { Component, OnInit, ViewChild, Inject, Optional, ElementRef } from '@angular/core';
import { IProjectType } from '@shared/models/project-type';
import { IProjectWork } from '@shared/models/project-work';
import { Album } from '@shared/models/album';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormControl, Validator } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@app/core/enums/endpoints';
import { ResponseApi } from '@shared/models/response-api';
import { allLang } from '@app/core/i18n/allLang';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { Observable } from 'rxjs';
import { SelectOption } from '@shared/models/select-option.models';
import { startWith, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { IProject } from '@models/project';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Work } from '@models/work';
import { IWorkCollaborator } from '@models/work-collaborator';
import { IEditor } from '@models/editor';
import { EPersonType } from '@enums/personType';
import { AddEditorComponent } from '@modules/general/components/editor/add-editor/add-editor.component';
import { AddContactComponent } from '@shared/components/add-contact/add-contact.component';
import { PersonFormComponent } from '@shared/components/person-form/person-form.component';
import { ToasterService } from '@services/toaster.service';
import { ITrack } from '@models/track';
import { ITrackWork } from '@models/track-work';
import { AddComposerComponent } from '../add-composer/add-composer.component';
import { AddArtistModalComponent } from '../add-artist-modal/add-artist-modal.component';
import { IWorkRecording } from '@models/work-recording';

@Component({
  selector: 'app-add-album-release',
  templateUrl: './add-album-release.component.html',
  styleUrls: ['./add-album-release.component.scss']
})
export class AddAlbumReleaseComponent implements OnInit {
  isWorking: boolean = false;
  projectId: number = 0;
  projectType: IProjectType;
  projectTypeId: number = 0;
  artistId: number = undefined;
  projectWorks: IProjectWork[] =[];
  project: IProject;
  action: string = this.translate.instant('track.createTrack');

  displayedColumns: string[] = ['select', 'name', 'ISRC'];
  dataSource: MatTableDataSource<any>;
  dataSourceSelect: MatTableDataSource<ITrack>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  innerWidth: any;
  isDataAvailable: boolean = true;

  composerFiltered: Observable<SelectOption[]>;
  composers: SelectOption[] = [];
  composersList: any[] = [];

  form: FormGroup;
  addArtistForm: FormGroup;
  get f() { return this.form.controls; }

  details: boolean = true;
  add: boolean = false;
  addWork: boolean = false;
  newContact: boolean = false;
  isNewWorkExternal: boolean = false;
  selectTracks: any[] = [];
  rowDetails: any;

  userCtrl = new FormControl();
  selectable = true;
  removable = true;
  addOnBlur = true;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  modelWork: Work;
  listCollaborators: any[];
  isEditData: boolean = false;
  modelProjectWork: IProjectWork = <IProjectWork>{};
  workId:number;
  projectWorkId:number;


  //Additional Field Work
  id: number;
  isInternal: boolean = false;
  editorsList: IEditor[] = [];
  editors: SelectOption[] = [];
  associations: SelectOption[] = [];
  productors: SelectOption[] = [];
  remixes: SelectOption[] = [];
  row: any;
  isInputDisabled: boolean = false;

  //SECTION TRACKS
  nameTrack = new FormControl({value: '', required: true});
  hasWork = new FormControl();
  worksFC = new FormControl('');
  ISRC = new FormControl({value: ''});
  numberTrack = new FormControl('');
  amountRevenue = new FormControl({value: ''});
  UPC = new FormControl({value: ''});
  time = new FormControl(''/*,Validators.pattern("^[0-9]{2}:[0-5]{1}\d{1}$")*/);
  releaseDate : Date;
  soundRecordingRegistration : Date;
  musicCopyright : Date;
  soundExchangeRegistration : Date;
  workForHireSound : Date;
  workForHireVideo : Date;

  isHasWork: boolean = false;
  listWorks: Work[] = [];
  isTracksAvailable: boolean = false;
  tracksByWork: ITrack[] = [];
  workIdSelected: number = 0;
  filteredOptions: Observable<Work[]>;

  listTrackWork: ITrackWork[] = [];
  existISRC: boolean = false;
  modelProjectWorkSelected: IProjectWork = <IProjectWork>{};

  selectedComposers: IWorkCollaborator[] = []; 
  work: Work;  
  percentagePending: number = 100;

  selectedArtists: IWorkRecording[] = []; 
  
  constructor(public dialogRef: MatDialogRef<AddAlbumReleaseComponent>,
              private service: ApiService,
              private dialog: MatDialog,
              private translate: TranslateService,
              private formBuilder: FormBuilder,
              private _fuseTranslationLoaderService: FuseTranslationLoaderService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private toaster: ToasterService,) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
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

    if(this.isEditData){
      this.modelProjectWork = this.data.modelProjectWork;
      this.workId = this.data.workId;
      this.projectWorkId = this.data.projectWorkId;

      let percentageSum = 0;

      if(percentageSum >= 100){
        this.isInputDisabled = true;
      }else{
        this.isInputDisabled = false;
      }

      this.action =  this.translate.instant('track.editTrack');
    }
    //this.getWorks();

    //Work Detail
    this.getEditors();
    this.getProductors();
    this.getRemix();
    this.getAssociations();
    this.getWorks();
    this.configureForm();
  }

  configureForm(): void {
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

    if(this.modelProjectWork.workRecordings == null || this.modelProjectWork.workRecordings == undefined){
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

    if(this.isHasWork){
      this.worksFC = new FormControl({value: '', disabled: false});
      this.getWorks(this.modelProjectWork.workId);
    }else{
      this.isTracksAvailable = false;
      this.worksFC = new FormControl('');
      this.ISRC = new FormControl('');
      this.listWorks = [];
      this.filteredOptions = null;

      this.f.editorId.patchValue(null);
      this.f.personProducerId.patchValue(null);
      this.f.personRemixId.patchValue(null);
    }
  }

  bindExternalForm(name: string, form: FormGroup) {
    this.addArtistForm.setControl(name, form);
  }

  displayFn(value): string {  
    return value ? value.viewValue : value;
  }

  onSelectionChanged(e) {  
    this.f.personId.setValue(e.option.value.value)
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getProjectType(): void {
    const params =[];
    params['id'] = this.projectTypeId;
    this.service.get(EEndpoints.ProjectType, params).subscribe((response: ResponseApi<IProjectType>) => {
      if (response.code == 100) {
        this.projectType = response.result;
      }
    }, (err) => this.responseError(err));
  }

  getTracks(): void {
    console.log('Entró a getTracks: ', this.projectId);
    const params =[];
    params['projectId'] = this.projectId;
    this.service.get(EEndpoints.TracksByProject, params)
        .subscribe((response: ResponseApi<any>) => {
            if (response.code == 100) {
              this.listCollaborators = response.result;
              this.dataSource = null;
              this.isDataAvailable = (response.result.length > 0);
              this.dataSource = new MatTableDataSource(response.result);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }

            this.isWorking = false;
    }, (err) => this.responseError(err));
  }

  getWorks(workId: number = 0) {
    console.log('getWorks: ');
    this.isWorking = true;
    this.service.get(EEndpoints.Works).subscribe(
      (response: ResponseApi<Work[]>) => {
        console.log('response getWorks: ', response);
        if (response.code == 100) {
          this.listWorks = response.result;
          this.filteredOptions = this.worksFC.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );

          if(workId > 0){
            this.work = this.listWorks.find(x=> x.id == workId);
            setTimeout(() => this.worksFC.setValue(this.work.name));

            let percentageSum = 0;
            this.selectedComposers = this.work.workCollaborator;

            this.selectedComposers.forEach(x => 
              percentageSum = percentageSum + x.percentageRevenue);

            this.percentagePending = this.percentagePending - percentageSum;

            this.workIdSelected = workId;
          }

        } else {
          this.toaster.showToaster('general.errors.requestError');
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  private _filter(value: string): Work[] {
    const filterValue = value.toLowerCase();
    let results = [];
    results = this.listWorks.filter(option => option.name.toLowerCase().includes(filterValue));
    return results;
  }

  addData(): void {
    this.details = false;
    this.add = true;
  }

  addExternalWork(): void {
    this.addWork = true;
  }

  closedExternalWork(): void {
    this.addWork = false;
  }

  save(): void {

    let track: ITrack = <ITrack>{};
    let trackWork: ITrackWork = <ITrackWork>{};

    this.isWorking = true;

    this.form.value.isInternal = !this.form.value.isInternal;

    let model = this.form.value;

      this.modelWork = <Work>{
      id: this.workId,
      name: model.name,
      description: model.name,
      amountRevenue: this.amountRevenue.value,
      rating: 0.0,
      statusRecordId: 1,
      isExternal: this.form.value.isInternal
    };

    if(!this.isEditData){
      if(!this.isHasWork){
        this.saveWork(this.modelWork, this.selectedComposers);
      }else{
          
          let foundWork = this.listWorks.find((x) => x.id === this.workIdSelected);
          if(foundWork != undefined && foundWork != null && foundWork.id > 0 ){
            
            this.saveProjectWorkTrack(foundWork);
          }
      }
    }else{
      if(!this.isHasWork){
        this.updateWork(this.modelWork, this.selectedComposers);
      }else{
          let foundWork = this.listWorks.find((x) => x.id === this.workIdSelected);
          console.log('foundWork: ', foundWork);
          if(foundWork != undefined && foundWork != null && foundWork.id > 0 ){
            console.log('entró al if: ');
            this.updateProjectWorkTrack(foundWork);
          }
      }
    }
  }

  saveProjectWorkTrack(model: Work): void {
    let projectWork: IProjectWork = <IProjectWork>{};

      projectWork = <IProjectWork>{
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
      personRemixName : this.f.personRemixName.value
    };

    this.service.save(EEndpoints.ProjectWork, projectWork).subscribe((response: ResponseApi<any>) => {
      if (response.code === 100) {
        let track:ITrack;
        track = {
          id: 0,
          workId: this.workIdSelected,
          projectId: this.projectId,
          name: this.nameTrack.value,
          numberTrack: this.numberTrack.value,
          time: this.time.value,
        }
        this.saveTrack(track);
      }
    }, (err) => this.responseError(err));
  }

  updateProjectWorkTrack(model: Work): void {

    const workCollaborators: IWorkCollaborator[] = [];
    const workRecordings: IWorkRecording[] = [];
    let composerId: number;

    //COMPOSERS
    this.selectedComposers.forEach((x) => {
        workCollaborators.push(<IWorkCollaborator>{
        id: 0,
        workId: model.id,
        composerId: x.composerId,
        amountRevenue: x.amountRevenue,
          percentageRevenue: x.percentageRevenue,
          isCollaborator: false
      });
    });

    //ARTISTS
    this.selectedArtists.forEach((x) => {
      workRecordings.push({
        id: 0,
        workId: model.id,
        artistId: x.artistId,
        amountRevenue: x.amountRevenue,
      });
    });

    if(workCollaborators.length > 0){
      composerId = workCollaborators[0].composerId;
      this.updateWorkCollaborators(workCollaborators);
    }

    if(workRecordings.length > 0){
      this.updateWorkRecordings(workRecordings);
    }

    //PROJECT WORK
    let projectWork: IProjectWork = <IProjectWork>{};

      projectWork = <IProjectWork>{
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
      personRemixName : this.f.personRemixName.value
    };

    console.log('projectWork: ', projectWork);

    this.service.update(EEndpoints.ProjectWork, projectWork).subscribe((response: ResponseApi<any>) => {
      console.log('response ProjectWork: ', response);
      if (response.code === 100) {
        let track:ITrack;
        track = {
          id: this.modelProjectWork.trackId,
          workId: this.workIdSelected,
          projectId: this.projectId,
          name: this.nameTrack.value,
          numberTrack: this.numberTrack.value,
          time: this.time.value,
          releaseDate: this.f.releaseDate.value,
          soundRecordingRegistration: this.f.soundRecordingRegistration.value,
          musicCopyright: this.f.musicCopyright.value,
          soundExchangeRegistration: this.f.soundExchangeRegistration.value,
          workForHireSound: this.f.workForHireSound.value,
          workForHireVideo: this.f.workForHireVideo.value
        }
        console.log('track: ', track);
        this.updateTrack(track);
      }
    }, (err) => this.responseError(err));
  }

  saveWork(model: Work, selectedComposers: IWorkCollaborator[]): void {
    delete model.id;

    this.service.save(EEndpoints.Work, model)
    .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
           const workCollaborators: IWorkCollaborator[] = [];
           const workRecordings: IWorkRecording[] = [];
           let composerId: number;

           //COMPOSERS
           selectedComposers.forEach((x) => {
               workCollaborators.push(<IWorkCollaborator>{
              id: 0,
              workId: parseInt(response.result.id),
              composerId: x.composerId,
              amountRevenue: x.amountRevenue,
                percentageRevenue: x.percentageRevenue,
              isCollaborator: false
            });
          });

          //ARTISTS
          this.selectedArtists.forEach((x) => {
            workRecordings.push({
              id: 0,
              workId: parseInt(response.result.id),
              artistId: x.artistId,
              amountRevenue: x.amountRevenue,
            });
          });

          if(workCollaborators.length > 0){
            composerId = workCollaborators[0].composerId;
            this.saveWorkCollaborators(workCollaborators);
          }

          if(workRecordings.length > 0){
            this.saveWorkRecordings(workRecordings);
          }

          this.saveProjectWork(response.result.id , composerId, model.name, model.isExternal )
        }
    }, (err) => this.responseError(err));
  }

  saveWorkCollaborators(workCollaborators: IWorkCollaborator[]): void {
    this.service.save(EEndpoints.WorkCollaborators, workCollaborators)
    .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          
        }
    }, (err) => this.responseError(err));
  }

  saveWorkRecordings(workRecordings: IWorkRecording[]): void {
    this.service.save(EEndpoints.WorkRecordings, workRecordings)
    .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          
        }
    }, (err) => this.responseError(err));
  }

  saveTrack(model: ITrack): void {
    delete model.isrc;

    this.service.save(EEndpoints.Track, model)
    .subscribe((response: ResponseApi<ITrack>) => {
        if (response.code == 100) {

          let trackWork: ITrackWork;

          trackWork = {
            id: 0,
            trackId: response.result.id,
            isrc: this.ISRC.value,
            upc: this.UPC.value,
          };

          this.saveTrackWork(trackWork);
        }
    }, (err) => this.responseError(err));
  }

  saveTrackWork(model: ITrackWork): void {
    this.service.save(EEndpoints.TrackWork, model)
    .subscribe((response: ResponseApi<ITrackWork>) => {
        if (response.code == 100) {
          this.isWorking = false;
          this.onNoClick(true);
        }
        this.isWorking = false
    }, (err) => this.responseError(err));
  }

  updateTrack(model: ITrack): void {
    delete model.isrc;

    this.service.update(EEndpoints.Track, model)
    .subscribe((response: ResponseApi<ITrack>) => {
      console.log('response Track: ', response);
        if (response.code == 100) {
          let trackWork: ITrackWork;

          trackWork = {
            id: this.modelProjectWork.trackWorkId,
            trackId: this.modelProjectWork.trackId,
            isrc: this.ISRC.value,
            upc: this.UPC.value,
          };
          console.log('trackWork: ', trackWork);

          this.updateTrackWork(trackWork);
        }
    }, (err) => this.responseError(err));
  }

  updateTrackWork(model: ITrackWork): void {
    this.service.update(EEndpoints.TrackWork, model)
    .subscribe((response: ResponseApi<ITrackWork>) => {
      console.log('response TrackWork: ', response);
        if (response.code == 100) {
          this.isWorking = false;
          this.onNoClick(true);
        }
        this.isWorking = false
    }, (err) => this.responseError(err));
  }

  saveProjectWork(workId: number, composerId: number, nameWork: string, isExternal: boolean ): void {
    let model = this.form.value;
    let projectWork: IProjectWork = <IProjectWork>{};

      projectWork = <IProjectWork>{
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
        personRemixName : model.personRemixName
    };

    this.service.save(EEndpoints.ProjectWork, projectWork).subscribe((response: ResponseApi<any>) => {
      if (response.code === 100) {

        let track:ITrack;
        track = {
          id: 0,
          workId: workId,
          projectId: this.projectId,
          name: this.nameTrack.value,
          numberTrack: this.numberTrack.value,
          time: this.time.value,
          releaseDate: this.f.releaseDate.value,
          soundRecordingRegistration: this.f.soundRecordingRegistration.value,
          musicCopyright: this.f.musicCopyright.value,
          soundExchangeRegistration: this.f.soundExchangeRegistration.value,
          workForHireSound: this.f.workForHireSound.value,
          workForHireVideo: this.f.workForHireVideo.value,
        }

        this.saveTrack(track);
      }
    }, (err) => this.responseError(err));
  }


  updateWork(model: Work, selectedComposers: IWorkCollaborator[]): void {
    this.service.save(EEndpoints.Work, model)
    .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          const workCollaborators: IWorkCollaborator[] = [];
          const workRecordings: IWorkRecording[] = [];
          let composerId: number;

          //COMPOSERS
          selectedComposers.forEach((x) => {
              workCollaborators.push(<IWorkCollaborator>{
              id: 0,
              workId: model.id,
              composerId: x.composerId,
              amountRevenue: x.amountRevenue,
                percentageRevenue: x.percentageRevenue,
                isCollaborator: false
            });
          });

          //ARTISTS
          this.selectedArtists.forEach((x) => {
            workRecordings.push({
              id: 0,
              workId: model.id,
              artistId: x.artistId,
              amountRevenue: x.amountRevenue,
            });
          });

          if(workCollaborators.length > 0){
            composerId = workCollaborators[0].composerId;
            this.updateWorkCollaborators(workCollaborators);
          }

          if(workRecordings.length > 0){
            this.updateWorkRecordings(workRecordings);
          }

          this.updateProjectWork(this.workId ,composerId, model.name )
        }
    }, (err) => this.responseError(err));
  }

  updateWorkCollaborators(workCollaborators: IWorkCollaborator[]): void {
    this.service.update(EEndpoints.WorkCollaborators, workCollaborators)
    .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          
        }
    }, (err) => this.responseError(err));
  }

  updateWorkRecordings(workRecordings: IWorkRecording[]): void {
    this.service.update(EEndpoints.WorkRecordings, workRecordings)
    .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          
        }
    }, (err) => this.responseError(err));
  }

  updateProjectWork(workId: number, composerId: number, nameWork: string ): void {
    let model = this.form.value;
    let projectWork: IProjectWork = <IProjectWork>{};

      projectWork = <IProjectWork>{
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
        personRemixName : model.personRemixName
    };

    this.service.update(EEndpoints.ProjectWork, projectWork).subscribe((response: ResponseApi<any>) => {
      if (response.code === 100) {

        let track:ITrack;
        track = {
          id: this.modelProjectWork.trackId,
          workId: workId,
          projectId: this.projectId,
          name: this.nameTrack.value,
          numberTrack: this.numberTrack.value,
          time: this.time.value,
          releaseDate: this.f.releaseDate.value,
          soundRecordingRegistration: this.f.soundRecordingRegistration.value,
          musicCopyright: this.f.musicCopyright.value,
          soundExchangeRegistration: this.f.soundExchangeRegistration.value,
          workForHireSound: this.f.workForHireSound.value,
          workForHireVideo: this.f.workForHireVideo.value,
        }

        this.updateTrack(track);
      }
    }, (err) => this.responseError(err));
  }
  

  confirmSave(model: Album) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '700px',
      data: {
          text: this.translate.instant('messages.saveQuestion', { field: model.name }),
          action: this.translate.instant('general.save'),
          icon: 'save_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
          let confirm = result.confirm;
          if (confirm)
            this.save()
      }
    });
  }

  confirmDelete(id: number) {
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
            this.delete(id);
      }
    });
  }

  select(row: any): void {
    let find: any;
      const rowNew = _.cloneDeep(row);
      console.log(rowNew);
    find = this.selectTracks.findIndex((x) => x.id === rowNew.id);

    if (find !== -1) {
      if (this.selectTracks.length === 1){
        this.selectTracks = [];
      }
      this.selectTracks.splice(find, 1);
      this.dataSourceSelect.data = this.selectTracks;
      return;
    }

    this.selectTracks.push(rowNew);
    this.dataSourceSelect.data = this.selectTracks;
  }

  setInitWork(): void {
    this.details = true;
    this.add = false;
  }

  addNewContact(): void{
    this.newContact = true
  }

  closeNewContact(): void{
    this.newContact = false
  }

  saveSelectWorks(): void {
    this.isWorking = true;
    const projectWorks: IProjectWork[] = [];

    this.dataSourceSelect.data.forEach((x) => {
      let work: Work = this.listWorks.find(y => y.id == x.workId);

        projectWorks.push(<IProjectWork>{
        id: 0,
        projectId: this.projectId,
        albumId: work.albumId,
        itemId: x.workId,
        productionTypeId: this.projectTypeId,
        isInternal: !work.isExternal,
        albumName: "",
        itemName: work.name,
        productionTypeName: this.projectType.name,
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

    this.service.save(EEndpoints.ProjectWorksTracks, projectWorks).subscribe((response: ResponseApi < any > ) => {
      if (response.code === 100) {
        this.onNoClick(true);
      }
      this.isWorking = false;
    }, (err) => this.responseError(err));
  }

  delete(id: number) {
    const find = this.selectTracks.findIndex((x) => x.id === id);
    if (find !== -1) {
      const work = this.selectTracks.find((x) => x.id === id);
      work.select = false;
      this.selectTracks.splice(find, 1);
      this.dataSourceSelect.data = this.selectTracks;
    }
  }

  onNoClick(status: boolean = false): void {
    this.dialogRef.close(status);
  }

  responseError(err: any) {
    this.isWorking = false;
    console.log(err);
    //this.toaster.showToaster('Error de comunicacion con el servidor');
    //this.changeIsWorking(false);
  }


  //Methods Additional Field Work

  getProductors(): void {
    const params = [];
    params['personTypeId'] = EPersonType.Producer;
    this.service.get(EEndpoints.PersonByPersonType, params)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.productors = response.result.map((s: any) => ({
            value: s.id,
            viewValue: s.name + ' ' + s.lastName
          }));
        }
      }, (err) => this.responseError(err));
  }

  getRemix(): void {
    const params = [];
    params['personTypeId'] = EPersonType.Remix;
    this.service.get(EEndpoints.PersonByPersonType, params)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.remixes = response.result.map((s: any) => ({
            value: s.id,
            viewValue: s.name + ' ' + s.lastName
          }));
        }
      }, (err) => this.responseError(err));
  }

  getEditors(): void {
    const params = [];
    params['isInternal'] = this.isInternal;
    this.service.get(EEndpoints.EditorsByInternal, params)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.editorsList = response.result;
          this.editors = response.result.map((s: any) => ({
            value: s.id,
            viewValue: s.name
          }));
          this.associations = [];
        }
      }, (err) => this.responseError(err));
  }

  getAssociations(): void {
    this.service.get(EEndpoints.Associations)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.associations = response.result.map((s: any) => ({
            value: s.id,
            viewValue: s.name
          }));
        }
      }, (err) => this.responseError(err));
  }

  getTrackWork(): void {
    console.log('getTrackWork: ');
    this.service.get(EEndpoints.TrackWork)
      .subscribe((response: ResponseApi<ITrackWork[]>) => {
        if (response.code == 100) {
          this.listTrackWork = response.result;
        }
      }, (err) => this.responseError(err));
  }

  selectEditor(event: any): void {
    this.associations = [];
    const find = this.editorsList.find((x) => x.id === event.value);
    this.associations.push({
      value: find.association.id,
      viewValue: find.association.name
    });
  }

  private populateForm(data: any): void {
    Object.keys(this.form.controls).forEach(name => {
      if (this.form.controls[name]) {
        this.form.controls[name].patchValue(data[name]);
      }
    });
    this.id = data.id;
  }

  set(): void {
    if (this.form.valid) {
      let find:any;
      if (this.f.personProducerId.value) {
        let find = this.productors.find((x) => x.value === this.f.personProducerId.value);
        this.f.personProducerName.setValue(find.viewValue);
      }
      
      if (this.f.personRemixId.value) {
        find = this.remixes.find((x) => x.value === this.f.personRemixId.value);
        this.f.personRemixName.setValue(find.viewValue);
      }
      
      this.dialogRef.close(this.form.value);
    }
  }

  openDialogForAddEditor(): void {
    const editor: IEditor = <IEditor>{}
    const dialogRef = this.dialog.open(AddEditorComponent, {
      width: '700px',
      data: { model: editor },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.getEditors();
      }
    });
  }

  openDialogForAddRemix(): void {
    const dialogRef = this.dialog.open(AddContactComponent, {
      width: '900px',
      data: {
        id: 0,
        personTypeId: EPersonType.Remix,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRemix();
    });
  }

  openDialogForAddProducer(): void {
    const dialogRef = this.dialog.open(AddContactComponent, {
      width: '900px',
      data: {
        id: 0,
        personTypeId: EPersonType.Producer,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProductors();
    });
  }

  openDialogForAddComposer(): void {
    const dialogRef = this.dialog.open(PersonFormComponent, {
      width: '900px',
      data: {
        id: 0,   
        isComposer: true        
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProductors();
    });
  }

  //Methods Fix Add Tracks

  checkedHasWork(event): void {
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
  }

  enterWork(evt: any) {
    const found = this.listWorks.find(f => f.name == this.worksFC.value);
    if (found){
      this.f.goalId.patchValue(found.id);
    }
  }

  enterNameTrack(evt: any) {
    this.f.name.patchValue(this.nameTrack.value);
  }

  enterISRC(evt: any) {
    let valueISRC = this.ISRC.value;
    const found = this.listTrackWork.find(f => f.isrc == valueISRC);
    if(found != null && found != undefined && found.id > 0 && found.isrc != this.modelProjectWork.trackWorkISRC){
      this.existISRC = true;
    }else{
      this.existISRC = false;
    }
  }

  autocompleteOptionSelected($event: MatAutocompleteSelectedEvent) {
    this.workIdSelected = parseInt($event.option.id);
    this.getWorks(this.workIdSelected);
    this.getTracksByWork(this.workIdSelected);
  }

  selectTrack(track: ITrack) {
    this.ISRC = new FormControl({value: track.isrc, disabled: true});
    this.getProjectWorkByISRC(this.ISRC.value);
  }

  getTracksByWork(workId:number): void {
    const params = [];
    params['workId'] = workId;
    this.service.get(EEndpoints.TracksByWork, params)
      .subscribe((response: ResponseApi<any>) => {
          if (response.code == 100) {
              console.log(response);
          this.tracksByWork = response.result;
          this.isTracksAvailable = true;
        }
      }, (err) => this.responseError(err));
  }

  getProjectWorkByISRC(ISRC:string): void {
    const params = [];
    params['ISRC'] = ISRC;
    this.service.get(EEndpoints.ProjectWorkByISRC, params)
      .subscribe((response: ResponseApi<IProjectWork>) => {
        if (response.code == 100) {
          this.modelProjectWorkSelected = response.result;

          this.f.editorId.patchValue(this.modelProjectWorkSelected.editorId);
          this.f.personProducerId.patchValue(this.modelProjectWorkSelected.personProducerId);
          this.f.personRemixId.patchValue(this.modelProjectWorkSelected.personRemixId);

          // this.form = this.formBuilder.group({
          //   personProducerId: [this.modelProjectWorkSelected.personProducerId],
          //   editorId: [this.modelProjectWorkSelected.editorId],
          //   personRemixId: [this.modelProjectWorkSelected.personRemixId],
          // });

        }
      }, (err) => this.responseError(err));
  }

  showComposer(composer: IWorkCollaborator = <IWorkCollaborator>{}, isEdit: boolean = false){

    this.isWorking = true;
    let component: any = AddComposerComponent;
    const dialogRef = this.dialog.open(component, {
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
    dialogRef.afterClosed().subscribe((result: IWorkCollaborator) => {
      if (result != undefined) {
        //Setee temporalmente si es o no una edicion en la variable isInternal
        if(result.composer.isInternal){
          if(result.composer.personTypeId !== result.composerId){
            this.selectedComposers = this.selectedComposers.filter(x => x.composerId !== result.composer.personTypeId);
          }else{
            this.selectedComposers = this.selectedComposers.filter(x => x.composerId !== result.composerId);
          }
        }else{
          let composer = this.selectedComposers.filter(x => x.composerId == result.composerId)[0];
          if(this.selectedComposers.length > 0 && composer !== undefined && composer.composerId > 0){
            this.selectedComposers = this.selectedComposers.filter(x => x.composerId !== result.composerId);
            result.percentageRevenue = result.percentageRevenue + composer.percentageRevenue;
          }
        }
        this.selectedComposers.push(result);
      }else{
        if(isEdit){
          this.percentagePending = this.percentagePending - composer.percentageRevenue;
        }
      }

      let percentageSum = 0;
      this.selectedComposers.forEach(x => percentageSum = percentageSum + x.percentageRevenue);
      this.percentagePending = 100 - percentageSum;

      if(this.percentagePending.toString().indexOf('-') >= 0 ){
        this.percentagePending = 0;
      }
    });
    this.isWorking = false;
  }

  showArtist(artist: IWorkRecording = <IWorkRecording>{}, isEdit: boolean = false){
    this.isWorking = true;
    let component: any = AddArtistModalComponent;
    const dialogRef = this.dialog.open(component, {
      width: '1000px',
      data: {
        isAddArtist: true,
        isEditArtist: isEdit,
        idArtistEdit: artist.artistId,
        workRecording: artist,
        itemName: 'Artist',
      }
    });
    dialogRef.afterClosed().subscribe((result: IWorkRecording) => {
      if (result != undefined) {
        //Setee temporalmente si es o no una edicion en la variable isInternal
        if(result.isEdit){
          if(result.artistId !== result.idEdit){
            this.selectedArtists = this.selectedArtists.filter(x => x.artistId !== result.idEdit);
          }else{
            this.selectedArtists = this.selectedArtists.filter(x => x.artistId !== result.artistId);
          }
        }else{
          let artist = this.selectedArtists.filter(x => x.artistId == result.artistId)[0];
          if(this.selectedArtists.length > 0 && artist !== undefined && artist.artistId > 0){
            this.selectedArtists = this.selectedArtists.filter(x => x.artistId !== result.artistId);
          }
        }
        this.selectedArtists.push(result);
      }
    });
    this.isWorking = false;
  }

  confirmDeleteComposer(composer: IWorkCollaborator): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
        width: '400px',
        data: {
            text: this.translate.instant('messages.deleteQuestion', { field: 'Composer' }),
            action: this.translate.instant('general.delete'),
            icon: 'delete_outline'
        }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
            let confirm = result.confirm;
            if (confirm)
                this.deleteComposer(composer);
        }
    });
  }

  deleteComposer(composer: IWorkCollaborator):void{
    this.selectedComposers = this.selectedComposers.filter(x => x.composerId !== composer.composerId);
    this.percentagePending = this.percentagePending + composer.percentageRevenue;
  }

  confirmDeleteArtist(artist: IWorkRecording): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
        width: '400px',
        data: {
            text: this.translate.instant('messages.deleteQuestion', { field: 'Artist' }),
            action: this.translate.instant('general.delete'),
            icon: 'delete_outline'
        }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
            let confirm = result.confirm;
            if (confirm)
                this.deleteArtist(artist);
        }
    });
  }

  deleteArtist(artist: IWorkRecording):void{
    this.selectedArtists = this.selectedArtists.filter(x => x.artistId !== artist.artistId);
  }

  validForm():boolean{
    if(this.nameTrack.value) {
      return true;
    }

    return false;
  }

}
