import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing.module';
import { PaymentPeriodsComponent } from './components/payment-periods/payment-periods.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PaymentPeriodsComponent
  ],
  exports: [
    PaymentPeriodsComponent
  ]
})
export class SettingsModule { }