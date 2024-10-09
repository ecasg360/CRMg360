import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, Optional, Inject, SimpleChanges } from '@angular/core';
import { IPerson } from '@models/person';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectOption } from '@models/select-option.models';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from '@services/api.service';
import { allLang } from '@i18n/allLang';
import { isNullOrUndefined } from 'util';
import { EEndpoints } from '@enums/endpoints';

@Component({
  selector: 'app-form-person',
  templateUrl: './form-person.component.html',
  styleUrls: ['./form-person.component.scss']
})

export class FormPersonComponent implements OnInit, OnChanges, OnDestroy {
  @Input() projectId: string;
  @Input() manageImage: boolean = true;
  @Input() person: IPerson;
  @Input() title: string;
  @Input('image') pictureURL: any;
  @Output() formReady = new EventEmitter<FormGroup>();
  @Output() outIsInternal = new EventEmitter<boolean>();
  personForm: FormGroup;
  genders: SelectOption[];
  @Input() isInternal: boolean = false;
  @Input() isContact: boolean = false;
  isComposer: boolean = false;
  isContractMember: boolean = false;

  constructor(
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private fb: FormBuilder,
      private service: ApiService,
  ) { }

  ngOnInit() {     
      // this.isComposer = this.actionData.isComposer;
      // this.isContractMember = this.actionData.isContractMember;

      if (!this.person) {
          this.person = <IPerson>{};
      }
      //this.person.isIntern = true;
      this._fuseTranslationLoaderService.loadTranslations(...allLang);

      this.genders = [
          { value: 'F', viewValue: 'general.female' },
          { value: 'M', viewValue: 'general.male' }
      ];

      this.initializeValidations();
      this.formReady.emit(this.personForm);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  initializeValidations(): void {
      const birthDateString = (this.person.birthDateString)
          ? (new Date(this.person.birthDateString)).toISOString()
          : null;

      this.person.isInternal = (this.person.isInternal) ? true : false;

      const res = this.projectId;
      if (!isNullOrUndefined(this.projectId)) {

          if (!this.person.name) {
              this.personForm = this.fb.group({
                  name: ['' , [Validators.required]],
                  lastName: ['', [this.isContact ? [] : [Validators.required]]],
                  secondLastName: [''],
                  birthDateString: [birthDateString],
                  gender: ['', this.isContact ? [] : [Validators.required]],
                  email: [''],
                  officePhone: [''],
                  cellPhone: [''],
                  pictureUrl: [''],
                  isInternal: [false],
              });
              return;
          }


          this.personForm = this.fb.group({
              name: [this.person.name, [
                  Validators.required
              ]],
              lastName: [this.person.lastName, [
                  this.isContact ? [] : []
              ]],
              secondLastName: [this.person.secondLastName, []],
              birthDateString: [birthDateString, []],
              gender: [this.person.gender, this.isContact ? [] : [Validators.required] ],
              email: [this.person.email, []],
              officePhone: [this.person.officePhone],
              cellPhone: [this.person.cellPhone, []],
              pictureUrl: [this.person.pictureUrl, []],
              isInternal: [false, []],
          });
          return;
      }

      this.personForm = this.fb.group({
          name: [this.person.name, [
              Validators.required
          ]],
          lastName: [this.person.lastName, [
              Validators.required
          ]],
          secondLastName: [this.person.secondLastName, []],
          birthDateString: [birthDateString, []],
          gender: [this.person.gender, this.isContact ? [] : [Validators.required] ],
          email: [this.person.email, []],
          officePhone: [this.person.officePhone, []],
          cellPhone: [this.person.cellPhone, []],
          pictureUrl: [this.person.pictureUrl, []],
          isInternal: [this.person.isInternal, []],
      });
      this.isInternal = this.person.isInternal;
  }

  get f() { return this.personForm.controls; }

  selectImage($evt: any): void {
      this.personForm.controls['pictureUrl'].patchValue($evt);
  }

  ngOnDestroy(): void {
      this.formReady.complete();
  }

  sample(): void {
      this.isInternal = !this.isInternal;
      this.outIsInternal.emit(this.isInternal);
  }

  setComposer(): void {
      if (this.personForm.valid) {
          this.saveComposer();
      }
  }

  saveComposer(): void {
      this.service.save(EEndpoints.Composer, this.personForm.value)
      .subscribe(data => {
        if (data.code == 100) {            
          this.onNoClick(this.personForm.value);
        }           
      }, (err) => this.responseError(err)
      )        
  }

  setContractMember(): void {
      if (this.personForm.valid) {
          this.saveContractMember();
      }
  }

  saveContractMember(): void {
      this.service.save(EEndpoints.ContractMemberPerson, this.personForm.value)
      .subscribe(data => {
        if (data.code == 100) {            
          this.onNoClick(data.result);
        }           
      }, (err) => this.responseError(err)
      )        
  }

  onNoClick(status: IPerson = undefined): void {
      // this.dialogRef.close(status);
  }

  private responseError(err: any) {        
      console.log('http error', err);
  }
}
