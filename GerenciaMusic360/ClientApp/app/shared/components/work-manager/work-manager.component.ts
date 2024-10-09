import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Work } from '@models/work';
import { WorkFormComponent } from '../work-form/work-form.component';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { allLang } from '@i18n/allLang';

@Component({
  selector: 'app-work-manager',
  templateUrl: './work-manager.component.html',
  styleUrls: ['./work-manager.component.scss']
})
export class WorkManagerComponent implements OnInit, OnChanges {

  @Input() personId: number;

  isWorking: boolean;
  workList: Work[] = [];

  constructor(
    private toaster: ToasterService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService) { }

  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslationsList(allLang)
  }

  ngOnChanges(changes: SimpleChanges): void {
    const personId = changes.personId;
    if (personId.currentValue > 0) {
      this.getWorksApi();
    }
  }

  showModalForm(id: number = 0) {
    this.isWorking = true;
    let work = <Work>{};
    if (id !== 0) {
      work = this.workList.find(f => f.id == id);
    } else {
      work.id = 0;
      work.certificationAuthorityId = 0;
      work.personRelationId = this.personId;
    }

    const dialogRef = this.dialog.open(WorkFormComponent, {
      width: '750px',
      data: {
        model: work
      }
    });
    dialogRef.afterClosed().subscribe((work: Work) => {
      if (work !== undefined) {
        work.personRelationId = this.personId;
        console.log(work);
        if (id == 0)
          this.saveWorkApi(work);
        else {
          work.id = id;
          this.updateWorkApi(work);
        }
      }
    });
    this.isWorking = false;
  }

  confirmDelete(id: number, name: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '700px',
      data: {
        text: this.translate.instant('messages.deleteQuestion', { field: name }),
        action: this.translate.instant('general.delete'),
        icon: 'delete_outline'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let confirm = result.confirm;
        if (confirm)
          this.deleteWorkApi(id);
      }
    });
  }

  updateStatus(id: number, statusRecordId: number) {
    this.isWorking = true;
    const status = statusRecordId == 1 ? 2 : 1;
    const params = {
      id: id,
      typeId: this.personId,
      status: status
    };
    this.updateStatuApi(params);
  }

  private responseError(err: any) {
    console.log('http', err);
    this.isWorking = false;
  }

  //#region API
  getWorksApi() {
    this.isWorking = true;
    this.apiService.get(EEndpoints.WorkByPerson, { personId: this.personId }).subscribe(
      (response: ResponseApi<Work[]>) => {
        if (response.code == 100) {
          this.workList = response.result;
        } else {
          this.toaster.showToaster('Error obteniendo datos');
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  saveWorkApi(data: Work) {
    this.isWorking = true;
    delete data.id;
    this.apiService.save(EEndpoints.Work, data).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.getWorksApi();
          this.toaster.showToaster('Registro guardado');
        } else {
          this.toaster.showToaster('Error guardando registro');
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  updateWorkApi(data: Work) {
    this.apiService.update(EEndpoints.Work, data).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.getWorksApi();
          this.toaster.showToaster('Registro modificado');
        } else {
          this.toaster.showToaster('Error modificando registro');
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  updateStatuApi(params: any) {
    this.apiService.save(EEndpoints.WorkStatus, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.getWorksApi();
        } else {
          this.toaster.showToaster('Error actualizando datos');
        }
        this.isWorking = false;
      }, err => this.responseError(err)
    )
  }

  deleteWorkApi(id: number) {
    const params = {
      id: id,
      personId: this.personId
    }
    this.apiService.delete(EEndpoints.Work, params).subscribe(
      (response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.getWorksApi();
          this.toaster.showToaster('registro eliminado');
        } else {
          this.toaster.showToaster('ocurrio un error eliminando el registro');
        }
      }, err => this.responseError(err)
    )
  }

  //#endregion

}
