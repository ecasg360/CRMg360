import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { SelectOption } from '@models/select-option.models';
import { EPersonType } from '@enums/personType';
import { allLang } from '@i18n/allLang';
import { IEditor } from '@models/editor';
import { AddEditorComponent } from '@modules/general/components/editor/add-editor/add-editor.component';
import { AddContactComponent } from '@shared/components/add-contact/add-contact.component';
import { PersonFormComponent } from '@shared/components/person-form/person-form.component';
import { ToasterService } from '@services/toaster.service';
import { AddPublisherComponent } from "../../../../modules/general/components/worksmanage/add-publisher/add-publisher.component";
import { IWorkPublisher } from "@models/IWorkPublisher";


@Component({
  selector: 'app-add-project-work-details',
  templateUrl: './add-project-work-details.component.html',
  styleUrls: ['./add-project-work-details.component.scss']
})
export class AddProjectWorkDetailsComponent implements OnInit {
  id: number;
  isWorking: boolean = false;
  isInternal: boolean = false;
  title: string;
  form: FormGroup;

  editorsList: IEditor[] = [];
  editors: SelectOption[] = [];
  associations: SelectOption[] = [];
  composers: SelectOption[] = [];
  productors: SelectOption[] = [];
  remixes: SelectOption[] = [];
  publishers: SelectOption[] = [];

  composersList = [];
  composersOriginal = [];

  publishersList = [];
  publishersOriginal = [];

  row: any;
  constructor(
    public dialogRef: MatDialogRef<AddProjectWorkDetailsComponent>,
    private service: ApiService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToasterService,
  ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.row = this.data.data;
    console.log('this.row en work details: ', this.row);
    console.log('this.row en work details publishers: ', this.row.workPublisher);
    this.title = (this.row.name)? this.row.name: this.row.itemName;

    if (this.row.foreignWorkPerson) {
      this.isInternal = this.row.foreignWorkPerson[0].person.isInternal;
      this.composers.push({
        value: this.row.foreignWorkPerson[0].person.id,
        viewValue: this.row.foreignWorkPerson[0].person.name + ' ' + this.row.foreignWorkPerson[0].person.lastName
      });
    } else {
      if (this.row.workCollaborator) {
        this.row.workCollaborator.forEach(colaborator => {
          this.composersList.push(
            {
              id: colaborator.composer.id,
              name: colaborator.composer.name,
              lastname: colaborator.composer.lastName
            }
          );
        });
      } else {
        this.isInternal = this.data.isInternal ? this.data.isInternal : !this.data.isExternal;
        this.getComposers();
      }
      if (this.row.workPublisher) {
        this.row.workPublisher.forEach(publisher => {
          console.log('publisher: ', publisher);
          this.publishersList.push(
            {
              id: publisher.publisher.id,
              name: publisher.publisher.name
            }
          );
        });
      } else {
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
  }

  configureForm(): void {
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
  }

  get f() { return this.form.controls; }

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

  getComposers(): void {
    this.service.get(EEndpoints.Composers)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100 && response.result) {
          this.composersOriginal = response.result;
          this.composers = response.result.map((s: any) => ({
            value: s.id,
            viewValue: s.name + ' ' + s.lastName
          }));
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
      }, (err) => this.responseError(err));
  }

