import { Component, Input, ChangeDetectorRef, ViewChild, ElementRef, SimpleChanges, Optional} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@app/core/enums/endpoints";
import { IFile } from "@shared/models/file.ts";
import { EFileAction } from '@enums/file-actions';
import { allLang } from '@i18n/allLang';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  @Input() moduleId: number; //Define el Id del modulo
  @Input() rowId: number; //Define el Identificador del registro
  @Input() acceptType: string; //Define los tipos de archivos que permitira el input file
  @Input() triggerSave: boolean; //Define si se realizara un registro en primera instancia
  @Input() fileAction: EFileAction = EFileAction.NoAction; //Define el tipo de acción NoAction, Register, Update
  @Input() required: boolean = false; //Define si el componente sera o no obligatorio.
  @Input() message: string = ""; //Controla los mensajes de las acciones del componente
  @Input() title: string = ""; //Define el titulo que quiere definirse al componente
  IFile: IFile = <IFile>{};

  @ViewChild('fileUpload')
  fileUploadControl: ElementRef;
  fileToUpload: File = null;

  fileData = null;
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private ApiService: ApiService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) {}
 
  ngOnInit() {
    this._fuseTranslationLoaderService.loadTranslations(...allLang);
  }
 
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }
  
  onFileChange(event) {
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.fileToUpload = file;
      this.triggerSave = false;
    }
  }
  
  reset() {
    this.triggerSave = false;
    this.fileUploadControl.nativeElement.value = "";
    this.message = this.translate.instant('uploadFile.messages.chooseFile');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.moduleId > 0 && this.fileToUpload != null) {
        //Create
        if (this.rowId > 0 && this.triggerSave && changes.fileAction.currentValue == EFileAction.Register) {
          this.IFile.moduleId = this.moduleId;
          this.IFile.rowId = this.rowId;

          var splitFileName = this.fileToUpload.name.split('.');
          this.IFile.fileExtention = '.' + splitFileName[splitFileName.length - 1];

          let reader = new FileReader();
          reader.readAsDataURL(this.fileToUpload);
    
          reader.onload = () => {
            this.IFile.fileURL =  'data:' + this.fileToUpload.type + ';base64,' + reader.result.toString().split(',')[1];
            this.saveFile(this.IFile);
          };
        }
        //Update
        else if (this.rowId > 0 && this.triggerSave == false && changes.fileAction.currentValue == EFileAction.Update) {
          this.IFile.moduleId = this.moduleId;
          this.IFile.rowId = this.rowId;

          var splitFileName = this.fileToUpload.name.split('.');
          this.IFile.fileExtention = '.' + splitFileName[splitFileName.length - 1];

          let reader = new FileReader();
          reader.readAsDataURL(this.fileToUpload);
    
          reader.onload = () => {
            this.IFile.fileURL =  'data:' + this.fileToUpload.type + ';base64,' + reader.result.toString().split(',')[1];
            this.updateFile(this.IFile);
          };
          
        }
    }else if(this.fileToUpload == null && this.required == true){
      this.message = this.translate.instant('uploadFile.messages.required');
    }
  }

  saveFile(model: IFile): void {
    this.ApiService.save(EEndpoints.File, model)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.message = this.translate.instant('uploadFile.messages.addSuccess');
          } else {
            this.message = this.translate.instant('uploadFile.messages.error');
          }
        },
      );
  }

  updateFile(model:IFile): void {
    this.ApiService.update(EEndpoints.File, model)
      .subscribe(
        data => {
          if (data.code == 100) {
            this.message = this.translate.instant('uploadFile.messages.savedSuccess');
          } else {
            this.message = this.translate.instant('uploadFile.messages.error');
          }
        },
      );
  }
}
