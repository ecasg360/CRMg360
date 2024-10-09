import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectOption } from '@models/select-option.models';
import { MatTableDataSource, MatSlideToggle, MatSlider, MatPaginator, MatSort } from '@angular/material';
import { IProject } from '@models/project';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { Options } from 'ng5-slider';
import { stat } from 'fs';

@Component({
  selector: 'app-tab-project',
  templateUrl: './tab-project.component.html',
  styleUrls: ['./tab-project.component.css']
})
export class TabProjectComponent implements OnInit {

  dataProjectFilter: FormGroup = new FormGroup({});
  statusId: number;
  artistId: number;
  date: Date;
  expireDate: Date;
  typeId: number;

  listStatus: SelectOption[] = [];
  listArtists: SelectOption[] = [];
  listTypes: SelectOption[] = [];
  projects: IProject[] = [];

  isWorking: boolean = false;

  dataSource: MatTableDataSource<IProject> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true } as any) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isDataAvailable = false;
  isValidSlider = false;
  displayedColumns: string[] = ['name', 'projectTypeName', 'artist', 'startDate', 'endDate', 'totalBudget', 'spent', 'status'];//'action'
  minBudgetFilter: number;
  maxBudgetFilter: number;
  minSpentFilter: number;
  maxSpentFilter: number;

  optionDefault: SelectOption = {
    value: 0,
    viewValue: "-- All --",
  };

  minBudget: number;
  maxBudget: number;
  optionsBudget: Options;

  minSpent: number;
  maxSpent: number;
  optionsSpent: Options;

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private apiService: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.configureForm();
    this.getProjects();
    this.getStatus();
    this.getArtists();
    this.getProjectTypes();
  }

  //#region form
  get f() { return this.dataProjectFilter.controls; }

  private configureForm(): void {
      this.dataProjectFilter = this.formBuilder.group({
          statusId: [this.statusId, []],
          artistId: [this.artistId, []],
          typeId: [this.typeId, []],
          date: [this.date, []],
          expireDate: [this.expireDate, []],
      });
  }

  getProjects() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.Projects).subscribe(
        (response: ResponseApi<IProject[]>) => {
            if (response.code == 100 && response.result.length) {
                this.projects = response.result;
                
                let projectsOrderBudget = response.result.filter(f => f.statusRecordId < 3).sort((a, b) => (a.totalBudget > b.totalBudget) ? 1 : -1);
                this.minBudget = projectsOrderBudget[0].totalBudget;
                this.maxBudget = projectsOrderBudget[projectsOrderBudget.length - 1].totalBudget;

                let projectsOrderSpent = response.result.filter(f => f.statusRecordId < 3).sort((a, b) => (a.spent > b.spent) ? 1 : -1);
                this.minSpent = projectsOrderSpent[0].spent;
                this.maxSpent = projectsOrderSpent[projectsOrderSpent.length - 1].spent;

                this.minBudgetFilter = this.minBudget;
                this.maxBudgetFilter = this.maxBudget;
                this.minSpentFilter = this.minSpent;
                this.maxSpentFilter = this.maxSpent;

                this.optionsBudget = {
                  floor: 0,
                  ceil: this.maxBudget
                };

                this.optionsSpent = {
                  floor: 0,
                  ceil: this.maxSpent
                };

                this.isValidSlider = true;
            }
            this.isWorking = false;
        }, (err) => this.responseError(err));
  }

  getProjectTypes() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ProjectTypes).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.listTypes = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });

          this.listTypes.push(this.optionDefault);
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
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

  getStatus() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.StatusProjects).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.listStatus = response.result.map(m => {
            return {
              value: m.id,
              viewValue: m.name,
            }
          });

          this.listStatus.push(this.optionDefault);
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    );
  }

  searchAll(): void {
    this.isWorking = true;
    this.dataSource.data = this.projects;
    this.isWorking = false;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  searchByFilter(): void {
    this.isWorking = true;
    let statusId = this.f.statusId.value;
    let artistId = this.f.artistId.value;
    let typeId = this.f.typeId.value;
    let date = this.f.date.value;
    let expireDate = this.f.expireDate.value;
    let minBudget = this.minBudgetFilter;
    let maxBudget = this.maxBudgetFilter;
    let minSpent = this.minSpentFilter;
    let maxSpent = this.maxSpentFilter;

    let projectsFilter = this.projects;
    let parseDate = new Date(date);
    let parseEndDate = new Date(expireDate);

    let initialDate = parseDate.getFullYear().toString() + '-' + (parseDate.getMonth() < 10 ? '0' + (parseDate.getMonth() + 1).toString() : (parseDate.getMonth() + 1).toString() ) + '-' + parseDate.getDate().toString();
    let endDate = parseEndDate.getFullYear().toString() + '-' + (parseEndDate.getMonth() < 10 ? '0' + (parseEndDate.getMonth() + 1).toString() : (parseEndDate.getMonth() + 1).toString() ) + '-' + parseEndDate.getDate().toString();


    if(statusId > 0 && statusId != null){
      projectsFilter = projectsFilter.filter(
        (f: IProject) => f.statusProjectId == statusId);
     }

    if(artistId > 0 && artistId != null){
      projectsFilter = projectsFilter.filter(
        (f: IProject) => f.artistId == artistId);
    }

    if(typeId > 0 && typeId != null){
      projectsFilter = projectsFilter.filter(
        (f: IProject) => f.projectTypeId == typeId);
    }

    if(date != "" && date != null){
      projectsFilter = projectsFilter.filter(
        (f: IProject) => f.initialDate.split('T')[0] == initialDate );
    }

    if(expireDate != "" && expireDate != null){
      projectsFilter = projectsFilter.filter(
        (f: IProject) =>  f.endDate.split('T')[0] == endDate);
    }

    if(minBudget != null && maxBudget != null){
      projectsFilter = projectsFilter.filter(
        (f: IProject) =>  f.totalBudget >= minBudget && f.totalBudget <= maxBudget);
    }

    if(minSpent != null && maxSpent != null){
      projectsFilter = projectsFilter.filter(
        (f: IProject) =>  f.spent >= minSpent && f.spent <= maxSpent);
    }

    this.isDataAvailable = (projectsFilter.length > 0);
    this.dataSource = new MatTableDataSource(projectsFilter);
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

  changeRangeBudget() {
    this.minBudgetFilter = this.minBudget;
    this.maxBudgetFilter = this.maxBudget;
  }

  changeRangeSpent() {
    this.minSpentFilter = this.minSpent;
    this.maxSpentFilter = this.maxSpent;
  }

  private _fillTable(): void {
    this.isDataAvailable = (this.projects.length > 0);
    this.dataSource = new MatTableDataSource(this.projects);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}

  downloadReport(id: number, name:string): void{

  }

  downloadReportProjects() {
    let projects = <IProject[]> this.dataSource.data;

    const idProjectList: number[] = [];

    projects.forEach((x) => {
      idProjectList.push(x.id);
    });
    
    if(projects.length > 0){
      this.isWorking = true;
      const idProjectsJSON = JSON.stringify(idProjectList);
      var result = idProjectsJSON.substring(1, idProjectsJSON.length-1); 
      const params = { idProjectsJSON: idProjectsJSON };
      this.apiService.download(EEndpoints.ReportProjects, params ).subscribe(fileData => {
          const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let link = document.createElement("a");
          if (link.download !== undefined) {
              let url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", "Report Projects Template");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
          this.isWorking = false;
      }, err => this.responseError(err));
    }else{
      this.toasterService.showToaster(this.translate.instant('report.general.messages.empty'));
      this.isWorking = false;
    }
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
