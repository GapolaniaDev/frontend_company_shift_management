import {Routes} from '@angular/router'

export const SCHEDULE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/schedule.component')
      .then(m => m.ScheduleComponent)
  },
  {
    path: 'payment-periods',
    loadComponent: () => import('./components/payment-periods/payment-periods.component')
      .then(m => m.PaymentPeriodsComponent)
  }
];
