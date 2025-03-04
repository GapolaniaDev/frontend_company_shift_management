import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftListComponent } from './components/shift-list/shift-list.component';
import { ShiftFormComponent } from './components/shift-form/shift-form.component';
import { ShiftDetailsComponent } from './components/shift-details/shift-details.component';
import { ShiftTypesComponent } from './components/shift-types/shift-types.component';
import { ShiftSettingsComponent } from './components/shift-settings/shift-settings.component';

const routes: Routes = [
  { path: '', component: ShiftListComponent },
  { path: 'new', component: ShiftFormComponent },
  { path: ':id', component: ShiftDetailsComponent },
  { path: ':id/edit', component: ShiftFormComponent },
  { path: 'types', component: ShiftTypesComponent },
  { path: 'settings', component: ShiftSettingsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftsRoutingModule { }