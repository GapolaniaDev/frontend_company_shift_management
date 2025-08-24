import {Routes} from '@angular/router'

export const SHIFTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/shift-list/shift-list.component')
      .then(m => m.ShiftListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/shift-form/shift-form.component')
      .then(m => m.ShiftFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/shift-form/shift-form.component')
      .then(m => m.ShiftFormComponent)
  },
  {
    path: ':id/details',
    loadComponent: () => import('./components/shift-details/shift-details.component')
      .then(m => m.ShiftDetailsComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./components/shift-history/shift-history.component')
      .then(m => m.ShiftHistoryComponent)
  },
  {
    path: 'types',
    loadComponent: () => import('./components/shift-types/shift-types.component')
      .then(m => m.ShiftTypesComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/shift-settings/shift-settings.component')
      .then(m => m.ShiftSettingsComponent)
  },
  {
    path: 'maps',
    loadComponent: () => import('./components/maps/maps.component')
      .then(m => m.MapsComponent)
  }
];
