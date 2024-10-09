import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { ToasterService } from "@services/toaster.service";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
import { allLang } from "@i18n/allLang";
import { ResponseApi } from "@models/response-api";
import { AddMusicalGenreComponent } from './add-musical-genre/add-musical-genre.component';
import { MusicalGenre } from '@models/musical-genre';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ActivatedRoute } from "@angular/router";


@Component({
    selector: 'app-musical-genre',
    templateUrl: './musical-genre.component.html',
})

export class MusicalGenreComponent implements OnInit {

    displayedColumns: string[] = ['name', 'description', 'status', 'action'];
    dataSource: MatTableDataSource<any>;
    isWorking: boolean = true;
    musicalGenresList: MusicalGenre[] = [];
    perm: any = {};

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private apiService: ApiService,
        public dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private translate: TranslateService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        this.perm = this.route.snapshot.data;
    }

    ngOnInit() {        
        this.getMusicalGenresApi();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getMusicalGenresApi() {
        this.isWorking = true;
        this.apiService.get(EEndpoints.MusicalGenres).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.musicalGenresList = response.result;
                    this.dataSource = new MatTableDataSource(response.result);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                } else {
                    //TODO: translate
                    this.toasterService.showToaster(response.message);
                }
                this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    showModalForm(id: number = 0): void {
        this.isWorking = true;

        const dialogRef = this.dialog.open(AddMusicalGenreComponent, {
            width: '700px',
            data: {
                id: id,
                data: this.musicalGenresList
            }
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result !== undefined) {
                this.getMusicalGenresApi();
            }
        });
        this.isWorking = false;
    }

    updateStatus(id: number, status: number): void {
        let statusId = status == 1 ? 2 : 1;
        this.isWorking = true;

        this.apiService.save(EEndpoints.MusicalGenreStatus, { id: id, status: statusId }).subscribe(
            (data: ResponseApi<any>) => {
                if (data.code == 100) {
                    this.getMusicalGenresApi();
                    this.toasterService.showToaster(this.translate.instant('messages.changeStatusSuccess'));
                } else {
                    this.toasterService.showToaster(data.message);
                }
                this.isWorking = false;
            }, (err) => this.responseError(err)
        );
    }

    confirmDelete(id: number, name: string): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
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
                    this.deleteMusicalGenreApi(id);
            }
        });
    }

    deleteMusicalGenreApi(id: number) {
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MusicalGenre, { id: id }).subscribe(
            (response: ResponseApi<any>) => {
                if (response.code == 100) {
                    this.getMusicalGenresApi();
                    //TODO translate
                    this.toasterService.showToaster(this.translate.instant('messages.itemDeleted'));
                } else {
                    //TODO: translate 
                    this.toasterService.showToaster('ocurrio un error');
                    console.log(response.result);
                }
                this.isWorking = false;
            }, err => this.responseError(err)
        );
    }

    private responseError(err: any) {
        this.isWorking = false;
        console.log('http error', err);
    }
}
