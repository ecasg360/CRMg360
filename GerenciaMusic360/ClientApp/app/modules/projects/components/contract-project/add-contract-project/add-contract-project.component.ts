import { Component, OnInit, Input, ViewChild, Optional, Inject } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { IConfigurationProjectTaskContract } from '@models/configuration-project-task-contract';
import { EContractType } from '@enums/contract-type';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { IContract } from '@models/contract';
import { IProject } from '@models/project';

@Component({
  selector: 'app-add-contract-project',
  templateUrl: './add-contract-project.component.html',
  styleUrls: ['./add-contract-project.component.scss']
})
export class AddContractProjectComponent implements OnInit {

  @Input() projectId: number;
  @Input() projectTypeId: number;

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  collaborators: any[];
  collaboratorsArray: any[] = <any>[];
  isDataAvailable = false;
  isWorking: boolean = true;

  project: IProject = <IProject>{};
  configurationProjectTaskContract: IConfigurationProjectTaskContract[];
  contractModel: IContract = <IContract>{};

  constructor(
    public dialogRef: MatDialogRef<AddContractProjectComponent>,
    private toasterService: ToasterService,
    private ApiService: ApiService,
    public dialog: MatDialog,
    private translate: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public actionData: any,
  ) { }

  ngOnInit() {
    this.projectId = this.actionData.projectId;
    this.projectTypeId = this.actionData.projectTypeId;
    this.getProject();
  }

  getProjectContract() {
    this.isDataAvailable = true;
    this.isWorking = true;
    this.dataSource = undefined;
    const params = [];
    params['projectId'] = this.projectId;
    this.ApiService.get(EEndpoints.ProjectContracts, params)
      .subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.isDataAvailable = (response.result.length > 0);
          this.dataSource = new MatTableDataSource(response.result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.collaborators = this.dataSource.data;

          //Consulta de la configuracion
          const params = [];
          params['projectTypeId'] = this.projectTypeId;
          this.ApiService.get(EEndpoints.ConfigurationProjectTaskContract, params)
            .subscribe((response: ResponseApi<IConfigurationProjectTaskContract[]>) => {
              if (response.code == 100) {
                this.configurationProjectTaskContract = response.result;//.filter(f => f.contractTypeId == EContractType.PublishingAgreement || f.contractTypeId == EContractType.WorkForHire_RecordingProducer);

                //Ubico la configuracion de cada Persona
                this.collaborators.forEach((value: any) => {
                  let configurationProjectContract: any = null;

                  if (value.type == "Compositor") {
                    configurationProjectContract = this.configurationProjectTaskContract.find(f => f.contractTypeId == EContractType.PublishingAgreement);
                  } else if (value.type == "Productor") {
                    configurationProjectContract = this.configurationProjectTaskContract.find(f => f.contractTypeId == EContractType.WorkForHire_RecordingProducer);
                  }

                  this.collaboratorsArray.push({
                    projectContract: value,
                    configurationProjectContract: configurationProjectContract,
                  });
                });
              }
              this.isWorking = false;
            }, (err) => this.responseError(err));

        }
        this.isWorking = false;
      }, (err) => this.responseError(err));
  }

  getProject() {
    this.isWorking = true;
    const params = [];
    params['id'] = this.projectId;
    this.ApiService.get(EEndpoints.Project, params)
      .subscribe((response: ResponseApi<IProject>) => {
        if (response.code == 100) {
          this.project = response.result;
          this.getProjectContract();
        }
      }, (err) => this.responseError(err));
  }

  confirmCreate(configurationProjectContract: any, name: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '700px',
      data: {
        text: this.translate.instant('messages.saveContractQuestion', { field: name }),
        action: this.translate.instant('general.create'),
        icon: 'save'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm) {
          this.createContract(configurationProjectContract, this.project, name);
        }
      }
    });
  }

  createContract(configurationProjectContract: any, project: IProject, name: string) {
    this.isWorking = true;
    this.contractModel = <IContract>{};
    this.contractModel.startDate = <Date><unknown>project.initialDate;
    this.contractModel.endDate = <Date><unknown>project.endDate;
    this.contractModel.name = project.name + ' - ' + name;
    this.contractModel.description = project.description + ' - ' + name;
    this.contractModel.currencyId = project.currencyId;
    this.contractModel.contractTypeId = configurationProjectContract.contractTypeId;
    this.contractModel.projectTaskId = configurationProjectContract.projectTaskId;
    this.contractModel.projectId = project.id;
    this.contractModel.contractTypeName = configurationProjectContract.contractType.name;
    this.contractModel.localCompanyId = configurationProjectContract.contractType.localCompanyId;

    this.ApiService.save(EEndpoints.Contract, this.contractModel)
      .subscribe((response: ResponseApi<IContract>) => {
        if (response.code == 100) {
          this.toasterService.showToaster(this.translate.instant('contractProject.messages.created'));
          this.onNoClick(true);
        } else {
          this.toasterService.showToaster(response.message);
        }
        this.isWorking = false;
      }, (err) => this.responseError(err));
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.collaborators = this.dataSource.filteredData;
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

  onNoClick(status = undefined): void {
    this.dialogRef.close(status);
  }

}
