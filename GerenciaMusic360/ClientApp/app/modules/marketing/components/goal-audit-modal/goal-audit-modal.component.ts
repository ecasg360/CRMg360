import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDatepickerInputEvent, MatTableDataSource } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseApi } from '@models/response-api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMarketingGoalsAudited, IMarketingGoals } from '@models/goals';
import { IMarketing } from '@models/marketing';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-goal-audit-modal',
    templateUrl: './goal-audit-modal.component.html',
    styleUrls: ['./goal-audit-modal.component.scss']
})

export class GoalAuditModalComponent implements OnInit {

    marketing: IMarketing = <IMarketing>{};
    isWorking: boolean = false;
    goalFG: FormGroup;
    formTemplate: any[] = [];
    goalsList: IMarketingGoals[] = [];
    displayedColumns: string[] = ['date'];
    tableData: any = []; //TABLE DATASOURCE
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    variationTag: string;

    constructor(
        private toaster: ToasterService,
        private apiService: ApiService,
        public dialog: MatDialog,
        private translationLoader: FuseTranslationLoaderService,
        private translate: TranslateService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<GoalAuditModalComponent>,
    ) {
        this.translationLoader.loadTranslations(...allLang);
    }

    ngOnInit() {
        this.marketing = <IMarketing>this.data.marketing;
        this.variationTag = this.translate.instant('general.variation');
        this.initForm();
        this._getGoals();
        this._getGoalsAudited(EEndpoints.MarketingGoalsAuditedsByMarketing, { marketingId: this.marketing.id }, true);
    }

    initForm() {
        let group = {}
        if (this.formTemplate.length > 0) {
            this.formTemplate.forEach(inputTemplate => {
                group[inputTemplate.social] = new FormControl('', [Validators.required]);
            })
        }
        group['date'] = new FormControl('', []);
        this.goalFG = new FormGroup(group);
    }

    get f() {
        return this.goalFG.controls;
    }

    addGoal() {
        const params = [];

        this.goalsList.forEach((value: IMarketingGoals) => {
            params.push({
                marketingId: this.marketing.id,
                socialNetworkTypeId: value.socialNetworkTypeId,
                dateString: this.getValidDate(),
                quantity: this.f[value.socialNetworkName].value,
            })
        });
        this._saveGoalsAudited(params);
    }

    private getValidDate(): string {
        const fecha = this.f['date'].value
            ? (new Date(this.f['date'].value))
            : (new Date());

        return fecha.toISOString().split('T')[0];
    }

    onNoClick(goal: any = undefined): void {
        this.dialogRef.close(goal);
    }

    private _formatArrayForm() {
        if (this.goalsList.length > 0) {
            this.formTemplate = [];
            this.goalsList.forEach((value: IMarketingGoals) => {
                this.formTemplate.push({
                    type: 'number',
                    goal: value.goalName,
                    image: value.pictureURL,
                    social: value.socialNetworkName
                });
            })
        }
    }

    dateChange(event: MatDatepickerInputEvent<Date>) {
        const value = event.value;

        if (value) {
            this.f['date'].patchValue(event.value.toISOString().split('T')[0]);
            const params = {
                marketingId: this.marketing.id,
                dateString: event.value.toISOString().split('T')[0]
            };

            this._getGoalsAudited(EEndpoints.MarketingGoalsAuditeds, params, false);
        }
    }

    private _fillSocialInputs(marketingGoals: IMarketingGoalsAudited[]) {
        if (marketingGoals.length > 0) {
            marketingGoals.forEach((value: IMarketingGoalsAudited) => {
                if (this.f[value.socialNetworkName]) {
                    this.f[value.socialNetworkName].patchValue(value.quantity);
                }
            })
        }
    }

