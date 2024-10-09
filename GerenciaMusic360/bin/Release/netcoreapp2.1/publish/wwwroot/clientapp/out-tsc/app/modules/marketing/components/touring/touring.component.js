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
import { FormBuilder, FormControl } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { allLang } from '@i18n/allLang';
import { EEndpoints } from '@enums/endpoints';
import { startWith, map } from 'rxjs/operators';
var TouringComponent = /** @class */ (function () {
    function TouringComponent(apiService, toaster, translationLoaderService, fb, translate, dialogRef, data) {
        var _a;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translationLoaderService = translationLoaderService;
        this.fb = fb;
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.data = data;
        this.isWorking = false;
        this.model = {};
        this.usedKeysIdeas = [];
        this.keysIdeasList = [];
        this.descriptionFC = new FormControl();
        this.question = '';
        this.displayedColumns = ['description', 'action'];
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
    }
    TouringComponent.prototype.ngOnInit = function () {
        this.model = this.data.marketingKey;
        this.usedKeysIdeas = this.data.keysIdeas;
        this._getKeyIdeas();
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
        this.dataSource = new MatTableDataSource(this.usedKeysIdeas);
    };
    TouringComponent.prototype.enter = function () {
        var value = this.descriptionFC.value;
        if (value.indexOf(this.question) < 0) {
            var found = this.keysIdeasList.find(function (f) { return f.name == value; });
            if (found)
                this._fillTable(found);
            else
                this._setKeyIdea(value);
        }
    };
    TouringComponent.prototype.autocompleteOptionSelected = function ($event) {
        if ($event.option.id != '0') {
            var found = this.keysIdeasList.find(function (f) { return f.id == parseInt($event.option.id); });
            if (found) {
                this._fillTable(found);
            }
        }
        else {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            this._setKeyIdea(newItem);
        }
    };
    TouringComponent.prototype.delete = function (keyIdea) {
        var index = this.usedKeysIdeas.findIndex(function (f) { return f.id == keyIdea.id; });
        if (index >= 0) {
            this.usedKeysIdeas.splice(index, 1);
            this.keysIdeasList.push(keyIdea);
            this._fillTable(undefined);
        }
    };
    TouringComponent.prototype._fillTable = function (keyIdea) {
        if (keyIdea != undefined && keyIdea != null) {
            this.usedKeysIdeas.push(keyIdea);
            this.keysIdeasList = this.keysIdeasList.filter(function (f) { return f.id != keyIdea.id; });
            this.descriptionFC.patchValue('');
        }
        this.dataSource.data = this.usedKeysIdeas;
    };
    TouringComponent.prototype._setKeyIdea = function (name) {
        var keyIdea = {
            categoryId: this.model.categoryId,
            keyIdeasTypeId: this.model.keyIdeasTypeId,
            name: name,
            position: this.keysIdeasList.length + 1,
        };
        this._createKeysIdeas(keyIdea);
    };
    TouringComponent.prototype.onNoClick = function (overview) {
        if (overview === void 0) { overview = undefined; }
        this.dialogRef.close(overview);
    };
    TouringComponent.prototype.save = function () {
        var _this = this;
        if (this.usedKeysIdeas.length > 0) {
            var keysNames = this.usedKeysIdeas.map(function (m) {
                return {
                    marketingKeyIdeasId: _this.model.id,
                    keyIdeasId: m.id
                };
            });
            this._deleteKeysNames(this.model.id, keysNames);
        }
    };
    TouringComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        var result = this.keysIdeasList.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
        return (result.length == 0)
            ? [{
                    id: 0,
                    name: "" + this.question + value.trim() + "\"?"
                }]
            : result;
    };
    TouringComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    TouringComponent.prototype._getKeyIdeas = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.KeyIdeasByType, { keyIdeasTypeId: this.model.keyIdeasTypeId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.keysIdeasList = response.result.filter(function (f) {
                    var found = _this.usedKeysIdeas.find(function (used) { return used.id == f.id; });
                    return found ? false : true;
                });
                _this.filteredOptions = _this.descriptionFC.valueChanges
                    .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    TouringComponent.prototype._createKeysIdeas = function (keyIdea) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.KeyIdea, keyIdea).subscribe(function (response) {
            if (response.code == 100) {
                keyIdea.id = response.result.id;
                _this._fillTable(keyIdea);
                setTimeout(function () { return _this.descriptionFC.setValue(''); });
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
                _this.descriptionFC.patchValue('');
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    TouringComponent.prototype._saveKeyIdeasNames = function (keyNames) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingKeyIdeaNames, keyNames).subscribe(function (response) {
            if (response.code == 100) {
                _this.onNoClick(_this.model);
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    TouringComponent.prototype._deleteKeysNames = function (marketingKeyIdeasId, marketingKeyIdeasNames) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MarketingKeyIdeaNameByMarketingKeysId, { marketingKeyIdeasId: marketingKeyIdeasId }).subscribe(function (response) {
            if (response.code == 100)
                _this._saveKeyIdeasNames(marketingKeyIdeasNames);
            else
                _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    TouringComponent = __decorate([
        Component({
            selector: 'app-touring',
            templateUrl: './touring.component.html',
            styleUrls: ['./touring.component.scss']
        }),
        __param(6, Optional()),
        __param(6, Inject(MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            FormBuilder,
            TranslateService,
            MatDialogRef, Object])
    ], TouringComponent);
    return TouringComponent;
}());
export { TouringComponent };
//# sourceMappingURL=touring.component.js.map