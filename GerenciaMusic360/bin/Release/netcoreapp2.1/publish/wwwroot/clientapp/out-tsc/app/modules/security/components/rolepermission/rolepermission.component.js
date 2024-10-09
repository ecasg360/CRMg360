var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { BehaviorSubject } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTreeFlattener, MatTreeFlatDataSource, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
var ChecklistDatabase = /** @class */ (function () {
    function ChecklistDatabase(apiService) {
        this.apiService = apiService;
        this.dataChange = new BehaviorSubject([]);
        this.initialize();
    }
    Object.defineProperty(ChecklistDatabase.prototype, "data", {
        get: function () { return this.dataChange.value; },
        enumerable: false,
        configurable: true
    });
    ChecklistDatabase.prototype.initialize = function () {
        var _this = this;
        this.apiService.get(EEndpoints.PermissionGroup).subscribe(function (response) {
            var data = _this.buildFileTree(response.result, 0);
            _this.treeData = data;
            _this.dataChange.next(data);
        }, function (erro) {
            console.log(erro);
        });
    };
    ChecklistDatabase.prototype.filter = function (filterText) {
        var filteredTreeData;
        if (filterText) {
            filteredTreeData = this.treeData.filter(function (d) { return d.item.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1; });
            console.log(filteredTreeData);
        }
        else {
            filteredTreeData = this.treeData;
        }
        // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
        // file node as children.
        var data = this.buildFileTree(filteredTreeData, 0);
        // Notify the change.
        this.dataChange.next(data);
        return data;
    };
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `TodoItemNode`.
     */
    ChecklistDatabase.prototype.buildFileTree = function (obj, level) {
        var _this = this;
        return Object.keys(obj).reduce(function (accumulator, key) {
            var value = obj[key];
            var node = new TodoItemNode();
            node.item = value.item;
            node.checked = value.checked;
            node.indeterminate = value.indeterminate;
            node.id = value.id;
            if (value.children != null) {
                if (typeof value.children === 'object') {
                    if (value.children.length > 0) {
                        node.children = _this.buildFileTree(value.children, level + 1);
                    }
                }
                else {
                    node.item = value.item;
                }
            }
            return accumulator.concat(node);
        }, []);
    };
    ChecklistDatabase = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [ApiService])
    ], ChecklistDatabase);
    return ChecklistDatabase;
}());
export { ChecklistDatabase };
/**
 * Node for to-do item
 */
var TodoItemNode = /** @class */ (function () {
    function TodoItemNode() {
    }
    return TodoItemNode;
}());
export { TodoItemNode };
/** Flat to-do item node with expandable and level information */
var TodoItemFlatNode = /** @class */ (function () {
    function TodoItemFlatNode() {
    }
    return TodoItemFlatNode;
}());
export { TodoItemFlatNode };
/**
 * The Json object for to-do list data.
 */
