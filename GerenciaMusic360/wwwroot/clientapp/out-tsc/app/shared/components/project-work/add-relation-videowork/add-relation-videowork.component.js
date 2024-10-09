var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Optional, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EEndpoints } from '@enums/endpoints';
import { allLang } from '@i18n/allLang';
import { AddProjectWorkDetailsComponent } from '../add-project-work-details/add-project-work-details.component';
var AddRelationVideoworkComponent = /** @class */ (function () {
    function AddRelationVideoworkComponent(dialogRef, service, dialog, translate, formBuilder, _fuseTranslationLoaderService, data) {
        this.dialogRef = dialogRef;
        this.service = service;
        this.dialog = dialog;
        this.translate = translate;
        this.formBuilder = formBuilder;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.data = data;
        this.isWorking = false;
        this.isNewWork = false;
        this.isInternal = false;
        this.projectWorksVideo = [];
        this.displayedColumns = ['select', 'name', 'ISRC', 'producerRemix'];
        this.isDataAvailable = true;
    }
    AddRelationVideoworkComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        this.configureForm();
        this.getProjectWorks();
        this.row = this.data.data;
        //this.isInternal = this.row.foreignWorkPerson[0].person.isInternal;
        // this.composers.push({
        //   value: this.row.foreignWorkPerson[0].person.id,
        //   viewValue: this.row.foreignWorkPerson[0].person.name + ' ' + this.row.foreignWorkPerson[0].person.lastName
        // });
        // this.getEditors();
        // this.getProductors();
        // this.getRemix();
        // this.configureForm();    
        // if(this.row.ISRC) {      
        //   this.populateForm(this.row);
        // }
    };
    AddRelationVideoworkComponent.prototype.configureForm = function () {
        //this.addArtistForm = this.formBuilder.group({});
        this.form = this.formBuilder.group({
            name: ['', [Validators.required]],
            isInternal: [true, [Validators.required]],
        });
    };
    Object.defineProperty(AddRelationVideoworkComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddRelationVideoworkComponent.prototype.bindExternalForm = function (name, form) {
        this.addArtistForm.setControl(name, form);
    };
    //Get ProjectWorks for Video Music and Video Lyrics
    AddRelationVideoworkComponent.prototype.getProjectWorks = function () {
        var _this = this;
        this.service.get(EEndpoints.ProjectWorksByProjects).subscribe(function (response) {
            if (response.code == 100) {
                _this.projectWorksVideo = response.result;
                _this.dataSource = new MatTableDataSource(_this.projectWorksVideo);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
                //this.dataSourceSelect = new MatTableDataSource(this.worksSelected);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddRelationVideoworkComponent.prototype.select = function (row) {
        this.dialogRef.close(row);
    };
    AddRelationVideoworkComponent.prototype.setWork = function () {
        this.isWorking = true;
        if (this.form.valid) {
            if (this.f.isInternal.value) {
                this.saveWork();
            }
            else {
                this.saveForeignWork();
            }
        }
        this.isWorking = false;
    };
    AddRelationVideoworkComponent.prototype.saveWork = function () {
        var _this = this;
        this.service.save(EEndpoints.Work, this.form.value)
            .subscribe(function (response) {
            if (response.code == 100) {
                response.result.itemId = response.result.id;
                _this.work = response.result;
                _this.openDetails(_this.row);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddRelationVideoworkComponent.prototype.saveForeignWork = function () {
        var _this = this;
        this.service.save(EEndpoints.ForeignWork, this.form.value)
            .subscribe(function (response) {
            if (response.code == 100) {
                response.result.itemId = response.result.id;
                _this.work = response.result;
                _this.openDetails(_this.row);
            }
        }, function (err) { return _this.responseError(err); });
    };
    AddRelationVideoworkComponent.prototype.openDetails = function (row) {
        var _this = this;
        //this.rowDetails = row;              
        var dialogRef = this.dialog.open(AddProjectWorkDetailsComponent, {
            width: '700px',
            data: {
                action: this.translate.instant('general.save'),
                icon: 'save_outline',
                data: row,
                isInternal: this.f.isInternal.value
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var data = result;
                _this.row.ISRC = data.ISRC;
                _this.row.personProducerId = data.personProducerId;
                _this.row.isComposerInternal = data.isComposerInternal;
                _this.row.personComposerId = data.personComposerId;
                _this.row.editorId = data.editorId;
                _this.row.associationId = data.associationId;
                _this.row.personRemixId = data.personRemixId;
                _this.row.personRemixName = data.personRemixName;
                _this.row.personProducerName = data.personProducerName;
                _this.row.isInternalRelated = _this.f.isInternal.value;
                if (_this.f.isInternal.value) {
                    _this.row.workRelatedId = _this.work.itemId;
                }
                else {
                    _this.row.foreignWorkRelatedId = _this.work.itemId;
                }
                _this.row.workName = _this.work.name;
                _this.dialogRef.close(_this.row);
            }
        });
    };
    AddRelationVideoworkComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    AddRelationVideoworkComponent.prototype.set = function () {
    };
    AddRelationVideoworkComponent.prototype.onNoClick = function () {
        this.dialogRef.close(undefined);
    };
    AddRelationVideoworkComponent.prototype.responseError = function (err) {
        this.isWorking = false;
        console.log(err);
        //this.toaster.showToaster('Error de comunicacion con el servidor');
        //this.changeIsWorking(false);
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], AddRelationVideoworkComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], AddRelationVideoworkComponent.prototype, "sort", void 0);
    AddRelationVideoworkComponent = __decorate([
        Component({
            selector: 'app-add-relation-videowork',
            templateUrl: './add-relation-videowork.component.html',
            styleUrls: ['./add-relation-videowork.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ApiService,
            MatDialog,
            TranslateService,
            FormBuilder,
            FuseTranslationLoaderService, Object])
    ], AddRelationVideoworkComponent);
    return AddRelationVideoworkComponent;
}());
export { AddRelationVideoworkComponent };
//# sourceMappingURL=add-relation-videowork.component.js.map