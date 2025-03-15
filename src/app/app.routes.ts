import {Routes} from '@angular/router';
import {HomeComponent} from './core/components/home/home.component';
import {LoginComponent} from './session/components/login/login.component';
import {RegisterComponent} from './session/components/register/register.component';
import {MainLayoutComponent} from "./main-layout/main-layout.component";
import {DashboardComponent} from "./core/components/dashboard/dashboard.component";
import {ForgotPasswordComponent} from "./session/components/forgot-password/forgot-password.component";
import {PagesNotFoundComponent} from "./core/components/pages-not-found/pages-not-found.component";
import {TermsConditionsComponent} from "./session/components/terms-conditions/terms-conditions.component";
import {ScheduleComponent} from "./core/components/schedule/schedule.component";
import {ShiftHistoryComponent} from "./core/components/shift-history/shift-history.component";

import {EmployeesComponent} from "./core/components/employees/employees.component";
import {ShiftSettingsComponent} from "./core/components/shift-settings/shift-settings.component";
import {ShiftTypesComponent} from "./core/components/shift-types/shift-types.component";
import {PaymentPeriodsComponent} from "./core/components/payment-periods/payment-periods.component";
import {ProfileComponent} from "./core/components/profile/profile.component";
import {AuthGuard} from "./guard/auth.guard";
import {PublicHomeComponent} from "./core/components/public-home/public-home.component";
import {PublicHomeLayoutComponent} from "./core/layouts/public-home-layout/public-home-layout.component";

export const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'terms-conditions', component: TermsConditionsComponent},

  // Ruta independiente para PublicHome (con su propio layout)
  {
    path: '',
    component: PublicHomeLayoutComponent, // Public Home tiene un layout propio
    children: [
      {path: '', component: PublicHomeComponent}, // Página principal pública
    ]
  },

  {
    path: '', component: MainLayoutComponent, children: [
      {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
      {path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard]},
      {path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard]},
      {path: 'shift-settings', component: ShiftSettingsComponent, canActivate: [AuthGuard]},
      {path: 'shift-types', component: ShiftTypesComponent, canActivate: [AuthGuard]},
      {path: 'payment-periods', component: PaymentPeriodsComponent, canActivate: [AuthGuard]},
      {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
      {path: 'shift-history', component: ShiftHistoryComponent, canActivate: [AuthGuard]},
      {path: '**', component: PagesNotFoundComponent}
    ]
  },
  {path: '**', component: PagesNotFoundComponent}
];
