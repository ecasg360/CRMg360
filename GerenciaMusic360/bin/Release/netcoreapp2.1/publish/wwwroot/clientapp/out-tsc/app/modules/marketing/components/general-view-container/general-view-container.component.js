var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { allLang } from '@i18n/allLang';
import { ApiService } from '@services/api.service';
import { Component, Input } from '@angular/core';
import { EEndpoints } from '@enums/endpoints';
import { EMarketingSection } from '@enums/modules';
import { ETypeName } from '@enums/type-name';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { map, startWith } from 'rxjs/operators';
import { MarketingSocialMediaComponent } from '../marketing-social-media/marketing-social-media.component';
import { MatDialog } from '@angular/material';
import { MediaTargetsComponent } from '../media-targets/media-targets.component';
import { StreamAddPlaylistsComponent } from '../stream-add-playlists/stream-add-playlists.component';
import { StreamingPlaylistComponent } from '../streaming-playlist/streaming-playlist.component';
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
var GeneralViewContainerComponent = /** @class */ (function () {
    function GeneralViewContainerComponent(apiService, toaster, dialog, translate, translationLoader) {
        var _a;
        this.apiService = apiService;
        this.toaster = toaster;
        this.dialog = dialog;
        this.translate = translate;
        this.translationLoader = translationLoader;
        this.marketingId = 0;
        this.marketingSection = EMarketingSection;
        this.marketingOverviews = [];
        this.isWorking = false;
        this.configurationMarketing = [];
        this.streamingList = [];
        this.mediaList = [];
        this.socialMediaList = [];
        this.materialFC = new FormControl();
        this.question = '';
        this.materialList = [];
        this.selectedMaterial = [];
        this.socialNetworksList = [];
        (_a = this.translationLoader).loadTranslations.apply(_a, allLang);
        this._getConfigurations();
        this._getSocialNetworkTypes();
    }
    GeneralViewContainerComponent.prototype.ngOnInit = function () {
        this.question = this.translate.instant('messages.autoCompleteAddQuestion');
    };
    GeneralViewContainerComponent.prototype.openPanel = function (section, sectionId) {
        var found = this.marketingOverviews.find(function (f) { return f.sectionId == sectionId; });
        if (found && section) {
            this._getOverViewDetail(section, found);
        }
    };
    GeneralViewContainerComponent.prototype.showModal = function (sectionId, position, section) {
        var _this = this;
        var model = null;
        var component = null;
        switch (section) {
            case EMarketingSection.streaming:
                model = this._getOverviewModel(sectionId, position);
                component = StreamingPlaylistComponent;
                break;
            case EMarketingSection.mediaTargets:
                model = this._getOverviewModel(sectionId, position);
                component = MediaTargetsComponent;
                break;
            case EMarketingSection.marketingSocialMedia:
                model = this._getOverviewModel(sectionId, position);
                component = MarketingSocialMediaComponent;
                break;
        }
        var dialogRef = this.dialog.open(component, {
            width: '700px',
            data: model
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                var found = _this.marketingOverviews.find(function (f) { return f.id == result.id; });
                if (!found) {
                    _this.marketingOverviews.push(result);
                    found = result;
                }
                _this._getOverViewDetail(section, found);
            }
        });
    };
    GeneralViewContainerComponent.prototype.openPanelMaterial = function (sectionId, position, section) {
        var found = this.marketingOverviews.find(function (f) { return f.sectionId == sectionId; });
        if (found) {
            this.materialOverview = found;
            this._getOverViewDetail(EMarketingSection.OverviewMaterialRelease, found);
        }
        else {
            var overview = this._getOverviewModel(sectionId, position);
            this._saveMarketingOverView(overview);
        }
    };
    GeneralViewContainerComponent.prototype.addPlaylist = function (item) {
        var _this = this;
        var dialogRef = this.dialog.open(StreamAddPlaylistsComponent, {
            width: '700px',
            data: item
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result)
                _this._getOverViewDetail(EMarketingSection.streaming, item.overview);
        });
    };
    GeneralViewContainerComponent.prototype.enter = function () {
        var value = this.materialFC.value;
        if (value.indexOf(this.question) < 0) {
            var found_1 = this.materialList.find(function (f) { return f.name == value; });
            if (found_1) {
                this.selectedMaterial.push(found_1);
                this.materialList = this.materialList.filter(function (f) { return f.id != found_1.id; });
                this.materialFC.patchValue('');
            }
            else
                this._createMaterial(value);
        }
    };
    GeneralViewContainerComponent.prototype.autocompleteOptionSelected = function ($event) {
        if ($event.option.id != '0') {
            var found_2 = this.materialList.find(function (f) { return f.id == parseInt($event.option.id); });
            if (found_2) {
                this.selectedMaterial.push(found_2);
                this.materialList = this.materialList.filter(function (f) { return f.id != found_2.id; });
            }
        }
        else {
            var newItem = $event.option.value.substring(this.question.length).split('"?')[0];
            this._createMaterial(newItem);
        }
        this.materialFC.patchValue('');
    };
    GeneralViewContainerComponent.prototype.deleteStream = function (id, type, overview) {
        if (type == 'overview') {
            var params = {
                overviewId: overview.id,
                socialNetworkId: id
            };
            this._deleteOverview(EEndpoints.MarketingOverviewDetailsByOverviewSocial, params, overview, EMarketingSection.streaming);
        }
        else {
            var params = { id: id };
            this._deleteOverview(EEndpoints.MarketingOverviewDetail, params, overview, EMarketingSection.streaming);
        }
    };
    GeneralViewContainerComponent.prototype.deleteMedia = function (item) {
        var found = this.marketingOverviews.find(function (f) { return f.id == item.marketingOverviewId; });
        if (found) {
            this._deleteOverview(EEndpoints.MarketingOverviewDetail, { id: item.id }, found, EMarketingSection.mediaTargets);
        }
    };
    GeneralViewContainerComponent.prototype.deleteSocial = function (item) {
        var found = this.marketingOverviews.find(function (f) { return f.id == item.marketingOverviewId; });
        if (found) {
            this._deleteOverview(EEndpoints.MarketingOverviewDetail, { id: item.id }, found, EMarketingSection.marketingSocialMedia);
        }
    };
    GeneralViewContainerComponent.prototype._getOverviewModel = function (sectionId, position) {
        var found = this.marketingOverviews.find(function (f) { return f.sectionId == sectionId; });
        var model = null;
        if (found)
            model = found;
        else {
            model = {
                marketingId: this.marketingId,
                sectionId: sectionId,
                position: position,
                descriptionExt: '',
            };
        }
        return model;
    };
    GeneralViewContainerComponent.prototype._formatStreaming = function (detail, overview) {
        var _this = this;
        this.streamingList = [];
        //filtro para obtener los registros bajo el id de social network
        var unique = detail.filter(function (value, index, self) {
            return self.findIndex(function (f) { return f.socialNetworkTypeId == value.socialNetworkTypeId; }) == index;
        });
        unique.forEach(function (value) {
            _this.streamingList.push({
                overviewId: value.marketingOverviewId,
                overview: overview,
                socialName: value.socialNetwork,
                socialId: value.socialNetworkTypeId,
                pictureUrl: value.pictureUrl,
                detail: detail.filter(function (f) { return f.socialNetworkTypeId == value.socialNetworkTypeId; })
            });
        });
    };
    GeneralViewContainerComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        var result = this.materialList.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
        return (result.length == 0)
            ? [{
                    id: 0,
                    name: "" + this.question + value.trim() + "\"?"
                }]
            : result;
    };
    GeneralViewContainerComponent.prototype._responseError = function (error) {
        this.isWorking = false;
        this.toaster.showTranslate('general.errors.serverError');
    };
    //#region API
    GeneralViewContainerComponent.prototype._getConfigurations = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.CMarketingOverviewSections).subscribe(function (response) {
            if (response.code == 100) {
                _this.configurationMarketing = response.result;
                _this._getOverviews();
            }
            else {
                _this.isWorking = false;
                _this.toaster.showTranslate('general.errors.requestError');
            }
        }, function (err) { return _this._responseError(err); });
    };
    GeneralViewContainerComponent.prototype._getOverviews = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MarketingOverviews, { marketingId: this.marketingId }).subscribe(function (response) {
            if (response.code == 100)
                _this.marketingOverviews = response.result;
            else {
                _this.toaster.showTranslate('general.errors.requestError');
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    GeneralViewContainerComponent.prototype._getOverViewDetail = function (section, overview) {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.MarketingOverviewDetails, { marketingOverviewId: overview.id }).subscribe(function (response) {
            switch (section) {
                case EMarketingSection.streaming:
                    _this._formatStreaming(response.result, overview);
                    break;
                case EMarketingSection.mediaTargets:
                    _this.mediaList = response.result;
                    break;
                case EMarketingSection.marketingSocialMedia: {
                    var items_1 = [];
                    response.result.forEach(function (element) {
                        var socialN = null;
                        _this.socialNetworksList.forEach(function (socialNetwork) {
                            if (socialNetwork.name === element.socialNetwork) {
                                socialN = socialNetwork.pictureUrl;
                            }
                        });
                        items_1.push({
                            id: element.id,
                            marketingOverviewId: element.marketingOverviewId,
                            materialId: element.materialId,
                            mediaId: element.mediaId,
                            name: element.name,
                            pictureUrl: socialN,
                            playListId: element.playListId,
                            position: element.position,
                            socialNetwork: element.socialNetwork,
                            socialNetworkTypeId: element.socialNetworkTypeId
                        });
                    });
                    _this.socialMediaList = items_1;
                    break;
                }
                case EMarketingSection.OverviewMaterialRelease:
                    _this.materialList = response.result;
                    _this.selectedMaterial = response.result;
                    _this.filteredOptions = _this.materialFC.valueChanges
                        .pipe(startWith(''), map(function (value) { return _this._filter(value); }));
                    break;
            }
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    GeneralViewContainerComponent.prototype._createMaterial = function (name) {
        var _this = this;
        this.isWorking = true;
        var type = {
            typeId: ETypeName.Material,
            name: name,
            description: '',
        };
        this.apiService.save(EEndpoints.Type, type).subscribe(function (response) {
            if (response.code == 100) {
                var overviewDetail = {
                    marketingOverviewId: _this.materialOverview.id,
                    materialId: response.result.id,
                    position: _this.materialList.length + 1,
                    name: name,
                };
                _this._saveMarketingOverViewDetail(overviewDetail);
            }
            else {
                _this.isWorking = false;
            }
            _this.materialFC.patchValue('');
        }, function (err) { return _this._responseError(err); });
    };
    GeneralViewContainerComponent.prototype._deleteOverview = function (endpoint, param, overview, type) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(endpoint, param).subscribe(function (response) {
            if (response.code == 100) {
                _this._getOverViewDetail(type, overview);
            }
            else {
                _this.isWorking = false;
                _this.toaster.showTranslate('general.errors.requestError');
            }
        }, function (err) { return _this._responseError(err); });
    };
    GeneralViewContainerComponent.prototype._saveMarketingOverView = function (overview) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingOverview, overview).subscribe(function (response) {
            if (response.code == 100) {
                _this.materialOverview = response.result;
                _this.marketingOverviews.push(response.result);
                _this._getOverViewDetail(EMarketingSection.OverviewMaterialRelease, response.result);
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    GeneralViewContainerComponent.prototype._saveMarketingOverViewDetail = function (detail) {
        var _this = this;
        this.isWorking = true;
        this.apiService.save(EEndpoints.MarketingOverviewDetail, detail).subscribe(function (response) {
            if (response.code == 100) {
                detail.id = response.result.id;
                _this.selectedMaterial.push(detail);
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    GeneralViewContainerComponent.prototype.deleteMaterial = function (detail) {
        var _this = this;
        this.isWorking = true;
        this.apiService.delete(EEndpoints.MarketingOverviewDetail, { id: detail.id }).subscribe(function (response) {
            if (response.code == 100) {
                _this.selectedMaterial = _this.selectedMaterial.filter(function (f) { return f.id != detail.id; });
                _this.materialList = _this.selectedMaterial;
            }
            else
                _this.toaster.showTranslate('general.errors.requestError');
            _this.isWorking = false;
        }, function (err) { return _this._responseError(err); });
    };
    GeneralViewContainerComponent.prototype._getSocialNetworkTypes = function () {
        var _this = this;
        this.isWorking = true;
        this.apiService.get(EEndpoints.SocialNetworkTypes).subscribe(function (response) {
            if (response.code == 100) {
                _this.socialNetworksList = response.result; //.filter(f => f.statusRecordId == 1);
            }
            else {
                _this.toaster.showTranslate('general.errors.requestError');
            }
            _this.isWorking = false;
        }, this._responseError);
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], GeneralViewContainerComponent.prototype, "marketingId", void 0);
    GeneralViewContainerComponent = __decorate([
        Component({
            selector: 'app-general-view-container',
            templateUrl: './general-view-container.component.html',
            styleUrls: ['./general-view-container.component.scss'],
            animations: fuseAnimations
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            MatDialog,
            TranslateService,
            FuseTranslationLoaderService])
    ], GeneralViewContainerComponent);
    return GeneralViewContainerComponent;
}());
export { GeneralViewContainerComponent };
//# sourceMappingURL=general-view-container.component.js.map