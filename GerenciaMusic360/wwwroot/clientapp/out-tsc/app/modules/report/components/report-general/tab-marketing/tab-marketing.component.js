var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EEndpoints } from '@enums/endpoints';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
var TabMarketingComponent = /** @class */ (function () {
    function TabMarketingComponent(formBuilder, apiService, toasterService, translate) {
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.dataProjectFilter = new FormGroup({});
        this.listArtists = [];
        this.listSingles = [];
        this.optionDefault = {
            value: 0,
            viewValue: "-- All --",
        };
        this.isWorking = false;
    }
    TabMarketingComponent.prototype.ngOnInit = function () {
        this.configureForm();
        this.getArtists();
    };
    Object.defineProperty(TabMarketingComponent.prototype, "f", {
        //#region form
        get: function () { return this.dataProjectFilter.controls; },
        enumerable: false,
        configurable: true
    });
    TabMarketingComponent.prototype.configureForm = function () {
        this.dataProjectFilter = this.formBuilder.group({
            artistId: [this.artistId, []],
            singleId: [this.singleId, []],
        });
    };
    TabMarketingComponent.prototype.getArtists = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Artists).subscribe(function (response) {
            if (response.code == 100) {
                _this.listArtists = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
                _this.listArtists.push(_this.optionDefault);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TabMarketingComponent.prototype.getCampaigns = function () {
        var _this = this;
        console.log('Entró al getCampaigns: ', this.dataProjectFilter.controls.artistId.value);
        var artistId = this.dataProjectFilter.controls.artistId.value;
        this.apiService.get(EEndpoints.ProjectArtistTracks, { ArtistId: artistId }).subscribe(function (response) {
            if (response.code == 100) {
                console.log('response de getSingles: ', response.result);
                _this.listSingles = response.result.map(function (m) {
                    return {
                        value: m.id,
                        viewValue: m.name,
                    };
                });
                if (_this.listSingles.length > 0) {
                    _this.listSingles.push(_this.optionDefault);
                }
                else {
                    _this.toasterService.showToaster(_this.translate.instant('general.errors.noCampaigns'));
                }
                console.log('this.listSingles: ', _this.listSingles);
            }
            else {
                _this.toasterService.showToaster('Error obteniendo contactos del proyecto');
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    TabMarketingComponent.prototype.searchByFilter = function () {
        var _this = this;
        var marketingId = this.dataProjectFilter.controls.singleId.value;
        console.log('marketingId: ', marketingId);
        if (marketingId !== null) {
            var artistId = this.dataProjectFilter.controls.artistId.value;
            this.apiService.download(EEndpoints.ReportMarketing, { ArtistId: artistId, MarketingId: marketingId }).subscribe(function (fileData) {
                console.log('fileData report marketing: ', fileData);
                var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "Report Marketing Template");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                _this.isWorking = false;
            }, function (err) { return _this.responseError(err); });
        }
        else {
            this.toasterService.showToaster(this.translate.instant('report.general.form.selectCampaign'));
        }
    };
    TabMarketingComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    TabMarketingComponent = __decorate([
        Component({
            selector: 'app-tab-marketing',
            templateUrl: './tab-marketing.component.html',
            styleUrls: ['./tab-marketing.component.css']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            ApiService,
            ToasterService,
            TranslateService])
    ], TabMarketingComponent);
    return TabMarketingComponent;
}());
export { TabMarketingComponent };
//# sourceMappingURL=tab-marketing.component.js.map