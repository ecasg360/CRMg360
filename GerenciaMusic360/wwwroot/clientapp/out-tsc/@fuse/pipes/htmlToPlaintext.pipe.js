var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
var HtmlToPlaintextPipe = /** @class */ (function () {
    function HtmlToPlaintextPipe() {
    }
    /**
     * Transform
     *
     * @param {string} value
     * @param {any[]} args
     * @returns {string}
     */
    HtmlToPlaintextPipe.prototype.transform = function (value, args) {
        if (args === void 0) { args = []; }
        return value ? String(value).replace(/<[^>]+>/gm, '') : '';
    };
    HtmlToPlaintextPipe = __decorate([
        Pipe({ name: 'htmlToPlaintext' })
    ], HtmlToPlaintextPipe);
    return HtmlToPlaintextPipe;
}());
export { HtmlToPlaintextPipe };
//# sourceMappingURL=htmlToPlaintext.pipe.js.map