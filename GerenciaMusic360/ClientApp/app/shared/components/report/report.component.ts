import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { EReportType } from '@enums/report-type';
import { ProjectArtistEventComponent } from '../project-artist-event/project-artist-event.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @Input() projectTypeId: number = 0;
  @Input() artistId: number = 0;
  @Input() projectId: number = 0;


  isWorking: boolean = false;
  reportTypeEnum = EReportType;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private toasterService: ToasterService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
  }

  showModalEvent(projectTypeId: number, artistId: number, projectId: number): void {
    const dialogRef = this.dialog.open(ProjectArtistEventComponent, {
      width: '700px',
      data: {
        projectTypeId: projectTypeId,
        artistId: artistId,
        projectId: projectId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('accepted');
      }
      else {
        console.log('refused');
      }
    });
  }

  private _responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
