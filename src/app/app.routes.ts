import {Routes} from '@angular/router'
import {MainLayoutComponent} from './main-layout/main-layout.component'
import {AuthGuard, LoginGuard} from '@core/auth.guard'
import {HomeComponent} from '@core/components/home/home.component'
import {PublicHomeComponent} from '@core/components/public-home/public-home.component'
import {PublicHomeLayoutComponent} from '@core/layouts/public-home-layout/public-home-layout.component'
import {
  ForgotPasswordComponent,
  LoginComponent,
  ProfileComponent,
  RegisterComponent,
  TermsConditionsComponent
} from "@features/session";
import {ShiftHistoryComponent, ShiftSettingsComponent, ShiftTypesComponent} from "@features/shifts";
import {PaymentPeriodsComponent} from "@features/schedule";


export const routes: Routes = [
  // Direct session routes
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },

  // Public routes (no layout)
  {
    path: '',
    component: PublicHomeLayoutComponent,
    children: [
      { path: '', component: PublicHomeComponent }
    ]
  },

  // Session routes (lazy-loaded)
  {
    path: 'session',
    loadChildren: () => import('@features/session/session.routes').then(m => m.SESSION_ROUTES)
  },

  // Main app routes (with MainLayout)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },

      // Feature routes (lazy-loaded)
      {
        path: 'employees',
        loadChildren: () => import('@features/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES)
      },
      {
        path: 'shifts',
        loadChildren: () => import('@features/shifts/shifts.routes').then(m => m.SHIFTS_ROUTES)
      },
      {
        path: 'schedule',
        loadChildren: () => import('@features/schedule/schedule.routes').then(m => m.SCHEDULE_ROUTES)
      },

      // Direct component routes
      { path: 'shift-settings', component: ShiftSettingsComponent },
      { path: 'shift-types', component: ShiftTypesComponent },
      { path: 'payment-periods', component: PaymentPeriodsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'shift-history', component: ShiftHistoryComponent },

      // 404 page
      {
        path: '**',
        loadComponent: () => import('@core/components/pages-not-found/pages-not-found.component')
          .then(m => m.PagesNotFoundComponent)
      }
    ]
  },

  // Global 404
  {
    path: '**',
    loadComponent: () => import('@core/components/pages-not-found/pages-not-found.component')
      .then(m => m.PagesNotFoundComponent)
  }
];