  getPublishers() {
    this.service.get(EEndpoints.publisher)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100 && response.result) {
          console.log('response.result: ', response.result);
          this.publishersOriginal = response.result;
          this.publishers = response.result.map((s: any) => ({
            value: s.id,
            viewValue: s.name
          }));
        }
        if (this.row.workPublisher) {
          this.publishers.forEach(pub => {
            console.log('pub: ', pub);
            if (pub.value === this.row.workPublisher[0].publisher.id) {
              this.form.controls.personPublisherId.setValue(pub.value);
            }
          });
        }
      }, (err) => this.responseError(err));
  }

  getEditors(): void {
    const params = [];
    params['isInternal'] = this.isInternal ? this.isInternal : true;
    this.service.get(EEndpoints.EditorsByInternal, params)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.editorsList = response.result;
          this.editors = [];
          this.editorsList.forEach(element => {
            this.editors.push(
              {
                value: element.id,
                viewValue: element.dba
              }
            );
          });
          this.associations = [];

          if (this.row.workPublisher) {
            this.editors.forEach(editor => {
              if (editor.value === this.row.workPublisher[0].publisher.id) {
                this.form.controls.editorId.setValue(editor.value);
                this.selectEditor(editor);
              }
            });
          }

          if (this.row.ISRC) {
            const find = this.editors.find((x) => x.value === this.row.editorId);
            this.selectEditor(find)
          }
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

  selectEditor(event: any): void {
    this.associations = [];
    const find = this.editorsList.find((x) => x.id === event.value);
    this.associations.push({
      value: find.association.id,
      viewValue: find.association.name
    });
  }

  changePublisher(event: any): void {
    this.associations = [];
    console.log('this.publishersOriginal: ', this.publishersOriginal);
    console.log('event: ', event);
    const find = this.publishersOriginal.find((x) => x.id === event.value);
    console.log('find: ', find);
    if (find && find.association) {
      this.associations.push({
        value: find.association.id,
        viewValue: find.association.name
      });
      this.form.controls.associationId.setValue(find.association.id);
    } else {
      this.getAssociations();
    }
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
      let theComposers = '';
      this.composersList.forEach( (element, index) => {
        if (index === 0) {
          theComposers += element.id;
        } else {
          theComposers += ',' + element.id;
        }
      });
      this.form.controls.composersList.setValue(theComposers);
      this.form.controls.personComposerId.setValue(this.composersList[0].id);

      let thePublishers = '';
      this.publishersList.forEach( (element, index) => {
        if (index === 0) {
          thePublishers += element.id;
        } else {
          thePublishers += ',' + element.id;
        }
      });
      this.form.controls.publishersList.setValue(thePublishers);
      this.form.controls.personPublisherId.setValue(this.publishersList[0].id);
      
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
      //this.getProductors();
      this.getComposers();
    });
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

  addComposer() {
    let exists = false;
    this.composersList.forEach(element => {
      if (element.id === this.form.controls.personComposerId.value) {
        exists = true;
        this.toaster.showToaster('Already exists');
      }
    });
    if (!exists) {
      this.composersOriginal.forEach(element => {
        if (element.id === this.form.controls.personComposerId.value) {
          this.composersList.push(
            {
              id: element.id,
              name: element.name,
              lastname: element.lastName
            }
          );
          this.toaster.showToaster('Composer added');
        }
      });
    }
  }

  addPublisher() {
    this.isWorking = true;
    const dialogRef = this.dialog.open(AddPublisherComponent, {
        width: '1000px',
        data: {
            itemName: this.translate.instant('general.compositions'),
            percentagePending: 50, //this.percentagePending,
            workPublisher: {}
        }
    });
    dialogRef.afterClosed().subscribe(async (result: IWorkPublisher) => {
      console.log('result: ', result);
        if (result != undefined) {
          console.log('publishersList: ', this.publishersList);
            if (this.publishersList.findIndex(f => f.id == result.publisherId) < 0) {
              console.log('Entró al push');
                this.publishersList.push(
                  {
                    id: result.id,
                    name: result.publisher.name
                  }
                );
                this.publishers.push({
                  value: result.publisherId,
                  viewValue: result.publisher.name
                });
                console.log('this.publishers: ', this.publishers);
                this.publishers.forEach(element => {
                  console.log('element: ', element, result);
                  if (element.value == result.publisherId) {
                    this.form.controls.personPublisherId.setValue(result.publisherId);
                  }
                });
            }
        }
    });
    this.isWorking = false;
  }

  addPub() {
    let exists = false;
    console.log('this.publishersList: ', this.publishersList);
    console.log('this.publisherId: ', this.form.controls.personPublisherId.value);
    console.log('this.publishersOriginal: ', this.publishersOriginal);
    this.publishersList.forEach(element => {
      if (element.id === this.form.controls.personPublisherId.value) {
        exists = true;
        this.toaster.showToaster('Already exists');
      }
    });
    if (!exists) {
      this.publishersOriginal.forEach(element => {
        if (element.id === this.form.controls.personPublisherId.value) {
          this.publishersList.push(
            {
              id: element.id,
              name: element.name
            }
          );
          this.toaster.showToaster('Publisher added');
        }
      });
    }
  }

}
