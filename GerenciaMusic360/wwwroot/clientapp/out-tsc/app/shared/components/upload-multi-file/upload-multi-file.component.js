var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ToasterService } from '@services/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '../confirm/confirm.component';
import { environment } from '@environments/environment';
// const URL = '/api/';
var URL = environment.baseUrl + 'Marketing/Upload/';
var UploadMultiFileComponent = /** @class */ (function () {
    function UploadMultiFileComponent(ApiService, toasterService, translate, dialog) {
        this.ApiService = ApiService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.dialog = dialog;
        this.perm = {};
        this.isWorking = false;
        this.indexSplit = environment.splitImageMarketing;
    }
    UploadMultiFileComponent.prototype.ngOnChanges = function (changes) {
        if (changes.marketingId.currentValue) {
            this.getFiles();
        }
    };
    UploadMultiFileComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log(this.marketingId);
        this.api = URL + this.marketingId;
        this.uploader = new FileUploader({
            url: this.api,
        });
        this.uploader.onErrorItem = function (item, response, status, headers) {
            if (status === 404) {
                _this.toasterService.showToaster(_this.translate.instant('general.fileId') + ' ' +
                    _this.translate.instant('general.errors.alreadyExists'));
            }
            else {
                _this.toasterService.showToaster(_this.translate.instant('general.errors.serverError'));
            }
        };
        this.uploader.onSuccessItem = function (item, response, status, headers) {
            console.log('item: ', item);
            console.log('response: ', response);
            console.log('status: ', status);
            console.log('headers: ', headers);
            if (status === 201) {
                item.remove();
            }
            _this.getFiles();
            _this.toasterService.showToaster(_this.translate.instant('multiFileUpload.messages.addSuccess'));
        };
        this.hasBaseDropZoneOver = false;
        this.hasAnotherDropZoneOver = false;
        this.response = '';
        this.uploader.response.subscribe(function (res) { return _this.response = res; });
        this.getFiles();
    };
    UploadMultiFileComponent.prototype.getFiles = function () {
        var _this = this;
        this.isWorking = true;
        var params = [];
        if (!this.marketingId)
            return;
        params['marketingId'] = this.marketingId;
        this.ApiService.get(EEndpoints.MarketingFiles, params).subscribe(function (response) {
            if (response && response.code == 100) {
                _this.files = response.result;
                console.log('this.files: ', _this.files);
            }
            _this.isWorking = false;
        }, function (err) { return _this.responseError(err); });
    };
    UploadMultiFileComponent.prototype.fileOverBase = function (e) {
        this.hasBaseDropZoneOver = e;
    };
    UploadMultiFileComponent.prototype.fileOverAnother = function (e) {
        this.hasAnotherDropZoneOver = e;
    };
    UploadMultiFileComponent.prototype.onProgress = function () {
        this.isWorking = true;
    };
    UploadMultiFileComponent.prototype.confirmDelete = function (fileName) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('messages.deleteQuestion', { field: fileName }),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteFile(fileName, _this.marketingId);
            }
        });
    };
    UploadMultiFileComponent.prototype.deleteFile = function (fileName, marketingId) {
        var _this = this;
        this.isWorking = true;
        var params = [];
        params['fileName'] = fileName;
        params['marketingId'] = marketingId;
        this.ApiService.delete(EEndpoints.MarketingFileDelete, params)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getFiles();
                _this.toasterService.showToaster(_this.translate.instant('multiFileUpload.messages.deleteSuccess'));
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
            _this.isWorking = false;
        }, function (err) {
            _this.responseError(err);
        });
    };
    UploadMultiFileComponent.prototype.removeAll = function () {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: this.translate.instant('multiFileUpload.messages.deleteAllQuestion'),
                action: this.translate.instant('general.delete'),
                icon: 'delete_outline'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_2 = result.confirm;
                if (confirm_2) {
                    _this.deleteAllFiles(_this.marketingId);
                }
            }
        });
    };
    UploadMultiFileComponent.prototype.deleteAllFiles = function (marketingId) {
        var _this = this;
        this.isWorking = true;
        this.files.forEach(function (file) { return __awaiter(_this, void 0, void 0, function () {
            var params;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [];
                        params['fileName'] = file.name;
                        params['marketingId'] = marketingId;
                        return [4 /*yield*/, this.ApiService.delete(EEndpoints.MarketingFileDelete, params)
                                .subscribe(function (data) {
                                if (data.code == 100) {
                                    _this.toasterService.showToaster(_this.translate.instant('multiFileUpload.messages.deleteSuccess'));
                                    _this.getFiles();
                                }
                                else {
                                    _this.toasterService.showToaster(data.message);
                                }
                            }, function (err) {
                                _this.responseError(err);
                            })];
                    case 1:
                        _a.sent();
                        this.isWorking = false;
                        return [2 /*return*/];
                }
            });
        }); });
    };
    UploadMultiFileComponent.prototype.responseError = function (error) {
        this.toasterService.showToaster(this.translate.instant('general.errors.serverError'));
        this.isWorking = false;
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], UploadMultiFileComponent.prototype, "marketingId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], UploadMultiFileComponent.prototype, "perm", void 0);
    UploadMultiFileComponent = __decorate([
        Component({
            selector: 'app-upload-multi-file',
            templateUrl: './upload-multi-file.component.html',
            styleUrls: ['./upload-multi-file.component.css']
        }),
        __metadata("design:paramtypes", [ApiService,
            ToasterService,
            TranslateService,
            MatDialog])
    ], UploadMultiFileComponent);
    return UploadMultiFileComponent;
}());
export { UploadMultiFileComponent };
//# sourceMappingURL=upload-multi-file.component.js.map