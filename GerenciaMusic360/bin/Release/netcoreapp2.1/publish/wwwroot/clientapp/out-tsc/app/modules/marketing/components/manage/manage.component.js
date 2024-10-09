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
import { DomSanitizer } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { ToasterService } from '@services/toaster.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { allLang } from '@i18n/allLang';
import { EEventType } from '@enums/modules-types';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
var ManageComponent = /** @class */ (function () {
    function ManageComponent(fb, apiService, toaster, translationLoaderService, route, router, sanitizer) {
        var _a;
        this.fb = fb;
        this.apiService = apiService;
        this.toaster = toaster;
        this.translationLoaderService = translationLoaderService;
        this.route = route;
        this.router = router;
        this.sanitizer = sanitizer;
        this.isEdit = false;
        this.isWorking = false;
        this.isUploading = false;
        this.eventType = EEventType;
        this.marketing = {};
        this.project = {};
        this.formatStartDate = {};
        this.formatEndDate = {};
        this.isChangeImage = false;
        this.perm = {};
        this.backgroundImg = sanitizer.bypassSecurityTrustStyle('url(assets/images/marketing/background-marketing-default.jpg)');
        (_a = this.translationLoaderService).loadTranslations.apply(_a, allLang);
        this.perm = this.route.snapshot.data;
    }
    ManageComponent.prototype.ngOnInit = function () {
        this.addMarketingForm = this.fb.group({});
        this.marketing = this.route.snapshot.data.marketingResolve.result;
        this.marketingId = this.route.snapshot.paramMap.get("marketingId");
        if (!this.marketingId)
            this.router.navigate(['/marketing']);
        this._formatMarketing();
        var id = parseInt(this.marketingId);
        this._getMarketingImage(id);
    };
    Object.defineProperty(ManageComponent.prototype, "f", {
        //#region form
        get: function () { return this.addMarketingForm.controls; },
        enumerable: false,
        configurable: true
    });
    ManageComponent.prototype.bindExternalForm = function (controlName, form) {
        this.addMarketingForm.setControl(controlName, form);
    };
    //#endregion
    ManageComponent.prototype.updateMarketing = function () {
        var marketing = this.f['marketing'].value;
        delete marketing.created;
        this._updateMarketingApi(marketing);
    };
    ManageComponent.prototype.editAction = function () {
        this.isEdit = !this.isEdit;
    };
    ManageComponent.prototype.cancelChange = function () {
        this.isChangeImage = !this.isChangeImage;
        this.file = null;
        this.filename = '';
    };
    ManageComponent.prototype.changeImage = function () {
        if (this.file) {
            this.isUploading = true;
            this._saveMarketingImage();
        }
        else {
            this.cancelChange();
        }
    };
    ManageComponent.prototype.uploadClick = function () {
        var _this = this;
        this.isUploading = true;
        var fileUpload = document.getElementById('fileUploadMarketing');
        fileUpload.onchange = function ($evt) {
            var file = fileUpload.files[0];
            _this.filename = file.name;
            _this.getBase64(file);
        };
        fileUpload.click();
    };
    ManageComponent.prototype.getBase64 = function (file) {
        var _this = this;
        var reader = new FileReader();
        reader.onloadend = function () {
            _this.file = reader.result;
            _this.isUploading = false;
        };
        reader.readAsDataURL(file);
    };
    ManageComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.isUploading = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    ManageComponent.prototype._formatMarketing = function () {
        this.formatStartDate = this._formatDate(this.marketing.startDateString);
        this.formatEndDate = this._formatDate(this.marketing.endDateString);
        if (this.marketing.projectId)
            this._getProjectApi(this.marketing.projectId);
    };
    ManageComponent.prototype._formatDate = function (date) {
        if (date) {
            var dateVerfication = new Date(date);
            return {
                year: dateVerfication.getFullYear(),
                day: dateVerfication.getDate(),
                weekDay: dateVerfication.getDay(),
                month: (dateVerfication.getMonth() + 1),
            };
        }
        return {
            year: '0000',
            day: '00',
            weekDay: 'waiting',
            month: 'waiting',
        };
    };
    //#region API
    ManageComponent.prototype._getMarketing = function (id) {
        var _this = this;
        this.apiService.get(EEndpoints.Marketing, { id: id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.marketing = response.result;
                _this._formatMarketing();
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
        });
    };
    ManageComponent.prototype._getMarketingImage = function (id) {
        var _this = this;
        this.apiService.get(EEndpoints.MarketingImage, { id: id }).subscribe(function (response) {
            if (response.code == 100 && response.result) {
                var image = response.result.replace(/\\/g, '/');
                _this.backgroundImg = _this.sanitizer.bypassSecurityTrustStyle("url(" + image + ")");
            }
        });
    };
    ManageComponent.prototype._getProjectApi = function (projectId) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.Project, { id: projectId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.project = response.result;
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ManageComponent.prototype._updateMarketingApi = function (marketing) {
        var _this = this;
        this.isWorking = true;
        this.apiService.update(EEndpoints.Marketing, marketing).subscribe(function (response) {
            if (response.code == 100) {
                _this.toaster.showTranslate('messages.itemUpdated');
                _this.marketing = _this.f['marketing'].value;
                if (_this.marketing.projectId)
                    _this._getProjectApi(_this.marketing.projectId);
            }
            else
                _this.toaster.showTranslate('errors.errorEditingItem');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ManageComponent.prototype._saveMarketingImage = function () {
        var _this = this;
        this.isUploading = true;
        var params = {
            id: this.marketing.id,
            PictureUrl: this.file
        };
        this.apiService.save(EEndpoints.MarketingImage, params).subscribe(function (response) {
            if (response.code == 100) {
                var image = response.result.replace(/\\/g, '/');
                _this.backgroundImg = _this.sanitizer.bypassSecurityTrustStyle("url(" + image + ")");
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isUploading = false;
            _this.cancelChange();
        }, function (err) { return _this._responseError(err); });
    };
    ManageComponent.prototype.downloadReport = function () {
        var _this = this;
        this.apiService.download(EEndpoints.MarketingPlanDownload, { marketingId: this.marketingId }).subscribe(function (fileData) {
            var blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                console.log('url: ', url);
                link.setAttribute("href", url);
                var filename = _this.marketing.name.replace('.', '_');
                link.setAttribute("download", "Reporte_MarketingPlan_" + filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    ManageComponent = __decorate([
        Component({
            selector: 'app-manage',
            templateUrl: './manage.component.html',
            styleUrls: ['./manage.component.scss'],
            animations: fuseAnimations
        }),
        __metadata("design:paramtypes", [FormBuilder,
            ApiService,
            ToasterService,
            FuseTranslationLoaderService,
            ActivatedRoute,
            Router,
            DomSanitizer])
    ], ManageComponent);
    return ManageComponent;
}());
export { ManageComponent };
//# sourceMappingURL=manage.component.js.map