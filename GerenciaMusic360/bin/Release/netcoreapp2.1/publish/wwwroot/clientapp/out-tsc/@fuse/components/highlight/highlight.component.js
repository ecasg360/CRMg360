var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ContentChild, ElementRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as Prism from 'prismjs/prism';
import '@fuse/components/highlight/prism-languages';
var FuseHighlightComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {ElementRef} _elementRef
     * @param {HttpClient} _httpClient
     */
    function FuseHighlightComponent(_elementRef, _httpClient) {
        this._elementRef = _elementRef;
        this._httpClient = _httpClient;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    FuseHighlightComponent.prototype.ngOnInit = function () {
        var _this = this;
        // If there is no language defined, return...
        if (!this.lang) {
            return;
        }
        // If the path is defined...
        if (this.path) {
            // Get the source
            this._httpClient.get(this.path, { responseType: 'text' })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(function (response) {
                // Highlight it
                _this.highlight(response);
            });
        }
        // If the path is not defined and the source element exists...
        if (!this.path && this.source) {
            // Highlight it
            this.highlight(this.source.nativeElement.value);
        }
    };
    /**
     * On destroy
     */
    FuseHighlightComponent.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Highlight the given source code
     *
     * @param sourceCode
     */
    FuseHighlightComponent.prototype.highlight = function (sourceCode) {
        // Split the source into lines
        var sourceLines = sourceCode.split('\n');
        // Remove the first and the last line of the source
        // code if they are blank lines. This way, the html
        // can be formatted properly while using fuse-highlight
        // component
        if (!sourceLines[0].trim()) {
            sourceLines.shift();
        }
        if (!sourceLines[sourceLines.length - 1].trim()) {
            sourceLines.pop();
        }
        // Find the first non-whitespace char index in
        // the first line of the source code
        var indexOfFirstChar = sourceLines[0].search(/\S|$/);
        // Generate the trimmed source
        var source = '';
        // Iterate through all the lines
        sourceLines.forEach(function (line, index) {
            // Trim the beginning white space depending on the index
            // and concat the source code
            source = source + line.substr(indexOfFirstChar, line.length);
            // If it's not the last line...
            if (index !== sourceLines.length - 1) {
                // Add a line break at the end
                source = source + '\n';
            }
        });
        // Generate the highlighted code
        var highlightedCode = Prism.highlight(source, Prism.languages[this.lang]);
        // Replace the innerHTML of the component with the highlighted code
        this._elementRef.nativeElement.innerHTML =
            '<pre><code class="highlight language-' + this.lang + '">' + highlightedCode + '</code></pre>';
    };
    __decorate([
        ContentChild('source'),
        __metadata("design:type", ElementRef)
    ], FuseHighlightComponent.prototype, "source", void 0);
    __decorate([
        Input('lang'),
        __metadata("design:type", String)
    ], FuseHighlightComponent.prototype, "lang", void 0);
    __decorate([
        Input('path'),
        __metadata("design:type", String)
    ], FuseHighlightComponent.prototype, "path", void 0);
    FuseHighlightComponent = __decorate([
        Component({
            selector: 'fuse-highlight',
            template: '',
            styleUrls: ['./highlight.component.scss']
        }),
        __metadata("design:paramtypes", [ElementRef,
            HttpClient])
    ], FuseHighlightComponent);
    return FuseHighlightComponent;
}());
export { FuseHighlightComponent };
//# sourceMappingURL=highlight.component.js.map