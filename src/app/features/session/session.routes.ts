import { Routes } from '@angular/router'

export const SESSION_ROUTES: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component')
      .then(m => m.RegisterComponent) 
  },
  { 
    path: 'forgot-password', 
    loadComponent: () => import('./components/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent) 
  },
  { 
    path: 'terms', 
    loadComponent: () => import('./components/terms-conditions/terms-conditions.component')
      .then(m => m.TermsConditionsComponent) 
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component')
      .then(m => m.ProfileComponent) 
  }
];