import { Routes } from '@angular/router'
import { MainLayoutComponent } from './main-layout/main-layout.component'
import { AuthGuard, LoginGuard } from '@core/auth.guard'
import { HomeComponent } from '@core/components/home/home.component'
import { PublicHomeComponent } from '@core/components/public-home/public-home.component'
import { PublicHomeLayoutComponent } from '@core/layouts/public-home-layout/public-home-layout.component'

export const routes: Routes = [
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