    private _formatTableData(audited: IMarketingGoalsAudited[]) {

        this.tableData = [];
        //filtro para obtener los registros unicos de fecha
        const unique = audited.filter((value, index, self) =>
            self.findIndex(f => f.dateString == value.dateString) == index);

        // recorro mi arreglo con las fechas unicas
        for (let i = 0; i < unique.length; i++) {
            // obtengo el valor de fecha unica
            const element = unique[i];
            // busco todos los registros de esa fecha
            const dayGoal = audited.filter(f => f.dateString == element.dateString);
            //genero mi objeto candidato y agrego la fecha que es la unica fija yla primera
            let obj = { date: element.dateString };
            // recorro lascolumnas a partir del segundo elemento ay que el primero fue establecido
            for (let index = 1; index < this.displayedColumns.length; index++) {
                // obtengo el nombre de la columna
                const column = this.displayedColumns[index];
                // todos los registros asociados a las redes sociales son impares
                if (index % 2 == 1) {
                    // buscando en el arreglo con datos del dia busco la red social
                    const goalFound = dayGoal.find(f => f.socialNetworkName == column);
                    // si la consigo agregosu datos, tomo en cuenta que el registro sigueinte hace referencia a su variacion
                    // y se coloca como prefio el nombre de la red social para diferenciarlo porque sino lo sobreescribe
                    if (goalFound) {
                        obj[column] = goalFound.quantity;
                        obj[`${column} ${this.variationTag}`] = goalFound.variation.toFixed(2);
                    } else {
                        // si no hay nada se asigna 0
                        obj[column] = 0;
                        obj[`${column} ${this.variationTag}`] = 0;
                    }
                }
            }
            this.tableData.push(obj);
        }
        //INITIALIZE MatTableDataSource
        this.dataSource = new MatTableDataSource(this.tableData);
    }

    private _responseError(err: HttpErrorResponse) {
        console.log(err);
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    }

    //#region API
    private _getGoals() {
        this.isWorking = true;
        this.apiService.get(EEndpoints.MarketingGoals, { marketingId: this.marketing.id }).subscribe(
            (response: ResponseApi<IMarketingGoals[]>) => {
                if (response.code == 100) {
                    this.goalsList = response.result;//.filter(f => f.audited);
                    if (this.goalsList.length > 0) {
                        this._formatArrayForm();
                        this.initForm();
                        this.goalsList.forEach(item => {
                            this.displayedColumns.push(item.socialNetworkName);
                            this.displayedColumns.push(`${item.socialNetworkName} ${this.variationTag}`);
                        });
                    } else
                        this.toaster.showTranslate('messages.mustGoal');
                } else
                    this.toaster.showTranslate('errors.errorGettingField');
                this.isWorking = false;
            }, err => this._responseError(err)
        );
    }

    private _getGoalsAudited(endpoint: EEndpoints, params: any, filltable: boolean) {
        this.isWorking = true;
        this.apiService.get(endpoint, params).subscribe(
            (response: ResponseApi<IMarketingGoalsAudited[]>) => {
                if (response.code == 100) {
                    if (response.result.length > 0) {
                        if (endpoint == EEndpoints.MarketingGoalsAuditeds)
                            this._fillSocialInputs(response.result);
                    }
                    if (filltable)
                        this._formatTableData(response.result);
                } else
                    this.toaster.showTranslate('errors.errorGettingField');
                this.isWorking = false;
            }, err => this._responseError(err)
        );
    }

    private _saveGoalsAudited(params: any[]) {
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingGoalsAuditeds, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    const data = {
                        marketingId: this.marketing.id
                    };
                    this._getGoalsAudited(EEndpoints.MarketingGoalsAuditedsByMarketing, data, true);
                } else
                    this.toaster.showTranslate('errors.errorSavingField');
                this.isWorking = false;
            }, err => this._responseError(err)
        );
    }

    downloadReport(item) {
        this.apiService.download(EEndpoints.GoalsAuditedDownload, { marketingId: item.id }).subscribe(
            fileData => {
                const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                let link = document.createElement("a");
                if (link.download !== undefined) {
                    let url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", `Reporte_MarketingGoals_${item.name}`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                this.isWorking = false;
            }, err => this._responseError(err)
        );
    }
    //#region
}
