import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginatorIntl, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ITemplateContractDocument } from '@models/templateContractDocument';
import { SelectOption } from '@models/select-option.models';
import { AddMarkerComponent } from './add-marker/add-marker.component';

@Component({
  selector: 'app-contracts-markers-templates',
  templateUrl: './contracts-markers-templates.component.html',
  styleUrls: ['./contracts-markers-templates.component.scss']
})

export class ContractsMarkersTemplatesComponent implements OnInit {
  innerWidth: any;
  displayedColumns: string[] = ['id', 'marker', 'action'];
  dataSource: MatTableDataSource<any>;
  paginatorIntl: MatPaginatorIntl;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isDataAvailable = false;
  isWorking: boolean = false;
  templateSelected: number = 0;


  templates: SelectOption[] = [];
  templateMarker: ITemplateContractDocument[] = [];
  perm: any = {};

  constructor(
    private toasterService: ToasterService,
    private ApiService: ApiService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) {
    this.perm = this.route.snapshot.data;
  }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
    this.getTemplatesMarkers();
    
  }

  getTemplatesMarkers() {
    this.isWorking = true;
    this.dataSource = undefined;
    this.ApiService.get(EEndpoints.TemplateContractDocument)
        .subscribe((response: ResponseApi<any>) => {
            if (response.code == 100) {    
                this.templateMarker = response.result;            
                this.templates = response.result.map((s: any) => ({
                  value: s.id,
                  viewValue: s.documentName
                }));
            }
            this.isWorking = false;
            if (this.templateSelected >0) {
              this.SelectionChangeTemplate(this.templateSelected);
            }
        }, (err) => this.responseError(err));
  }

  SelectionChangeTemplate(id: number) {
    this.templateSelected = id;
    const list = this.templateMarker.find((x) => x.id === id);
    
    this.isDataAvailable = false;
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (list) {
      this.isDataAvailable = (list.templateContractDocumentMarker.length > 0);              
      this.dataSource = new MatTableDataSource(list.templateContractDocumentMarker);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }    
  }

  showModalForm(): void {
    if (this.templateSelected === 0) {
      this.toasterService.showToaster(this.translate.instant('settings.catalogTypes.messages.selectCatalogType'));
      return;
    }
    const dialogRef = this.dialog.open(AddMarkerComponent, {
      width: '500px',
      data: {
        id: 0,
        templateContractDocumentId: this.templateSelected
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.getTemplatesMarkers();
      }
    });
  }

  private responseError(error: any): void {
    this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
    this.isWorking = false;
  }

}
