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
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { EEndpoints } from '@enums/endpoints';
import { allLang } from '@i18n/allLang';
import { SelectionModel } from '@angular/cdk/collections';
import { Validators, FormBuilder } from '@angular/forms';
var SelectionContractTermsComponent = /** @class */ (function () {
    function SelectionContractTermsComponent(dialogRef, toaster, apiService, translate, _translationLoaderService, fb, data) {
        this.dialogRef = dialogRef;
        this.toaster = toaster;
        this.apiService = apiService;
        this.translate = translate;
        this._translationLoaderService = _translationLoaderService;
        this.fb = fb;
        this.data = data;
        this.isWorking = false;
        this.isCreatingClausule = false;
        this.displayedColumns = ['select', 'name'];
        this.dataSource = new MatTableDataSource([]);
        this.selection = new SelectionModel(true, []);
    }
    SelectionContractTermsComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._translationLoaderService).loadTranslations.apply(_a, allLang);
        this.termTypeContract = this.data.contractTerms;
        this.selectedClausules = this.data.clausules;
        this._getTerms();
        this.formClausule = this.fb.group({
            id: [null, []],
            name: [null, [Validators.required]],
            termTypeId: [this.termTypeContract.termTypeId]
        });
    };
    Object.defineProperty(SelectionContractTermsComponent.prototype, "f", {
        get: function () { return this.formClausule.controls; },
        enumerable: false,
        configurable: true
    });
    /** Whether the number of selected elements matches the total number of rows. */
    SelectionContractTermsComponent.prototype.isAllSelected = function () {
        var numSelected = this.selection.selected.length;
        var numRows = this.dataSource.data.length;
        return numSelected === numRows;
    };
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    SelectionContractTermsComponent.prototype.masterToggle = function () {
        var _this = this;
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(function (row) { return _this.selection.select(row); });
    };
    /** The label for the checkbox on the passed row */
    SelectionContractTermsComponent.prototype.checkboxLabel = function (row) {
        return row ?
            (this.selection.isSelected(row) ? 'deselect' : 'select') + " row " :
            (this.isAllSelected() ? 'select' : 'deselect') + " all";
    };
    SelectionContractTermsComponent.prototype.cancelClausule = function () {
        this.formClausule.reset();
        this.formClausule.clearValidators();
        this.isCreatingClausule = false;
    };
    SelectionContractTermsComponent.prototype.setClausule = function () {
        if (this.formClausule.valid) {
            var term = this.formClausule.value;
            if (term.id)
                this._updateClausule(term);
            else {
                term.id = 0;
                this._saveClausule(term);
            }
        }
    };
    SelectionContractTermsComponent.prototype.set = function () {
        var _this = this;
        if (this.selection.selected.length > 0) {
            var contractTerms = this.selection.selected.map(function (m, index) {
                return {
                    id: 0,
                    contractId: _this.termTypeContract.contractId,
                    termId: m.id,
                    position: _this.selectedClausules.length + (index + 1)
                };
            });
            this._save(contractTerms);
        }
    };
    SelectionContractTermsComponent.prototype.onNoClick = function () {
        this.dialogRef.close(undefined);
    };
    SelectionContractTermsComponent.prototype._formatTerms = function (terms) {
        var _this = this;
        var valids = [];
        if (this.selectedClausules.length == 0)
            return terms;
        if (terms.length > 0) {
            terms.forEach(function (item) {
                var found = _this.selectedClausules.findIndex(function (f) { return f.termId == item.id; });
                if (found < 0)
                    valids.push(item);
            });
        }
        return valids;
    };
    SelectionContractTermsComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    SelectionContractTermsComponent.prototype._getTerms = function () {
        var _this = this;
        this.isWorking = true;
        var params = { termTypeId: this.termTypeContract.termTypeId };
        this.apiService.get(EEndpoints.TermsByTermType, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.selection.clear();
                _this.dataSource.data = _this._formatTerms(response.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.onNoClick();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    SelectionContractTermsComponent.prototype._saveClausule = function (term) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.Term, term).subscribe(function (response) {
            if (response.code == 100) {
                //this._saveContractTerms(response.result.id);
                _this._getTerms();
                _this.cancelClausule();
            }
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    SelectionContractTermsComponent.prototype._updateClausule = function (term) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.Term, term).subscribe(function (response) {
            if (response.code == 100) {
                _this._getTerms();
                _this.cancelClausule();
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    SelectionContractTermsComponent.prototype._saveContractTerms = function (termId) {
        var _this = this;
        this.isWorking = true;
        var contractTerm = {
            id: 0,
            contractId: this.termTypeContract.contractId,
            termId: termId,
            position: 0
        };
        this.apiService.save(EEndpoints.ContractTerm, contractTerm).subscribe(function (response) {
            if (response.code == 100) {
                _this._getTerms();
                _this.cancelClausule();
            }
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    SelectionContractTermsComponent.prototype._save = function (contractTerms) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ContractTerms, contractTerms).subscribe(function (response) {
            if (response.code == 100) {
                _this.dialogRef.close(true);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], SelectionContractTermsComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], SelectionContractTermsComponent.prototype, "sort", void 0);
    SelectionContractTermsComponent = __decorate([
        Component({
            selector: 'app-selection-contract-terms',
            templateUrl: './selection-contract-terms.component.html',
            styleUrls: ['./selection-contract-terms.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ToasterService,
            ApiService,
            TranslateService,
            FuseTranslationLoaderService,
            FormBuilder, Object])
    ], SelectionContractTermsComponent);
    return SelectionContractTermsComponent;
}());
export { SelectionContractTermsComponent };
//# sourceMappingURL=selection-contract-terms.component.js.map