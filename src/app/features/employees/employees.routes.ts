import {Routes} from '@angular/router'

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/employee-list/employee-list.component')
      .then(m => m.EmployeeListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/employee-form/employee-form.component')
      .then(m => m.EmployeeFormComponent)
  },
  {
    path: ':id/view',
    loadComponent: () => import('./components/employee-detail/employee-detail.component')
      .then(m => m.EmployeeDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/employee-form/employee-form.component')
      .then(m => m.EmployeeFormComponent)
  }
];
