import { Routes } from '@angular/router'

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
    path: ':id/edit', 
    loadComponent: () => import('./components/employee-form/employee-form.component')
      .then(m => m.EmployeeFormComponent) 
  },
  { 
    path: 'legacy', 
    loadComponent: () => import('./components/legacy-employees/employees.component')
      .then(m => m.EmployeesComponent) 
  }
];