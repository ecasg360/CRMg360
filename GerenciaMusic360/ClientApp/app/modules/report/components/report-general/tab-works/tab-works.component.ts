import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectOption } from '@models/select-option.models';
import { MatTableDataSource, MatSlideToggle, MatSlider, MatPaginator, MatSort } from '@angular/material';
import { IPerson } from '@models/person';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { Options } from 'ng5-slider';
import { stat } from 'fs';
import { Work } from '@models/work';

@Component({
  selector: 'app-tab-works',
  templateUrl: './tab-works.component.html',
  styleUrls: ['./tab-works.component.css']
})
export class TabWorksComponent implements OnInit {

  dataWorkFilter: FormGroup = new FormGroup({});
  name: string;
  description: string;
  amountRevenue: number;
  rating: number;
  registeredWork: boolean;
  registerNum: number;
  registerDate: Date;
  genreMusicalId: number;
  certifiedWork: boolean;
  licenseNum: number;

  listGenresMusicals: SelectOption[] = [];

  works: Work[] = [];
  isWorking: boolean = false;

  dataSource: MatTableDataSource<Work> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true } as any) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isDataAvailable = false;
  displayedColumns: string[] = ['name', 'description', 'amountRevenue', 'rating', 'registerNum', 'registerDate', 'genreMusical', 'licenseNum', 'action'];

  optionDefault: SelectOption = {
    value: 0,
    viewValue: "-- All --",
  };

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private apiService: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.configureForm();
    this.getWorks();
    this.getGenresMusicals();
  }

  //#region form
  get f() { return this.dataWorkFilter.controls; }

  private configureForm(): void {
      this.dataWorkFilter = this.formBuilder.group({
          name: [this.name, []],
          description: [this.description, []],
          genreMusicalId: [this.genreMusicalId, []],
          amountRevenue: [this.amountRevenue, []],
          rating: [this.rating, []],
          registeredWork: [this.registeredWork, []],
          registerNum: [this.registerNum, []],
          registerDate: [this.registerDate, []],
          certifiedWork: [this.certifiedWork, []],
          licenseNum: [this.licenseNum, []],
      });
  }

  getWorks() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Works).subscribe(
        (response: ResponseApi<Work[]>) => {
            if (response.code == 100 && response.result.length) {
              
                this.works = response.result;

                console.log(this.works);

                this.works.forEach((x) => {
                  let musicalGenre = this.listGenresMusicals.filter(y => y.value == x.musicalGenreId);
                  if(musicalGenre.length > 0){
                    x.musicalGenre = musicalGenre[0].viewValue;
                  }
                });
                console.log(this.works);
                //let projectsOrderBudget = response.result.filter(f => f.statusRecordId < 3).sort((a, b) => (a.totalBudget > b.totalBudget) ? 1 : -1);
                //let projectsOrderSpent = response.result.filter(f => f.statusRecordId < 3).sort((a, b) => (a.spent > b.spent) ? 1 : -1);
            }
            this.isWorking = false;
        }, (err) => this.responseError(err));
  }

  getGenresMusicals() {
    this.isWorking = true;
    const params = { entityId: 9 };
    this.apiService.get(EEndpoints.MusicalGenres, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          console.log(response.result);
          this.listGenresMusicals = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });

          this.listGenresMusicals.push(this.optionDefault);
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  searchAll(): void {
    this.isWorking = true;
    this.isDataAvailable = (this.works.length > 0);
    this.dataSource = new MatTableDataSource(this.works);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.isWorking = false;

  }

  searchByFilter(): void {
    this.isWorking = true;
    let name = this.f.name.value;
    let description = this.f.description.value;
    let genreMusicalId = this.f.genreMusicalId.value;
    let amountRevenue = this.f.amountRevenue.value;
    let rating = this.f.rating.value;
    let registeredWork = this.f.registeredWork.value;
    let registerNum = this.f.registerNum.value;
    let registerDate = this.f.registerDate.value;
    let certifiedWork = this.f.certifiedWork.value;
    let licenseNum = this.f.licenseNum.value;

    console.log(genreMusicalId);


    let worksFilter = this.works;

    if(name != "" && name != null){
      worksFilter = worksFilter.filter(
        (f: Work) => f.name.toLowerCase() == name.toLowerCase() );
    }

    if(description != "" && description != null){
      worksFilter = worksFilter.filter(
        (f: Work) => f.description.toLowerCase() == description.toLowerCase() );
    }

    if(genreMusicalId > 0 && genreMusicalId != null){
      worksFilter = worksFilter.filter(
        (f: Work) => f.musicalGenreId == genreMusicalId );
    }

    if(amountRevenue != "" && amountRevenue != null){
      worksFilter = worksFilter.filter(
        (f: Work) => f.amountRevenue == amountRevenue );
    }

    if(rating != "" && rating != null){
      worksFilter = worksFilter.filter(
        (f: Work) => f.rating == rating );
    }

    if(registerNum != "" && registerNum != null){
      worksFilter = worksFilter.filter(
        (f: Work) => f.registerNum == registerNum );
    }

    if(registerDate != "" && registerDate != null){
      worksFilter = worksFilter.filter(
        (f: Work) => f.registerDate == registerDate );
    }

    if(registeredWork != null){
      worksFilter = worksFilter.filter(
        (f: Work) => f.registeredWork == registeredWork );
    }

    if(certifiedWork != null){
      worksFilter = worksFilter.filter(
        (f: Work) => f.certifiedWork == (certifiedWork ) );
    }

    if(licenseNum != "" && licenseNum != null){
      worksFilter = worksFilter.filter(
        (f: Work) => f.licenseNum == licenseNum );
    }

    this.isDataAvailable = (worksFilter.length > 0);
    this.dataSource = new MatTableDataSource(worksFilter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.isWorking = false;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }

  private _fillTable(): void {
    this.isDataAvailable = (this.works.length > 0);
    this.dataSource = new MatTableDataSource(this.works);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}

  downloadReport(workId: number): void{
    if(workId != null && workId !== undefined && workId > 0){
      this.isWorking = true;
      const params = { workId: workId };
      this.apiService.download(EEndpoints.ReportWork, params ).subscribe(fileData => {
          const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let link = document.createElement("a");
          if (link.download !== undefined) {
              let url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", "Report Work Template");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
          this.isWorking = false;
      }, err => this.responseError(err));
    }else{
      this.toasterService.showToaster(this.translate.instant('report.work.messages.empty'));
      this.isWorking = false;
    }
  }

  downloadReportProjects() {
    let works = <Work[]> this.dataSource.data;

    const idWorkList: number[] = [];

    works.forEach((x) => {
      idWorkList.push(x.id);
    });
    
    if(works.length > 0){
      this.isWorking = true;
      const idWorksJSON = JSON.stringify(idWorkList);
      var result = idWorksJSON.substring(1, idWorksJSON.length-1); 
      console.log(result)
      const params = { idWorksJSON: idWorksJSON };
      this.apiService.download(EEndpoints.ReportWorks, params ).subscribe(fileData => {
          const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let link = document.createElement("a");
          if (link.download !== undefined) {
              let url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", "Report Works Template");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
          this.isWorking = false;
      }, err => this.responseError(err));
    }else{
      this.toasterService.showToaster(this.translate.instant('report.work.messages.empty'));
      this.isWorking = false;
    }
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
