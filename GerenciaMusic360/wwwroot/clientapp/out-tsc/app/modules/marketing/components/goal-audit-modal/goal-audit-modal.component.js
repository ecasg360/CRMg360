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
import { Component, Optional, Inject } from '@angular/core';
import { ToasterService } from '@services/toaster.service';
import { ApiService } from '@services/api.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
var GoalAuditModalComponent = /** @class */ (function () {
    function GoalAuditModalComponent(toaster, apiService, dialog, translationLoader, translate, data, dialogRef) {
        var _a;
        this.toaster = toaster;
        this.apiService = apiService;
        this.dialog = dialog;
        this.translationLoader = translationLoader;
        this.translate = translate;
        this.data = data;
        this.dialogRef = dialogRef;
        this.marketing = {};
        this.isWorking = false;
        this.formTemplate = [];
        this.goalsList = [];
        this.displayedColumns = ['date'];
        this.tableData = []; //TABLE DATASOURCE
        this.dataSource = new MatTableDataSource();
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
    }
    GoalAuditModalComponent.prototype.ngOnInit = function () {
        this.marketing = this.data.marketing;
        this.variationTag = this.translate.instant('general.variation');
        this.initForm();
        this._getGoals();
        this._getGoalsAudited(EEndpoints.MarketingGoalsAuditedsByMarketing, { marketingId: this.marketing.id }, true);
    };
    GoalAuditModalComponent.prototype.initForm = function () {
        var group = {};
        if (this.formTemplate.length > 0) {
            this.formTemplate.forEach(function (inputTemplate) {
                group[inputTemplate.social] = new FormControl('', [Validators.required]);
            });
        }
        group['date'] = new FormControl('', []);
        this.goalFG = new FormGroup(group);
    };
    Object.defineProperty(GoalAuditModalComponent.prototype, "f", {
        get: function () {
            return this.goalFG.controls;
        },
        enumerable: false,
        configurable: true
    });
    GoalAuditModalComponent.prototype.addGoal = function () {
        var _this = this;
        var params = [];
        this.goalsList.forEach(function (value) {
            params.push({
                marketingId: _this.marketing.id,
                socialNetworkTypeId: value.socialNetworkTypeId,
                dateString: _this.getValidDate(),
                quantity: _this.f[value.socialNetworkName].value,
            });
        });
        this._saveGoalsAudited(params);
    };
    GoalAuditModalComponent.prototype.getValidDate = function () {
        var fecha = this.f['date'].value
            ? (new Date(this.f['date'].value))
            : (new Date());
        return fecha.toISOString().split('T')[0];
    };
    GoalAuditModalComponent.prototype.onNoClick = function (goal) {
        if (goal === void 0) { goal = undefined; }
        this.dialogRef.close(goal);
    };
    GoalAuditModalComponent.prototype._formatArrayForm = function () {
        var _this = this;
        if (this.goalsList.length > 0) {
            this.formTemplate = [];
            this.goalsList.forEach(function (value) {
                _this.formTemplate.push({
                    type: 'number',
                    goal: value.goalName,
                    image: value.pictureURL,
                    social: value.socialNetworkName
                });
            });
        }
    };
    GoalAuditModalComponent.prototype.dateChange = function (event) {
        var value = event.value;
        if (value) {
            this.f['date'].patchValue(event.value.toISOString().split('T')[0]);
            var params = {
                marketingId: this.marketing.id,
                dateString: event.value.toISOString().split('T')[0]
            };
            this._getGoalsAudited(EEndpoints.MarketingGoalsAuditeds, params, false);
        }
    };
    GoalAuditModalComponent.prototype._fillSocialInputs = function (marketingGoals) {
        var _this = this;
        if (marketingGoals.length > 0) {
            marketingGoals.forEach(function (value) {
                if (_this.f[value.socialNetworkName]) {
                    _this.f[value.socialNetworkName].patchValue(value.quantity);
                }
            });
        }
    };
    GoalAuditModalComponent.prototype._formatTableData = function (audited) {
        this.tableData = [];
        //filtro para obtener los registros unicos de fecha
        var unique = audited.filter(function (value, index, self) {
            return self.findIndex(function (f) { return f.dateString == value.dateString; }) == index;
        });
        var _loop_1 = function (i) {
            // obtengo el valor de fecha unica
            var element = unique[i];
            // busco todos los registros de esa fecha
            var dayGoal = audited.filter(function (f) { return f.dateString == element.dateString; });
            //genero mi objeto candidato y agrego la fecha que es la unica fija yla primera
            var obj = { date: element.dateString };
            var _loop_2 = function (index) {
                // obtengo el nombre de la columna
                var column = this_1.displayedColumns[index];
                // todos los registros asociados a las redes sociales son impares
                if (index % 2 == 1) {
                    // buscando en el arreglo con datos del dia busco la red social
                    var goalFound = dayGoal.find(function (f) { return f.socialNetworkName == column; });
                    // si la consigo agregosu datos, tomo en cuenta que el registro sigueinte hace referencia a su variacion
                    // y se coloca como prefio el nombre de la red social para diferenciarlo porque sino lo sobreescribe
                    if (goalFound) {
                        obj[column] = goalFound.quantity;
                        obj[column + " " + this_1.variationTag] = goalFound.variation.toFixed(2);
                    }
                    else {
                        // si no hay nada se asigna 0
                        obj[column] = 0;
                        obj[column + " " + this_1.variationTag] = 0;
                    }
                }
            };
            // recorro lascolumnas a partir del segundo elemento ay que el primero fue establecido
            for (var index = 1; index < this_1.displayedColumns.length; index++) {
                _loop_2(index);
            }
            this_1.tableData.push(obj);
        };
        var this_1 = this;
        // recorro mi arreglo con las fechas unicas
        for (var i = 0; i < unique.length; i++) {
            _loop_1(i);
        }
        //INITIALIZE MatTableDataSource
        this.dataSource = new MatTableDataSource(this.tableData);
    };
    GoalAuditModalComponent.prototype._responseError = function (err) {
        console.log(err);
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    GoalAuditModalComponent.prototype._getGoals = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MarketingGoals, { marketingId: this.marketing.id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.goalsList = response.result; //.filter(f => f.audited);
                if (_this.goalsList.length > 0) {
                    _this._formatArrayForm();
                    _this.initForm();
                    _this.goalsList.forEach(function (item) {
                        _this.displayedColumns.push(item.socialNetworkName);
                        _this.displayedColumns.push(item.socialNetworkName + " " + _this.variationTag);
                    });
                }
                else
                    _this.toaster.showTranslate('messages.mustGoal');
            }
            else
                _this.toaster.showTranslate('errors.errorGettingField');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    GoalAuditModalComponent.prototype._getGoalsAudited = function (endpoint, params, filltable) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(endpoint, params).subscribe(function (response) {
            if (response.code == 100) {
                if (response.result.length > 0) {
                    if (endpoint == EEndpoints.MarketingGoalsAuditeds)
                        _this._fillSocialInputs(response.result);
                }
                if (filltable)
                    _this._formatTableData(response.result);
            }
            else
                _this.toaster.showTranslate('errors.errorGettingField');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    GoalAuditModalComponent.prototype._saveGoalsAudited = function (params) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingGoalsAuditeds, params).subscribe(function (response) {
            if (response.code == 100) {
                var data = {
                    marketingId: _this.marketing.id
                };
                _this._getGoalsAudited(EEndpoints.MarketingGoalsAuditedsByMarketing, data, true);
            }
            else
                _this.toaster.showTranslate('errors.errorSavingField');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    GoalAuditModalComponent.prototype.downloadReport = function (item) {
        var _this = this;
        this.apiService.download(EEndpoints.GoalsAuditedDownload, { marketingId: item.id }).subscribe(function (fileData) {
            var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "Reporte_MarketingGoals_" + item.name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    GoalAuditModalComponent = __decorate([
        Component({
            selector: 'app-goal-audit-modal',
            templateUrl: './goal-audit-modal.component.html',
            styleUrls: ['./goal-audit-modal.component.scss']
        }),
        __param(5, Optional()),
        __param(5, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            FuseTranslationLoaderService,
            TranslateService, Object, MatDialogRef])
    ], GoalAuditModalComponent);
    return GoalAuditModalComponent;
}());
export { GoalAuditModalComponent };
//# sourceMappingURL=goal-audit-modal.component.js.map