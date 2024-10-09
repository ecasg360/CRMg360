import { Component, OnInit, AfterViewInit, DoCheck, OnChanges } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { ProjectArtistEventComponent } from '@shared/components/project-artist-event/project-artist-event.component';
@Component({
  selector: 'app-report-menu-budget-template',
  templateUrl: './report-menu-budget-template.component.html',
  styleUrls: ['./report-menu-budget-template.component.scss']
})
export class ReportMenuBudgetTemplateComponent implements OnInit, AfterViewInit {


  projectTypeId: number = 0;
  isWorking: boolean = true;
  perm:any = {};

  constructor(
    private toaster: ToasterService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
  ) {
    this.perm = this.route.snapshot.data;
    if (!this.perm.Report.ReportBudgetTemplate)
      this.router.navigate(["/"]);
  }

  ngOnInit() {
    // this.projectTypeId = (this.route.snapshot.params['projectType'])
    //   ? parseInt(this.route.snapshot.params['projectType'])
    //   : 0;
    // this.translationLoader.loadTranslations(...allLang);
    // if (this.projectTypeId == NaN || this.projectTypeId == undefined || this.projectTypeId <= 0)
    //   this.router.navigate(['/projects']);
  }

  ngAfterViewInit() {
    setTimeout(() => this.openModal(), 2000);
  }

  openModal(): void {
    const dialogRef = this.dialog.open(ProjectArtistEventComponent, {
      width: '700px',
      data: {
        artistId: 0,
        projectTypeId: 6,//Artist Sale Project Type
        projectId: 0,
      }
    });
    this.isWorking = false;
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result != undefined) {
        this.router.navigate(['/']);
      }
      else {
        this.router.navigate(['/']);
      }
    });
  }
}
