var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'ClientApp/app/shared/shared.module';
import { AddCustomerComponent } from './components/customer/add-customer.component';
import { CustomerComponent } from './components/customer/customer.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
var routes = [
    {
        path: '',
        component: CustomerComponent
    }
];
var CustomersModule = /** @class */ (function () {
    function CustomersModule() {
    }
    CustomersModule = __decorate([
        NgModule({
            declarations: [
                AddCustomerComponent,
                CustomerComponent
            ],
            imports: [
                CommonModule,
                RouterModule.forChild(routes),
                FuseSharedModule,
                SharedModule,
            ]
        })
    ], CustomersModule);
    return CustomersModule;
}());
export { CustomersModule };
//# sourceMappingURL=customers.module.js.map