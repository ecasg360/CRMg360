var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@app/core/enums/endpoints";
import { EFileAction } from '@enums/file-actions';
import { allLang } from '@i18n/allLang';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
var UploadFileComponent = /** @class */ (function () {
    function UploadFileComponent(fb, translate, ApiService, _fuseTranslationLoaderService) {
        this.fb = fb;
        this.translate = translate;
        this.ApiService = ApiService;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this.fileAction = EFileAction.NoAction; //Define el tipo de acción NoAction, Register, Update
        this.required = false; //Define si el componente sera o no obligatorio.
        this.message = ""; //Controla los mensajes de las acciones del componente
        this.title = ""; //Define el titulo que quiere definirse al componente
        this.IFile = {};
        this.fileToUpload = null;
        this.fileData = null;
    }
    UploadFileComponent.prototype.ngOnInit = function () {
        var _a;
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
    };
    UploadFileComponent.prototype.fileProgress = function (fileInput) {
        this.fileData = fileInput.target.files[0];
    };
    UploadFileComponent.prototype.onFileChange = function (event) {
        if (event.target.files && event.target.files.length) {
            var file = event.target.files[0];
            this.fileToUpload = file;
            this.triggerSave = false;
        }
    };
    UploadFileComponent.prototype.reset = function () {
        this.triggerSave = false;
        this.fileUploadControl.nativeElement.value = "";
        this.message = this.translate.instant('uploadFile.messages.chooseFile');
    };
    UploadFileComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.moduleId > 0 && this.fileToUpload != null) {
            //Create
            if (this.rowId > 0 && this.triggerSave && changes.fileAction.currentValue == EFileAction.Register) {
                this.IFile.moduleId = this.moduleId;
                this.IFile.rowId = this.rowId;
                var splitFileName = this.fileToUpload.name.split('.');
                this.IFile.fileExtention = '.' + splitFileName[splitFileName.length - 1];
                var reader_1 = new FileReader();
                reader_1.readAsDataURL(this.fileToUpload);
                reader_1.onload = function () {
                    _this.IFile.fileURL = 'data:' + _this.fileToUpload.type + ';base64,' + reader_1.result.toString().split(',')[1];
                    _this.saveFile(_this.IFile);
                };
            }
            //Update
            else if (this.rowId > 0 && this.triggerSave == false && changes.fileAction.currentValue == EFileAction.Update) {
                this.IFile.moduleId = this.moduleId;
                this.IFile.rowId = this.rowId;
                var splitFileName = this.fileToUpload.name.split('.');
                this.IFile.fileExtention = '.' + splitFileName[splitFileName.length - 1];
                var reader_2 = new FileReader();
                reader_2.readAsDataURL(this.fileToUpload);
                reader_2.onload = function () {
                    _this.IFile.fileURL = 'data:' + _this.fileToUpload.type + ';base64,' + reader_2.result.toString().split(',')[1];
                    _this.updateFile(_this.IFile);
                };
            }
        }
        else if (this.fileToUpload == null && this.required == true) {
            this.message = this.translate.instant('uploadFile.messages.required');
        }
    };
    UploadFileComponent.prototype.saveFile = function (model) {
        var _this = this;
        this.ApiService.save(EEndpoints.File, model)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.message = _this.translate.instant('uploadFile.messages.addSuccess');
            }
            else {
                _this.message = _this.translate.instant('uploadFile.messages.error');
            }
        });
    };
    UploadFileComponent.prototype.updateFile = function (model) {
        var _this = this;
        this.ApiService.update(EEndpoints.File, model)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.message = _this.translate.instant('uploadFile.messages.savedSuccess');
            }
            else {
                _this.message = _this.translate.instant('uploadFile.messages.error');
            }
        });
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], UploadFileComponent.prototype, "moduleId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], UploadFileComponent.prototype, "rowId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], UploadFileComponent.prototype, "acceptType", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], UploadFileComponent.prototype, "triggerSave", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], UploadFileComponent.prototype, "fileAction", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], UploadFileComponent.prototype, "required", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], UploadFileComponent.prototype, "message", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], UploadFileComponent.prototype, "title", void 0);
    __decorate([
        ViewChild('fileUpload'),
        __metadata("design:type", ElementRef)
    ], UploadFileComponent.prototype, "fileUploadControl", void 0);
    UploadFileComponent = __decorate([
        Component({
            selector: 'app-upload-file',
            templateUrl: './upload-file.component.html',
            styleUrls: ['./upload-file.component.css']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            TranslateService,
            ApiService,
            FuseTranslationLoaderService])
    ], UploadFileComponent);
    return UploadFileComponent;
}());
export { UploadFileComponent };
//# sourceMappingURL=upload-file.component.js.map