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
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmComponent } from "ClientApp/app/shared/components/confirm/confirm.component";
import { AddcontactssponsorComponent } from "./addcontactssponsor/addcontactssponsor.component";
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { ActivatedRoute } from "@angular/router";
var ContactssponsorComponent = /** @class */ (function () {
    function ContactssponsorComponent(toasterService, apiService, dialog, route, spinner) {
        this.toasterService = toasterService;
        this.apiService = apiService;
        this.dialog = dialog;
        this.route = route;
        this.spinner = spinner;
        this.displayedColumns = [
            "id",
            "name",
            "email",
            "phone",
            "status",
            "edit",
            "delete"
        ];
        this.perm = {};
        this.perm = this.route.snapshot.data;
    }
    ContactssponsorComponent.prototype.ngOnInit = function () {
        this.spinner.show();
        this.getContactssponsors();
        this.innerWidth = window.innerWidth;
    };
    ContactssponsorComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    ContactssponsorComponent.prototype.getContactssponsors = function () {
        var _this = this;
        this.apiService.get(EEndpoints.contactssponsors).subscribe(function (data) {
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
        }, function (err) { return console.error("Failed! " + err); });
    };
    ContactssponsorComponent.prototype.addContactssponsor = function () {
        var _this = this;
        var action = "create";
        var dialogRef = this.dialog.open(AddcontactssponsorComponent, {
            width: innerWidth.toString() + "px",
            data: {
                action: action,
                id: 0
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this.getContactssponsors();
        });
    };
    ContactssponsorComponent.prototype.updateContactssponsor = function (id) {
        var _this = this;
        var action = "update";
        var dialogRef = this.dialog.open(AddcontactssponsorComponent, {
            width: innerWidth.toString() + "px",
            data: {
                action: action,
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined)
                _this.getContactssponsors();
        });
    };
    ContactssponsorComponent.prototype.confirmDelete = function (id) {
        var _this = this;
        var dialogRef = this.dialog.open(ConfirmComponent, {
            width: "400px",
            data: {
                text: "�Esta seguro que desea eliminar el compositor id " + id,
                action: '<i class="fas fa-trash fa-lg"></i> Eliminar'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var confirm_1 = result.confirm;
                if (confirm_1)
                    _this.deleteContactssponsor(id);
            }
        });
    };
    ContactssponsorComponent.prototype.deleteContactssponsor = function (id) {
        var _this = this;
        this.spinner.show();
        this.apiService.delete(EEndpoints.contactssponsor, { id: id }).subscribe(function (data) {
            if (data.code == 100) {
                _this.getContactssponsors();
                setTimeout(function () {
                    _this.toasterService.showToaster("Se ha eliminado el compositor correctamente.");
                }, 300);
            }
            else {
                _this.spinner.hide();
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error("Failed! " + err); });
    };
    __decorate([
        ViewChild(MatPaginator),
        __metadata("design:type", MatPaginator)
    ], ContactssponsorComponent.prototype, "paginator", void 0);
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], ContactssponsorComponent.prototype, "sort", void 0);
    ContactssponsorComponent = __decorate([
        Component({
            selector: "app-contactssponsor",
            templateUrl: "./contactssponsor.component.html"
        }),
        __metadata("design:paramtypes", [ToasterService,
            ApiService,
            MatDialog,
            ActivatedRoute,
            NgxSpinnerService])
    ], ContactssponsorComponent);
    return ContactssponsorComponent;
}());
export { ContactssponsorComponent };
//# sourceMappingURL=contactssponsor.component.js.map