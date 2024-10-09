var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ViewChild, Component } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { AddRoleComponent } from "./add-role.component";
import { ConfirmComponent } from "@shared/components/confirm/confirm.component";
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var RoleComponent = /** @class */ (function () {
    function RoleComponent(toasterService, apiService, dialog) {
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.dialog = dialog;
        this.displayedColumns = ['name', 'status', 'action'];
    }
    RoleComponent.prototype.ngOnInit = function () {
        this.getRoles();
    };
    RoleComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    RoleComponent.prototype.getRoles = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Roles).subscribe(function (data) {
            if (data.code == 100) {
                data.result.forEach(function (f) {
                    f.isActive = f.statusRecordId === 1 ? true : false;
                });
                _this.dataSource = new MatTableDataSource(data.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            else {
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    RoleComponent.prototype.addRole = function () {
        var _this = this;
        var action = 'create';
        var dialogRef = this.dialog.open(AddRoleComponent, {
            width: '700px',
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this.getRoles();
        });
    };
    RoleComponent.prototype.updateRole = function (id) {
        var _this = this;
        var action = 'update';
        var dialogRef = this.dialog.open(AddRoleComponent, {
            width: '700px',
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this.getRoles();
        });
    };
    RoleComponent.prototype.confirmDelete = function (id) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: '¿Esta seguro que desea eliminar el rol id ' + id,
                action: 'Eliminar'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteRole(id);
            }
        });
    };
    RoleComponent.prototype.deleteRole = function (id) {
        var _this = this;
        this.apiService.delete(EEndpoints.Role, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getRoles();
                setTimeout(function () {
                    _this.toasterService.showToaster('Se ha eliminado el rol correctamente.');
                }, 300);
            }
            else {
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    RoleComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        var statusId = status ? 2 : 1;
        this.apiService.update(EEndpoints.RoleStatus, { id: id, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getRoles();
                setTimeout(function () {
                    _this.toasterService.showToaster('Se ha cambiado el estatus del rol correctamente.');
                }, 300);
            }
            else {
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], RoleComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], RoleComponent.prototype, "sort", void 0);
    RoleComponent = __decorate([
        Component({
            selector: 'app-role',
            templateUrl: './role.component.html',
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog])
    ], RoleComponent);
    return RoleComponent;
}());
export { RoleComponent };
//# sourceMappingURL=role.component.js.map