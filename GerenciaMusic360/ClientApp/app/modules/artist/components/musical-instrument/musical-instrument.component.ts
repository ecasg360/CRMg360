import { allLang } from '@app/core/i18n/allLang';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import {
    MatDialog,
    MatPaginator,
    MatSort,
    MatTableDataSource
} from '@angular/material';
import { ResponseApi } from '@models/response-api';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { AddMusicalInstrumentComponent } from './add-musical-instrument/add-musical-instrument.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-musical-instrument',
    templateUrl: './musical-instrument.component.html',
    styleUrls: ['./musical-instrument.component.scss']
})
export class MusicalInstrumentComponent implements OnInit {

    displayedColumns: string[] = ['name', 'action'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isWorking: boolean = true;
    isDataAvailable: boolean = true;
    perm: any = {};

    constructor(
        private toasterService: ToasterService,
        private apiService: ApiService,
        public dialog: MatDialog,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this.getAll();
        this.perm = this.route.snapshot.data;
    }

    ngOnInit() {
        this._fuseTranslationLoaderService.loadTranslations(...allLang);
    }
    
    getAll(): void {
        this.isWorking = true;
        this.apiService.get(EEndpoints.MusicalInstruments).subscribe(
            (response: ResponseApi<any>) => {
                this.isDataAvailable = (response.result.length > 0);
                this.dataSource = new MatTableDataSource(response.result);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.isWorking = false;
            },
            (error: any) => this.reponseError(error)
        )
    }

    private reponseError(error: any): void {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    updateStatus(id: number, status: number): void {
        let statusId = status == 1 ? 2 : 1;
        this.isWorking = true;

        this.apiService.update(EEndpoints.MusicalInstrument, { id: id, status: statusId }).subscribe(data => {
            if (data.code == 100) {
                this.getAll();
                this.toasterService.showToaster(this.translate.instant('messages.statusChanged'));
            } else {
                this.toasterService.showToaster(data.message);
            }
            this.isWorking = false;
        }, (err) => {
            this.reponseError(err);
        });
    }

    /**
     * Abre el modal con el formulario para agregar una nueva actividad
     */
    showModalForm(id: number = 0): void {
        const dialogRef = this.dialog.open(AddMusicalInstrumentComponent, {
            width: '500px',
            data: {
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('after close');
            if (result !== undefined) {
                this.getAll();
            }
        });
    }

    showImage(image: string, caption) {
        const dialogRef = this.dialog.open(ImagePreviewComponent, {
            width: '500px',
            data: {
                imageUrl: image,
                caption: caption
            }
        });
    }

    confirmDelete(id: number, name: string): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('settings.deleteQuestion', { activity: name }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let confirm = result.confirm;
                if (confirm)
                    this.deleteMainActivity(id);
            }
        });
    }

    deleteMainActivity(id: number) {
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MusicalInstrument, { id: id }).subscribe(data => {
            if (data.code == 100) {
                this.getAll();
                this.toasterService.showToaster(this.translate.instant('messages.itemDeleted'));
            } else {
                this.toasterService.showToaster(data.message);
                this.isWorking = false;
            }
        }, (err) => {
            this.reponseError(err);
        });
    }
}