var TREE_DATA = [
    {
        item: 'Cook dinner', id: 1, checked: false, children: [
            { item: 'Cook dinner', id: 11, checked: false, children: null },
            { item: 'Cook dinner2', id: 12, checked: false, children: null }
        ]
    },
    { item: 'Read the Material Design spec', id: 2, checked: true },
];
var RolepermissionComponent = /** @class */ (function () {
    //cuando llenes el treeview la primera vez o lo tomes de la bd
    function RolepermissionComponent(apiService, _database, formBuilder, dialog, translate, toasterService) {
        var _this = this;
        this.apiService = apiService;
        this._database = _database;
        this.formBuilder = formBuilder;
        this.dialog = dialog;
        this.translate = translate;
        this.toasterService = toasterService;
        this.dataChange = new BehaviorSubject([]);
        this.flatNodeMap = new Map();
        this.nestedNodeMap = new Map();
        this.selectedParent = null;
        this.newItemName = '';
        this.checklistSelection = new SelectionModel(true /* multiple */);
        this.getLevel = function (node) { return node.level; };
        this.isExpandable = function (node) { return node.expandable; };
        this.getChildren = function (node) { return node.children; };
        this.hasChild = function (_, _nodeData) { return _nodeData.expandable; };
        this.hasNoContent = function (_, _nodeData) { return _nodeData.item === ''; };
        /**
         * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
         */
        this.transformer = function (node, level) {
            var existingNode = _this.nestedNodeMap.get(node);
            var flatNode = existingNode && existingNode.item === node.item
                ? existingNode
                : new TodoItemFlatNode();
            flatNode.item = node.item;
            flatNode.level = level;
            flatNode.expandable = !!node.children;
            flatNode.id = node.id;
            flatNode.checked = node.checked;
            flatNode.indeterminate = node.indeterminate;
            _this.flatNodeMap.set(flatNode, node);
            _this.nestedNodeMap.set(node, flatNode);
            return flatNode;
        };
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        _database.dataChange.subscribe(function (data) {
            _this.dataSource.data = data;
            _this.treeDataList = _this.dataSource.data;
        });
    }
    Object.defineProperty(RolepermissionComponent.prototype, "data", {
        get: function () { return this.dataChange.value; },
        enumerable: false,
        configurable: true
    });
    RolepermissionComponent.prototype.ngOnInit = function () {
        this.getRoles();
        this.configureForm();
    };
    RolepermissionComponent.prototype.configureForm = function () {
        this.form = this.formBuilder.group({
            role: ['', []],
        });
    };
    RolepermissionComponent.prototype.getRoles = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Roles).subscribe(function (response) {
            _this.roles = response.result;
        }, function (erro) {
            console.log(erro);
        });
    };
    /** Whether all the descendants of the node are selected. */
    RolepermissionComponent.prototype.descendantsAllSelected = function (node) {
        var _this = this;
        var descendants = this.treeControl.getDescendants(node);
        var descAllSelected = descendants.every(function (child) {
            return _this.checklistSelection.isSelected(child);
        });
        return descAllSelected;
    };
    /** Whether part of the descendants are selected */
    RolepermissionComponent.prototype.descendantsPartiallySelected = function (node) {
        var _this = this;
        var descendants = this.treeControl.getDescendants(node);
        var result = descendants.some(function (child) { return _this.checklistSelection.isSelected(child); });
        return result && !this.descendantsAllSelected(node);
    };
    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    RolepermissionComponent.prototype.todoItemSelectionToggle = function (node) {
        var _a, _b;
        var _this = this;
        this.checklistSelection.toggle(node);
        var descendants = this.treeControl.getDescendants(node);
        descendants.forEach(function (n) {
            n.checked = node.checked;
        });
        this.checklistSelection.isSelected(node)
            ? (_a = this.checklistSelection).select.apply(_a, descendants) : (_b = this.checklistSelection).deselect.apply(_b, descendants);
        //// Force update for the parent
        descendants.every(function (child) {
            return _this.checklistSelection.isSelected(child);
        });
        this.checkAllParentsSelection(node);
    };
    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    RolepermissionComponent.prototype.todoLeafItemSelectionToggle = function (node) {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
    };
    /* Checks all the parents when a leaf node is selected/unselected */
    RolepermissionComponent.prototype.checkAllParentsSelection = function (node) {
        var parent = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    };
    /** Check root node checked state and change it accordingly */
    RolepermissionComponent.prototype.checkRootNodeSelection = function (node) {
        var _this = this;
        var nodeSelected = this.checklistSelection.isSelected(node);
        var descendants = this.treeControl.getDescendants(node);
        var descAllSelected = descendants.every(function (child) {
            return _this.checklistSelection.isSelected(child);
        });
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        }
        else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    };
    /* Get the parent node of a node */
    RolepermissionComponent.prototype.getParentNode = function (node) {
        var currentLevel = this.getLevel(node);
        if (currentLevel < 1) {
            return null;
        }
        var startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
        for (var i = startIndex; i >= 0; i--) {
            var currentNode = this.treeControl.dataNodes[i];
            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    };
    RolepermissionComponent.prototype.applyFilter = function (filterText) {
        //this.dataSource.data = this._database.filter(filterText);
        if (filterText) {
            this.treeControl.expandAll();
        }
        else {
            this.treeControl.collapseAll();
        }
        var filteredTreeData;
        if (filterText) {
            filteredTreeData = this.treeDataList.filter(function (d) { return d.item.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1; });
        }
        else {
            filteredTreeData = this.treeDataList;
        }
        this.dataSource.data = filteredTreeData;
    };
    RolepermissionComponent.prototype.set = function () {
        var _this = this;
        if (!this.form.invalid) {
            var todo_1;
            todo_1 = this.getItemsSelected();
            var dialogRef = this.dialog.open(ConfirmComponent, {
                width: '400px',
                data: {
                    text: this.translate.instant('general.save?'),
                    action: this.translate.instant('general.save')
                }
            });
            dialogRef.afterClosed().subscribe(function (result) {
                if (result !== undefined) {
                    var confirm_1 = result.confirm;
                    if (confirm_1)
                        _this.save(todo_1);
                }
            });
        }
    };
    RolepermissionComponent.prototype.save = function (todo) {
        var _this = this;
        var params = { children: todo, Item: "rolId", Checked: true, Id: this.roleId };
        this.apiService.save(EEndpoints.RolProfilePermission, params).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('general.saved'));
            }
            else {
                _this.toasterService.showToaster(response.Message);
            }
        }, function (erro) { });
    };
    RolepermissionComponent.prototype.addAllPermissions = function () {
        var _this = this;
        if (!this.form.invalid) {
            var dialogRef = this.dialog.open(ConfirmComponent, {
                width: '400px',
                data: {
                    text: this.translate.instant('general.addallPermissions?'),
                    action: this.translate.instant('general.save')
                }
            });
            dialogRef.afterClosed().subscribe(function (result) {
                if (result !== undefined) {
                    var confirm_2 = result.confirm;
                    if (confirm_2) {
                        _this.treeControl.dataNodes.forEach(function (permission) {
                            permission.checked = true;
                        });
                        _this.addAllPermission();
                    }
                }
            });
        }
    };
    RolepermissionComponent.prototype.removeAllPermissions = function () {
        var _this = this;
        if (!this.form.invalid) {
            var dialogRef = this.dialog.open(ConfirmComponent, {
                width: '400px',
                data: {
                    text: this.translate.instant('general.removeallPermissions?'),
                    action: this.translate.instant('general.save')
                }
            });
            dialogRef.afterClosed().subscribe(function (result) {
                if (result !== undefined) {
                    var confirm_3 = result.confirm;
                    if (confirm_3) {
                        _this.treeControl.dataNodes.forEach(function (permission) {
                            permission.checked = false;
                        });
                        _this.Delete();
                    }
                }
            });
        }
    };
    RolepermissionComponent.prototype.Delete = function () {
        var _this = this;
        this.apiService.delete(EEndpoints.RolProfilePermission, { id: this.roleId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('general.saved'));
            }
            else {
                _this.toasterService.showToaster(response.Message);
            }
        }, function (erro) { });
    };
    RolepermissionComponent.prototype.getItemsSelected = function () {
        var todo;
        todo = [];
        this.treeControl.dataNodes.filter(function (item) { return item.checked == true; }).forEach(function (i) {
            todo.push({
                id: i.id,
                checked: i.checked,
                children: null,
                item: i.item,
                indeterminate: i.indeterminate
            });
        });
        return todo;
    };
    RolepermissionComponent.prototype.getPermissionByRolId = function (rol) {
        var _this = this;
        this.roleId = rol.value;
        this.apiService.get(EEndpoints.PermissionByRolId, { rolId: this.roleId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.treeControl.dataNodes.forEach(function (node) {
                    node.checked = response.result.filter(function (item) { return item.id == node.id; })[0].checked;
                });
            }
            else {
            }
        }, function (erro) {
            console.log(erro);
        });
    };
    RolepermissionComponent.prototype.addAllPermission = function () {
        var _this = this;
        console.log(this.roleId);
        this.apiService.get(EEndpoints.AddAllPermission, { id: this.roleId }).subscribe(function (response) {
            if (response.code == 100) {
                _this.toasterService.showToaster(_this.translate.instant('general.saved'));
            }
            else {
                _this.toasterService.showToaster(response.Message);
            }
        }, function (erro) { });
    };
    RolepermissionComponent = __decorate([
        Component({
            selector: 'app-rolepermission',
            templateUrl: './rolepermission.component.html',
            styleUrls: ['./rolepermission.component.css'],
            providers: [ChecklistDatabase]
        }),
        __metadata("design:paramtypes", [ApiService,
            ChecklistDatabase,
            FormBuilder,
            MatDialog,
            TranslateService,
            ToasterService])
    ], RolepermissionComponent);
    return RolepermissionComponent;
}());
export { RolepermissionComponent };
//# sourceMappingURL=rolepermission.component.js.map