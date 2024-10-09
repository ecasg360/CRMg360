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
import { BehaviorSubject, Subject } from 'rxjs';
import * as _ from 'lodash';
var FuseNavigationService = /** @class */ (function () {
    /**
     * Constructor
     */
    function FuseNavigationService() {
        this._registry = {};
        // Set the defaults
        this.onItemCollapsed = new Subject();
        this.onItemCollapseToggled = new Subject();
        // Set the private defaults
        this._currentNavigationKey = null;
        this._onNavigationChanged = new BehaviorSubject(null);
        this._onNavigationRegistered = new BehaviorSubject(null);
        this._onNavigationUnregistered = new BehaviorSubject(null);
        this._onNavigationItemAdded = new BehaviorSubject(null);
        this._onNavigationItemUpdated = new BehaviorSubject(null);
        this._onNavigationItemRemoved = new BehaviorSubject(null);
    }
    Object.defineProperty(FuseNavigationService.prototype, "onNavigationChanged", {
        // -----------------------------------------------------------------------------------------------------
        // @ Accessors
        // -----------------------------------------------------------------------------------------------------
        /**
         * Get onNavigationChanged
         *
         * @returns {Observable<any>}
         */
        get: function () {
            return this._onNavigationChanged.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FuseNavigationService.prototype, "onNavigationRegistered", {
        /**
         * Get onNavigationRegistered
         *
         * @returns {Observable<any>}
         */
        get: function () {
            return this._onNavigationRegistered.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FuseNavigationService.prototype, "onNavigationUnregistered", {
        /**
         * Get onNavigationUnregistered
         *
         * @returns {Observable<any>}
         */
        get: function () {
            return this._onNavigationUnregistered.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FuseNavigationService.prototype, "onNavigationItemAdded", {
        /**
         * Get onNavigationItemAdded
         *
         * @returns {Observable<any>}
         */
        get: function () {
            return this._onNavigationItemAdded.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FuseNavigationService.prototype, "onNavigationItemUpdated", {
        /**
         * Get onNavigationItemUpdated
         *
         * @returns {Observable<any>}
         */
        get: function () {
            return this._onNavigationItemUpdated.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FuseNavigationService.prototype, "onNavigationItemRemoved", {
        /**
         * Get onNavigationItemRemoved
         *
         * @returns {Observable<any>}
         */
        get: function () {
            return this._onNavigationItemRemoved.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Register the given navigation
     * with the given key
     *
     * @param key
     * @param navigation
     */
    FuseNavigationService.prototype.register = function (key, navigation) {
        // Check if the key already being used
        if (this._registry[key]) {
            console.error("The navigation with the key '" + key + "' already exists. Either unregister it first or use a unique key.");
            return;
        }
        // Add to the registry
        this._registry[key] = navigation;
        // Notify the subject
        this._onNavigationRegistered.next([key, navigation]);
    };
    /**
     * Unregister the navigation from the registry
     * @param key
     */
    FuseNavigationService.prototype.unregister = function (key) {
        // Check if the navigation exists
        if (!this._registry[key]) {
            console.warn("The navigation with the key '" + key + "' doesn't exist in the registry.");
        }
        // Unregister the sidebar
        delete this._registry[key];
        // Notify the subject
        this._onNavigationUnregistered.next(key);
    };
    /**
     * Get navigation from registry by key
     *
     * @param key
     * @returns {any}
     */
    FuseNavigationService.prototype.getNavigation = function (key) {
        // Check if the navigation exists
        if (!this._registry[key]) {
            console.warn("The navigation with the key '" + key + "' doesn't exist in the registry.");
            return;
        }
        // Return the sidebar
        return this._registry[key];
    };
    /**
     * Get flattened navigation array
     *
     * @param navigation
     * @param flatNavigation
     * @returns {any[]}
     */
    FuseNavigationService.prototype.getFlatNavigation = function (navigation, flatNavigation) {
        if (flatNavigation === void 0) { flatNavigation = []; }
        for (var _i = 0, navigation_1 = navigation; _i < navigation_1.length; _i++) {
            var item = navigation_1[_i];
            if (item.type === 'item') {
                flatNavigation.push(item);
                continue;
            }
            if (item.type === 'collapsable' || item.type === 'group') {
                if (item.children) {
                    this.getFlatNavigation(item.children, flatNavigation);
                }
            }
        }
        return flatNavigation;
    };
    /**
     * Get the current navigation
     *
     * @returns {any}
     */
    FuseNavigationService.prototype.getCurrentNavigation = function () {
        if (!this._currentNavigationKey) {
            console.warn("The current navigation is not set.");
            return;
        }
        return this.getNavigation(this._currentNavigationKey);
    };
    /**
     * Set the navigation with the key
     * as the current navigation
     *
     * @param key
     */
    FuseNavigationService.prototype.setCurrentNavigation = function (key) {
        // Check if the sidebar exists
        if (!this._registry[key]) {
            console.warn("The navigation with the key '" + key + "' doesn't exist in the registry.");
            return;
        }
        // Set the current navigation key
        this._currentNavigationKey = key;
        // Notify the subject
        this._onNavigationChanged.next(key);
    };
    /**
     * Get navigation item by id from the
     * current navigation
     *
     * @param id
     * @param {any} navigation
     * @returns {any | boolean}
     */
    FuseNavigationService.prototype.getNavigationItem = function (id, navigation) {
        if (navigation === void 0) { navigation = null; }
        if (!navigation) {
            navigation = this.getCurrentNavigation();
        }
        for (var _i = 0, navigation_2 = navigation; _i < navigation_2.length; _i++) {
            var item = navigation_2[_i];
            if (item.id === id) {
                return item;
            }
            if (item.children) {
                var childItem = this.getNavigationItem(id, item.children);
                if (childItem) {
                    return childItem;
                }
            }
        }
        return false;
    };
    /**
     * Get the parent of the navigation item
     * with the id
     *
     * @param id
     * @param {any} navigation
     * @param parent
     */
    FuseNavigationService.prototype.getNavigationItemParent = function (id, navigation, parent) {
        if (navigation === void 0) { navigation = null; }
        if (parent === void 0) { parent = null; }
        if (!navigation) {
            navigation = this.getCurrentNavigation();
            parent = navigation;
        }
        for (var _i = 0, navigation_3 = navigation; _i < navigation_3.length; _i++) {
            var item = navigation_3[_i];
            if (item.id === id) {
                return parent;
            }
            if (item.children) {
                var childItem = this.getNavigationItemParent(id, item.children, item);
                if (childItem) {
                    return childItem;
                }
            }
        }
        return false;
    };
    /**
     * Add a navigation item to the specified location
     *
     * @param item
     * @param id
     */
    FuseNavigationService.prototype.addNavigationItem = function (item, id) {
        // Get the current navigation
        var navigation = this.getCurrentNavigation();
        // Add to the end of the navigation
        if (id === 'end') {
            navigation.push(item);
            // Trigger the observable
            this._onNavigationItemAdded.next(true);
            return;
        }
        // Add to the start of the navigation
        if (id === 'start') {
            navigation.unshift(item);
            // Trigger the observable
            this._onNavigationItemAdded.next(true);
            return;
        }
        // Add it to a specific location
        var parent = this.getNavigationItem(id);
        if (parent) {
            // Check if parent has a children entry,
            // and add it if it doesn't
            if (!parent.children) {
                parent.children = [];
            }
            // Add the item
            parent.children.push(item);
        }
        // Trigger the observable
        this._onNavigationItemAdded.next(true);
    };
    /**
     * Update navigation item with the given id
     *
     * @param id
     * @param properties
     */
    FuseNavigationService.prototype.updateNavigationItem = function (id, properties) {
        // Get the navigation item
        var navigationItem = this.getNavigationItem(id);
        // If there is no navigation with the give id, return
        if (!navigationItem) {
            return;
        }
        // Merge the navigation properties
        _.merge(navigationItem, properties);
        // Trigger the observable
        this._onNavigationItemUpdated.next(true);
    };
    /**
     * Remove navigation item with the given id
     *
     * @param id
     */
    FuseNavigationService.prototype.removeNavigationItem = function (id) {
        var item = this.getNavigationItem(id);
        // Return, if there is not such an item
        if (!item) {
            return;
        }
        // Get the parent of the item
        var parent = this.getNavigationItemParent(id);
        // This check is required because of the first level
        // of the navigation, since the first level is not
        // inside the 'children' array
        parent = parent.children || parent;
        // Remove the item
        parent.splice(parent.indexOf(item), 1);
        // Trigger the observable
        this._onNavigationItemRemoved.next(true);
    };
    FuseNavigationService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], FuseNavigationService);
    return FuseNavigationService;
}());
export { FuseNavigationService };
//# sourceMappingURL=navigation.service.js.map