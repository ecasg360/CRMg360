
import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { allLang } from '@i18n/allLang';
import { EEventType } from '@enums/modules-types';


@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})

export class CalendarComponent implements OnInit {

  eventType = EEventType;

  constructor(
    private toaster: ToasterService,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
  ) {
  }


  //#region Lifecycle hooks

  ngOnInit(): void {
    this.translationLoader.loadTranslations(...allLang);
  }

  //#endregion
}
