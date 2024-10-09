import { Component, OnInit } from '@angular/core';
import { EEventType } from '@enums/modules-types';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { allLang } from '@i18n/allLang';

@Component({
  selector: 'app-project-calendar',
  templateUrl: './project-calendar.component.html',
  styleUrls: ['./project-calendar.component.scss']
})
export class ProjectCalendarComponent implements OnInit {

  eventType = EEventType;
  menuProjectType: string = '';
  perm: any = {};

  constructor(
    private translationLoaderService: FuseTranslationLoaderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.perm = this.activatedRoute.snapshot.data;
    this.activatedRoute.params.subscribe(
      (params: any) => {
        this.menuProjectType = params.projectFilter;
        if (params.projectFilter === 'label' && !this.perm.Calendar.GetByLabel) {
          this.router.navigateByUrl('/');
        }
        if (params.projectFilter === 'event' && !this.perm.Calendar.GetByEvent) {
          this.router.navigateByUrl('/');
        }
        if (params.projectFilter === 'agency' && !this.perm.Calendar.GetByAgency) {
          this.router.navigateByUrl('/');
        }
      }
    );
  }

  ngOnInit() {
    this.translationLoaderService.loadTranslations(...allLang);
  }
}
