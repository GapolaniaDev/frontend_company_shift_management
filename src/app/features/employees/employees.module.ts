import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeListComponent,
    EmployeeFormComponent,
    EmployeesComponent,
    ProfileComponent
  ],
  exports: [
    EmployeeListComponent,
    EmployeeFormComponent,
    EmployeesComponent,
    ProfileComponent
  ]
})
export class EmployeesModule { }