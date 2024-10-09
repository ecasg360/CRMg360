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

@Component({
  selector: 'app-tab-contact',
  templateUrl: './tab-contact.component.html',
  styleUrls: ['./tab-contact.component.css']
})
export class TabContactComponent implements OnInit {

  dataContactFilter: FormGroup = new FormGroup({});
  name: string;
  lastName: string;
  secondLastName: string;
  officePhone: string;
  cellPhone: string;
  email: string;
  expireDate: Date;
  typeId: number;
  genderId: number;

  listTypes: SelectOption[] = [];
  listGenders: SelectOption[] = [];

  contacts: IPerson[] = [];
  isWorking: boolean = false;

  dataSource: MatTableDataSource<IPerson> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true } as any) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isDataAvailable = false;
  displayedColumns: string[] = ['name', 'personType', 'officePhone', 'cellPhone', 'email', 'birthDate', 'gender'];

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
    this.getContacts();
    this.getTypes();
    this.getGenders();
  }

  //#region form
  get f() { return this.dataContactFilter.controls; }

  private configureForm(): void {
      this.dataContactFilter = this.formBuilder.group({
          name: [this.name, []],
          lastName: [this.lastName, []],
          secondLastName: [this.secondLastName, []],
          officePhone: [this.officePhone, []],
          cellPhone: [this.cellPhone, []],
          email: [this.email, []],
          typeId: [this.typeId, []],
          genderId: [this.genderId, []],
      });
  }

  getContacts() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ProjectContacts).subscribe(
        (response: ResponseApi<IPerson[]>) => {
            if (response.code == 100 && response.result.length) {
              console.log(response.result);
              
                this.contacts = response.result;
                //let projectsOrderBudget = response.result.filter(f => f.statusRecordId < 3).sort((a, b) => (a.totalBudget > b.totalBudget) ? 1 : -1);
                //let projectsOrderSpent = response.result.filter(f => f.statusRecordId < 3).sort((a, b) => (a.spent > b.spent) ? 1 : -1);

            }
            this.isWorking = false;
        }, (err) => this.responseError(err));
  }

  getTypes() {
    this.isWorking = true;
    const params = { entityId: 9 };
    this.apiService.get(EEndpoints.PersonTypes, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          console.log(response.result);
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

  getGenders() {
    this.isWorking = true;

    this.listGenders = [];

    this.listGenders.push({
      value: 'M',
      viewValue: this.translate.instant('report.contact.male'),
    });

    this.listGenders.push({
      value: 'F',
      viewValue: this.translate.instant('report.contact.female'),
    });

    this.listGenders.push(this.optionDefault);
  }

  searchAll(): void {
    this.isWorking = true;
    this.dataSource.data = this.contacts;
    this.isWorking = false;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  searchByFilter(): void {
    this.isWorking = true;
    let name = this.f.name.value;
    let lastName = this.f.lastName.value;
    let secondLastName = this.f.secondLastName.value;
    let officePhone = this.f.officePhone.value;
    let cellPhone = this.f.cellPhone.value;
    let email = this.f.email.value;
    let typeId = this.f.typeId.value;
    let genderId = this.f.genderId.value;

    let contactsFilter = this.contacts;

    if(name != "" && name != null){
      contactsFilter = contactsFilter.filter(
        (f: IPerson) => f.name.toLowerCase() == name.toLowerCase() );
    }

    if(lastName != "" && lastName != null){
      contactsFilter = contactsFilter.filter(
        (f: IPerson) => f.lastName.toLowerCase() == lastName.toLowerCase() );
    }

    if(secondLastName != "" && secondLastName != null){
      contactsFilter = contactsFilter.filter(
        (f: IPerson) => f.secondLastName.toLowerCase() == secondLastName.toLowerCase() );
    }

    if(officePhone != "" && officePhone != null){
      contactsFilter = contactsFilter.filter(
        (f: IPerson) => f.officePhone.toLowerCase() == officePhone.toLowerCase() );
    }

    if(cellPhone != "" && cellPhone != null){
      contactsFilter = contactsFilter.filter(
        (f: IPerson) => f.cellPhone.toLowerCase() == cellPhone.toLowerCase() );
    }

    if(email != "" && email != null){
      contactsFilter = contactsFilter.filter(
        (f: IPerson) => f.email.toLowerCase() == email.toLowerCase() );
    }

    if(typeId > 0 && typeId != null){
      contactsFilter = contactsFilter.filter(
        (f: IPerson) => f.personTypeId == typeId);
    }

    if(genderId != "" && genderId != null){
      contactsFilter = contactsFilter.filter(
        (f: IPerson) => f.gender.toLowerCase() == genderId.toLowerCase() );
    }

    this.isDataAvailable = (contactsFilter.length > 0);
    this.dataSource = new MatTableDataSource(contactsFilter);
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
    this.isDataAvailable = (this.contacts.length > 0);
    this.dataSource = new MatTableDataSource(this.contacts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}

  downloadReport(id: number, name:string): void{

  }

  downloadReportContacts() {
    let contacts = <IPerson[]> this.dataSource.data;

    const idContactList: number[] = [];

    contacts.forEach((x) => {
      idContactList.push(x.id);
    });
    
    if(contacts.length > 0){
      this.isWorking = true;
      const idContactsJSON = JSON.stringify(idContactList);
      var result = idContactsJSON.substring(1, idContactsJSON.length-1); 
      console.log(result)
      const params = { idContactsJSON: idContactsJSON };
      this.apiService.download(EEndpoints.ReportContacts, params ).subscribe(fileData => {
          const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let link = document.createElement("a");
          if (link.download !== undefined) {
              let url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", "Report Contacts Template");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
          this.isWorking = false;
      }, err => this.responseError(err));
    }else{
      this.toasterService.showToaster(this.translate.instant('report.contact.messages.empty'));
      this.isWorking = false;
    }
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
