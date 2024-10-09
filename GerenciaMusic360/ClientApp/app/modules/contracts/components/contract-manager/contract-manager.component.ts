import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { IContract } from '@models/contract';
import { IStatusModule } from '@models/StatusModule';


@Component({
  selector: 'app-contract-manager',
  templateUrl: './contract-manager.component.html',
  styleUrls: ['./contract-manager.component.scss']
})
export class ContractManagerComponent implements OnInit {
  contractId: number;
  isWorking: boolean;
  maxValue: number;
  value: number;
  contract: IContract = <IContract>{};
  statusModule: IStatusModule[] = [];
  perm: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _translationLoaderService: FuseTranslationLoaderService,
  ) {
    this._translationLoaderService.loadTranslations(...allLang);
    this.perm = this.route.snapshot.data;
  }

  ngOnInit() {
    this.contractId = this.route.snapshot.params.contractId;
    this.contract = this.route.snapshot.data.contract.result;

    if (!this.contractId || !this.contract.id) {
      this.router.navigate(['contracts']);
    }
  }

  additionalFields(event): void {
    console.log(event);
  }
}
