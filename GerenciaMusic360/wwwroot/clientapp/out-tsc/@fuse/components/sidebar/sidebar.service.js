var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
var FuseSidebarService = /** @class */ (function () {
    /**
     * Constructor
     */
    function FuseSidebarService() {
        // Private
        this._registry = {};
    }
    /**
     * Add the sidebar to the registry
     *
     * @param key
     * @param sidebar
     */
    FuseSidebarService.prototype.register = function (key, sidebar) {
        // Check if the key already being used
        if (this._registry[key]) {
            console.error("The sidebar with the key '" + key + "' already exists. Either unregister it first or use a unique key.");
            return;
        }
        // Add to the registry
        this._registry[key] = sidebar;
    };
    /**
     * Remove the sidebar from the registry
     *
     * @param key
     */
    FuseSidebarService.prototype.unregister = function (key) {
        // Check if the sidebar exists
        if (!this._registry[key]) {
            console.warn("The sidebar with the key '" + key + "' doesn't exist in the registry.");
        }
        // Unregister the sidebar
        delete this._registry[key];
    };
    /**
     * Return the sidebar with the given key
     *
     * @param key
     * @returns {FuseSidebarComponent}
     */
    FuseSidebarService.prototype.getSidebar = function (key) {
        // Check if the sidebar exists
        if (!this._registry[key]) {
            console.warn("The sidebar with the key '" + key + "' doesn't exist in the registry.");
            return;
        }
        // Return the sidebar
        return this._registry[key];
    };
    FuseSidebarService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], FuseSidebarService);
    return FuseSidebarService;
}());
export { FuseSidebarService };
//# sourceMappingURL=sidebar.service.js.map