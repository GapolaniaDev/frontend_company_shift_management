import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentPeriodsComponent } from './components/payment-periods/payment-periods.component';

const routes: Routes = [
  { path: '', redirectTo: 'payment-periods', pathMatch: 'full' },
  { path: 'payment-periods', component: PaymentPeriodsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }