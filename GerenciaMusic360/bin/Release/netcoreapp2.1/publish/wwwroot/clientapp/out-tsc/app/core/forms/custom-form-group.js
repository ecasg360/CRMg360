var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { FormGroup, FormArray } from '@angular/forms';
var CustomFormGroup = /** @class */ (function (_super) {
    __extends(CustomFormGroup, _super);
    function CustomFormGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomFormGroup.prototype.shouldShowFormErrorsFor = function (field) {
        return this.controls[field].invalid &&
            (this.controls[field].dirty || this.controls[field].touched);
    };
    CustomFormGroup.prototype.validateAllFormControls = function () {
        this._validateAllFormControls(this);
    };
    CustomFormGroup.prototype._validateAllFormControls = function (control) {
        var _this = this;
        if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach(function (field) {
                _this._validateAllFormControls(control.get(field));
            });
        }
        else if (control instanceof FormArray) {
            control.controls.forEach(function (field) {
                _this._validateAllFormControls(field);
            });
        }
        control.markAsTouched({ onlySelf: true });
    };
    Object.defineProperty(CustomFormGroup.prototype, "names", {
        get: function () {
            return Object.keys(this.controls);
        },
        enumerable: false,
        configurable: true
    });
    return CustomFormGroup;
}(FormGroup));
export { CustomFormGroup };
//# sourceMappingURL=custom-form-group.js.map