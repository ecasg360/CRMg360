import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FuseTranslationLoaderService } from "../../../../../@fuse/services/translation-loader.service";
import { TranslateService } from '@ngx-translate/core';
import { allLang } from "@i18n/allLang";
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-promoters-view',
  templateUrl: './promoters-view.component.html',
  styleUrls: ['./promoters-view.component.scss']
})
export class PromotersViewComponent implements OnInit {

  model: any;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    public dialogRef: MatDialogRef<PromotersViewComponent>,
    private translate: TranslateService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
  }

  ngOnInit() {
    this.model = this.actionData.model ? this.actionData.model : {};
    console.log(this.model);
  }

}
