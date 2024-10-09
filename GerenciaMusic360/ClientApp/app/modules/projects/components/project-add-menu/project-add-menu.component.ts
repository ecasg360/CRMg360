import { Component, OnInit, AfterViewInit, DoCheck, OnChanges } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AddProjectComponent } from '../add-project/add-project.component';
import { IProject } from '@models/project';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';

@Component({
  selector: 'app-project-add-menu',
  templateUrl: './project-add-menu.component.html',
  styleUrls: ['./project-add-menu.component.scss']
})
export class ProjectAddMenuComponent implements OnInit, AfterViewInit {


  projectTypeId: number = 0;
  isWorking: boolean = true;

  constructor(
    private toaster: ToasterService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this.projectTypeId = (this.route.snapshot.params['projectType'])
      ? parseInt(this.route.snapshot.params['projectType'])
      : 0;
    this.translationLoader.loadTranslations(...allLang);
    if (this.projectTypeId == NaN || this.projectTypeId == undefined || this.projectTypeId <= 0)
      this.router.navigate(['/projects']);
  }

  ngAfterViewInit() {
    setTimeout(() => this.openModal(), 2000);
  }

  openModal(): void {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '700px',
      data: {
        projectId: 0,
        projectType: this.projectTypeId
      }
    });
    this.isWorking = false;
    dialogRef.afterClosed().subscribe((result: IProject) => {
      if (result != undefined) {
        this.toaster.showToaster(this.translate.instant('messages.projectSaved'));
        this.router.navigate(['/projects/manage/', result.id]);
      }
      else {
        //this.toaster.showToaster(this.translate.instant('errors.savedProjectError'));
        this.router.navigate(['/projects']);
      }
    });
  }
}
