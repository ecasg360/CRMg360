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
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { EEndpoints } from '@enums/endpoints';
import { startWith, map } from 'rxjs/operators';
var AddTermTypeComponent = /** @class */ (function () {
    function AddTermTypeComponent(dialogRef, toaster, apiService, translate, fb, _translationLoaderService, data) {
        this.dialogRef = dialogRef;
        this.toaster = toaster;
        this.apiService = apiService;
        this.translate = translate;
        this.fb = fb;
        this._translationLoaderService = _translationLoaderService;
        this.data = data;
        this.isWorking = false;
        this.contractId = 0;
        this.termTypes = [];
        this.selectedTermTypes = [];
        this.termTypeFC = new FormControl();
        this.question = '';
        this.contractTermTypeList = [];
        this.displayedColumns = ['name', 'action'];
        this._getTermTypes();
    }
    AddTermTypeComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._translationLoaderService).loadTranslations.apply(_a, allLang);
        this.contractId = this.data.contractId;
        this.contractTermTypeList = this.data.contractTermType;
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
        this.configureForm();
    };
    AddTermTypeComponent.prototype.configureForm = function () {
        this.form = this.fb.group({
            termType: ['', [Validators.required]]
        });
    };
    Object.defineProperty(AddTermTypeComponent.prototype, "f", {
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    AddTermTypeComponent.prototype.enter = function () {
        var value = this.termTypeFC.value;
        if (value.indexOf(this.question) < 0) {
            var found_1 = this.termTypes.find(function (f) { return f.viewValue.toLowerCase() == value.toLowerCase(); });
            if (found_1) {
                this.selectedTermTypes.push(found_1);
                this.termTypes = this.termTypes.filter(function (f) { return f.value != found_1.value; });
                this._fillTable();
            }
            else
                this._saveTermType(value);
            this.termTypeFC.patchValue('');
        }
    };
    AddTermTypeComponent.prototype.autocompleteOptionSelected = function ($event) {
        if ($event.option.id != '0') {
            var found_2 = this.termTypes.find(function (f) { return f.value == $event.option.id; });
            if (found_2) {
                this.selectedTermTypes.push(found_2);
                this.termTypes = this.termTypes.filter(function (f) { return f.value != found_2.value; });
                this._fillTable();
            }
        }
        else {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            this._saveTermType(newItem);
        }
        this.termTypeFC.patchValue('');
    };
    AddTermTypeComponent.prototype.deleteTermTypeTable = function (row) {
        var found = this.selectedTermTypes.find(function (f) { return f.value == row.value; });
        if (found) {
            this.selectedTermTypes = this.selectedTermTypes.filter(function (f) { return f.value != row.value; });
            this.termTypes.push(found);
            this._fillTable();
        }
    };
    AddTermTypeComponent.prototype.set = function () {
        var params = this._formatTermTypes();
        this._save(params);
    };
    AddTermTypeComponent.prototype.onNoClick = function () {
        this.dialogRef.close(undefined);
    };
    AddTermTypeComponent.prototype._fillTable = function () {
        this.dataSource = new MatTableDataSource(this.selectedTermTypes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.f.termType.patchValue(this.selectedTermTypes);
        this.termTypeFC.setValue('');
    };
    AddTermTypeComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        var result = this.termTypes.filter(function (option) { return option.viewValue.toLowerCase().includes(filterValue); });
        return (result.length == 0)
            ? [{
                    value: 0,
                    viewValue: "" + this.question + value.trim() + "\"?"
                }]
            : result;
    };
    AddTermTypeComponent.prototype._formatTermTypes = function () {
        var _this = this;
        return this.selectedTermTypes.map(function (m) {
            return {
                termTypeId: m.value,
                contractId: _this.contractId
            };
        });
    };
    AddTermTypeComponent.prototype._responseError = function (error) {
        this.toaster.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    //#region API
    AddTermTypeComponent.prototype._getTermTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.TermTypes).subscribe(function (response) {
            if (response.code == 100) {
                response.result.forEach(function (item) {
                    var index = _this.contractTermTypeList.findIndex(function (f) { return f.termTypeId == item.id; });
                    if (index < 0) {
                        _this.termTypes.push({
                            value: item.id,
                            viewValue: item.name
                        });
                    }
                });
                _this.filteredOptions = _this.termTypeFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddTermTypeComponent.prototype._save = function (types) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.ContractTermTypes, types).subscribe(function (response) {
            if (response.code == 100) {
                _this.dialogRef.close(true);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    AddTermTypeComponent.prototype._saveTermType = function (name) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.TermType, { name: name }).subscribe(function (response) {
            if (response.code == 100) {
                _this.selectedTermTypes.push({
                    value: response.result.id,
                    viewValue: response.result.name
                });
                _this._fillTable();
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    __decorate([
        ViewChild(MatPaginator, { static: true }),
        __metadata("design:type", MatPaginator)
    ], AddTermTypeComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], AddTermTypeComponent.prototype, "sort", void 0);
    AddTermTypeComponent = __decorate([
        Component({
            selector: 'app-add-term-type',
            templateUrl: './add-term-type.component.html',
            styleUrls: ['./add-term-type.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [MatDialogRef,
            ToasterService,
            ApiService,
            TranslateService,
            FormBuilder,
            FuseTranslationLoaderService, Object])
    ], AddTermTypeComponent);
    return AddTermTypeComponent;
}());
export { AddTermTypeComponent };
//# sourceMappingURL=add-term-type.component.js.map