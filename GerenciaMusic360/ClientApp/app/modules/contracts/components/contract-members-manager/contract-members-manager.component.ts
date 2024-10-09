import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { PersonFormComponent } from '@shared/components/person-form/person-form.component';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ToasterService } from '@services/toaster.service';
import { allLang } from '@i18n/allLang';
import { IContractMembers } from '@models/contractMembers';
import { IPerson } from '@models/person';

@Component({
  selector: 'app-contract-members-manager',
  templateUrl: './contract-members-manager.component.html',
  styleUrls: ['./contract-members-manager.component.scss']
})
export class ContractMembersManagerComponent implements OnInit {
  @Input() contractId: number;
  isWorking: boolean;

  contractMembers: IContractMembers[] = [];
  person: IPerson;
  constructor(
    //public dialogRef: MatDialogRef<AddProjectWorkDetailsComponent>,
    private toaster: ToasterService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private translate: TranslateService,
    //private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    //@Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);    
    this.getMembers();
  }

  getMembers(): void {
    this.isWorking = true;
    this.apiService.get(EEndpoints.ContractMembers)
    .subscribe(
        (response: ResponseApi<IContractMembers[]>) => {
            if (response.code == 100) {              
              this.contractMembers = response.result;
              this.person = response.result[0].person;
            }
            this.isWorking = false;
        }, (err) => this.responseError(err)
    );
  }

  saveMember(model: IContractMembers): void {
    this.isWorking = true;
    this.apiService.save(EEndpoints.ContractMember, model)
    .subscribe(
        (response: ResponseApi<IContractMembers[]>) => {
            if (response.code == 100) {              
              this.getMembers();
            }
            this.isWorking = false;
        }, (err) => this.responseError(err)
    );
  }

  openDialogForAddContractMember(): void {
    const dialogRef = this.dialog.open(PersonFormComponent, {
      width: '900px',
      data: {
        id: 0,   
        isContractMember: true
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const contractMember: IContractMembers = {
          id: 0,
          contractId: this.contractId,
          companyId: 0,
          personId: result,
          contractRoleId: 0
        }
        this.saveMember(contractMember);        
      }
      
    });
  }

  private responseError(error: any): void {
    this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
