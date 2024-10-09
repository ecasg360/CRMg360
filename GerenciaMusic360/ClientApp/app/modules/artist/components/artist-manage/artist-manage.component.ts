import { Component, OnInit, OnDestroy } from '@angular/core';
import { IArtist } from '@models/artist';
import { entity } from '@enums/entity';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { IPerson } from '@models/person';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-artist-manage',
  templateUrl: './artist-manage.component.html',
  styleUrls: ['./artist-manage.component.scss'],
  animations: fuseAnimations
})
export class ArtistManageComponent implements OnInit, OnDestroy {

  artist: IArtist = <IArtist>{};
  entityType: entity = entity.Artist;
  isBuyer: boolean = false;

  constructor(
    private apiService: ApiService,
    private toaster: ToasterService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.artist = this.route.snapshot.data.artist.result;
    if (!this.artist.id) {
      this.router.navigate(['/artist']);
    }
  }

  ngOnDestroy(): void {
  }
}
