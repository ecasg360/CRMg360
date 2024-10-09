var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from "@angular/material";
import { ToasterService } from "ClientApp/app/core/services/toaster.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { AddPromoterComponent } from "./add-promoter.component";
import { ConfirmComponent } from "ClientApp/app/shared/components/confirm/confirm.component";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ActivatedRoute } from "@angular/router";
var PromoterComponent = /** @class */ (function () {
    function PromoterComponent(toasterService, dialog, apiService, route, spinner) {
        this.toasterService = toasterService;
        this.dialog = dialog;
        this.apiService = apiService;
        this.route = route;
        this.spinner = spinner;
        this.displayedColumns = ['id', 'name', 'email', 'phone', 'status', 'edit', 'delete'];
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    PromoterComponent.prototype.ngOnInit = function () {
        this.spinner.show();
        this.getPromoters();
        this.innerWidth = window.innerWidth;
    };
    PromoterComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    PromoterComponent.prototype.getPromoters = function () {
        var _this = this;
        this.apiService.get(EEndpoints.Promoters).subscribe(function (data) {
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
    PromoterComponent.prototype.addPromoter = function () {
        var _this = this;
        var action = 'create';
        var dialogRef = this.dialog.open(AddPromoterComponent, {
            width: (innerWidth).toString() + 'px',
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this.getPromoters();
        });
    };
    PromoterComponent.prototype.updatePromoter = function (id) {
        var _this = this;
        var action = 'update';
        var dialogRef = this.dialog.open(AddPromoterComponent, {
            width: (innerWidth).toString() + 'px',
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this.getPromoters();
        });
    };
    PromoterComponent.prototype.confirmDelete = function (id) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: {
                text: '¿Esta seguro que desea eliminar el promotor id ' + id,
                action: '<i class="fas fa-trash fa-lg"></i> Eliminar'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deletePromoter(id);
            }
        });
    };
    PromoterComponent.prototype.deletePromoter = function (id) {
        var _this = this;
        this.apiService.delete(EEndpoints.Promoter, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getPromoters();
                setTimeout(function () {
                    _this.toasterService.showToaster('Se ha eliminado el promotor correctamente.');
                }, 300);
            }
            else {
                _this.toasterService.showToaster(data.message);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    PromoterComponent.prototype.updateStatus = function (id, status) {
        var _this = this;
        this.spinner.show();
        var statusId = status ? 2 : 1;
        this.apiService.save(EEndpoints.PromoterStatus, { id: id, status: statusId }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getPromoters();
                setTimeout(function () {
                    _this.toasterService.showToaster('Se ha cambiado el estatus del promotor correctamente.');
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
    ], PromoterComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], PromoterComponent.prototype, "sort", void 0);
    PromoterComponent = __decorate([
        Component({
            selector: 'app-promoter',
            templateUrl: './promoter.component.html',
        }),
        __metadata("design:paramtypes", [ToasterService,
            MatDialog,
            ApiService,
            ActivatedRoute,
            NgxSpinnerService])
    ], PromoterComponent);
    return PromoterComponent;
}());
export { PromoterComponent };
//# sourceMappingURL=promoter.component.js.map