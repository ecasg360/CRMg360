import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'ClientApp/app/shared/shared.module';
import { AddCustomerComponent } from './components/customer/add-customer.component';
import { CustomerComponent } from './components/customer/customer.component';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent
  }
];


@NgModule({
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
export class CustomersModule { }
