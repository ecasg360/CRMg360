import { FormGroup, FormControl, FormArray, AbstractControl } from '@angular/forms';

export class CustomFormGroup extends FormGroup {

  public shouldShowFormErrorsFor(field: string) {
    return this.controls[field].invalid &&
    (this.controls[field].dirty || this.controls[field].touched);
}

  public validateAllFormControls() {
    this._validateAllFormControls(this);
  }

  private _validateAllFormControls(control: AbstractControl) {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(field => {
        this._validateAllFormControls(control.get(field));
      });
    } else if (control instanceof FormArray) {
      control.controls.forEach(field => {
        this._validateAllFormControls(field);
      });
    }
    control.markAsTouched({ onlySelf: true });
  }

  public get names () {
    return Object.keys(this.controls);
  }

}
