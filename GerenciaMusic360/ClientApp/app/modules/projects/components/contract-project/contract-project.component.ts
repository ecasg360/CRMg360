import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ApiService } from "@services/api.service";
import { AddContractProjectComponent } from "./add-contract-project/add-contract-project.component";
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { TranslateService } from '@ngx-translate/core';
import { IContract } from '@models/contract';

@Component({
  selector: 'app-contract-project',
  templateUrl: './contract-project.component.html',
  styleUrls: ['./contract-project.component.scss']
})
export class ContractProjectComponent implements OnInit {

  @Input() projectId: number;
  @Input() projectTypeId: number;

  isDataAvailable = false;
  isWorking: boolean = true;
  dataSource: MatTableDataSource<IContract>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  contracts: IContract[];

  constructor(
    private toasterService: ToasterService,
    private ApiService: ApiService,
    public dialog: MatDialog,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.getContractsProject();
  }

  getContractsProject() {
    this.isDataAvailable = true;
    this.isWorking = true;
    this.dataSource = undefined;
    const params = { projectId: this.projectId };
    this.ApiService.get(EEndpoints.ContractsByProjectId, params).subscribe((response: ResponseApi<IContract[]>) => {
      if (response.code == 100) {
        this.isDataAvailable = (response.result.length > 0);
        this.dataSource = new MatTableDataSource(response.result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.contracts = this.dataSource.data;
      }
      this.isWorking = false;
    }, err => this.responseError(err)
    );
  }

  showModalForm(id: number = 0): void {
    const dialogRef = this.dialog.open(AddContractProjectComponent, {
      width: '500px',
      data: {
        id: id,
        projectId: this.projectId,
        projectTypeId: this.projectTypeId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getContractsProject();
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.contracts = this.dataSource.filteredData;
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }
}
