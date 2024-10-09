import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EEndpoints } from '@enums/endpoints';
import { ApiService } from '@services/api.service';
import { ResponseApi } from '@models/response-api';
import { SelectOption } from '@models/select-option.models';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab-marketing',
  templateUrl: './tab-marketing.component.html',
  styleUrls: ['./tab-marketing.component.css']
})
export class TabMarketingComponent implements OnInit {

  dataProjectFilter: FormGroup = new FormGroup({});
  listArtists: SelectOption[] = [];
  listSingles: SelectOption[] = [];

  optionDefault: SelectOption = {
    value: 0,
    viewValue: "-- All --",
  };

  artistId: number;
  singleId: number;

  isWorking: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.configureForm();
    this.getArtists();
  }

  //#region form
  get f() { return this.dataProjectFilter.controls; }

  private configureForm(): void {
      this.dataProjectFilter = this.formBuilder.group({
          artistId: [this.artistId, []],
          singleId: [this.singleId, []],
      });
  }

  getArtists() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Artists).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.listArtists = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });

          this.listArtists.push(this.optionDefault);
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  getCampaigns() {
    console.log('Entró al getCampaigns: ', this.dataProjectFilter.controls.artistId.value);
    const artistId = this.dataProjectFilter.controls.artistId.value;
    this.apiService.get(EEndpoints.ProjectArtistTracks, { ArtistId: artistId }).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          console.log('response de getSingles: ', response.result);
          this.listSingles = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });
          if (this.listSingles.length > 0) {
            this.listSingles.push(this.optionDefault);
          } else {
            this.toasterService.showToaster(this.translate.instant('general.errors.noCampaigns'));
          }

          console.log('this.listSingles: ', this.listSingles);
        } else {
          this.toasterService.showToaster('Error obteniendo contactos del proyecto');
        }
        this.isWorking = false;
    }, err => this.responseError(err)
    );
  }

  searchByFilter() {
    const marketingId = this.dataProjectFilter.controls.singleId.value;
    console.log('marketingId: ', marketingId);
    if (marketingId !== null) {
      const artistId = this.dataProjectFilter.controls.artistId.value;
      this.apiService.download(
        EEndpoints.ReportMarketing,
        { ArtistId: artistId, MarketingId: marketingId }
      ).subscribe(
        fileData => {
          console.log('fileData report marketing: ', fileData);
          const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let link = document.createElement("a");
          if (link.download !== undefined) {
              let url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", "Report Marketing Template");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
          this.isWorking = false;
        }, err => this.responseError(err)
      );
    } else {
      this.toasterService.showToaster(
        this.translate.instant('report.general.form.selectCampaign')
      );
    }
    
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
