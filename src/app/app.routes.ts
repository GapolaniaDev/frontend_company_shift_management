import {Routes} from '@angular/router'
import {MainLayoutComponent} from '@app/layouts/main-layout/main-layout.component'
import {AuthGuard, LoginGuard} from '@core/auth.guard'
import {HomeComponent} from '@features/public/home/home.component'
import {PublicLayoutComponent} from '@app/layouts/public-layout/public-layout.component'
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
    component: PublicLayoutComponent,
    children: [
      { path: '', component: PublicLayoutComponent }
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
        loadComponent: () => import('@features/public/pages-not-found/pages-not-found.component')
          .then(m => m.PagesNotFoundComponent)
      }
    ]
  },

  // Global 404
  {
    path: '**',
    loadComponent: () => import('@features/public/pages-not-found/pages-not-found.component')
      .then(m => m.PagesNotFoundComponent)
  }
];
