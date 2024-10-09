import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { BehaviorSubject } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTreeFlattener, MatTreeFlatDataSource, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { ResponseApi } from '@models/response-api';


@Injectable()
export class ChecklistDatabase {
    dataChange = new BehaviorSubject<TodoItemNode[]>([]);
    treeData: any[];
    get data(): TodoItemNode[] { return this.dataChange.value; }

    constructor(private apiService: ApiService) {
        this.initialize();
    }

    initialize() {
        this.apiService.get(EEndpoints.PermissionGroup).subscribe(response => {
            const data = this.buildFileTree(response.result, 0);
            this.treeData = data;
            this.dataChange.next(data);
        }, erro => {
            console.log(erro);
        });
    }
    public filter(filterText: string):any[] {
        let filteredTreeData;
        if (filterText) {
            filteredTreeData = this.treeData.filter(d => d.item.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
            console.log(filteredTreeData);
        } else {
            filteredTreeData = this.treeData;
        }

        // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
        // file node as children.
        const data = this.buildFileTree(filteredTreeData,0);
        // Notify the change.
        this.dataChange.next(data);
        return data;
    }
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `TodoItemNode`.
     */
    buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
        return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
            const value = obj[key];
            const node = new TodoItemNode();
            node.item = value.item;
            node.checked = value.checked;
            node.indeterminate = value.indeterminate;
            node.id = value.id;
            if (value.children != null) {
                if (typeof value.children === 'object') {
                    if (value.children.length > 0) {
                        node.children = this.buildFileTree(value.children, level + 1);
                    }
                } else {
                    node.item = value.item;
                }
            }

            return accumulator.concat(node);
        }, []);
    }
}
/**
 * Node for to-do item
 */
export class TodoItemNode {
    children: TodoItemNode[];
    item: string;
    id: string;
    checked: boolean;
    indeterminate: boolean;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
    item: string;
    level: number;
    expandable: boolean;
    id: string;
    checked: boolean;
    indeterminate: boolean;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = [
    {
        item: 'Cook dinner', id: 1, checked: false, children:
            [
                { item: 'Cook dinner', id: 11, checked: false, children: null },
                { item: 'Cook dinner2', id: 12, checked: false, children: null }
            ]
    },
    { item: 'Read the Material Design spec', id: 2, checked: true },
];

@Component({
    selector: 'app-rolepermission',
    templateUrl: './rolepermission.component.html',
    styleUrls: ['./rolepermission.component.css'],
    providers: [ChecklistDatabase]
})
export class RolepermissionComponent implements OnInit {
    form: FormGroup;
    isWorking: boolean;
    dataChange = new BehaviorSubject<TodoItemNode[]>([]);
    get data(): TodoItemNode[] { return this.dataChange.value; }
    flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
    nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
    selectedParent: TodoItemFlatNode | null = null;
    newItemName = '';
    treeControl: FlatTreeControl<TodoItemFlatNode>;
    treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
    dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
    checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
    roles: any;
    roleId: number;
    //esto va en las declaracion de las propiedades
    treeDataList: any;
    //cuando llenes el treeview la primera vez o lo tomes de la bd
    
    constructor(private apiService: ApiService,
        private _database: ChecklistDatabase,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private translate: TranslateService,
        private toasterService: ToasterService,
    ) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        _database.dataChange.subscribe(data => {
            this.dataSource.data = data;
            this.treeDataList = this.dataSource.data;
        });
    }
    ngOnInit() {
        this.getRoles();
        this.configureForm();
    }
    configureForm(): void {
        this.form = this.formBuilder.group(
            {
                role: ['', []],               
            }
        )
    }
    getRoles(): void {
        this.apiService.get(EEndpoints.Roles).subscribe(response => {
            this.roles = response.result;
        }, erro => {
            console.log(erro);
        });
    }
    getLevel = (node: TodoItemFlatNode) => node.level;

    isExpandable = (node: TodoItemFlatNode) => node.expandable;

    getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

    hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: TodoItemNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.item === node.item
            ? existingNode
            : new TodoItemFlatNode();
        flatNode.item = node.item;
        flatNode.level = level;
        flatNode.expandable = !!node.children;
        flatNode.id = node.id;
        flatNode.checked = node.checked;
        flatNode.indeterminate = node.indeterminate;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: TodoItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        return descAllSelected;
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: TodoItemFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);

        descendants.forEach(n => {
            n.checked = node.checked

        });
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        //// Force update for the parent
        descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        this.checkAllParentsSelection(node);
    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: TodoItemFlatNode): void {
        let parent: TodoItemFlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: TodoItemFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }

    /* Get the parent node of a node */
    getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

   
    applyFilter(filterText: string) {
       //this.dataSource.data = this._database.filter(filterText);
        if (filterText) {
            this.treeControl.expandAll();
        } else {
            this.treeControl.collapseAll();
        }
        let filteredTreeData;
        if (filterText) {
            filteredTreeData = this.treeDataList.filter(d => d.item.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
        } else {
            filteredTreeData = this.treeDataList;
        }
        this.dataSource.data = filteredTreeData; 
    }
    set() {
        if (!this.form.invalid) {
            let todo: TodoItemNode[];
            todo = this.getItemsSelected();
            const dialogRef = this.dialog.open(ConfirmComponent, {
                width: '400px',
                data: {
                    text: this.translate.instant('general.save?'),
                    action: this.translate.instant('general.save')
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    let confirm = result.confirm;
                    if (confirm)
                        this.save(todo);
                }
            });
        }
    }
    save(todo: TodoItemNode[]): void {
        var params = { children: todo, Item: "rolId", Checked: true, Id: this.roleId }
        this.apiService.save(EEndpoints.RolProfilePermission, params).subscribe(response => {
            if (response.code == 100) {
                this.toasterService.showToaster(this.translate.instant('general.saved'));
            }
            else {
                this.toasterService.showToaster(response.Message);
            }
        }, erro => { });
    }
    addAllPermissions(): void {
        if (!this.form.invalid) {
            const dialogRef = this.dialog.open(ConfirmComponent, {
                width: '400px',
                data: {
                    text: this.translate.instant('general.addallPermissions?'),
                    action: this.translate.instant('general.save')
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    let confirm = result.confirm;
                    if (confirm) {
                        this.treeControl.dataNodes.forEach(permission => {
                            permission.checked = true;
                        });
                        this.addAllPermission();
                    }
                }
            });
        }
       
    }
    removeAllPermissions(): void {
        if (!this.form.invalid) {
            const dialogRef = this.dialog.open(ConfirmComponent, {
                width: '400px',
                data: {
                    text: this.translate.instant('general.removeallPermissions?'),
                    action: this.translate.instant('general.save')
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    let confirm = result.confirm;
                    if (confirm) {
                        this.treeControl.dataNodes.forEach(permission => {
                            permission.checked = false;
                        });
                        this.Delete();
                    }
                }
            });
        }
    }
    Delete(): any {
        this.apiService.delete(EEndpoints.RolProfilePermission, { id: this.roleId}).subscribe(response => {
            if (response.code == 100) {
                this.toasterService.showToaster(this.translate.instant('general.saved'));
            }
            else {
                this.toasterService.showToaster(response.Message);
            }
        }, erro => { });
    }
    getItemsSelected(): TodoItemNode[] {
        let todo: TodoItemNode[];
        todo = [];
        this.treeControl.dataNodes.filter(item => item.checked == true).forEach(i => {
            todo.push({
                id: i.id,
                checked: i.checked,
                children: null,
                item: i.item,
                indeterminate: i.indeterminate
            })
        });
        return todo;
    }
    getPermissionByRolId(rol: any): void {
        this.roleId = rol.value;
        this.apiService.get(EEndpoints.PermissionByRolId, { rolId: this.roleId }).subscribe((response: ResponseApi<TodoItemNode[]>) => {
            if (response.code == 100) {
                this.treeControl.dataNodes.forEach(node => {
                    node.checked = response.result.filter(item => item.id == node.id)[0].checked;
               }) 
            }
            else {

            }
        }, erro => {
            console.log(erro);
        });
    }
    addAllPermission(): any {
        console.log(this.roleId);
        this.apiService.get(EEndpoints.AddAllPermission, { id: this.roleId}).subscribe(response => {
            if (response.code == 100) {
                this.toasterService.showToaster(this.translate.instant('general.saved'));
            }
            else {
                this.toasterService.showToaster(response.Message);
            }
        }, erro => { });
    }
}
