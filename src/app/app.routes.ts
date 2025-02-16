import {Routes} from '@angular/router';
import {HomeComponent} from './core/components/home/home.component';
import {LoginComponent} from './session/components/login/login.component';
import {RegisterComponent} from './session/components/register/register.component';
import {MainLayoutComponent} from "./main-layout/main-layout.component";
import {DashboardComponent} from "./core/components/dashboard/dashboard.component";
import {ForgotPasswordComponent} from "./session/components/forgot-password/forgot-password.component";
import {PagesNotFoundComponent} from "./core/components/pages-not-found/pages-not-found.component";
import {TermsConditionsComponent} from "./session/components/terms-conditions/terms-conditions.component";
import {ScheduleComponent} from "./shift-schedule/components/schedule/schedule.component";

import {EmployeesComponent} from "./core/components/employees/employees.component";
import {ShiftSettingsComponent} from "./core/components/shift-settings/shift-settings.component";
import {ShiftTypesComponent} from "./core/components/shift-types/shift-types.component";
import {PaymentPeriodsComponent} from "./core/components/payment-periods/payment-periods.component";
import {ProfileComponent} from "./core/components/profile/profile.component";

export const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'terms-conditions', component: TermsConditionsComponent},
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', component: HomeComponent},
      {path: 'home', component: HomeComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'schedule', component: ScheduleComponent},
      {path: 'employees', component: EmployeesComponent},
      {path: 'shift-settings', component: ShiftSettingsComponent},
      {path: 'shift-types', component: ShiftTypesComponent},
      {path: 'payment-periods', component: PaymentPeriodsComponent},
      {path: 'profile', component: ProfileComponent},
      {path: '**', component: PagesNotFoundComponent}
    ]
  },
  {path: '**', component: PagesNotFoundComponent}
];
