import { Component, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { HttpErrorResponse } from '@angular/common/http';
import { EStartCenterType } from '@enums/start-center-type';
import { EProjectStatusName, EMarketingStatus, EContractStatus } from '@enums/status';
import { Router } from '@angular/router';
import { IProjectType } from '@models/project-type';
import { IConfigurationImage } from '@models/configurationImage';
import { AccountService } from '@services/account.service';
import { IUser } from '@models/user';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
    private months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    private meses: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    retry: number = 0;

    private baseBarChart: any = {
        // bar options
        showXAxis: true,
        showYAxis: true,
        gradient: false,
        showLegend: false,
        showXAxisLabel: false,
        showYAxisLabel: false,
        showDataLabel: false,
        roundEdges: false,
        colorScheme: {
            domain: ['#4fc3f7', '#e57373', '#f06292', '#ba68c8', '#7986cb', '#9575cd', '#4dd0e1', '#4db6ac', '#81c784', '#dce775', '#ffb74d', '#7d818c']
        },
        onSelect: (ev: any, module: string) => {
            let monthNumber = this.getMonthNumber(ev.name);
            this.router.navigate([`/${module}/list/${monthNumber}/${2019}`]);
        },
        realValue: null,
        data: []
    };

    private baseBarChartProjects: any = {
        // bar options
        showXAxis: true,
        showYAxis: true,
        gradient: false,
        showLegend: false,
        showXAxisLabel: false,
        showYAxisLabel: false,
        showDataLabel: false,
        roundEdges: false,
        colorScheme: {
            domain: ['#4fc3f7', '#e57373', '#f06292', '#ba68c8', '#7986cb', '#9575cd', '#4dd0e1', '#4db6ac', '#81c784', '#dce775', '#ffb74d', '#7d818c']
        },
        onSelect: (ev: any, module: string) => {
            let monthNumber = this.getMonthNumber(ev.name);
            this.router.navigate([`/${module}/list/${monthNumber}/${2019}`]);
        },
        realValue: null,
        data: []
    };

    private basePieChart: any = {
        // pie options
        legend: false,
        explodeSlices: false,
        labels: true,
        doughnut: true,
        gradient: false,
        scheme: {
            domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63']
        },
        realValue: null,
        data: [],
        onSelect: (ev: any, module: string) => {
            this.router.navigate([`/${module}/list/${ev.name.toLowerCase().replace(/ /g, '')}`]);
        },
    };

    projectBar = Object.assign({}, this.baseBarChartProjects);
    marketingBar = Object.assign({}, this.baseBarChart);
    contractBar = Object.assign({}, this.baseBarChart);

    projectPie = Object.assign({}, this.basePieChart);
    marketingPie = Object.assign({}, this.basePieChart);
    contractPie = Object.assign({}, this.basePieChart);

    projectList: any[] = [];
    contractList: any[] = [];
    marketingList: any[] = [];

    projectTypeList: IProjectType[] = [];

    currentUser: IUser;

    constructor(
        private apiService: ApiService,
        private toaster: ToasterService,
        private translate: TranslateService,
        private translationLoader: FuseTranslationLoaderService,
        private accountService: AccountService,
        private router: Router
    ) {
        this.currentUser = this.accountService.getLocalUserProfile();
        this.getConfigurationImageUser();
        this.projectPie.scheme = {
            domain: [EProjectStatusName.started, EProjectStatusName.waiting,
            EProjectStatusName.inProgress, EProjectStatusName.completed, EProjectStatusName.canceled]
        };

        this.marketingPie.scheme = {
            domain: [EMarketingStatus.active, EMarketingStatus.inactive,
            EMarketingStatus.Cancelled, EMarketingStatus.finalized]
        };

        this.contractPie.scheme = {
            domain: [EContractStatus.Created, EContractStatus.Send,
            EContractStatus.ReceivedbyGM360, EContractStatus.SignedbyGM360, EContractStatus.Cancelled]
        };
        this._getProjectsTypeApi();
    }

    ngOnInit() {
        this.translationLoader.loadTranslations(...allLang);
        const currentYear = (new Date()).getFullYear();

        this._getLast({ type: EStartCenterType.project });
        this._getLast({ type: EStartCenterType.marketing });
        this._getLast({ type: EStartCenterType.contract });

        this._getBarData({ type: EStartCenterType.project, year: currentYear });
        this._getBarData({ type: EStartCenterType.marketing, year: currentYear });
        this._getBarData({ type: EStartCenterType.contract, year: currentYear });

        this._getPieData({ type: EStartCenterType.project, year: currentYear });
        this._getPieData({ type: EStartCenterType.marketing, year: currentYear });
        this._getPieData({ type: EStartCenterType.contract, year: currentYear });
    }

    private _responseError(err: HttpErrorResponse): void {
        console.log(err);
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
    }

    private _formatLists(type: any, data: any[]) {
        if (type == EStartCenterType.project)
            this.projectList = data.map((m: any) => {
                m.statusColor = m.status.replace(/ /g, '');
                const found = this.projectTypeList.find(f => f.name == m.type.replace(/ /g, ''));
                if (found) {
                    m.endDateLabel = this.translate.instant(
                        (found.name == 'Event' || found.name == 'Artist Sale')
                            ? 'general.eventDay'
                            : 'general.releaseDate');
                }
                return m;
            });
        else if (type == EStartCenterType.marketing)
            this.marketingList = data.map((m: any) => {
                m.statusColor = m.status.replace(/ /g, '');
                return m;
            });
        else
            this.contractList = data.map((m: any) => {
                m.statusColor = m.status.replace(/ /g, '')
                return m;
            });
    }

    //#region API

    private _getProjectsTypeApi(): void {
        this.apiService.get(EEndpoints.ProjectTypes).subscribe(
            (response: ResponseApi<IProjectType[]>) => {
                if (response.code == 100) {
                    this.projectTypeList = response.result.map(m => {
                        m.name = m.name.replace(/ /g, '');
                        return m;
                    });
                } else {
                    this.toaster.showToaster(response.message);
                }
            }, (err) => this._responseError(err)
        );
    }

    private _getBarData(params: any) {
        this.apiService.get(EEndpoints.StartCenterOne, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    const data = response.result.map((m: any) => {
                        return {
                            name: this.translate.instant(`general.month_${m.order}`),
                            value: m.number,
                        }
                    });
                    if (params.type == EStartCenterType.project) {
                        this.projectBar.data = data;
                    }
                    else if (params.type == EStartCenterType.marketing) {
                        this.marketingBar.data = data;
                    }
                    else {
                        this.contractBar.data = data;
                    }
                } else
                    this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
            }, err => this._responseError(err)
        )
    }

    private _getPieData(params: any) {
        this.apiService.get(EEndpoints.StartCenterTwo, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    const data = response.result.map((m: any) => {
                        return {
                            name: this.translate.instant(`general.${m.status.replace(/ /g, '')}`),
                            value: m.number
                        }
                    });
                    if (params.type == EStartCenterType.project)
                        this.projectPie.data = data;
                    else if (params.type == EStartCenterType.marketing)
                        this.marketingPie.data = data;
                    else
                        this.contractPie.data = data;
                } else
                    this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
            }, err => this._responseError(err)
        )
    }

    private _getLast(params: any) {
        this.apiService.get(EEndpoints.StartCenterThree, params).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100)
                    this._formatLists(params.type, response.result);
                else
                    this.toaster.showToaster(this.translate.instant('general.errors.requestError'));
            }, err => this._responseError(err)
        )
    }

    private getMonthNumber(month: string): number {
        let index = this.months.indexOf(month);
        if (index == 0) {
            index = this.meses.indexOf(month);
        }
        return index;
    }

    getConfigurationImageUser(): void {
        const params = { userId: this.currentUser.id };
        this.apiService.get(EEndpoints.ConfigurationImagesByUser, params).subscribe(
            (response: ResponseApi<IConfigurationImage>) => {
                if (response.code == 100 && response.result && response.result.pictureUrl) {
                    this.accountService.setDefaultImage(response.result.pictureUrl);
                } else {
                    this.accountService.clearDefaultImage();
                }
            }, err => this._responseError(err)
        );
    }
    //#endregion
}
