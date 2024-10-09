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
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { AddUserComponent } from './add-user.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from 'ClientApp/app/core/services/account.service';
import { ConfirmComponent } from 'ClientApp/app/shared/components/confirm/confirm.component';
var UserComponent = /** @class */ (function () {
    function UserComponent(toasterService, accountService, dialog, spinner) {
        this.toasterService = toasterService;
        this.accountService = accountService;
        this.dialog = dialog;
        this.spinner = spinner;
        this.displayedColumns = ['picureURL', 'name', 'email', 'role', 'status', 'action'];
        this.isWorking = false;
    }
    UserComponent.prototype.ngOnInit = function () {
        this.spinner.show();
        this.getUsers();
    };
    UserComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    UserComponent.prototype.getUsers = function () {
        var _this = this;
        this.accountService.getUsers().subscribe(function (data) {
            if (data.code == 100) {
                console.log(data);
                data.result.forEach(function (f) {
                    f.isActive = f.status === 1 ? true : false;
                });
                _this.dataSource = new MatTableDataSource(data.result);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
                _this.spinner.hide();
            }
            else {
                _this.spinner.hide();
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    UserComponent.prototype.addUser = function () {
        var _this = this;
        var action = 'create';
        var dialogRef = this.dialog.open(AddUserComponent, {
            width: '700px',
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this.getUsers();
        });
    };
    UserComponent.prototype.updateUser = function (id) {
        var _this = this;
        var action = 'update';
        var dialogRef = this.dialog.open(AddUserComponent, {
            width: '700px',
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this.getUsers();
        });
    };
    UserComponent.prototype.confirmDelete = function (id) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: '¿Esta seguro que desea eliminar el usuario id ' + id,
                action: 'Eliminar'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteUser(id);
            }
        });
    };
    UserComponent.prototype.deleteUser = function (id) {
        var _this = this;
        this.spinner.show();
        this.accountService.deleteUser(id)
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getUsers();
                setTimeout(function () {
                    _this.toasterService.showToaster('Se ha eliminado el usuario correctamente.');
                }, 300);
            }
            else {
                _this.spinner.hide();
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    UserComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        this.spinner.show();
        var statusId = status ? 2 : 1;
        this.accountService.updateStatus({ id: id, status: statusId })
            .subscribe(function (data) {
            if (data.code == 100) {
                _this.getUsers();
                setTimeout(function () {
                    _this.toasterService.showToaster('Se ha cambiado el estatus del usuario correctamente.');
                }, 300);
            }
            else {
                _this.spinner.hide();
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], UserComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], UserComponent.prototype, "sort", void 0);
    UserComponent = __decorate([
        Component({
            selector: 'app-user',
            templateUrl: './user.component.html',
        }),
        __metadata("design:paramtypes", [ToasterService,
            AccountService,
            MatDialog,
            NgxSpinnerService])
    ], UserComponent);
    return UserComponent;
}());
export { UserComponent };
//# sourceMappingURL=user.component.js.map