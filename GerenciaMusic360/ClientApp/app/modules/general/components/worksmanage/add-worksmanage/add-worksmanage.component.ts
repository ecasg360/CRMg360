import { Component, OnInit, Optional, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { SelectOption } from "ClientApp/app/shared/models/select-option.models";
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@enums/endpoints';
import { allLang } from "@i18n/allLang";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { ResponseApi } from "@models/response-api";
import { TranslateService } from "@ngx-translate/core";
import { Work } from "@models/work";
import { ECategoriesModules } from "@enums/categories-modules";
import { AddComposerComponent } from "@shared/components/project-work/add-composer/add-composer.component";
import { IWorkCollaborator } from "@models/work-collaborator";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { AddPublisherComponent } from "../add-publisher/add-publisher.component";
import { IWorkPublisher } from "@models/IWorkPublisher";

@Component({
  selector: 'app-add-worksmanage',
  templateUrl: './add-worksmanage.component.html',
  styleUrls: ['./add-worksmanage.component.scss']
})
export class AddWorksmanageComponent implements OnInit {
  form: FormGroup;
  isWorking: boolean = false;
  modelWork: Work = <Work>{};

  albums: SelectOption[] = [];
  musicalGenres: SelectOption[] = [];
  status: SelectOption[] = [];
  composers: SelectOption[] = [];   

    selectedComposers: IWorkCollaborator[] = [];
    selectedPublisher: IWorkPublisher[] = [];
  percentagePending: number = 100;
  onlyView = false;

  constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<AddWorksmanageComponent>,
        private formBuilder: FormBuilder,
        private ApiService: ApiService,
        private toasterService: ToasterService,
        @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private translate: TranslateService,
  ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.modelWork = this.actionData.model;
    this.getStatus();
    this.configureForm();
    console.log('this.actionData: ', this.actionData);
    if (this.actionData.onlyView) {
      this.onlyView = true;
    }
  }

  configureForm(): void {

    if(this.modelWork.id > 0){
      let percentageSum = 0;
        this.selectedComposers = this.modelWork.workCollaborator;
        this.selectedPublisher = this.modelWork.workPublisher;

      this.selectedComposers.forEach(x => 
        percentageSum = percentageSum + x.percentageRevenue);

      this.percentagePending = this.percentagePending - percentageSum;
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
  }

  get f() { return this.form.controls; }

  save() {
    if (this.form.valid) {
        this.isWorking = true;
        let model = <Work>this.form.value;
        model.workPublisher = this.selectedPublisher.map(m => {
            return <IWorkPublisher>{
                amountRevenue: m.amountRevenue,
                associationId: m.associationId,
                id: 0,
                percentageRevenue: m.percentageRevenue,
                publisherId: m.publisherId,
                workId: model.id | 0
            }
        });
        model.workCollaborator =  this.selectedComposers.map(m => {
          console.log('The m of workCollaborator: ', m);
                    return <IWorkCollaborator>{
                        id: 0,
                        workId: model.id | 0,
                        composerId: m.composerId,
                        amountRevenue: m.amountRevenue,
                        percentageRevenue: m.percentageRevenue,
                        isCollaborator: false, 
                        associationId: m.associationId                      
                    };
        });
        console.log("Composers, publishers: ", this.selectedComposers, this.selectedPublisher);
        if (model.id == 0 || model.id == null) {
            delete model.id;
            this.saveWork(model);
        }
        else {
            this.updateWork(model);
        }        
    }
  }

    //#region API

    saveWork(model : any) {
        this.ApiService.save(EEndpoints.Work, model).subscribe(data => {
            if (data.code == 100) {
                this.toasterService.showTranslate('work.messages.saved');
                this.onNoClick(true);
            } else 
                this.toasterService.showTranslate('errors.errorSavingItem');
        }, err => this.responseError(err)
        );
    }

    updateWork(model: any) {
      console.log('model to update: ', model);
        this.ApiService.update(EEndpoints.Work, model).subscribe(data => {
            if (data.code == 100) {
            this.toasterService.showTranslate('messages.itemUpdated');
                this.onNoClick(true);                    
            } else 
                this.toasterService.showTranslate('errors.errorEditingItem');
        }, err => this.responseError(err));
    }

  getAlbums() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.Albums).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.albums = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }


  getStatus() {
    this.isWorking = true;
    const params = { moduleId: ECategoriesModules.Work };
    this.ApiService.get(EEndpoints.StatusByModule, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.status = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

    //#endregion

  showComposer(composer: IWorkCollaborator = <IWorkCollaborator>{}, isEdit: boolean = false) {

    this.isWorking = true;
    let component: any = AddComposerComponent;
    const dialogRef = this.dialog.open(component, {
      width: '1000px',
      data: {
        isAddComposer: true,
        isEditComposer: isEdit,
        idComposerEdit: composer.composerId,
          workCollaborator: composer,
          itemName: this.translate.instant('general.compositions'),
      }
    });
    dialogRef.afterClosed().subscribe((result: IWorkCollaborator) => {
      if (result != undefined) {
          if (this.selectedComposers.findIndex(f => f.composerId == result.composer.id) < 0) {
              this.selectedComposers.push(result);
          }        
      }
    });
    this.isWorking = false;
  }

    showPublisher() {
        this.isWorking = true;
        const dialogRef = this.dialog.open(AddPublisherComponent, {
            width: '1000px',
            data: {
                itemName: this.translate.instant('general.compositions'),
                percentagePending: this.percentagePending,
                workPublisher: {}
            }
        });
        dialogRef.afterClosed().subscribe((result: IWorkPublisher) => {
            if (result != undefined) {
                if (this.selectedPublisher.findIndex(f => f.publisherId == result.publisherId) < 0) {
                    this.selectedPublisher.push(result);
                }
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

    confirmDeletePublisher(publisher: IWorkPublisher): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: 'Publisher' }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm) {
                    this.selectedPublisher = this.selectedPublisher.filter(x => x.publisherId != publisher.publisherId);
                }
            }
        });
    }

  deleteComposer(composer: IWorkCollaborator):void{
    this.selectedComposers = this.selectedComposers.filter(x => x.composerId !== composer.composerId);
    this.percentagePending = this.percentagePending + composer.percentageRevenue;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

  private responseError(error: any): void {
    this.toasterService.showTranslate('general.errors.serverError');
    this.isWorking = false;
  }

}
