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
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddMembersgroupComponent } from './addmembersgroup/addmembersgroup.component';
import { ConfirmComponent } from '@shared/components/confirm/confirm.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from '@angular/router';
var MembersgroupComponent = /** @class */ (function () {
    function MembersgroupComponent(toasterService, apiService, dialog, route, spinner) {
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.dialog = dialog;
        this.route = route;
        this.spinner = spinner;
        this.displayedColumns = ['id', 'firstname', 'lastname', 'email', 'mainactivity', 'birthdate', 'entrydate', 'edit', 'delete'];
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    MembersgroupComponent.prototype.ngOnInit = function () {
        this.spinner.show();
        this.getMenbersgroups();
    };
    MembersgroupComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    MembersgroupComponent.prototype.getMenbersgroups = function () {
        var _this = this;
        this.apiService.get(EEndpoints.membersgroups).subscribe(function (data) {
            if (data.code == 100) {
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
        }, function (err) { return console.log('Failed' + err); });
    };
    MembersgroupComponent.prototype.addUser = function () {
        var _this = this;
        var action = 'create';
        var dialogRef = this.dialog.open(AddMembersgroupComponent, {
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getMenbersgroups();
        });
    };
    MembersgroupComponent.prototype.updateUser = function (id) {
        var _this = this;
        var action = 'update';
        var dialogRef = this.dialog.open(AddMembersgroupComponent, {
            width: '700px',
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getMenbersgroups();
        });
    };
    MembersgroupComponent.prototype.confirmDelete = function (id) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: '�Esta seguro que desea eliminar el usuario id ' + id,
                action: '<i class="fas fa-trash fa-lg"></i> Eliminar'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.delete(id);
            }
        });
    };
    MembersgroupComponent.prototype.delete = function (id) {
        var _this = this;
        this.apiService.delete(EEndpoints.membersgroup, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getMenbersgroups();
                setTimeout(function () {
                    _this.toasterService.showToaster('Se ha eliminado el usuario correctamente.');
                }, 300);
            }
            else {
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    MembersgroupComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        this.spinner.show();
        var statusId = status ? 2 : 1;
        this.apiService.save(EEndpoints.membersgroup, { id: id, status: statusId }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getMenbersgroups();
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
    ], MembersgroupComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], MembersgroupComponent.prototype, "sort", void 0);
    MembersgroupComponent = __decorate([
        Component({
            selector: 'app-membersgroup',
            templateUrl: './membersgroup.component.html',
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            ActivatedRoute,
            NgxSpinnerService])
    ], MembersgroupComponent);
    return MembersgroupComponent;
}());
export { MembersgroupComponent };
//# sourceMappingURL=membersgroup.component.js.map