import { Component, OnInit, Optional, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { SelectOption } from '@models/select-option.models';
import { IProjectWork } from '@models/project-work';
import { allLang } from '@i18n/allLang';
import { IEditor } from '@models/editor';
import { IProject } from '@models/project';
import { IForeignWorkPerson } from '@models/foreignWorkPerson';
import { Work } from '@models/work';
import { AddProjectWorkDetailsComponent } from '../add-project-work-details/add-project-work-details.component';

@Component({
  selector: 'app-add-relation-videowork',
  templateUrl: './add-relation-videowork.component.html',
  styleUrls: ['./add-relation-videowork.component.scss']
})
export class AddRelationVideoworkComponent implements OnInit {
  form: FormGroup;
  addArtistForm: FormGroup;

  work: any;

  isWorking: boolean = false;
  isNewWork: boolean = false;
  row: any;
  isInternal: boolean = false;
  projectWorksVideo: IProjectWork[] = [];

  displayedColumns: string[] = ['select', 'name', 'ISRC', 'producerRemix'];
  dataSource: MatTableDataSource<any>;
  dataSourceSelect: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  innerWidth: any;
  isDataAvailable: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<AddRelationVideoworkComponent>,
    private service: ApiService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit() {
      this._fuseTranslationLoaderService.loadTranslations(...allLang);
      this.configureForm();
      this.getProjectWorks();
      this.row = this.data.data; 
      //this.isInternal = this.row.foreignWorkPerson[0].person.isInternal;
      // this.composers.push({
      //   value: this.row.foreignWorkPerson[0].person.id,
      //   viewValue: this.row.foreignWorkPerson[0].person.name + ' ' + this.row.foreignWorkPerson[0].person.lastName
      // });
      
      // this.getEditors();
      // this.getProductors();
      // this.getRemix();
      // this.configureForm();    
  
      // if(this.row.ISRC) {      
      //   this.populateForm(this.row);
      // }
    }

    configureForm(): void {
      //this.addArtistForm = this.formBuilder.group({});
      this.form = this.formBuilder.group({
        name: ['', [Validators.required]],
        isInternal: [true, [Validators.required]],
      });
    }

    get f() { return this.form.controls; }

    bindExternalForm(name: string, form: FormGroup) {
      this.addArtistForm.setControl(name, form);
    }

    //Get ProjectWorks for Video Music and Video Lyrics
    getProjectWorks(): void {
      this.service.get(EEndpoints.ProjectWorksByProjects).subscribe((response: ResponseApi<IProjectWork[]>) => {
        if (response.code == 100) {
          this.projectWorksVideo = response.result;
          this.dataSource = new MatTableDataSource(this.projectWorksVideo);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
        //this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
        }
      }, (err) => this.responseError(err));
    }

  select(row: any): void {
    this.dialogRef.close(row);
  }

  setWork(): void {
    this.isWorking = true;
    if (this.form.valid) {
      if (this.f.isInternal.value) {        
        this.saveWork();
      } else {
        this.saveForeignWork();
      }      
    }  
    this.isWorking = false;
  }

  saveWork(): void {    
    this.service.save(EEndpoints.Work, this.form.value)
    .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          response.result.itemId = response.result.id;
          this.work = response.result          
          this.openDetails(this.row);         
        }
    }, (err) => this.responseError(err));
  } 

  saveForeignWork(): void {    
    this.service.save(EEndpoints.ForeignWork, this.form.value)
    .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          response.result.itemId = response.result.id;
          this.work = response.result;          
          this.openDetails(this.row);
        }
    }, (err) => this.responseError(err));
  } 

  openDetails(row: any): void {
    //this.rowDetails = row;              
    const dialogRef = this.dialog.open(AddProjectWorkDetailsComponent, {
      width: '700px',
      data: {          
          action: this.translate.instant('general.save'),
          icon: 'save_outline',
          data: row,
          isInternal: this.f.isInternal.value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {          
          const data = result;
          this.row.ISRC = data.ISRC;
          this.row.personProducerId = data.personProducerId;
          this.row.isComposerInternal = data.isComposerInternal;
          this.row.personComposerId = data.personComposerId;
          this.row.editorId = data.editorId;
          this.row.associationId = data.associationId;
          this.row.personRemixId = data.personRemixId;
          this.row.personRemixName = data.personRemixName;
          this.row.personProducerName = data.personProducerName;
          this.row.isInternalRelated = this.f.isInternal.value;          
          if (this.f.isInternal.value) {
            this.row.workRelatedId = this.work.itemId;
          } else {
            this.row.foreignWorkRelatedId = this.work.itemId;
          }    
          this.row.workName = this.work.name;

          this.dialogRef.close(this.row);
      }
    });
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }

  set(): void {

  }

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }
  
  responseError(err: any) {
      this.isWorking = false;
      console.log(err);
      //this.toaster.showToaster('Error de comunicacion con el servidor');
      //this.changeIsWorking(false);
  }

}
