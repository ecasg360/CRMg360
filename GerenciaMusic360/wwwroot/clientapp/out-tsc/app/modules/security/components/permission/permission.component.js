var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ToasterService } from '@services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { AddPermissionComponent } from './add-permission/add-permission.component';
var PermissionComponent = /** @class */ (function () {
    function PermissionComponent(toasterService, apiService, dialog, spinner) {
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.dialog = dialog;
        this.spinner = spinner;
        this.displayedColumns = ['modulo', 'description', 'controller', 'actions', 'action'];
        this.isWorking = true;
    }
    PermissionComponent.prototype.ngOnInit = function () {
        this.spinner.show();
        this.getPermissions();
    };
    PermissionComponent.prototype.getPermissions = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Permissions).subscribe(function (response) {
            _this.dataSource = new MatTableDataSource(response.result);
            _this.dataSource.paginator = _this.paginator;
            _this.dataSource.sort = _this.sort;
            _this.isWorking = false;
        }, function (erro) {
            console.log(erro);
        });
    };
    PermissionComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    PermissionComponent.prototype.showModalForm = function (permission) {
        var _this = this;
        var modal = this.dialog.open(AddPermissionComponent, {
            width: "600px",
            data: permission
        });
        modal.afterClosed().subscribe(function (res) {
            _this.getPermissions();
        });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], PermissionComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], PermissionComponent.prototype, "sort", void 0);
    PermissionComponent = __decorate([
        Component({
            selector: 'app-permission',
            templateUrl: './permission.component.html',
            styleUrls: ['./permission.component.css']
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            NgxSpinnerService])
    ], PermissionComponent);
    return PermissionComponent;
}());
export { PermissionComponent };
//# sourceMappingURL=permission.component.js.map