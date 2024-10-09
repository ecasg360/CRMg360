import { Component, OnInit, Input, Optional, Inject, ɵConsole } from '@angular/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ResponseApi } from '@models/response-api';
import { IBudgetEvent } from '@models/budget-event';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange } from '@angular/material';
import { SelectOption } from '@models/select-option.models';
import { IArtist } from '@models/artist';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-project-artist-event',
  templateUrl: './project-artist-event.component.html',
  styleUrls: ['./project-artist-event.component.css']
})
export class ProjectArtistEventComponent implements OnInit {

  @Input() artistId:number;
  @Input() projectId:number;
  @Input() projectTypeId:number;

  budgetEventList: IBudgetEvent[] = [];
  eventsSelect: any[] = [];

  isWorking: boolean = false;
  showList: boolean = false;
  artistList: SelectOption[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProjectArtistEventComponent>,
    private ApiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
  ) { }

  ngOnInit() {
    this.artistId = this.actionData.artistId;
    this.projectTypeId = this.actionData.projectTypeId;
    this.projectId = this.actionData.projectId;
    if(this.artistId > 0){
      this.getEventsByArtist(this.artistId, this.projectTypeId, this.projectId);
    }else{
      this.showList = true;
      this.getArtists();
    }
  }

  getArtists() {
    this.isWorking = true;
    this.ApiService.get(EEndpoints.Artists).subscribe(
      (response: ResponseApi<IArtist[]>) => {
        if (response.code == 100) {
          this.artistList = response.result.map(m => {
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

  onSelectedEvents(selectArtist: any): void {
    this.artistId = selectArtist.value;
    this.getEventsByArtist(this.artistId, this.projectTypeId, this.projectId);
  }

  private getEventsByArtist(artistId: number, projectTypeId: number, projectId: number): void {
    this.isWorking = true;
    const params = { artistId: artistId, projectTypeId: projectTypeId, projectId: projectId };
    this.ApiService.get(EEndpoints.EventsByArtist, params).subscribe(
      (response: ResponseApi<IBudgetEvent[]>) => {
        if (response.code == 100) {
          this.budgetEventList = response.result;
          this.eventsSelect = response.result.map(m => {
            return {
              checked: false,
              event: m
            }
          });
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  checkedEvent(event: MatCheckboxChange, events: any ) {
    events.checked = event.checked;
    console.log(events);
  }

  downloadReportBudget() {
    let events = this.eventsSelect.filter(event => event.checked == true).map(event => event.event);
    console.log(events);
    
    if(events.length > 0){
      this.isWorking = true;
      const eventsJSON = JSON.stringify(events);
      const params = { eventsJSON: eventsJSON };
      this.ApiService.download(EEndpoints.ReportEventsArtist, params ).subscribe(fileData => {
          const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let link = document.createElement("a");
          if (link.download !== undefined) {
              let url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", "Project Budget Template");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
          this.isWorking = false;
      }, err => this.responseError(err));
    }else{
      this.toasterService.showToaster(this.translate.instant('eventsArtist.messages.selectEvent'));
      this.isWorking = false;
    }
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

}
