import { Component, OnInit } from '@angular/core';
import { ApiService } from "@services/api.service";
import { ResponseApi } from "@models/response-api";
import { EEndpoints } from "@enums/endpoints";
import { IMetas } from '@models/metas';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatTableDataSource, MatPaginatorIntl, MatPaginator, MatSort } from '@angular/material';
import { MetasAddComponent } from '../metas-add/metas-add.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from 'ClientApp/app/core/services/account.service';
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MetasReplyComponent } from '../metas-reply/metas-reply.component';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from '@models/user';
import { environment } from "@environments/environment";
//import daylireport
import { ReportAddComponent } from '../report-add/report-add.component';
@Component({
  selector: 'app-metas-list',
  templateUrl: './metas-list.component.html',
  styleUrls: ['./metas-list.component.css']
})
export class MetasListComponent implements OnInit {

  users = [];
  metas = [];
  metasForm: FormGroup;
  perm: any = {};
  profile: IUser;
  metasTotal = 0;
  metasMeasurables = 0;
  metasCompleted = 0;


  /* Gráfica */
  multi: any[] = [];
  view: any[] = [700, 900];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  legendPosition: string = 'below';
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Usuarios';
  showYAxisLabel: boolean = true;
  xAxisLabel = 'Metas';

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };
  schemeType: string = 'linear';

  showChart = false;

  constructor(
    private apiService: ApiService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.perm = this.activatedRoute.snapshot.data;
  }

  async ngOnInit() {
    console.log('this.perm MetasListComponent: ', this.perm);
    this.profile = JSON.parse(localStorage.getItem(environment.currentUser));
    this.configureForm();
    this.getStartOfWeek();
    this.getUsers();
  }

  private configureForm(): void {
    this.metasForm = this.formBuilder.group({
      theDate: [null, Validators.required]
    });
  }

  getUsers() {
    this.spinner.show();
    this.accountService.getUsers().subscribe(data => {
        if (data.code == 100) {
            data.result.forEach(f => {
                f.isActive = f.status === 1 ? true : false
            });
            this.users = data.result;
            this.users.sort(function(a, b) {
              let userNameA = a.name + ' ' + a.lastName + ' ' + a.secondLastName;
              let userNameB = b.name + ' ' + b.lastName + ' ' + b.secondLastName;
              if(userNameA < userNameB) {
                return -1;
              }
              if(userNameA > userNameB) {
                return 1;
              }
              return 0;
            });
            this.spinner.hide();
            this.getRecords();
        } else {
            this.spinner.hide();
            setTimeout(() => {
                this.toasterService.showToaster(data.message);
            }, 300);
        }
    }, (err) => console.error('Failed! ' + err));
  }

  getRecords() {
    this.metas = [];
    return this.apiService.get(
      EEndpoints.Metas,
      {
        initialDate: this.formatDate(this.metasForm.controls.theDate.value)
      }
    ).subscribe(
      (response: ResponseApi<IMetas[]>) => {
        if (response.code == 100) {
          let theUser = 0;
          this.users.forEach(user => {
            let meta = {
              show: false,
              userName: '',
              userPicture: '',
              userId: 0,
              completed: 0,
              measurables: 0,
              metas: []
            };
            let existsMetas = false;
            response.result.forEach(element => {
              if (user.id == element.userId) {
                console.log('Entró al if: ', element);
                this.metasTotal++;
                if (element.isMeasurable) {
                  this.metasMeasurables++;
                }
                if (element.isCompleted) {
                  this.metasCompleted++;
                }
                existsMetas = true;
                if (meta.userName === '') {
                  meta.userName = element.userName;
                  meta.userPicture = element.pictureUrl;
                  meta.userId = user.id;
                }
                meta.completed = element.isCompleted == 1
                  ? meta.completed + 1
                  : meta.completed;
                meta.measurables = element.isMeasurable == 1
                  ? meta.measurables + 1
                  : meta.measurables;
                meta.metas.push(
                  {
                    goalDescription: element.goalDescription,
                    completed: element.completed,
                    id: element.id,
                    isMeasurable: element.isMeasurable,
                    isCompleted: element.isCompleted
                  }
                );
              }
            });
            if (existsMetas) {
              this.metas.push(meta);
            } else {
              this.metas.push(
                {
                  userName: `${user.name} ${user.lastName} ${user.secondLastName}`,
                  userPicture: user.pictureUrl,
                  userId: user.id,
                  metas: []
                }
              );
            }
          });
          console.log('this.metas: ', this.metas);
          this.metas.forEach((meta, index) => {
            let measurables = meta.measurables ? meta.measurables : 0;
            let completed = meta.completed ? meta.completed : 0;
            this.multi.push(
              {
                "name": meta.userName,
                "series": [
                  {
                    "name": "Measurables",
                    "value": meta.measurables ? meta.measurables : 0
                  },
                  {
                    "name": "Completed",
                    "value": meta.completed ? meta.completed : 0
                  }
                ]
              }
            );
          });
          console.log('this.multi: ', this.multi);
        }
      }, err => console.log('http error', err)
    )
  }

  addRecord(meta) {
    this.openModal(meta);
  }

  openModal(row: any): void {
    let action = this.translate.instant(!row ? 'save': 'update');
    const dialogRef = this.dialog.open(MetasAddComponent, {
        width: '700px',
        data: {
            action: action,
            model: row,
            theDate: this.metasForm.controls.theDate.value
        }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.clearInfo();
          this.getRecords();
        }
    });
  }

  showList(meta) {
    meta.show = !meta.show;
  }

  getStartOfWeek() {
    var curr = new Date();
    // get current date 
    var first = curr.getDate() - curr.getDay() + 1; // First day is the  day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    var firstday = new Date(curr.setDate(first));
    //var lastday = new Date(curr.setDate(firstday.getDate() + 6)).toUTCString();
    let theDate =  firstday.getFullYear() + '-' + (firstday.getMonth() + 1) + '-' + firstday.getDate()
    let date =  new Date(moment(theDate).utcOffset('+0000').format('YYYY-MM-DD HH:MM'));
    this.metasForm.controls.theDate.setValue(date);
  }

  formatDate(theDate) {
    theDate =  theDate.getFullYear() + '-' + (theDate.getMonth() + 1) + '-' + theDate.getDate();
    return theDate;
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day === 1;
  }

  dateChangeEvent(event) {
    /*
    console.log('event: ', event);
    let theDate = event.target.value;
    theDate =  theDate.getFullYear() + '-' + (theDate.getMonth() + 1) + '-' + theDate.getDate();
    console.log('theDate: ', theDate);
    */
   this.clearInfo();
   this.getRecords();
  }

  reply(row) {
    const dialogRef = this.dialog.open(MetasReplyComponent, {
      width: '700px',
      data: {
          model: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.clearInfo();
      this.getRecords();
    });
  }

  clearInfo() {
    this.metas = [];
    this.metasTotal = 0;
    this.metasMeasurables = 0;
    this.metasCompleted = 0;
    this.multi = [];
  }

  toggleChart() {
    this.showChart = !this.showChart;
  }

  get f() { return this.metasForm.controls; }

//Dayli Report  components added

    addDayliReport(dayliReport) {
        this.openModalReport(dayliReport);
    }

    openModalReport(row: any): void {
      let action = this.translate.instant(!row ? 'save': 'update');
      const dialogRef2 = this.dialog.open(ReportAddComponent, {
          width: '700px',
          data: {
              action: action,
              model: row,
              theDate: this.metasForm.controls.theDate.value
          }
      });
      dialogRef2.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.clearInfo();
          this.getRecords();
        }
    });
    }
  
}
