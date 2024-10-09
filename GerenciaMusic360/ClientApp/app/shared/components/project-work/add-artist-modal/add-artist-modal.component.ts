import { Component, OnInit, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { IPerson } from '@models/person';
import { EEndpoints } from '@enums/endpoints';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from "@services/api.service";
import { ResponseApi } from '@models/response-api';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IWorkCollaborator } from '@models/work-collaborator';
import { SelectOption } from '@models/select-option.models';
import { IWorkRecording } from '@models/work-recording';
@Component({
  selector: 'app-add-artist-modal',
  templateUrl: './add-artist-modal.component.html',
  styleUrls: ['./add-artist-modal.component.css']
})
export class AddArtistModalComponent implements OnInit {
  @Input() workRecording: IWorkRecording = <IWorkRecording>{};
  
  @Output() formReady = new EventEmitter<FormGroup>();

  isWorking:boolean = false;

  artists: SelectOption[] = [];
  dataArtistForm: FormGroup;
  modelArtist: IWorkRecording = <IWorkRecording>{};
  itemName: string = "";
  listArtists: IPerson[] = [];

  action: string = this.translate.instant('general.save');
  isAddArtist: boolean = false;
  isEditArtist: boolean = false;
  idArtistEdit: number = 0;

  constructor(
    public dialogRef: MatDialogRef<AddArtistModalComponent>,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
  ) { }

  ngOnInit() {
    this.getArtists();
    this.workRecording = this.actionData.workRecording;
    this.itemName = this.actionData.itemName;
    if(this.actionData.isAddArtist){
      this.isAddArtist = this.actionData.isAddArtist;
      this.isEditArtist = this.actionData.isEditArtist;
      this.idArtistEdit = this.actionData.idArtistEdit;
    }
    if(this.workRecording.id > 0){
      this.action = this.translate.instant('general.save');
    }
    this.configureArtistForm();
  }

  private configureArtistForm(): void {

    this.dataArtistForm = this.formBuilder.group({
      id: [this.workRecording.id, []],
      workId: [this.workRecording.workId, []],
      artistId: [this.workRecording.artistId, [
        Validators.required
      ]],
    });

    this.formReady.emit(this.dataArtistForm);
  }

  getArtists():void{
    this.isWorking = true;
    this.ApiService.get(EEndpoints.Artists).subscribe(
      (response: ResponseApi<IPerson[]>) => {
        if (response.code == 100)
          this.listArtists = response.result;

          this.artists = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name + ' ' + m.lastName,
            }
          });
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  saveArtist() {
    this.modelArtist = <IWorkRecording>this.dataArtistForm.value;
    let objModelArtist = Object.assign({}, this.modelArtist);

    if(this.isAddArtist){
      this.onNoClickReturn(this.modelArtist)
    }else{
      //Update
      if (this.modelArtist.id) {
        this._updateArtist(this.modelArtist);
      }
      else {
        //Create
        delete objModelArtist["id"];
        this._createArtist(objModelArtist);
      }
    }
  }

  private _createArtist(model: IWorkRecording): void {
    model.amountRevenue = 0;
    this.isWorking = true;
    this.ApiService.save(EEndpoints.Artist, model).subscribe(
      data => {
        if (data.code == 100) {
          this.toasterService.showToaster(this.translate.instant('artist.messages.saved'));
          this.onNoClick(true);
        } else
          this.toasterService.showToaster(data.message);
        this.isWorking = false;
      }, (err) => this.responseError(err)
    );
  }

  private _updateArtist(model: IWorkRecording): void {
    model.amountRevenue = 0;
    this.isWorking = true;
    this.ApiService.update(EEndpoints.WorkCollaborator, model).subscribe(
      data => {
        if (data.code == 100) {
          this.toasterService.showToaster(this.translate.instant('artist.messages.saved'));
          this.onNoClick(true);
        } else
          this.toasterService.showToaster(data.message);
        this.isWorking = false;
      }, (err) => this.responseError(err)
    );
  }


  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

  onNoClickReturn(artist: IWorkRecording = undefined): void {
    
    let artistFind = this.listArtists.find(x => x.id == artist.artistId);
    artist.isEdit = this.isEditArtist;
    artist.idEdit = this.idArtistEdit;
    if(artistFind != undefined && artistFind != null){
      artist.detail = artistFind;
    }
    this.dialogRef.close(artist);
  }

}
