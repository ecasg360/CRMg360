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
import { ConfirmComponent } from 'ClientApp/app/shared/components/confirm/confirm.component';
import { AddGroupComponent } from './addgroup/addgroup.component';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
import { ActivatedRoute } from '@angular/router';
var GroupComponent = /** @class */ (function () {
    function GroupComponent(toasterService, apiService, route, dialog, spinner) {
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.route = route;
        this.dialog = dialog;
        this.spinner = spinner;
        this.displayedColumns = ['id', 'name', 'description', 'edit', 'delete'];
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    GroupComponent.prototype.ngOnInit = function () {
        this.spinner.show();
        this.getGroups();
    };
    GroupComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
            this.getGroups();
        }
    };
    GroupComponent.prototype.getGroups = function () {
        var _this = this;
        this.apiService.get(EEndpoints.groups).subscribe(function (data) {
            if (data.code == 100) {
                data.result.forEach(function (f) {
                    f.isActive = f.statusRecordId === 1 ? true : false;
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
    GroupComponent.prototype.addGroup = function () {
        var _this = this;
        var action = 'create';
        var dialogRef = this.dialog.open(AddGroupComponent, {
            width: (innerWidth).toString() + 'px',
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getGroups();
        });
    };
    GroupComponent.prototype.updateGroup = function (id) {
        var _this = this;
        var action = 'update';
        var dialogRef = this.dialog.open(AddGroupComponent, {
            width: (innerWidth).toString() + 'px',
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.getGroups();
        });
    };
    GroupComponent.prototype.confirmDelete = function (id) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                text: '¿Esta seguro que desea eliminar esta preferencia ' + id,
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
    GroupComponent.prototype.delete = function (id) {
        var _this = this;
        this.spinner.show();
        this.apiService.delete(EEndpoints.group, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getGroups();
                setTimeout(function () {
                    _this.toasterService.showToaster('Se ha eliminado un tipo de preferencia.');
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
    ], GroupComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], GroupComponent.prototype, "sort", void 0);
    GroupComponent = __decorate([
        Component({
            selector: 'app-group',
            templateUrl: './group.component.html',
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            ActivatedRoute,
            MatDialog,
            NgxSpinnerService])
    ], GroupComponent);
    return GroupComponent;
}());
export { GroupComponent };
//# sourceMappingURL=group.component.js.map